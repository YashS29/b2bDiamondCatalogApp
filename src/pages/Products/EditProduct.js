import React, { useState, useEffect } from 'react';

const EditProduct = ({ product, onClose, onSuccess, onError }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    shape: '',
    caratWeight: '',
    color: '',
    clarity: '',
    cut: '',
    certification: '',
    priceType: 'perCarat',
    pricePerCarat: '',
    totalPrice: '',
    stockStatus: 'Available',
    images: []
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  const shapeOptions = [
    'Round Brilliant', 'Princess', 'Emerald', 'Oval', 'Cushion', 
    'Marquise', 'Pear', 'Asscher', 'Radiant', 'Heart'
  ];

  const colorOptions = ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
  
  const clarityOptions = [
    'FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'I1', 'I2', 'I3'
  ];

  const cutOptions = ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'];
  
  const certificationOptions = ['GIA', 'AGS', 'EGL', 'GSI', 'IGI', 'GCAL'];

  // Load product data on component mount
  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (product) {
          setFormData({
            shape: product.shape,
            caratWeight: product.caratWeight.toString(),
            color: product.color,
            clarity: product.clarity,
            cut: product.cut,
            certification: product.certification,
            priceType: 'perCarat',
            pricePerCarat: product.pricePerCarat.toString(),
            totalPrice: product.totalPrice.toString(),
            stockStatus: product.stockStatus,
            images: product.images || []
          });

          // Set existing images if available
          if (product.image) {
            setExistingImages([{
              id: 1,
              url: product.image,
              filename: 'diamond.jpg'
            }]);
          }
        }
        
      } catch (error) {
        console.error('Error loading product:', error);
        const errorMessage = 'Failed to load product data';
        setErrors({ fetch: errorMessage });
        if (onError) {
          onError(errorMessage);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (product) {
      loadProduct();
    }
  }, [product, onError]);

  // Validation rules
  const validateForm = () => {
    const newErrors = {};

    if (!formData.shape) newErrors.shape = 'Diamond shape is required';
    if (!formData.caratWeight || formData.caratWeight <= 0) {
      newErrors.caratWeight = 'Valid carat weight is required';
    }
    if (!formData.color) newErrors.color = 'Color grade is required';
    if (!formData.clarity) newErrors.clarity = 'Clarity grade is required';
    if (!formData.cut) newErrors.cut = 'Cut grade is required';
    if (!formData.certification) newErrors.certification = 'Certification is required';
    
    if (formData.priceType === 'perCarat') {
      if (!formData.pricePerCarat || formData.pricePerCarat <= 0) {
        newErrors.pricePerCarat = 'Valid price per carat is required';
      }
    } else {
      if (!formData.totalPrice || formData.totalPrice <= 0) {
        newErrors.totalPrice = 'Valid total price is required';
      }
    }

    // Check if we have at least one image (existing or new)
    const totalImages = existingImages.length - imagesToDelete.length + imageFiles.length;
    if (totalImages === 0) {
      newErrors.images = 'At least one product image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Auto-calculate total price when carat weight or price per carat changes
    if (name === 'caratWeight' || name === 'pricePerCarat') {
      const carat = name === 'caratWeight' ? parseFloat(value) : parseFloat(formData.caratWeight);
      const pricePerCarat = name === 'pricePerCarat' ? parseFloat(value) : parseFloat(formData.pricePerCarat);
      
      if (carat && pricePerCarat && formData.priceType === 'perCarat') {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          totalPrice: (carat * pricePerCarat).toFixed(2)
        }));
      }
    }

    // Auto-calculate price per carat when total price or carat weight changes
    if (name === 'totalPrice' && formData.priceType === 'total') {
      const carat = parseFloat(formData.caratWeight);
      const total = parseFloat(value);
      
      if (carat && total) {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          pricePerCarat: (total / carat).toFixed(2)
        }));
      }
    }
  };

  // Handle price type change
  const handlePriceTypeChange = (e) => {
    setFormData(prev => ({
      ...prev,
      priceType: e.target.value
    }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      setErrors(prev => ({
        ...prev,
        images: 'Only JPEG, PNG, and WebP images are allowed'
      }));
      return;
    }

    // Validate file size (max 5MB per file)
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setErrors(prev => ({
        ...prev,
        images: 'Each image must be less than 5MB'
      }));
      return;
    }

    setImageFiles(prev => [...prev, ...files]);
    
    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, {
          id: Date.now() + Math.random(),
          url: e.target.result,
          file: file
        }]);
      };
      reader.readAsDataURL(file);
    });

    // Clear image error
    if (errors.images) {
      setErrors(prev => ({
        ...prev,
        images: ''
      }));
    }
  };

  // Remove new image
  const removeNewImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Mark existing image for deletion
  const markImageForDeletion = (imageId) => {
    setImagesToDelete(prev => [...prev, imageId]);
  };

  // Restore existing image
  const restoreExistingImage = (imageId) => {
    setImagesToDelete(prev => prev.filter(id => id !== imageId));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create updated product object
      const updatedProduct = {
        ...product,
        shape: formData.shape,
        caratWeight: parseFloat(formData.caratWeight),
        color: formData.color,
        clarity: formData.clarity,
        cut: formData.cut,
        certification: formData.certification,
        pricePerCarat: parseFloat(formData.pricePerCarat),
        totalPrice: parseFloat(formData.totalPrice),
        stockStatus: formData.stockStatus,
        image: imagePreviews[0]?.url || existingImages[0]?.url || product.image
      };

      console.log('Product update data to be sent:', {
        formData,
        newImageFiles: imageFiles.map(f => ({ name: f.name, size: f.size, type: f.type })),
        imagesToDelete
      });

      // Call success callback
      if (onSuccess) {
        onSuccess(updatedProduct);
      }

    } catch (error) {
      console.error('Error updating product:', error);
      const errorMessage = 'Failed to update product. Please try again.';
      setErrors({ submit: errorMessage });
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 font-medium text-sm sm:text-base">Loading product...</p>
        </div>
      </div>
    );
  }

  if (errors.fetch) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center px-4">
          <svg className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Product Not Found</h3>
          <p className="text-gray-600 mb-4 text-sm sm:text-base">{errors.fetch}</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm sm:text-base"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Diamond Shape *
              </label>
              <select
                name="shape"
                value={formData.shape}
                onChange={handleInputChange}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-sm sm:text-base ${
                  errors.shape ? 'border-red-500' : 'border-gray-200'
                }`}
              >
                <option value="">Select Shape</option>
                {shapeOptions.map(shape => (
                  <option key={shape} value={shape}>{shape}</option>
                ))}
              </select>
              {errors.shape && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.shape}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Carat Weight *
              </label>
              <input
                type="number"
                name="caratWeight"
                value={formData.caratWeight}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                placeholder="e.g., 2.50"
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-sm sm:text-base ${
                  errors.caratWeight ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.caratWeight && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.caratWeight}</p>}
            </div>
          </div>
        </div>

        {/* Diamond Characteristics */}
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Diamond Characteristics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color *
              </label>
              <select
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-sm sm:text-base ${
                  errors.color ? 'border-red-500' : 'border-gray-200'
                }`}
              >
                <option value="">Select Color</option>
                {colorOptions.map(color => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
              {errors.color && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.color}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Clarity *
              </label>
              <select
                name="clarity"
                value={formData.clarity}
                onChange={handleInputChange}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-sm sm:text-base ${
                  errors.clarity ? 'border-red-500' : 'border-gray-200'
                }`}
              >
                <option value="">Select Clarity</option>
                {clarityOptions.map(clarity => (
                  <option key={clarity} value={clarity}>{clarity}</option>
                ))}
              </select>
              {errors.clarity && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.clarity}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cut *
              </label>
              <select
                name="cut"
                value={formData.cut}
                onChange={handleInputChange}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-sm sm:text-base ${
                  errors.cut ? 'border-red-500' : 'border-gray-200'
                }`}
              >
                <option value="">Select Cut</option>
                {cutOptions.map(cut => (
                  <option key={cut} value={cut}>{cut}</option>
                ))}
              </select>
              {errors.cut && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.cut}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Certification *
              </label>
              <select
                name="certification"
                value={formData.certification}
                onChange={handleInputChange}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-sm sm:text-base ${
                  errors.certification ? 'border-red-500' : 'border-gray-200'
                }`}
              >
                <option value="">Select Certification</option>
                {certificationOptions.map(cert => (
                  <option key={cert} value={cert}>{cert}</option>
                ))}
              </select>
              {errors.certification && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.certification}</p>}
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Pricing</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Input Method
              </label>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="priceType"
                    value="perCarat"
                    checked={formData.priceType === 'perCarat'}
                    onChange={handlePriceTypeChange}
                    className="mr-2"
                  />
                  <span className="text-sm sm:text-base">Price per Carat</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="priceType"
                    value="total"
                    checked={formData.priceType === 'total'}
                    onChange={handlePriceTypeChange}
                    className="mr-2"
                  />
                  <span className="text-sm sm:text-base">Total Price</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price per Carat ($) *
                </label>
                <input
                  type="number"
                  name="pricePerCarat"
                  value={formData.pricePerCarat}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  placeholder="e.g., 8500.00"
                  disabled={formData.priceType === 'total'}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-sm sm:text-base ${
                    errors.pricePerCarat ? 'border-red-500' : 'border-gray-200'
                  } ${formData.priceType === 'total' ? 'bg-gray-100' : ''}`}
                />
                {errors.pricePerCarat && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.pricePerCarat}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Price ($) *
                </label>
                <input
                  type="number"
                  name="totalPrice"
                  value={formData.totalPrice}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  placeholder="e.g., 21250.00"
                  disabled={formData.priceType === 'perCarat'}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-sm sm:text-base ${
                    errors.totalPrice ? 'border-red-500' : 'border-gray-200'
                  } ${formData.priceType === 'perCarat' ? 'bg-gray-100' : ''}`}
                />
                {errors.totalPrice && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.totalPrice}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Stock Status */}
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Stock Status</h2>
          <select
            name="stockStatus"
            value={formData.stockStatus}
            onChange={handleInputChange}
            className="w-full md:w-1/2 px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-sm sm:text-base"
          >
            <option value="Available">Available</option>
            <option value="Sold Out">Sold Out</option>
          </select>
        </div>

        {/* Product Images */}
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Product Images</h2>
          <div className="space-y-4 sm:space-y-6">
            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div>
                <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-3">Current Images</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                  {existingImages.map((image) => (
                    <div key={image.id} className="relative">
                      <img
                        src={image.url}
                        alt={image.filename}
                        className={`w-full h-24 sm:h-32 object-cover rounded-lg border border-gray-200 ${
                          imagesToDelete.includes(image.id) ? 'opacity-50 grayscale' : ''
                        }`}
                      />
                      {imagesToDelete.includes(image.id) ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => restoreExistingImage(image.id)}
                            className="bg-green-500 text-white rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm hover:bg-green-600 transition-colors duration-200"
                          >
                            Restore
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => markImageForDeletion(image.id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm hover:bg-red-600 transition-colors duration-200"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload New Images */}
            <div>
              <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-3">Add New Images</h3>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageUpload}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-sm sm:text-base"
              />
              <p className="text-xs sm:text-sm text-gray-500 mt-1">JPEG, PNG, WebP - Max 5MB each</p>
              {errors.images && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.images}</p>}
            </div>

            {/* New Image Previews */}
            {imagePreviews.length > 0 && (
              <div>
                <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-3">New Images to Upload</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={preview.id} className="relative">
                      <img
                        src={preview.url}
                        alt={`New Preview ${index + 1}`}
                        className="w-full h-24 sm:h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm hover:bg-red-600 transition-colors duration-200"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4">
            <p className="text-red-700 text-xs sm:text-sm">{errors.submit}</p>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 sm:gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-all duration-200 text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
          >
            {isSaving ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                <span className="hidden sm:inline">Updating Product...</span>
                <span className="sm:hidden">Updating...</span>
              </div>
            ) : (
              <>
                <span className="hidden sm:inline">Update Product</span>
                <span className="sm:hidden">Update</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;