import React, { useState } from 'react';

const DeleteCustomer = ({ customer, isOpen, onClose, onConfirm, isDeleting }) => {
  const [reason, setReason] = useState('');
  const [showReasonInput, setShowReasonInput] = useState(false);

  const handleConfirm = () => {
    if (showReasonInput && !reason.trim()) {
      return; // Don't proceed if reason is required but not provided
    }
    onConfirm(customer.id, reason.trim());
  };

  const handleClose = () => {
    setReason('');
    setShowReasonInput(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="w-full">
      <div className="p-6">
          {/* Header */}
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0 h-10 w-10">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Delete Customer</h3>
              <p className="text-sm text-gray-600">This action cannot be undone</p>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-12 w-12">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                  {customer.name.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="ml-4">
                <h4 className="text-base font-medium text-gray-900">{customer.name}</h4>
                <p className="text-sm text-gray-600">{customer.email}</p>
                <p className="text-sm text-gray-500">@{customer.username}</p>
              </div>
            </div>
          </div>

          {/* Warning Message */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex">
              <svg className="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <h4 className="text-sm font-medium text-red-900">Warning</h4>
                <p className="text-sm text-red-700 mt-1">
                  Deleting this customer will permanently remove their account and all associated data. 
                  This action cannot be undone.
                </p>
              </div>
            </div>
          </div>

          {/* Reason Input */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700">
                Reason for deletion
              </label>
              <button
                type="button"
                onClick={() => setShowReasonInput(!showReasonInput)}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                {showReasonInput ? 'Optional' : 'Add Reason'}
              </button>
            </div>
            
            {showReasonInput && (
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason for deletion (optional)"
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 text-sm resize-none"
              />
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleClose}
              disabled={isDeleting}
              className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isDeleting || (showReasonInput && !reason.trim())}
              className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isDeleting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  <span>Deleting...</span>
                </div>
              ) : (
                'Delete Customer'
              )}
            </button>
          </div>
        </div>
      </div>
  );
};

export default DeleteCustomer;
