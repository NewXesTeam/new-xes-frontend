import { computed, onMounted, ref } from 'vue';
import { commonFetch } from './common.ts';

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

export function useFetchData<T>(url: string, options?: RequestInit, initialize: T | null = null) {
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
