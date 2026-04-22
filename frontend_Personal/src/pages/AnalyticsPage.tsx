import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getJWTToken } from '../utils/auth';
import { useEffect } from 'react';

export const AnalyticsPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const token = getJWTToken();
  const isCookieAuth = token === 'COOKIE_AUTH';

  useEffect(() => {
    if (loading) {
      return;
    }
    
    if (!user && !isCookieAuth) {
      navigate('/login', { replace: true });
    }
  }, [user, token, navigate, loading, isCookieAuth]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12 px-4">
      {/* Loading Spinner */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 flex flex-col items-center gap-4">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 border-4 border-gray-200 dark:border-gray-600 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-purple-500 rounded-full border-t-transparent border-r-transparent animate-spin"></div>
            </div>
            <p className="text-gray-900 dark:text-white font-medium">กำลังโหลด...</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            📈 Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            วิเคราะห์แนวโน้มการใช้จ่ายและรายรับของคุณ
          </p>
        </div>

        {/* Date Range Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🗓️ ช่วงเวลา
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                จากวันที่
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ถึงวันที่
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex items-end">
              <button
                className="w-full px-6 py-2 bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 text-white font-medium rounded-lg transition"
              >
                ค้นหา
              </button>
            </div>
          </div>
        </div>

        {/* Analytics Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Total Transactions */}
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-900/30 rounded-lg shadow-lg p-6 border border-indigo-200 dark:border-indigo-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">ธุรกรรมทั้งหมด</h3>
              <div className="text-3xl">📊</div>
            </div>
            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">0</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">รายการ</p>
          </div>

          {/* Average Transaction */}
          <div className="bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-900/20 dark:to-violet-900/30 rounded-lg shadow-lg p-6 border border-violet-200 dark:border-violet-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">ค่าเฉลี่ยต่อรายการ</h3>
              <div className="text-3xl">📍</div>
            </div>
            <p className="text-3xl font-bold text-violet-600 dark:text-violet-400">0.00</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">บาท</p>
          </div>

          {/* Highest Expense */}
          <div className="bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-900/20 dark:to-rose-900/30 rounded-lg shadow-lg p-6 border border-rose-200 dark:border-rose-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">ค่าใช้จ่ายสูงสุด</h3>
              <div className="text-3xl">⚠️</div>
            </div>
            <p className="text-3xl font-bold text-rose-600 dark:text-rose-400">0.00</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">บาท</p>
          </div>

          {/* Highest Income */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/30 rounded-lg shadow-lg p-6 border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">รายรับสูงสุด</h3>
              <div className="text-3xl">🎯</div>
            </div>
            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">0.00</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">บาท</p>
          </div>
        </div>

        {/* Advanced Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Category Breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              🏷️ การแบ่งประเภท
            </h3>
            <div className="h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  📊 ยังไม่มีข้อมูลกราฟ
                </p>
                <p className="text-gray-500 dark:text-gray-500 text-xs mt-2">
                  เชื่อมต่อ API เพื่อแสดงข้อมูล
                </p>
              </div>
            </div>
          </div>

          {/* Comparison Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              🔄 เปรียบเทียบรายเดือน
            </h3>
            <div className="h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  📊 ยังไม่มีข้อมูลกราฟ
                </p>
                <p className="text-gray-500 dark:text-gray-500 text-xs mt-2">
                  เชื่อมต่อ API เพื่อแสดงข้อมูล
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Report */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700 mb-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            📋 รายงานโดยละเอียด
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">วันที่</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">รายละเอียด</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">ประเภท</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">จำนวนเงิน</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white">รูป</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400" colSpan={5}>
                    <div className="flex items-center justify-center py-8">
                      <p className="text-gray-500 dark:text-gray-500">ยังไม่มีข้อมูลสำหรับแสดง</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* TODO: Features to implement */}
        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
          <p className="text-sm text-purple-800 dark:text-purple-300">
            💡 <strong>TODO:</strong> เชื่อมต่อ API เพื่อสร้างการวิเคราะห์:
          </p>
          <ul className="mt-2 text-sm text-purple-700 dark:text-purple-400 list-disc list-inside space-y-1">
            <li>รวบรวมข้อมูลตามช่วงวันที่</li>
            <li>คำนวณสถิติ (ค่าเฉลี่ย, สูงสุด, ต่ำสุด)</li>
            <li>สร้างกราฟแบ่งประเภท (Pie/Doughnut Chart)</li>
            <li>สร้างกราฟเปรียบเทียบรายเดือน (Bar Chart)</li>
            <li>ส่วนแบ่งของหมวดหมู่ต่าง ๆ (Category Breakdown)</li>
            <li>ส่งออกรายงาน (Export to PDF/Excel)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
