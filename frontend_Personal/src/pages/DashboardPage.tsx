import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getJWTToken } from '../utils/auth';
import { useEffect, useMemo } from 'react';
import { useFinanceStats } from '../hooks/useFinanceStats';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const token = getJWTToken();
  const isCookieAuth = token === 'COOKIE_AUTH';
  const { incomeAmount, expenseAmount, netBalance, financeData, transformDataForChart, monthlyTrendData } = useFinanceStats();
  const chartData = useMemo(() => {
    return transformDataForChart(financeData);
  }, [financeData, transformDataForChart]);

  useEffect(() => {
    if (authLoading) {
      return;
    }
    
    if (!user && !isCookieAuth) {
      navigate('/login', { replace: true });
    }
  }, [user, token, navigate, authLoading, isCookieAuth]);
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12 px-4">
      {/* Loading Spinner */}
      {authLoading && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 flex flex-col items-center gap-4">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 border-4 border-gray-200 dark:border-gray-600 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent border-r-transparent animate-spin"></div>
            </div>
            <p className="text-gray-900 dark:text-white font-medium">กำลังโหลด...</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            📊 Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            ติดตามข้อมูลการเงินของคุณแบบเรียลไทม์
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Income Card */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/30 rounded-lg shadow-lg p-6 border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">รายรับทั้งหมด</h3>
              <div className="text-3xl">💰</div>
            </div>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{incomeAmount.toFixed(2)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">บาท</p>
          </div>

          {/* Total Expense Card */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/30 rounded-lg shadow-lg p-6 border border-red-200 dark:border-red-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">รายจ่ายทั้งหมด</h3>
              <div className="text-3xl">💸</div>
            </div>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">{expenseAmount.toFixed(2)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">บาท</p>
          </div>

          {/* Net Balance Card */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/30 rounded-lg shadow-lg p-6 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">ยอดคงเหลือ</h3>
              <div className="text-3xl">📈</div>
            </div>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{netBalance.toFixed(2)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">บาท</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Income vs Expense Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              📊 รายรับ vs รายจ่าย
            </h3>
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
              {Array.isArray(financeData) && financeData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="income" name="รายรับ" fill="#10b981" />
                    <Bar dataKey="expense" name="รายจ่าย" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
                  ยังไม่มีข้อมูลการเงิน หรือกำลังโหลด...
                </div>
              )}
              
            </div>
          </div>

          {/* Monthly Trends Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              📉 แนวโน้มรายเดือน
            </h3>
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
              {Array.isArray(monthlyTrendData) && monthlyTrendData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="monthName" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="income" name="รายรับ" stroke="#10b981" />
                    <Line type="monotone" dataKey="expense" name="รายจ่าย" stroke="#ef4444" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
                  ยังไม่มีข้อมูลแนวโน้มรายเดือน หรือกำลังโหลด...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            📋 ธุรกรรมล่าสุด
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">วันที่</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">รายละเอียด</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">ประเภท</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">จำนวนเงิน</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400" colSpan={4}>
                    <div className="flex items-center justify-center py-8">
                      <p className="text-gray-500 dark:text-gray-500">ยังไม่มีธุรกรรมสำหรับแสดง</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* TODO: Data to fetch from API */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            💡 <strong>TODO:</strong> เชื่อมต่อ API เพื่อดึงข้อมูล:
          </p>
          <ul className="mt-2 text-sm text-blue-700 dark:text-blue-400 list-disc list-inside space-y-1">
            <li className='text-green-400'>ดึงข้อมูลรายรับ/รายจ่าย (Total Income/Expense)</li>
            <li className='text-green-400'>คำนวณยอดคงเหลือ (Net Balance)</li>
            <li>สร้างกราฟ Income vs Expense</li>
            <li>สร้างกราฟแนวโน้มรายเดือน</li>
            <li>ดึงรายการธุรกรรมล่าสุด</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
