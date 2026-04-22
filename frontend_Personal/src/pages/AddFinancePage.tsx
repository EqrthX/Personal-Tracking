import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getJWTToken } from '../utils/auth';
import { useState, useEffect, useRef } from 'react';
import { ResponseModal } from '../components/ResponseModal';
import { addFinance, OcrSlip } from '../utils/api';
import { formatThaiDate } from '../utils/formatThaiDate';
import { convertFileToBase64 } from '../utils/convertImgToBase64';

export const AddFinancePage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const token = getJWTToken();
  const isCookieAuth = token === 'COOKIE_AUTH';
  const [info, setInfo] = useState({
    amount: 0.0,
    description: '',
    type: 'expense' as 'income' | 'expense',
    images: null as File | null,
    date: new Date().toISOString().slice(0, 16),
  });
  const [fileName, setFileName] = useState<string>('');
  const [isOcrLoading, setIsOcrLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info' as 'success' | 'error' | 'info',
  });

  useEffect(() => {
    if (loading) {
      return;
    }
    
    if (!user && !isCookieAuth) {
      navigate('/login', { replace: true });
    }
  }, [user, token, navigate, loading, isCookieAuth]);

  const handleFileUpload = async (file: File | null) => {
    setInfo({ ...info, images: file });
    setFileName(file?.name || '');
  };

  const handleOcrSubmit = async () => {
    if (!info.images) {
      setModal({
        isOpen: true,
        title: 'ข้อผิดพลาด',
        message: 'กรุณาเลือกรูปภาพก่อน',
        type: 'error',
      });
      return;
    }

    setIsOcrLoading(true);
    try {
      const resOcr = await OcrSlip(info.images as File);
      console.log('OCR Response:', resOcr);
      
      if (resOcr.success && resOcr.data) {
        const amount = parseFloat(resOcr.data.extractedAmount || '0');
        if (amount > 0) {
          setInfo(prev => ({ ...prev, amount }));
          setModal({
            isOpen: true,
            title: 'สำเร็จ',
            message: `ระบบอ่านจำนวนเงินจากรูปภาพได้: ${amount} บาท`,
            type: 'success',
          });
          info.images = null;
          setFileName('');
        } else {
          setModal({
            isOpen: true,
            title: 'หมายเหตุ',
            message: 'ไม่สามารถอ่านจำนวนเงินจากรูปภาพ กรุณากรอกจำนวนเงินด้วยตัวเอง',
            type: 'info',
          });
        }
      } else {
        setModal({
          isOpen: true,
          title: 'หมายเหตุ',
          message: 'ไม่สามารถอ่านจำนวนเงินจากรูปภาพ กรุณากรอกจำนวนเงินด้วยตัวเอง',
          type: 'info',
        });
      }
    } catch (error) {
      console.error('OCR Error:', error);
      setModal({
        isOpen: true,
        title: 'หมายเหตุ',
        message: 'ไม่สามารถอ่านจำนวนเงินจากรูปภาพ กรุณากรอกจำนวนเงินด้วยตัวเอง',
        type: 'info',
      });
    } finally {
      setIsOcrLoading(false);
    }
  };

  const handleSubmitInfoAmount = async (e: React.FormEvent) => {
    e.preventDefault();    
    if(info.amount <= 0.0 || isNaN(info.amount) || info.amount === null) {
      setModal({
        isOpen: true,
        title: 'ข้อผิดพลาด',
        message: 'จำนวนเงินต้องมากกว่า 0',
        type: 'error',
      });
      return;
    }

    if(info.description.trim() === '') {
      setModal({
        isOpen: true,
        title: 'ข้อผิดพลาด',
        message: 'กรุณากรอกรายละเอียดการใช้จ่าย',
        type: 'error',
      });
      return;
    }

    try {
      let base64Image = '';

      if(info.images){
        base64Image = await convertFileToBase64(info.images as File); 
      }
      
      const response = await addFinance(info.amount, user?.name as string, info.description, info.type, info.date, base64Image || '');
      
      if(!response.success) {
        setModal({
          isOpen: true,
          title: 'ข้อผิดพลาด',
          message: response.message || 'เกิดข้อผิดพลาดในการส่งข้อมูล',
          type: 'error',
        });
      } else {
        setModal({
          isOpen: true,
          title: 'สำเร็จ',
          message: 'บันทึกข้อมูลเรียบร้อยแล้ว',
          type: 'success',
        });
        setInfo({
          amount: 0.0,
          description: '',
          type: 'expense',
          images: null,
          date: new Date().toISOString().slice(0, 16),
        });
        setFileName('');
        setTimeout(() => {
          navigate('/overview');
        }, 2000);
      }
    } catch (error) {
      setModal({
        isOpen: true,
        title: 'ข้อผิดพลาด',
        message: 'เกิดข้อผิดพลาดในการส่งข้อมูล',
        type: 'error',
      });
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12 px-4">
      {/* Loading Spinner */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 flex flex-col items-center gap-4">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 border-4 border-gray-200 dark:border-gray-600 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-green-500 rounded-full border-t-transparent border-r-transparent animate-spin"></div>
            </div>
            <p className="text-gray-900 dark:text-white font-medium">กำลังโหลด...</p>
          </div>
        </div>
      )}
      
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/overview')}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium mb-4"
          >
            ← กลับไปยังภาพรวม
          </button>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            ➕ เพิ่มข้อมูลใหม่
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            กรอกข้อมูลการใช้จ่ายหรือรายรับของคุณ
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <form className="space-y-6" onSubmit={handleSubmitInfoAmount}>
            {/* Amount Input */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                จำนวนเงิน *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                placeholder="เช่น 99.99"
                value={info.amount === 0 ? '' : info.amount}
                onChange={(e) => {
                  const value = e.target.value;
                  setInfo({ ...info, amount: value === '' ? 0 : parseFloat(value) });
                }}
                required
              />
            </div>

            {/* Description Input */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                รายละเอียด *
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                placeholder="เช่น อาหารเย็น, โอนเงิน"
                value={info.description}
                onChange={(e) => setInfo({ ...info, description: e.target.value })}
                required
              />
            </div>

            {/* Type Select */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                ประเภท *
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                value={info.type}
                onChange={(e) => setInfo({ ...info, type: e.target.value as 'income' | 'expense' })}
              >
                <option value="expense">💸 รายจ่าย</option>
                <option value="income">💰 รายรับ</option>
              </select>
            </div>

            {/* Date & Time Input */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                วันที่และเวลา *
              </label>
              <input
                type="datetime-local"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                value={info.date}
                onChange={(e) => setInfo({ ...info, date: e.target.value })}
                required
              />
              {/* Thai Date Preview */}
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                📅 {formatThaiDate(info.date)}
              </p>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                🖼️ อัปโหลดไฟล์เอกสารหรือรูปภาพ (ไม่จำเป็น)
              </label>
              <div className="flex gap-2 items-start">
                <div className="flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      handleFileUpload(file);
                    }}
                  />
                  <div className="mt-2 h-5">
                    {fileName && (
                      <p className="text-sm text-green-600 dark:text-green-400">
                        ✓ ไฟล์ที่เลือก: {fileName}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleOcrSubmit}
                  disabled={!info.images || isOcrLoading}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium rounded-lg transition whitespace-nowrap h-fit"
                >
                  {isOcrLoading ? '⏳ กำลังอ่าน...' : '📖 อ่านจำนวนเงิน'}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white font-medium rounded-lg transition"
              >
                ✅ ยืนยันและบันทึก
              </button>
              <button
                type="button"
                onClick={() => navigate('/overview')}
                className="flex-1 px-6 py-3 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-900 dark:text-white font-medium rounded-lg transition"
              >
                ❌ ยกเลิก
              </button>
            </div>
          </form>

          <ResponseModal
            isOpen={modal.isOpen}
            title={modal.title}
            message={modal.message}
            type={modal.type}
            onClose={() => setModal({...modal, isOpen: false})}
          />
        </div>

        {/* Info Box */}
        <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm text-green-800 dark:text-green-300">
            ℹ️ <strong>หมายเหตุ:</strong> ฟิลด์ที่มี * จำเป็นต้องกรอก สำหรับการอัปโหลดรูปภาพ เป็นตัวเลือก ถ้าอัปโหลดรูป ระบบจะพยายามอ่านจำนวนเงินโดยอัตโนมัติ ไม่ใส่ก็ได้สำหรับการจ่ายเงินสด
          </p>
        </div>
      </div>
    </div>
  );
};
