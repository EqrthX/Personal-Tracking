import { useState, useEffect } from 'react';
import { getFinanceById, getMonthSummy } from '../utils/api';

export interface FinanceStats {
    incomeAmount: number;
    expenseAmount: number;
    netBalance: number;
    financeData: any[];
    rawFinanceData: any[];
    monthlyTrendData: any[];
    loading: boolean;
    error: string | null;
    transformDataForChart: (rawData: any[]) => any[];
}

export const useFinanceStats = (): FinanceStats => {
    const [incomeAmount, setIncomeAmount] = useState(0);
    const [expenseAmount, setExpenseAmount] = useState(0);
    const [financeData, setFinanceData] = useState([]);
    const [rawFinanceData, setRawFinanceData] = useState([]);
    const [monthlyTrendData, setMonthlyTrendData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFinanceData = async () => {
            try {
                setLoading(true);
                const [response, monthlyRes] = await Promise.all([
                    getFinanceById(),
                    getMonthSummy()
                ])
                if (response.success) {
                    setFinanceData(response.data.data);

                    setRawFinanceData(response.data.data)

                    let income = 0;
                    let expense = 0;

                    if (response.data?.data && Array.isArray(response.data.data)) {
                        response.data.data.forEach((item: any) => {
                            if (item.type === 0) {
                                income += item.amount || 0;
                            } else {
                                expense += item.amount || 0;
                            }
                        });
                    }

                    setIncomeAmount(income);
                    setExpenseAmount(expense);
                    setError(null);

                } else {
                    setError(response.error || 'Failed to fetch finance data');
                }

                if (monthlyRes.success) {
                    setMonthlyTrendData(monthlyRes.data.data);
                    console.log(monthlyRes.data);

                } else {
                    setError(monthlyRes.error || 'Failed to fetch monthly data')
                }
            } catch (err) {
                console.error('Error fetching finance data:', err);
                setError(err instanceof Error ? err.message : 'Unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchFinanceData();
    }, []);

    const netBalance = incomeAmount - expenseAmount;

    const transformDataForChart = (rawData: any[]) => { // ใส่ type ให้ rawData ลด Warning ใน TS
        if (!rawData || !Array.isArray(rawData)) return [];

        const grouped = rawData.reduce((acc: any, item: any) => {
            // ดึงวันที่ออกมาเป็น Key (เช่น "21/04")
            const dateStr = new Date(item.date).toLocaleDateString('th-TH', {
                day: '2-digit', month: '2-digit'
            });

            // ถ้ายังไม่มีวันที่นี้ในก้อนสะสม ให้สร้างรอไว้
            if (!acc[dateStr]) {
                acc[dateStr] = {
                    date: dateStr,
                    income: 0,
                    expense: 0,
                    // แอบเก็บค่าเวลาจริงๆ (เป็นตัวเลข) ไว้ใช้สำหรับเรียงลำดับ
                    timestamp: new Date(item.date).getTime()
                };
            }

            // ยัดยอดเงินลงไปตามประเภท (0 = รายรับ, 1 = รายจ่าย)
            if (item.type === 0) {
                acc[dateStr].income += item.amount;
            } else {
                acc[dateStr].expense += item.amount;
            }

            return acc;
        }, {});

        return Object.values(grouped).sort((a: any, b: any) => a.timestamp - b.timestamp);
    };

    return {
        incomeAmount,
        expenseAmount,
        netBalance,
        financeData,
        rawFinanceData,
        monthlyTrendData,
        loading,
        error,
        transformDataForChart
    };
};
