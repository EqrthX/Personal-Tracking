import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import { ConfirmationModal } from './ConfirmationModal';

const navLinks = [
  { path: '/overview', icon: '📊', label: 'Overview' },
  { path: '/add-finance', icon: '➕', label: 'เพิ่มข้อมูล' },
  { path: '/dashboard', icon: '📈', label: 'Dashboard' },
  { path: '/analytics', icon: '📉', label: 'Analytics' },
];

export default function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isActive = (path: string) => location.pathname === path;

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    logout();
    navigate('/login');
  };

  // Authenticated Navigation
  if (user) {
    return (
      <>
        <nav className="w-full bg-gray-900 dark:bg-gray-950 sticky top-0 z-50 border-b border-gray-700">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between gap-8">
              {/* Logo */}
              <Link to="/overview" className="flex-shrink-0 flex items-center gap-2 font-bold text-lg whitespace-nowrap">
                <span className="text-2xl">💰</span>
                <span className="text-blue-400">Personal Track</span>
              </Link>

              {/* Desktop Navigation - Hidden on Mobile */}
              <div className="hidden lg:flex items-center gap-1 flex-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                      isActive(link.path)
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    {link.icon} {link.label}
                  </Link>
                ))}
              </div>

              {/* Desktop User Section */}
              <div className="hidden lg:flex items-center gap-4 ml-auto">
                <span className="text-gray-300 text-sm font-medium whitespace-nowrap">
                  {user.name || user.email}
                </span>
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors whitespace-nowrap"
                >
                  Logout
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
              <div className="lg:hidden mt-4 pt-4 border-t border-gray-700 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(link.path)
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    {link.icon} {link.label}
                  </Link>
                ))}
                <div className="border-t border-gray-700 pt-2 mt-2">
                  <div className="px-4 py-2 text-sm text-gray-300">
                    {user.name || user.email}
                  </div>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setShowLogoutConfirm(true);
                    }}
                    className="w-full text-left px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>

        <ConfirmationModal
          isOpen={showLogoutConfirm}
          title="ยืนยันการออกจากระบบ"
          message="คุณแน่ใจหรือว่าต้องการออกจากระบบ?"
          confirmText="ออกจากระบบ"
          cancelText="ยกเลิก"
          isDangerous={true}
          onConfirm={handleConfirmLogout}
          onCancel={() => setShowLogoutConfirm(false)}
        />
      </>
    );
  }

  // Unauthenticated Navigation
  return (
    <nav className="w-full bg-gray-900 dark:bg-gray-950 sticky top-0 z-50 border-b border-gray-700">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex-shrink-0 flex items-center gap-2 font-bold text-lg">
            <span className="text-2xl">💰</span>
            <span className="text-blue-400">Personal Track</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                isActive('/login')
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              Login
            </Link>
            <Link
              to="/register"
              className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                isActive('/register')
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
