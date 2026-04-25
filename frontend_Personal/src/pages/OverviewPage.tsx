import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getJWTToken } from '../utils/auth';
import { useEffect, useState } from 'react';
import { useFinanceStats } from '../hooks/useFinanceStats';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';

export const OverviewPage = () => {
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const token = getJWTToken();
    const isCookieAuth = token === 'COOKIE_AUTH';
    const { incomeAmount, expenseAmount, rawFinanceData } = useFinanceStats();
    const [currentPage, setCurrentPage] = useState(1); 
    const pageSize = 5;

    useEffect(() => {
        if (authLoading) {
        return;
        }
        
        if (!user && !isCookieAuth) {
        navigate('/login', { replace: true });
        }
    }, [user, token, navigate, authLoading, isCookieAuth]);

    const allTransactions = (Array.isArray(rawFinanceData) ? (rawFinanceData as any[]) : []);    
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedTransactions = allTransactions.slice(startIndex, startIndex + pageSize);

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 py-12 px-4">
        {/* Loading Spinner */}
        {authLoading && (
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

        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                📊 ภาพรวม
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
                ดูข้อมูลการเงินและรายการทั้งหมดของคุณ
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
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{(incomeAmount - expenseAmount).toFixed(2)}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">บาท</p>
            </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                📋 รายการล่าสุด
                </h3>
                <button
                onClick={() => navigate('/add-finance')}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white font-medium rounded-lg transition"
                >
                ➕ เพิ่มข้อมูล
                </button>
            </div>
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
                        {paginatedTransactions.length > 0 ? (
                            paginatedTransactions.map((item: any, index: number) => (
                                <tr 
                                    key={item.id || item.Id || index} 
                                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                                >
                                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                                        {new Date(item.date.endsWith('Z') ? item.date : `${item.date}Z`).toLocaleString('th-TH', { 
                                            timeZone: 'Asia/Bangkok',
                                            year: 'numeric', 
                                            month: 'short', 
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })} น.
                                    </td>

                                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                                        {item.description || '-'}
                                    </td>

                                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                                        {item.type === 0 ? 'รายรับ' : 'รายจ่าย'}
                                    </td>

                                        {/* จำนวนเงิน (เปลี่ยนสีตามประเภท) */}
                                    <td className={`py-3 px-4 text-right font-bold ${
                                        item.type === 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                    }`}>
                                        {item.type === 0 ? '+' : '-'}{item.amount.toLocaleString()} ฿
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="py-8 text-center text-gray-500 dark:text-gray-500">
                                    ยังไม่มีรายการสำหรับแสดง
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            {allTransactions.length > 0 && (
            <div className="mt-6 flex justify-end">
              <Pagination 
                current={currentPage} 
                total={allTransactions.length} 
                pageSize={pageSize} 
                onChange={(page) => setCurrentPage(page)} 
                // 💡 เพิ่ม itemRender ตรงนี้
                itemRender={(current, type, originalElement) => {
                    // 1. ปุ่มตัวเลขหน้า
                    if (type === 'page') {
                    const isActive = current === currentPage;
                    return (
                        <button 
                        className={`w-8 h-8 flex items-center justify-center rounded-md font-medium transition-colors ${
                            isActive 
                            ? 'bg-green-600 text-white border border-green-600' 
                            : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
                        }`}
                        >
                        {current}
                        </button>
                    );
                    }
                    
                    // 2. ปุ่มก่อนหน้า (Previous)
                    if (type === 'prev') {
                    return (
                        <button className="px-3 h-8 flex items-center justify-center rounded-md border border-white bg-white text-gray-600 hover:bg-gray-100dark:border-gray-600 transition-colors">
                            ก่อนหน้า
                        </button>
                    );
                    }

                    // 3. ปุ่มถัดไป (Next)
                    if (type === 'next') {
                    return (
                        <button className="px-3 h-8 flex items-center justify-center rounded-md border border-white bg-white text-gray-600 hover:bg-gray-100 transition-colors">
                            ถัดไป
                        </button>
                    );
                    }

                    return originalElement;
                }} 
                />
            </div>
          )}
        </div>
            
        
        </div>
    </div>
    );
};
