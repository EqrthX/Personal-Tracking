import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ResponseModal } from '../components/ResponseModal';
import { register } from '../utils/api';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info' as 'success' | 'error' | 'info',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setModal({
        isOpen: true,
        title: 'ข้อผิดพลาด',
        message: 'รหัสผ่านไม่ตรงกัน',
        type: 'error',
      });
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setModal({
        isOpen: true,
        title: 'ข้อผิดพลาด',
        message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร',
        type: 'error',
      });
      setLoading(false);
      return;
    }

    try {
        const name = `${formData.firstName.trim()} ${formData.lastName.trim()}`;
        
      const response = await register(
        name,
        formData.email,
        formData.password
      );

      if (response.success) {
        setModal({
          isOpen: true,
          title: 'สำเร็จ',
          message: 'สมัครสมาชิกสำเร็จ กรุณาเข้าสู่ระบบ',
          type: 'success',
        });
        // เคลียร์ฟอร์ม
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
        });
        // ไป login หลังจาก 1.5 วินาที
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        setModal({
          isOpen: true,
          title: 'ข้อผิดพลาด',
          message: response.error || 'มีข้อผิดพลาดในการสมัครสมาชิก',
          type: 'error',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
            Register
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            สมัครสมาชิกบัญชีใหม่
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              ชื่อ
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              placeholder="ชื่อของคุณ"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              นามสกุล
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              placeholder="นามสกุลของคุณ"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              อีเมล
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              placeholder="your@email.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              รหัสผ่าน
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              placeholder="••••••••"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              อย่างน้อย 6 ตัวอักษร
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              ยืนยันรหัสผ่าน
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              placeholder="••••••••"
            />
          </div>

          {/* Terms */}
          <label className="flex items-start">
            <input
              type="checkbox"
              required
              className="w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-500 mt-1"
            />
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              ฉันยอมรับ{' '}
              <a href="#" className="text-green-600 dark:text-green-400 hover:underline">
                เงื่อนไขการใช้บริการ
              </a>{' '}
              และ{' '}
              <a href="#" className="text-green-600 dark:text-green-400 hover:underline">
                นโยบายความเป็นส่วนตัว
              </a>
            </span>
          </label>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white font-medium py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'กำลังสมัครสมาชิก...' : 'สมัครสมาชิก'}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
          <span className="px-3 text-gray-500 dark:text-gray-400 text-sm">หรือ</span>
          <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
        </div>

        {/* Social Register */}
        <div className="grid grid-cols-2 gap-4">
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
            Google
          </button>
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
            Facebook
          </button>
        </div>

        {/* Sign In Link */}
        <p className="text-center text-gray-600 dark:text-gray-400 text-sm mt-6">
          มีบัญชีแล้ว?{' '}
          <Link to="/login" className="text-green-600 dark:text-green-400 font-medium hover:underline">
            เข้าสู่ระบบ
          </Link>
        </p>
      </div>

      {/* Response Modal */}
      <ResponseModal
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onClose={() => setModal({ ...modal, isOpen: false })}
      />
    </div>
  );
};
