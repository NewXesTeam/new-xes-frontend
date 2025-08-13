import { defineStore } from 'pinia';
import type { UserInfo } from '@/types/user.ts';

interface AppState {
    loaded: boolean;
    isLoggedIn: boolean;
    userInfo: UserInfo | null;
    theme: 'light' | 'dark' | 'system';
}

export const useAppStore = defineStore('app', {
    state(): AppState {
        return {
            loaded: false,
            isLoggedIn: false,
            userInfo: null,
            theme: 'system',
        };
    },
    persist: {
        pick: ['isLoggedIn', 'theme'],
    },
});
