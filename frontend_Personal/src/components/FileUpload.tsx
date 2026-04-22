import React, { useRef, useState, useEffect } from 'react';

interface FileUploadProps {
  onChange: (file: File | null) => void;
  fileName?: string;
  disabled?: boolean;
  accept?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onChange,
  fileName,
  disabled = false,
  accept = 'image/*',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string>('');

  useEffect(() => {
    if (fileName && fileInputRef.current?.files?.[0]) {
      const file = fileInputRef.current.files[0];
      
      // สร้าง preview เมื่อเป็นรูปภาพ
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
      
      // แสดงขนาดไฟล์
      const size = file.size;
      if (size < 1024) {
        setFileSize(`${size} B`);
      } else if (size < 1024 * 1024) {
        setFileSize(`${(size / 1024).toFixed(2)} KB`);
      } else {
        setFileSize(`${(size / (1024 * 1024)).toFixed(2)} MB`);
      }
    }
  }, [fileName]);

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    onChange(file || null);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragActive(e.type === 'dragenter' || e.type === 'dragover');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (!disabled) {
      const file = e.dataTransfer.files?.[0];
      if (file) {
        onChange(file);
        if (fileInputRef.current) {
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          fileInputRef.current.files = dataTransfer.files;
        }
      }
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setPreview(null);
    setFileSize('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // แสดง preview ถ้ามีรูปภาพ
  if (preview) {
    return (
      <div className="space-y-4">
        {/* Preview Image */}
        <div className="relative w-full rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-auto object-cover max-h-96"
          />
          
          {/* Remove Button */}
          <button
            onClick={handleRemove}
            className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded-lg transition shadow-lg"
            title="ลบไฟล์"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* File Info */}
        <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center gap-3">
            <svg
              className="w-5 h-5 text-green-600 dark:text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {fileName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {fileSize}
              </p>
            </div>
          </div>
          <button
            onClick={handleRemove}
            className="px-3 py-1 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition"
          >
            ลบ
          </button>
        </div>

        {/* Change File Button */}
        <button
          onClick={handleClick}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition text-sm font-medium"
        >
          เลือกไฟล์ใหม่
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`relative w-full px-6 py-8 border-2 border-dashed rounded-lg transition-all cursor-pointer ${
        disabled
          ? 'border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700/50'
          : isDragActive
            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-green-400 dark:hover:border-green-500 hover:bg-green-50/50 dark:hover:bg-green-900/10'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
        disabled={disabled}
      />

      <div className="flex flex-col items-center gap-3">
        {/* Icon */}
        <div
          className={`p-3 rounded-lg transition-colors ${
            isDragActive
              ? 'bg-green-200 dark:bg-green-800'
              : 'bg-gray-100 dark:bg-gray-700'
          }`}
        >
          <svg
            className={`w-6 h-6 transition-colors ${
              isDragActive
                ? 'text-green-600 dark:text-green-400'
                : 'text-gray-600 dark:text-gray-400'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>

        {/* Text */}
        <div className="text-center">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {disabled ? 'ฟีเจอร์นี้ปิดใช้งาน' : 'คลิกหรือลากรูปภาพมาวางที่นี่'}
          </p>
          {!disabled && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              รองรับไฟล์รูปภาพ (JPG, PNG, GIF ฯลฯ)
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
