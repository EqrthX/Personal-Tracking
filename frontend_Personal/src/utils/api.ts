

import { getAuthHeader } from './auth';

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface LoginResponse {
    jwt?: string;
    user?: {
        id: string;
        email: string;
        name?: string;
    };
    message?: string;
}


export async function apiCall<T = any>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    try {

        const url = endpoint;

        const authHeaders = getAuthHeader();

        // 1. สร้าง Header พื้นฐาน
        const headers: Record<string, string> = {
            ...authHeaders,
            ...(options.headers as Record<string, string>),
        };

        // 2. พระเอกอยู่ตรงนี้: ถ้าไม่ใช่ FormData ถึงจะใส่ application/json
        // ถ้าเป็น FormData (อัปโหลดไฟล์) Browser จะใส่ Content-Type พร้อม Boundary ให้เอง
        if (options.body && !(options.body instanceof FormData)) {
            if (!headers['Content-Type']) {
                headers['Content-Type'] = 'application/json';
            }
        }

        const response = await fetch(url, {
            ...options,
            headers, // ใช้ Header ที่ผ่านการเช็คแล้ว
            credentials: 'include',
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: data.message || `Error: ${response.statusText}`,
            };
        }

        return {
            success: true,
            data,
            message: data.message || 'Success',
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return {
            success: false,
            error: errorMessage,
        };
    }
}


export async function login(
    email: string,
    password: string
): Promise<ApiResponse<LoginResponse>> {
    return apiCall<LoginResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
}


export async function register(
    name: string,
    email: string,
    password: string
): Promise<ApiResponse<{ message: string }>> {
    return apiCall('/api/Auth/register', {
        method: 'POST',
        body: JSON.stringify({
            name,
            email,
            password,
        }),
    });
}

export async function addFinance(
    amount: number,
    name: string,
    description: string,
    typeFinance: string,
    date: string,
    image: string
): Promise<any> {
    const typeEnum = typeFinance.toLowerCase() === 'income' ? 0 : 1;
    const localDate = new Date(date);
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, '0');
    const day = String(localDate.getDate()).padStart(2, '0');
    const hours = String(localDate.getHours()).padStart(2, '0');
    const minutes = String(localDate.getMinutes()).padStart(2, '0');
    const seconds = String(localDate.getSeconds()).padStart(2, '0');
    const exactLocalTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    return apiCall('/api/PersonalTrack/addfinance', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({
            amount: amount,
            name: name,
            description: description,
            type: typeEnum,
            date: exactLocalTime,
            image: image
        })
    })
}

export async function getFinanceById() {
    return apiCall('/api/PersonalTrack/getfinance', {
        method: 'GET',
        credentials: 'include'
    })
}

export async function OcrSlip(file: File) {
    const formData = new FormData();

    formData.append('file', file)
    return apiCall('/api/TestOcr/extract-from-file', {
        method: 'POST',
        body: formData,
        credentials: 'include'
    })
}

export async function getMonthSummy() {
    return apiCall('/api/PersonalTrack/monthlysummary', {
        method: 'GET',
        credentials: 'include'
    })
}

export async function getAnalytics(startDate: string, endDate: string) {
    return apiCall('/api/Analytics/summary', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({
            StartDate: startDate,
            EndDate: endDate
        })
    })
}