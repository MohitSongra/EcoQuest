import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ewasteReportsService } from '../../services/firestoreService';

export function EWasteReporter({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    deviceType: '',
    brand: '',
    model: '',
    condition: 'working' as 'working' | 'broken' | 'partially-working',
    location: '',
    description: '',
    estimatedValue: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<string>('');
  const { currentUser } = useAuth();

  const deviceTypes = [
    'Smartphone', 'Laptop', 'Desktop Computer', 'Tablet', 'Television',
    'Printer', 'Router', 'Gaming Console', 'Smart Watch', 'Headphones',
    'Camera', 'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setIsSubmitting(true);
    setSubmitStatus('Submitting report...');

    try {
      const reportData: any = {
        deviceType: formData.deviceType,
        brand: formData.brand,
        model: formData.model,
        condition: formData.condition,
        location: formData.location,
        reportedBy: currentUser.uid,
        userId: currentUser.uid, // Required for Firestore security rules
        status: 'pending',
        description: formData.description
      };

      // Only include estimatedValue if it has a value
      if (formData.estimatedValue) {
        reportData.estimatedValue = parseFloat(formData.estimatedValue);
      }

      await ewasteReportsService.createReport(reportData);
      
      setSubmitStatus('E-waste device reported successfully! 🎉');
      setTimeout(() => {
        setFormData({
          deviceType: '',
          brand: '',
          model: '',
          condition: 'working',
          location: '',
          description: '',
          estimatedValue: ''
        });
        onClose();
        setSubmitStatus('');
      }, 2000);
    } catch (error) {
      console.error('Error reporting device:', error);
      setSubmitStatus('Error reporting device. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Report E-Waste Device</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {submitStatus && (
          <div className={`mb-4 p-3 rounded-lg ${
            submitStatus.includes('Error') 
              ? 'bg-red-50 text-red-700 border border-red-200' 
              : 'bg-green-50 text-green-700 border border-green-200'
          }`}>
            {submitStatus}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Device Type *
            </label>
            <select
              value={formData.deviceType}
              onChange={(e) => setFormData({...formData, deviceType: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select device type</option>
              {deviceTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand *
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({...formData, brand: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Apple, Samsung, Dell"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model
              </label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData({...formData, model: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., iPhone 12, Galaxy S21"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Condition *
            </label>
            <select
              value={formData.condition}
              onChange={(e) => setFormData({...formData, condition: e.target.value as any})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="working">Working</option>
              <option value="partially-working">Partially Working</option>
              <option value="broken">Broken</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="City, State or full address"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estimated Value (optional)
            </label>
            <input
              type="number"
              value={formData.estimatedValue}
              onChange={(e) => setFormData({...formData, estimatedValue: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Estimated value in USD"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Any additional details about the device..."
            />
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Report Device'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
