import type { RouteRecordRaw } from 'vue-router';

import NotFoundPage from '@/pages/errors/NotFoundPage.vue';

export default [
    {
        path: '/404',
        name: 'errors.not-found',
        component: NotFoundPage,
        meta: {
            useLayout: true,
        },
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/404',
    },
] satisfies RouteRecordRaw[];
