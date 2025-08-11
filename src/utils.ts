import { computed, onMounted, ref } from 'vue';
import type { BasicResponse, ErrorResponse } from '@/types/common';
import type { Work } from '@/types/work.ts';

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

interface FetchState<T> {
    data: T | null;
    completed: boolean;
    error: boolean;
    errorMessage: string;
    resolve(info: T): void;
    reject(message: string): void;
}

export function useFetchState<T>(initialize: T | null = null) {
    const completedRef = ref(false);
    const dataRef = ref<T | null>(initialize);
    const errorRef = ref(false);
    const errorMessageRef = ref('');

    return computed(
        () =>
            ({
                data: dataRef.value as T | null,
                completed: completedRef.value,
                error: errorRef.value,
                errorMessage: errorMessageRef.value,
                resolve(info: T) {
                    completedRef.value = true;
                    dataRef.value = info;
                },
                reject(message: string) {
                    completedRef.value = true;
                    errorRef.value = true;
                    errorMessageRef.value = message;
                },
            }) as FetchState<T>,
    );
}

export function fetchData<T>(url: string, options?: RequestInit, initialize: T | null = null) {
    const state = useFetchState<T>(initialize);
    onMounted(() => {
        commonFetch<T>(url, options)
            .then(data => {
                state.value.resolve(data.data);
            })
            .catch(error => {
                state.value.reject(error.toString());
            });
    });
    return state;
}

export function getWorkLink(work: Work) {
    let lang = work.project_type;
    if (lang === 'compiler') lang = 'code';

    return `https://code.xueersi.com/home/project/detail?lang=${lang}&pid=${work.id}&version=${work.version}&langType=${work.lang}`;
}
