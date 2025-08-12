import { useAppStore } from '@/stores/app.ts';
import { commonFetch } from '@/utils/common.ts';
import type { BasicResponse } from '@/types/common.ts';
import type { UserInfo } from '@/types/user.ts';

export function refreshInfo() {
    const store = useAppStore();
    store.loaded = false;
    store.isLoggedIn = document.cookie.includes('is_login=1;');
    if (store.isLoggedIn) {
        return commonFetch<BasicResponse<UserInfo>>('/api/user/info')
            .then(data => {
                store.userInfo = data.data;
            })
            .catch(error => {
                console.error('fetch user info error: ', error);
            })
            .finally(() => {
                store.loaded = true;
            });
    }
}
