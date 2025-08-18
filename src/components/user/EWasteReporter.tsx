import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';

interface EWasteDevice {
  type: string;
  brand: string;
  model: string;
  condition: 'working' | 'broken' | 'partially-working';
  quantity: number;
  description: string;
  location: string;
  contactMethod: 'pickup' | 'dropoff' | 'mail';
}

interface EWasteReporterProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function EWasteReporter({ onClose, onSuccess }: EWasteReporterProps) {
  const [formData, setFormData] = useState<EWasteDevice>({
    type: '',
    brand: '',
    model: '',
    condition: 'working',
    quantity: 1,
    description: '',
    location: '',
    contactMethod: 'pickup'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentUser } = useAuth();

  const deviceTypes = [
    'Smartphone',
    'Laptop',
    'Desktop Computer',
    'Tablet',
    'Monitor',
    'Television',
    'Printer',
    'Router/Modem',
    'Gaming Console',
    'Smart Watch',
    'Headphones/Earbuds',
    'Camera',
    'Battery',
    'Charger/Cable',
    'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const reportData = {
        ...formData,
        userId: currentUser?.uid,
        userEmail: currentUser?.email,
        status: 'pending',
        reportedAt: new Date(),
        points: calculatePoints(formData)
      };

      await addDoc(collection(db, 'ewasteReports'), reportData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error submitting e-waste report:', error);
      alert('Error submitting report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculatePoints = (device: EWasteDevice) => {
    let basePoints = 50;
    
    // Bonus points based on device type
    const typeMultipliers: { [key: string]: number } = {
      'Smartphone': 1.2,
      'Laptop': 1.5,
      'Desktop Computer': 1.8,
      'Television': 1.6,
      'Monitor': 1.4,
      'Printer': 1.3,
      'Gaming Console': 1.4,
      'Other': 1.0
    };

    const multiplier = typeMultipliers[device.type] || 1.0;
    return Math.round(basePoints * multiplier * device.quantity);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Report E-Waste Device</h2>
              <p className="text-gray-600">Help us recycle responsibly and earn points!</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Device Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="">Select device type</option>
                  {deviceTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand
                </label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Apple, Samsung, Dell"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Model
                </label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., iPhone 12, XPS 13"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition *
                </label>
                <select
                  value={formData.condition}
                  onChange={(e) => setFormData(prev => ({ ...prev, condition: e.target.value as 'working' | 'broken' | 'partially-working' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="working">Working</option>
                  <option value="partially-working">Partially Working</option>
                  <option value="broken">Broken</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity *
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Contact Method *
                </label>
                <select
                  value={formData.contactMethod}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactMethod: e.target.value as 'pickup' | 'dropoff' | 'mail' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="pickup">Schedule Pickup</option>
                  <option value="dropoff">Drop-off Location</option>
                  <option value="mail">Mail-in Service</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location/Address *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your city or full address"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows={3}
                placeholder="Any additional details about the device condition, accessories included, etc."
              />
            </div>

            {/* Points Preview */}
            {formData.type && (
              <div className="bg-green-50 p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-green-800">Estimated Points</h4>
                    <p className="text-sm text-green-600">You'll earn points for reporting this device</p>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    +{calculatePoints(formData)} pts
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !formData.type || !formData.location}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <h4 className="font-medium text-blue-800 mb-2">What happens next?</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Our team will review your report within 24 hours</li>
              <li>• You'll receive contact information for local recycling partners</li>
              <li>• Points will be added to your account once verified</li>
              <li>• Help us track the positive environmental impact!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
