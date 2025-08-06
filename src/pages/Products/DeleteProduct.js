import React, { useState } from 'react';

const DeleteProduct = ({ 
  product, 
  isOpen, 
  onClose, 
  onConfirm, 
  isDeleting = false 
}) => {
  const [deleteReason, setDeleteReason] = useState('');
  const [confirmText, setConfirmText] = useState('');
  
  const deleteReasons = [
    'Product sold',
    'Inventory error',
    'Damaged product',
    'Discontinued',
    'Price change',
    'Other'
  ];

  const handleConfirm = () => {
    if (confirmText.toLowerCase() === 'delete') {
      onConfirm(product.id, deleteReason);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-full">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Delete Product</h2>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Product Info */}
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-start space-x-3 sm:space-x-4">
            <div className="flex-shrink-0">
              <img
                src={product.image || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=80&h=80&fit=crop&crop=center'}
                alt={`${product.shape} Diamond`}
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover shadow-md"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 truncate">
                {product.shape}
              </h3>
              <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Carat Weight:</span>
                  <span className="font-medium">{product.caratWeight}</span>
                </div>
                <div className="flex justify-between">
                  <span>Color/Clarity:</span>
                  <span className="font-medium">{product.color}/{product.clarity}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cut:</span>
                  <span className="font-medium">{product.cut}</span>
                </div>
                <div className="flex justify-between">
                  <span>Price:</span>
                  <span className="font-medium text-base sm:text-lg text-blue-600">
                    {formatCurrency(product.totalPrice)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Status:</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    product.stockStatus === 'Available' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.stockStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Reason + Confirmation */}
        <div className="p-4 sm:p-6 space-y-4">
          <div>
            <label htmlFor="deleteReason" className="block text-sm font-medium text-gray-700 mb-1">
              Reason for deletion
            </label>
            <select
              id="deleteReason"
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-red-500 focus:border-red-500 text-sm"
            >
              <option value="" disabled>Select a reason</option>
              {deleteReasons.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="confirmText" className="block text-sm font-medium text-gray-700 mb-1">
              Type <span className="font-bold">DELETE</span> to confirm
            </label>
            <input
              id="confirmText"
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-red-500 focus:border-red-500 text-sm"
              placeholder="DELETE"
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-2 pt-2">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="w-full sm:w-auto px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition disabled:opacity-50 order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={confirmText.toLowerCase() !== 'delete' || !deleteReason || isDeleting}
              className="w-full sm:w-auto px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50 order-1 sm:order-2"
            >
              {isDeleting ? 'Deleting...' : 'Confirm Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteProduct;