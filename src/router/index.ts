import { createRouter, createWebHistory } from 'vue-router';

import DemoPage from '@/pages/DemoPage.vue';
import HomePage from '@/pages/HomePage.vue';
import DiscoverPage from '@/pages/DiscoverPage.vue';
import SearchPage from '@/pages/SearchPage.vue';
import LoginPage from '@/pages/LoginPage.vue';

import information from '@/router/modules/information.ts';
import errors from '@/router/modules/errors.ts';
import space from '@/router/modules/space.ts';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/demo',
            name: 'demo',
            component: DemoPage,
            meta: {
                useLayout: true,
            },
        },

        {
            path: '/',
            name: 'home',
            component: HomePage,
            meta: {
                useLayout: true,
            },
        },
        {
            path: '/discover',
            name: 'discover',
            component: DiscoverPage,
            meta: {
                useLayout: true,
            },
        },
        {
            path: '/search',
            name: 'search',
            component: SearchPage,
            meta: {
                useLayout: true,
            },
        },

        {
            path: '/login',
            name: 'login',
            component: LoginPage,
            meta: {
                useLayout: false,
            },
        },
        // {
        //     path: '/user',
        //     name: 'user',
        //     component: UserPage,
        //     meta: {
        //         useLayout: true,
        //     },
        // },


        ...space,
        // message
        ...information,
        ...errors,
    ],
});

export default router;
