import React from 'react';

interface ResponseModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const ResponseModal: React.FC<ResponseModalProps> = ({
  isOpen,
  title,
  message,
  type,
  onClose,
}) => {
  if (!isOpen) return null;

  const bgColor =
    type === 'success'
      ? 'bg-green-50 dark:bg-green-900/20'
      : type === 'error'
        ? 'bg-red-50 dark:bg-red-900/20'
        : 'bg-blue-50 dark:bg-blue-900/20';

  const borderColor =
    type === 'success'
      ? 'border-green-200 dark:border-green-800'
      : type === 'error'
        ? 'border-red-200 dark:border-red-800'
        : 'border-blue-200 dark:border-blue-800';

  const iconColor =
    type === 'success'
      ? 'text-green-600 dark:text-green-400'
      : type === 'error'
        ? 'text-red-600 dark:text-red-400'
        : 'text-blue-600 dark:text-blue-400';

  const titleColor =
    type === 'success'
      ? 'text-green-800 dark:text-green-200'
      : type === 'error'
        ? 'text-red-800 dark:text-red-200'
        : 'text-blue-800 dark:text-blue-200';

  const messageColor =
    type === 'success'
      ? 'text-green-700 dark:text-green-300'
      : type === 'error'
        ? 'text-red-700 dark:text-red-300'
        : 'text-blue-700 dark:text-blue-300';

  const buttonColor =
    type === 'success'
      ? 'bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600'
      : type === 'error'
        ? 'bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600'
        : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600';

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all">
        <div className={`px-6 py-4 border-b ${borderColor} ${bgColor}`}>
          <div className="flex items-center gap-3">
            {type === 'success' && (
              <svg
                className={`w-6 h-6 ${iconColor}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {type === 'error' && (
              <svg
                className={`w-6 h-6 ${iconColor}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {type === 'info' && (
              <svg
                className={`w-6 h-6 ${iconColor}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <h2 className={`text-lg font-semibold ${titleColor}`}>{title}</h2>
          </div>
        </div>

        <div className="px-6 py-4">
          <p className={`${messageColor} text-sm leading-relaxed`}>{message}</p>
        </div>

        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 rounded-b-lg flex justify-end">
          <button
            onClick={onClose}
            className={`${buttonColor} text-white px-4 py-2 rounded-lg font-medium transition-colors`}
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};
