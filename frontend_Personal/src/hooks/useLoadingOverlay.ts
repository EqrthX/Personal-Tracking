import { useLoading } from '../contexts/LoadingContext';

/**
 * Hook สำหรับจัดการ loading overlay ในระหว่าง async operations
 * 
 * ตัวอย่างการใช้งาน:
 * ```
 * const { withLoading } = useLoadingOverlay();
 * 
 * const handleFetch = async () => {
 *   await withLoading(async () => {
 *     const response = await fetchData();
 *   });
 * };
 * ```
 */
export const useLoadingOverlay = () => {
    const { showLoading, hideLoading } = useLoading();

    const withLoading = async <T,>(
        asyncFn: () => Promise<T>,
        options?: {
            minDuration?: number; // ระยะเวลาต่ำสุดที่ต้องแสดง loading (ms)
        }
    ): Promise<T> => {
        const startTime = Date.now();
        showLoading();

        try {
            const result = await asyncFn();

            // ถ้ากำหนด minDuration ให้รอเวลาก่อนซ่อน
            const minDuration = options?.minDuration;
            if (minDuration !== undefined) {
                const elapsed = Date.now() - startTime;
                if (elapsed < minDuration) {
                    await new Promise((resolve) =>
                        setTimeout(resolve, minDuration - elapsed)
                    );
                }
            }

            return result;
        } finally {
            hideLoading();
        }
    };

    return { withLoading, showLoading, hideLoading };
};
