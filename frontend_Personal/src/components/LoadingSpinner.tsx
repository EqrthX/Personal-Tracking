export const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-gray-200 dark:border-gray-600 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-green-500 rounded-full border-t-transparent border-r-transparent animate-spin"></div>
        </div>
        
        {/* Loading Text */}
        <div className="text-center">
          <p className="text-gray-900 dark:text-white font-medium">
            กำลังโหลด
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            โปรดรอสักครู่...
          </p>
        </div>
      </div>
    </div>
  );
};
