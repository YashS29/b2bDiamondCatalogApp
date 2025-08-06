import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const DashboardLayout = ({ 
  children, 
  currentUser = { name: 'Admin User', email: 'admin@diamond.com' },
  onLogout 
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get active menu from current path
  const getActiveMenu = () => {
    const path = location.pathname;
    if (path.includes('/products')) return 'products';
    if (path.includes('/customers')) return 'customers';
    if (path.includes('/logs')) return 'logs';
    return 'dashboard';
  };
  
  const [activeMenu, setActiveMenu] = useState(getActiveMenu());

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v3H8V5z" />
        </svg>
      )
    },
    {
      id: 'products',
      label: 'Diamond Products',
      path: '/products',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2M12 4.3L20 8.2V10C20 15.5 16.5 19.2 12 20.7C7.5 19.2 4 15.5 4 10V8.2L12 4.3M12 6L6 9V10C6 14 8.7 16.9 12 18C15.3 16.9 18 14 18 10V9L12 6M12 8.5L15 10.3V10.5C15 12.8 13.8 14.8 12 15.5C10.2 14.8 9 12.8 9 10.5V10.3L12 8.5Z"/>
        </svg>
      ),
      badge: 'New'
    },
    {
      id: 'customers',
      label: 'Customers',
      path: '/customers',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      )
    },
    {
      id: 'logs',
      label: 'Activity Logs',
      path: '/logs',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    }
  ];

  const handleMenuClick = (menuId, path) => {
    setActiveMenu(menuId);
    setIsSidebarOpen(false);
    navigate(path);
  };

  // Update active menu when location changes
  React.useEffect(() => {
    setActiveMenu(getActiveMenu());
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className={`
        fixed top-0 left-0 h-full w-72 bg-white/80 backdrop-blur-xl shadow-2xl border-r border-white/20 z-50 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-gray-100/50">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 rounded-xl blur opacity-75 animate-pulse" />
              <div className="relative bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 p-3 rounded-xl shadow-lg">
                <svg className="w-6 h-6 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2M12 4.3L20 8.2V10C20 15.5 16.5 19.2 12 20.7C7.5 19.2 4 15.5 4 10V8.2L12 4.3M12 6L6 9V10C6 14 8.7 16.9 12 18C15.3 16.9 18 14 18 10V9L12 6M12 8.5L15 10.3V10.5C15 12.8 13.8 14.8 12 15.5C10.2 14.8 9 12.8 9 10.5V10.3L12 8.5Z"/>
                </svg>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Diamond Admin
              </h1>
              <p className="text-sm text-gray-500 font-medium">Management Portal</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id, item.path)}
              className={`
                group w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-all duration-200 text-left
                ${activeMenu === item.id 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-[1.02]'
                  : 'text-gray-700 hover:bg-white/60 hover:shadow-md hover:transform hover:scale-[1.01]'
                }
              `}
            >
              <div className="flex items-center space-x-3">
                <div className={`
                  ${activeMenu === item.id ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}
                  transition-colors duration-200
                `}>
                  {item.icon}
                </div>
                <span className="font-semibold">{item.label}</span>
              </div>
              {item.badge && (
                <span className={`
                  px-2 py-1 text-xs font-bold rounded-full transition-colors duration-200
                  ${activeMenu === item.id 
                    ? 'bg-white/20 text-white' 
                    : 'bg-gradient-to-r from-orange-400 to-pink-500 text-white'
                  }
                `}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100/50 bg-white/40 backdrop-blur-sm">
          <div className="flex items-center space-x-3 p-3 bg-white/60 rounded-xl shadow-sm">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">
                {currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{currentUser.name}</p>
              <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:ml-72">
        <header className="bg-white/70 backdrop-blur-xl shadow-sm border-b border-white/20 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-white/60 rounded-xl transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="hidden lg:block">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent capitalize">
                {activeMenu === 'products' ? 'Diamond Products' : activeMenu}
              </h2>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-white/60 rounded-xl transition-all duration-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5-5v-1a8 8 0 00-16 0v1l-5 5h5m6 0v1a3 3 0 01-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              </button>

              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white/60 rounded-xl transition-all duration-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>

              <button
                onClick={onLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/40 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 min-h-[600px] p-6">
              <Outlet />
            </div>
          </div>
        </main>

        <footer className="p-6 text-center">
          <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
            <p className="text-sm text-gray-600">
              © 2025 Diamond Admin Panel. All rights reserved. | Secured & Encrypted
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;