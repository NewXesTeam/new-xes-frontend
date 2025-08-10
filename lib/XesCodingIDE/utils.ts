import { type Dispatch, type SetStateAction, useDebugValue, useState, useMemo } from 'react';

export interface RefState<T> {
    current: T;
    set: Dispatch<SetStateAction<T>>;
}

export function useRefState<T>(initialize: T | (() => T)): RefState<T> {
    const [state, setState] = useState<T>(initialize);
    useDebugValue(state);
    return useMemo(
        () => ({
            current: state,
            set: setState,
        }),
        [state, setState],
    );
}

export function b64_to_utf8(text: string): string {
    return new TextDecoder().decode(Uint8Array.from(atob(text), c => c.charCodeAt(0)));
}

export async function getTemplate(lang: 'python' | 'webpy' | 'offlinepy' | 'cpp') {
    const response = await fetch('https://v1.hitokoto.cn/?c=d&c=k');
    const responseData = await response.json();
    const templates = {
        python: `print("${responseData.hitokoto} —— 「${responseData.from}」")`,
        webpy: `print("${responseData.hitokoto} —— 「${responseData.from}」")`,
        offlinepy: `print("${responseData.hitokoto} —— 「${responseData.from}」")`,
        cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "${responseData.hitokoto} —— 「${responseData.from}」" << endl;
    return 0;
}`,
    };
    return templates[lang];
}
