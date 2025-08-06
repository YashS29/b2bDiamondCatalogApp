import React, { useState, useEffect } from 'react';
import AddProduct from './AddProduct';
import EditProduct from './EditProduct';
import DeleteProduct from './DeleteProduct';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('table');
  const [sortBy, setSortBy] = useState('dateAdded');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  // Modal state: { type: 'add' | 'edit' | 'delete' | null, product: object | null }
  const [modal, setModal] = useState({ type: null, product: null });
  const [modalError, setModalError] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Helper to open modals
  const openModal = (type, product = null) => {
    setModal({ type, product });
    setModalError(null);
  };

  // Helper to close modals
  const closeModal = () => {
    setModal({ type: null, product: null });
    setModalError(null);
    setModalLoading(false);
  };

  // Handle successful operations
  const handleAddSuccess = (newProduct) => {
    setProducts(prev => [newProduct, ...prev]);
    closeModal();
  };

  const handleEditSuccess = (updatedProduct) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    closeModal();
  };

  const handleDeleteSuccess = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    closeModal();
  };
  
  const [filters, setFilters] = useState({
    shape: '',
    color: '',
    clarity: '',
    cut: '',
    stockStatus: '',
    priceRange: { min: 0, max: 100000 }
  });

  // Mock data - replace with API call later
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockProducts = [
        {
          id: '1',
          shape: 'Round Brilliant',
          caratWeight: 2.5,
          color: 'D',
          clarity: 'VVS1',
          cut: 'Excellent',
          certification: 'GIA',
          pricePerCarat: 8500,
          totalPrice: 21250,
          stockStatus: 'Available',
          image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=150&h=150&fit=crop&crop=center',
          dateAdded: '2024-01-15'
        },
        {
          id: '2',
          shape: 'Princess',
          caratWeight: 1.8,
          color: 'F',
          clarity: 'VS1',
          cut: 'Very Good',
          certification: 'AGS',
          pricePerCarat: 6200,
          totalPrice: 11160,
          stockStatus: 'Available',
          image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=150&h=150&fit=crop&crop=center',
          dateAdded: '2024-01-14'
        },
        {
          id: '3',
          shape: 'Emerald',
          caratWeight: 3.2,
          color: 'E',
          clarity: 'VVS2',
          cut: 'Excellent',
          certification: 'GIA',
          pricePerCarat: 9800,
          totalPrice: 31360,
          stockStatus: 'Sold Out',
          image: 'https://images.unsplash.com/photo-1544266503-7ad532882d90?w=150&h=150&fit=crop&crop=center',
          dateAdded: '2024-01-13'
        },
        {
          id: '4',
          shape: 'Oval',
          caratWeight: 1.5,
          color: 'G',
          clarity: 'VS2',
          cut: 'Very Good',
          certification: 'GIA',
          pricePerCarat: 5800,
          totalPrice: 8700,
          stockStatus: 'Available',
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=150&h=150&fit=crop&crop=center',
          dateAdded: '2024-01-12'
        },
        {
          id: '5',
          shape: 'Cushion',
          caratWeight: 2.1,
          color: 'H',
          clarity: 'SI1',
          cut: 'Good',
          certification: 'EGL',
          pricePerCarat: 4200,
          totalPrice: 8820,
          stockStatus: 'Available',
          image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=150&h=150&fit=crop&crop=center',
          dateAdded: '2024-01-11'
        },
        {
          id: '6',
          shape: 'Marquise',
          caratWeight: 1.2,
          color: 'I',
          clarity: 'VS1',
          cut: 'Very Good',
          certification: 'GIA',
          pricePerCarat: 4800,
          totalPrice: 5760,
          stockStatus: 'Available',
          image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=150&h=150&fit=crop&crop=center',
          dateAdded: '2024-01-10'
        },
        {
          id: '7',
          shape: 'Pear',
          caratWeight: 1.9,
          color: 'J',
          clarity: 'SI2',
          cut: 'Good',
          certification: 'AGS',
          pricePerCarat: 3200,
          totalPrice: 6080,
          stockStatus: 'Sold Out',
          image: 'https://images.unsplash.com/photo-1596944924591-e7bc8d34bff8?w=150&h=150&fit=crop&crop=center',
          dateAdded: '2024-01-09'
        }
      ];
      
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setIsLoading(false);
    };

    fetchProducts();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let filtered = products.filter(product => {
      const matchesSearch = 
        product.shape.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.clarity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.certification.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesShape = !filters.shape || product.shape === filters.shape;
      const matchesColor = !filters.color || product.color === filters.color;
      const matchesClarity = !filters.clarity || product.clarity === filters.clarity;
      const matchesCut = !filters.cut || product.cut === filters.cut;
      const matchesStatus = !filters.stockStatus || product.stockStatus === filters.stockStatus;
      const matchesPrice = product.totalPrice >= filters.priceRange.min && 
                          product.totalPrice <= filters.priceRange.max;

      return matchesSearch && matchesShape && matchesColor && matchesClarity && 
             matchesCut && matchesStatus && matchesPrice;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'caratWeight':
          aValue = a.caratWeight;
          bValue = b.caratWeight;
          break;
        case 'totalPrice':
          aValue = a.totalPrice;
          bValue = b.totalPrice;
          break;
        default:
          aValue = new Date(a.dateAdded).getTime();
          bValue = new Date(b.dateAdded).getTime();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, searchTerm, filters, sortBy, sortOrder]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const clearFilters = () => {
    setFilters({
      shape: '',
      color: '',
      clarity: '',
      cut: '',
      stockStatus: '',
      priceRange: { min: 0, max: 100000 }
    });
    setSearchTerm('');
  };

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-600">
          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredProducts.length)} of {filteredProducts.length} results
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                currentPage === page
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600 font-medium">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Diamond Products</h1>
            <p className="text-gray-600 mt-1">Manage your diamond inventory</p>
          </div>
          <button 
            onClick={() => openModal('add')}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Product
          </button>
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search diamonds by shape, color, clarity, or certification..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  viewMode === 'table' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 6h18m-18 8h18m-18 4h18" />
                </svg>
                Table
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Grid
              </button>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                showFilters ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
              </svg>
              Filters
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <select
                value={filters.shape}
                onChange={(e) => setFilters(prev => ({ ...prev, shape: e.target.value }))}
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Shapes</option>
                <option value="Round Brilliant">Round Brilliant</option>
                <option value="Princess">Princess</option>
                <option value="Emerald">Emerald</option>
                <option value="Oval">Oval</option>
                <option value="Cushion">Cushion</option>
                <option value="Marquise">Marquise</option>
                <option value="Pear">Pear</option>
              </select>

              <select
                value={filters.color}
                onChange={(e) => setFilters(prev => ({ ...prev, color: e.target.value }))}
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Colors</option>
                <option value="D">D</option>
                <option value="E">E</option>
                <option value="F">F</option>
                <option value="G">G</option>
                <option value="H">H</option>
                <option value="I">I</option>
                <option value="J">J</option>
              </select>

              <select
                value={filters.clarity}
                onChange={(e) => setFilters(prev => ({ ...prev, clarity: e.target.value }))}
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Clarity</option>
                <option value="FL">FL</option>
                <option value="IF">IF</option>
                <option value="VVS1">VVS1</option>
                <option value="VVS2">VVS2</option>
                <option value="VS1">VS1</option>
                <option value="VS2">VS2</option>
                <option value="SI1">SI1</option>
                <option value="SI2">SI2</option>
              </select>

              <select
                value={filters.stockStatus}
                onChange={(e) => setFilters(prev => ({ ...prev, stockStatus: e.target.value }))}
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="Available">Available</option>
                <option value="Sold Out">Sold Out</option>
              </select>

              <div className="md:col-span-2 lg:col-span-4 flex items-center justify-between">
                <button
                  onClick={clearFilters}
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
                >
                  Clear all filters
                </button>
                <div className="text-sm text-gray-600">
                  Showing {filteredProducts.length} of {products.length} products
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sort Options */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="dateAdded">Date Added</option>
              <option value="caratWeight">Carat Weight</option>
              <option value="totalPrice">Total Price</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <svg className={`w-5 h-5 transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Products Display */}
        {viewMode === 'table' ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Specifications</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Pricing</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-16 w-16">
                            <img
                              className="h-16 w-16 rounded-xl object-cover shadow-md"
                              src={product.image}
                              alt={`${product.shape} Diamond`}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">{product.shape}</div>
                            <div className="text-sm text-gray-600">{product.caratWeight} Carat</div>
                            <div className="text-xs text-gray-500">{product.certification}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          <div className="grid grid-cols-2 gap-1">
                            <span className="text-gray-600">Color:</span>
                            <span className="font-medium">{product.color}</span>
                            <span className="text-gray-600">Clarity:</span>
                            <span className="font-medium">{product.clarity}</span>
                            <span className="text-gray-600">Cut:</span>
                            <span className="font-medium">{product.cut}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          <div className="font-semibold text-lg">{formatCurrency(product.totalPrice)}</div>
                          <div className="text-gray-600">{formatCurrency(product.pricePerCarat)}/ct</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          product.stockStatus === 'Available' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.stockStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => openModal('edit', product)}
                            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-all duration-200"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => openModal('delete', product)}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentProducts.map((product) => (
              <div key={product.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={`${product.shape} Diamond`}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      product.stockStatus === 'Available' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.stockStatus}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{product.shape}</h3>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{formatCurrency(product.totalPrice)}</div>
                      <div className="text-sm text-gray-600">{formatCurrency(product.pricePerCarat)}/ct</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div>
                      <span className="text-gray-600">Carat:</span>
                      <span className="font-semibold ml-2">{product.caratWeight}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Color:</span>
                      <span className="font-semibold ml-2">{product.color}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Clarity:</span>
                      <span className="font-semibold ml-2">{product.clarity}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Cut:</span>
                      <span className="font-semibold ml-2">{product.cut}</span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 mb-4">
                    Certified by {product.certification} • Added {new Date(product.dateAdded).toLocaleDateString()}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <button className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => openModal('edit', product)}
                        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-all duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => openModal('delete', product)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {renderPagination()}

        {/* Empty State */}
        {filteredProducts.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria to find what you're looking for.
            </p>
            <div className="mt-6">
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Clear filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Overlays */}
      {modal.type === 'add' && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50 p-2 sm:p-4 pt-20 sm:pt-24">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[75vh] sm:max-h-[80vh] overflow-y-auto mx-4">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Add New Product</h2>
                <button
                  onClick={closeModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <AddProduct 
                onClose={closeModal}
                onSuccess={handleAddSuccess}
                onError={setModalError}
              />
            </div>
            {modalError && (
              <div className="p-4 bg-red-50 border-t border-red-200">
                <p className="text-red-700 text-sm">{modalError}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {modal.type === 'edit' && modal.product && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50 p-2 sm:p-4 pt-20 sm:pt-24">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[75vh] sm:max-h-[80vh] overflow-y-auto mx-4">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Edit Product</h2>
                <button
                  onClick={closeModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <EditProduct 
                product={modal.product}
                onClose={closeModal}
                onSuccess={handleEditSuccess}
                onError={setModalError}
              />
            </div>
            {modalError && (
              <div className="p-4 bg-red-50 border-t border-red-200">
                <p className="text-red-700 text-sm">{modalError}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {modal.type === 'delete' && modal.product && (
        <DeleteProduct
          product={modal.product}
          isOpen={true}
          onClose={closeModal}
          onConfirm={(id, reason) => {
            setModalLoading(true);
            // Simulate delete logic (replace with API call in future)
            setTimeout(() => {
              handleDeleteSuccess(id);
              setModalLoading(false);
            }, 800);
          }}
          isDeleting={modalLoading}
        />
      )}
    </div>
  );
};

export default ProductList;