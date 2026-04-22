import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';

export const NotFoundPage = () => {
  const error = useRouteError();
  const isRouteError = isRouteErrorResponse(error);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
            {isRouteError ? error.status : '404'}
          </h1>
          <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-4">
            {isRouteError ? error.statusText : 'ไม่พบหน้า'}
          </h2>
        </div>

        <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
          ขออภัย หน้าที่คุณกำลังมองหาไม่มีอยู่ หรือเกิดข้อผิดพลาด
        </p>

        {isRouteError && error.data && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8">
            <p className="text-red-700 dark:text-red-300 text-sm">
              {error.data}
            </p>
          </div>
        )}

        <div className="space-y-3">
          <Link
            to="/"
            className="block px-6 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white font-medium rounded-lg transition"
          >
            กลับไปหน้าแรก
          </Link>
          <Link
            to="/login"
            className="block px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium rounded-lg transition"
          >
            เข้าสู่ระบบ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
