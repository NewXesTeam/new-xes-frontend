import { type Ref, ref, type UnwrapRef } from 'vue';
import { commonFetch } from '@/utils/common.ts';
import type { BasicResponse } from '@/types/common.ts';

interface BaseFetchState<T> {
    on: {
        completed(listener: () => void): void;
        success(listener: (data: T) => void): void;
        error(listener: (error: string) => void): void;
    };

    listeners: {
        completed: (() => void)[];
        success: ((data: T) => void)[];
        error: ((error: string) => void)[];
    };

    resolve(data: T): void;
    reject(message: string): void;

    reset: {
        (): void;
        data(): void;
        state(): void;
    };
}

interface PendingFetchState<T> extends BaseFetchState<T> {
    data: T | null;
    errorMessage: null;

    completed: false;
    success: false;
    error: false;
}

interface SuccessFetchState<T> extends BaseFetchState<T> {
    data: T;
    errorMessage: null;

    completed: true;
    success: true;
    error: false;
}

interface ErrorFetchState<T> extends BaseFetchState<T> {
    data: T | null;
    errorMessage: string;

    completed: true;
    success: false;
    error: true;
}

type FetchState<T> = PendingFetchState<T> | SuccessFetchState<T> | ErrorFetchState<T>;

function invoke<T extends Array<unknown>>(functions: ((...args: T) => void)[], ...args: T) {
    for (const func of functions) {
        func(...args);
    }
}

export function useFetchState<T>(initialize: T | null = null) {
    const state = ref({
        data: initialize,
        errorMessage: null,

        completed: false,
        success: false,
        error: false,

        on: {
            completed(listener) {
                state.value.listeners.completed.push(listener);
            },
            success(listener) {
                state.value.listeners.success.push(listener);
            },
            error(listener) {
                state.value.listeners.error.push(listener);
            },
        },

        listeners: {
            completed: [] as (() => void)[],
            success: [] as ((data: T) => void)[],
            error: [] as ((error: string) => void)[],
        },

        resolve(data) {
            state.value.data = data as UnwrapRef<T>;
            state.value.errorMessage = null;

            state.value.success = true;
            state.value.completed = true;

            invoke(state.value.listeners.completed);
            invoke(state.value.listeners.success, data);
        },
        reject(message) {
            state.value.data = null;
            state.value.errorMessage = message;

            state.value.error = true;
            state.value.completed = true;

            invoke(state.value.listeners.completed);
            invoke(state.value.listeners.error, message);
        },

        reset: Object.assign(
            () => {
                state.value.reset.data();
                state.value.reset.state();
            },
            {
                data() {
                    state.value.data = null;
                    state.value.errorMessage = null;
                },
                state() {
                    state.value.success = false;
                    state.value.error = false;
                    state.value.completed = false;
                },
            },
        ),
    } as FetchState<T>);

    return state;
}

export function useFetchData<T>(url: string | (() => string), options?: RequestInit, initialize: T | null = null) {
    const state = useFetchState<T>(initialize);
    const load = () => {
        state.value.reset();
        setTimeout(() => {
            commonFetch<BasicResponse<T>>(typeof url === 'string' ? url : url(), options)
                .then(data => {
                    state.value.resolve(data.data);
                })
                .catch(error => {
                    state.value.reject(error.toString());
                });
        }, 50); // byd watch callback 后有几率 ref 没更新
    };
    return [state, load] as [Ref<FetchState<T>>, () => void];
}
