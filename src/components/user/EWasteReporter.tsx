import React, { useState, useEffect, useCallback } from 'react';
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

  // Escape key handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

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
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-content p-8 max-w-2xl w-full mx-4 font-[family-name:var(--font-satoshi)]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-neutral-200 font-[family-name:var(--font-clash-display)]">Report E-Waste Device</h2>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-[#00ff88] text-2xl transition-colors"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {submitStatus && (
          <div className={`mb-4 p-3 rounded-xl ${
            submitStatus.includes('Error') 
              ? 'bg-red-500/10 text-red-400 border border-red-500/30' 
              : 'bg-[rgba(0,255,136,0.1)] text-[#00ff88] border border-[rgba(0,255,136,0.3)]'
          }`}>
            {submitStatus}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-primary">
              Device Type *
            </label>
            <select
              value={formData.deviceType}
              onChange={(e) => setFormData({...formData, deviceType: e.target.value})}
              className="select-primary"
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
              <label className="label-primary">
                Brand *
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({...formData, brand: e.target.value})}
                className="input-primary"
                placeholder="e.g., Apple, Samsung, Dell"
                required
              />
            </div>

            <div>
              <label className="label-primary">
                Model
              </label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData({...formData, model: e.target.value})}
                className="input-primary"
                placeholder="e.g., iPhone 12, Galaxy S21"
              />
            </div>
          </div>

          <div>
            <label className="label-primary">
              Condition *
            </label>
            <select
              value={formData.condition}
              onChange={(e) => setFormData({...formData, condition: e.target.value as any})}
              className="select-primary"
              required
            >
              <option value="working">Working</option>
              <option value="partially-working">Partially Working</option>
              <option value="broken">Broken</option>
            </select>
          </div>

          <div>
            <label className="label-primary">
              Location *
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className="input-primary"
              placeholder="City, State or full address"
              required
            />
          </div>

          <div>
            <label className="label-primary">
              Estimated Value (optional)
            </label>
            <input
              type="number"
              value={formData.estimatedValue}
              onChange={(e) => setFormData({...formData, estimatedValue: e.target.value})}
              className="input-primary"
              placeholder="Estimated value in USD"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="label-primary">
              Additional Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="textarea-primary"
              rows={3}
              placeholder="Any additional details about the device..."
            />
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
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
