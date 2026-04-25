import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getJWTToken } from '../utils/auth';
import { useEffect, useState } from 'react';
import { getAnalytics } from '../utils/api';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useFinanceStats } from '../hooks/useFinanceStats';

export const AnalyticsPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const token = getJWTToken();
  const isCookieAuth = token === 'COOKIE_AUTH';
  const {financeData} = useFinanceStats();

  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0]; 
  }); 
  const [endDate, setEndDate] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0]; 
  });

  const [records, setRecords] = useState([]);
  const [allReport, setAllReport] = useState(0);
  const [averageReport, setAverageReport] = useState(0);
  const [highestExpense, setHighestExpense] = useState(0);
  const [highestIncome, setHighestIncome] = useState(0);

  useEffect(() => {
    if (loading) {
      return;
    }
    
    if (!user && !isCookieAuth) {
      navigate('/login', { replace: true });
    }
  }, [user, token, navigate, loading, isCookieAuth]);

  useEffect(() => {
    if (!loading && (user || isCookieAuth)) {
      fetchData(startDate, endDate);
    }
  }, [loading, user, isCookieAuth]);

  const fetchData = async (start: string, end: string) => {
    try {
      const response = await getAnalytics(start, end);
      if(response.success) {
        setAllReport(response.data.countReport ?? 0);
        setAverageReport(response.data.averageReport ?? 0);
        setHighestExpense(response.data.maxExpense ?? 0);
        setHighestIncome(response.data.maxIncome ?? 0);
        setRecords(response.data.records ?? []);        
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await getAnalytics(startDate, endDate);
  
      if(response.success) {
        console.log('Analytics data:', response.data);
        setAllReport(response.data.countReport ?? 0);
        setAverageReport(response.data.averageReport ?? 0);
        setHighestExpense(response.data.maxExpense ?? 0);
        setHighestIncome(response.data.maxIncome ?? 0);
        setRecords(response.data.records ?? []);
        
      } else {
        console.error('Failed to fetch analytics:', response.error);
      }
      
    } catch (error) {
      console.error('Unexpected error occurred:', error);

    }
  };

  const prepareDateForInput = () => {
    const totalIncome = records.filter(record => record.type === 'Income').reduce((sum, record) => sum + record.amount, 0);
    const totalExpense = records.filter(record => record.type === 'Expense').reduce((sum, record) => sum + record.amount, 0);
    return [
      {name: 'รายรับ', value: totalIncome, color: '#4ade80'},
      {name: 'รายจ่าย', value: totalExpense, color: '#f87171'},
    ]
  }
  
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
        <div className="bg-linear-to-br from-black to-gray-500 dark:from-gray-800 dark:to-gray-850 rounded-xl shadow-lg p-8 mb-8 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              🗓️ ช่วงเวลา
            </h3>
            <div className="flex-grow h-0.5 bg-gradient-to-r from-purple-300 to-transparent dark:from-purple-700"></div>
          </div>
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-6 items-end">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                จากวันที่
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 hover:border-purple-300 dark:hover:border-purple-600 shadow-sm"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                ถึงวันที่
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 hover:border-purple-300 dark:hover:border-purple-600 shadow-sm"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 dark:from-purple-700 dark:to-purple-600 dark:hover:from-purple-600 dark:hover:to-purple-500 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg shadow-md flex items-center justify-center gap-2 whitespace-nowrap"
            >
              🔍 ค้นหา
            </button>
          </form>
        </div>

        {/* Analytics Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Transactions */}
          <div className="bg-linear-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-900/30 rounded-xl shadow-lg p-6 border-2 border-indigo-200 dark:border-indigo-700 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">ธุรกรรมทั้งหมด</h3>
              <div className="text-4xl">📊</div>
            </div>
            <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">{allReport}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 font-medium">รายการ</p>
          </div>

          {/* Average Transaction */}
          <div className="bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-900/20 dark:to-violet-900/30 rounded-xl shadow-lg p-6 border-2 border-violet-200 dark:border-violet-700 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">ค่าเฉลี่ยต่อรายการ</h3>
              <div className="text-4xl">📍</div>
            </div>
            <p className="text-4xl font-bold text-violet-600 dark:text-violet-400">{averageReport.toFixed(2)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 font-medium">บาท</p>
          </div>

          {/* Highest Expense */}
          <div className="bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-900/20 dark:to-rose-900/30 rounded-xl shadow-lg p-6 border-2 border-rose-200 dark:border-rose-700 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">ค่าใช้จ่ายสูงสุด</h3>
              <div className="text-4xl">⚠️</div>
            </div>
            <p className="text-4xl font-bold text-rose-600 dark:text-rose-400">{highestExpense.toFixed(2)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 font-medium">บาท</p>
          </div>

          {/* Highest Income */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/30 rounded-xl shadow-lg p-6 border-2 border-emerald-200 dark:border-emerald-700 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">รายรับสูงสุด</h3>
              <div className="text-4xl">🎯</div>
            </div>
            <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">{highestIncome.toFixed(2)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 font-medium">บาท</p>
          </div>
        </div>

        {/* Advanced Analytics */}
        <div className="mb-8"> 
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border-2 border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                🏷️ การแบ่งประเภท
              </h3>
            </div>
            {records.length > 0 ? (
              <div className="h-100"> 
                {(() => {
                  const pieData = prepareDateForInput(records);
                  return (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie 
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={80} 
                          outerRadius={140}
                          paddingAngle={5}
                          dataKey="value"
                          nameKey="name"
                          label
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => [`${value.toLocaleString()} บาท`, 'ยอดรวม']} />
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>
                  );
                })()}
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl border-3 border-dashed border-gray-300 dark:border-gray-600">
                <div className="text-center">
                  <p className="text-gray-600 dark:text-gray-300 text-base font-medium">
                    📊 ยังไม่มีข้อมูลกราฟ
                  </p>
                </div>
              </div>
            )}
          </div>
          {/* ลบ Comparison Chart ทิ้งไปทั้งหมดเลย */}
        </div>

        {/* Detailed Report */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border-2 border-gray-200 dark:border-gray-700 mb-8 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              📋 รายงานโดยละเอียด
            </h3>
            <div className="flex-grow h-0.5 bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-600"></div>
          </div>
          <div className="overflow-x-auto rounded-lg">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-black to-gray-500 dark:from-gray-700 dark:to-gray-650 border-b-2 border-gray-300 dark:border-gray-600">
                  <th className="text-left py-4 px-4 font-bold text-gray-900 dark:text-white">วันที่</th>
                  <th className="text-left py-4 px-4 font-bold text-gray-900 dark:text-white">รายละเอียด</th>
                  <th className="text-left py-4 px-4 font-bold text-gray-900 dark:text-white">ประเภท</th>
                  <th className="text-right py-4 px-4 font-bold text-gray-900 dark:text-white">จำนวนเงิน</th>
                  <th className="text-center py-4 px-4 font-bold text-gray-900 dark:text-white">รูป</th>
                </tr>
              </thead>
              <tbody>
                {financeData.map((record) => (
                  <tr key={record.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="py-3 px-4 text-gray-900 dark:text-white">{new Date(record.date).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-gray-900 dark:text-white">{record.description}</td>
                    <td className={`py-3 px-4 font-semibold ${record.type === 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {record.type === 0 ? 'รายรับ' : 'รายจ่าย'}
                    </td>
                    <td className={`py-3 px-4 text-right font-bold ${record.type === 'Income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {record.amount.toLocaleString()} บาท
                    </td>
                    <td className="py-3 px-4 text-center">
                      {record.imageUrl ? (
                        <img src={record.imageUrl} alt="Receipt" className="w-12 h-12 object-cover rounded-md mx-auto" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center mx-auto">
                          <span className="text-gray-500 dark:text-gray-400 text-sm">ไม่มีรูป</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
