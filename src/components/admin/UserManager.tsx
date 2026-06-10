import React, { useState } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../../services/firebase';
import { User, CreateUserData } from '../../types';
import { ValidationService } from '../../services/validationService';
import { useAuth } from '../../contexts/AuthContext';

interface UserManagerProps {
  users: User[];
  onUsersUpdate: () => void;
}

export default function UserManager({ users, onUsersUpdate }: UserManagerProps) {
  const { isAdmin } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<CreateUserData>({
    email: '',
    displayName: '',
    role: 'customer',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Redirect non-admin users
  if (!isAdmin) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-red-400 mb-2 font-[family-name:var(--font-clash-display)]">Access Denied</h3>
        <p className="text-red-400/80">You don't have permission to manage users.</p>
      </div>
    );
  }

  const resetForm = () => {
    setFormData({
      email: '',
      displayName: '',
      role: 'customer',
      password: ''
    });
    setEditingUser(null);
    setShowCreateForm(false);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate form data
    if (!ValidationService.isValidEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      
      // Create user role document with consistent structure
      const userRoleData = {
        id: userCredential.user.uid, // Add the missing id field
        uid: userCredential.user.uid,
        email: formData.email,
        displayName: formData.displayName || formData.email.split('@')[0],
        role: formData.role,
        points: 0,
        status: 'active' as const,
        createdAt: new Date()
      };

      // Validate user data before saving
      const validation = ValidationService.validateUser(userRoleData);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.map(e => e.message).join(', ')}`);
      }

      await addDoc(collection(db, 'userRoles'), userRoleData);
      onUsersUpdate();
      resetForm();
    } catch (error: any) {
      console.error('Error creating user:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError('A user with this email already exists');
      } else {
        setError('Error creating user. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    
    setError('');
    setIsSubmitting(true);
    try {
      const updateData = {
        displayName: formData.displayName,
        role: formData.role
      };
      
      await updateDoc(doc(db, 'userRoles', editingUser.id), updateData);
      onUsersUpdate();
      resetForm();
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Error updating user. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    
    try {
      await deleteDoc(doc(db, 'userRoles', userId));
      onUsersUpdate();
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Error deleting user. Please try again.');
    }
  };

  const handleStatusChange = async (userId: string, status: 'active' | 'suspended') => {
    try {
      await updateDoc(doc(db, 'userRoles', userId), { status });
      onUsersUpdate();
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const startEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      displayName: user.displayName || '',
      role: user.role,
      password: ''
    });
    setShowCreateForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-neutral-200 font-[family-name:var(--font-clash-display)]">User Management</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn btn-primary"
        >
          + Add New User
        </button>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="card">
          <h3 className="text-xl font-bold text-neutral-200 mb-6 font-[family-name:var(--font-clash-display)]">
            {editingUser ? 'Edit User' : 'Create New User'}
          </h3>
          
          <form onSubmit={editingUser ? handleUpdateUser : handleCreateUser} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label-primary">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="input-primary"
                  placeholder="user@example.com"
                  required
                  disabled={!!editingUser}
                />
              </div>
              
              <div>
                <label className="label-primary">Display Name</label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                  className="input-primary"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label className="label-primary">Role *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'admin' | 'customer' }))}
                  className="select-primary"
                  required
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              {!editingUser && (
                <div>
                  <label className="label-primary">Password *</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="input-primary"
                    placeholder="Minimum 6 characters"
                    minLength={6}
                    required
                  />
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={resetForm}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary"
              >
                {isSubmitting ? 'Processing...' : editingUser ? 'Update User' : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users List */}
      <div className="card !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-dark">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Points</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[rgba(0,255,136,0.15)] border border-[rgba(0,255,136,0.3)] rounded-full flex items-center justify-center">
                        <span className="text-[#00ff88] font-semibold">
                          {user.displayName?.charAt(0) || user.email.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-neutral-200">{user.displayName || 'No Name'}</div>
                        <div className="text-sm text-neutral-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap">
                    <span className={`badge ${
                      user.role === 'admin' ? 'badge-purple' : 'badge-info'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="whitespace-nowrap">
                    <div className="flex items-center text-neutral-200">
                      <span className="mr-1">🏆</span>
                      {user.points.toLocaleString()}
                    </div>
                  </td>
                  <td className="whitespace-nowrap">
                    <span className={`badge ${
                      user.status === 'active' ? 'badge-success' : 'badge-danger'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap text-neutral-500">
                    {user.createdAt.toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => startEdit(user)}
                        className="text-[#00ffff] hover:text-[#67e8f9] transition-colors"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleStatusChange(user.id, user.status === 'active' ? 'suspended' : 'active')}
                        className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                          user.status === 'active' 
                            ? 'bg-red-500/15 text-red-400 border border-red-500/20 hover:bg-red-500/25' 
                            : 'bg-[rgba(0,255,136,0.1)] text-[#00ff88] border border-[rgba(0,255,136,0.2)] hover:bg-[rgba(0,255,136,0.2)]'
                        }`}
                        title={user.status === 'active' ? 'Suspend' : 'Activate'}
                      >
                        {user.status === 'active' ? '🚫' : '✅'}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👤</div>
              <p className="text-xl font-semibold text-neutral-300 mb-2">No Users Found</p>
              <p className="text-neutral-500">Add your first user to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
