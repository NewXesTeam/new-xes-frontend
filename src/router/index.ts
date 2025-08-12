import { createRouter, createWebHistory } from 'vue-router';

import DemoPage from '@/pages/DemoPage.vue';
import HomePage from '@/pages/HomePage.vue';

import UserInfoPage from '@/pages/UserInfoPage.vue';
import AboutPage from '@/pages/AboutPage.vue';

import NotFoundPage from '@/pages/errors/NotFoundPage.vue';

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
        // {
        //     path: '/login',
        //     name: 'login',
        //     component: LoginPage,
        //     meta: {
        //         useLayout: false,
        //     },
        // },

        // {
        //     path: '/discover',
        //     name: 'discover',
        //     component: DiscoverPage,
        //     meta: {
        //         useLayout: true,
        //     },
        // },
        // {
        //     path: '/search',
        //     name: 'search',
        //     component: SearchPage,
        //     meta: {
        //         useLayout: true,
        //     },
        // },

        // {
        //     path: '/user',
        //     name: 'user',
        //     component: UserPage,
        //     meta: {
        //         useLayout: true,
        //     },
        // },

        // space

        // message

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
        // {
        //     path: '/eula',
        //     name: 'eula',
        //     component: EulaPage,
        //     meta: {
        //         useLayout: false,
        //     },
        // },

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
    ],
});

export default router;
