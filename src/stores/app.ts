import { defineStore } from 'pinia';
import type { UserInfo } from '@/types/user.ts';

interface AppState {
    isLoggedIn: boolean;
    userInfo: UserInfo | null;
}

export const useAppStore = defineStore('app', {
    state(): AppState {
        return {
            isLoggedIn: false,
            userInfo: null,
        };
    },
});
