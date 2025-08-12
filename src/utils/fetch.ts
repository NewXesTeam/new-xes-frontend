import { computed, onMounted, ref } from 'vue';
import { commonFetch } from './common.ts';

interface BaseFetchState<T> {
    resolve(info: T): void;
    reject(message: string): void;
}

interface PendingFetchState<T> extends BaseFetchState<T> {
    data: T | null;
    completed: false;
    error: false;
    errorMessage: null;
}

interface SuccessFetchState<T> extends BaseFetchState<T> {
    data: T;
    completed: true;
    error: false;
    errorMessage: null;
}

interface ErrorFetchState<T> extends BaseFetchState<T> {
    data: T | null;
    completed: true;
    error: true;
    errorMessage: string;
}

type FetchState<T> = PendingFetchState<T> | SuccessFetchState<T> | ErrorFetchState<T>;

export function useFetchState<T>(initialize: T | null = null) {
    const completedRef = ref(false);
    const dataRef = ref<T | null>(initialize);
    const errorRef = ref(false);
    const errorMessageRef = ref<string | null>(null);

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
