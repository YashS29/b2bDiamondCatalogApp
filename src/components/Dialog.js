import React, { useEffect, useRef } from 'react';

const Dialog = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md', // 'sm', 'md', 'lg', 'xl'
  showCloseButton = true,
  closeOnBackdropClick = true,
  className = ''
}) => {
  const dialogRef = useRef(null);
  const backdropRef = useRef(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when dialog is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Focus management
  useEffect(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm w-full mx-2',
    md: 'max-w-md w-full mx-2',
    lg: 'max-w-lg w-full mx-2',
    xl: 'max-w-xl w-full mx-2',
    '2xl': 'max-w-2xl w-full mx-2',
    '3xl': 'max-w-3xl w-full mx-2',
    '4xl': 'max-w-4xl w-full mx-2',
    '5xl': 'max-w-5xl w-full mx-2',
    '6xl': 'max-w-6xl w-full mx-2',
    '7xl': 'max-w-7xl w-full mx-2'
  };

  const handleBackdropClick = (e) => {
    if (closeOnBackdropClick && e.target === backdropRef.current) {
      onClose();
    }
  };

  return (
    <div 
      ref={backdropRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 p-2 sm:p-4 md:p-6"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div
        ref={dialogRef}
        className={`bg-white rounded-2xl shadow-2xl border border-gray-200 ${sizeClasses[size]} max-h-[98vh] sm:max-h-[95vh] md:max-h-[90vh] overflow-hidden transition-all duration-200 ease-out ${className}`}
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-3 sm:p-4 lg:p-6 border-b border-gray-200">
            {title && (
              <h2 id="dialog-title" className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 pr-2 break-words">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-shrink-0"
                aria-label="Close dialog"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(98vh-80px)] sm:max-h-[calc(95vh-120px)] md:max-h-[calc(90vh-120px)]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Dialog;
