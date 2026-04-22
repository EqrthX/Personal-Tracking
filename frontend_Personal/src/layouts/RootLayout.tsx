import { Outlet, useLocation } from 'react-router-dom';
import { ThemeToggle } from '../components/ThemeToggle';
import Navigation from '../components/Navigation';

export default function RootLayout() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header with Navigation */}
      {!isAuthPage && <Navigation />}
      <div className="fixed top-4 right-4 z-40">
        <ThemeToggle />
      </div>

      {/* Main Content */}
      <main className="flex-1 bg-white dark:bg-gray-900 transition-colors duration-200">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6 px-4">
        <div className="max-w-6xl mx-auto text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2024 Personal Tracking. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
