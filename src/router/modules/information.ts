import type { RouteRecordRaw } from 'vue-router';

import UserInfoPage from '@/pages/UserInfoPage.vue';
import AboutPage from '@/pages/AboutPage.vue';
import EulaPage from '@/pages/EulaPage.vue';

export default [
    {
        path: '/userInfo',
        name: 'user-info',
        component: UserInfoPage,
        meta: {
            useLayout: true,
        },
    },
    {
        path: '/about',
        name: 'about',
        component: AboutPage,
        meta: {
            useLayout: true,
        },
    },
    {
        path: '/eula',
        name: 'eula',
        component: EulaPage,
        meta: {
            useLayout: false,
        },
    },
] satisfies RouteRecordRaw[];
