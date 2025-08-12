import type { BasicResponse, ErrorResponse } from '@/types/common';

export async function commonFetch<T>(url: string, options?: RequestInit) {
    const response = await fetch(url, options);
    if (response.ok) {
        const data: BasicResponse<T> = await response.json();
        return data;
    } else {
        const errorData: ErrorResponse = await response.json();
        console.error('commonFetch error', response.status, errorData);
        // 在这里理论上搞 Today Eat Sentry 也不是不行，只是没必要
        throw new Error(errorData.message);
    }
}
