import { createRouter, createWebHistory } from 'vue-router';
import SpaceLayout from '@/layouts/SpaceLayout.vue';

import DemoPage from '@/pages/DemoPage.vue';
import HomePage from '@/pages/HomePage.vue';
import DiscoverPage from '@/pages/DiscoverPage.vue';
import SearchPage from '@/pages/SearchPage.vue';
import LoginPage from '@/pages/LoginPage.vue';

import SpaceHomePage from '@/pages/space/SpaceHomePage.vue';
import SpaceCoverPage from '@/pages/space/SpaceCoverPage.vue';
import SpaceProjectsPage from '@/pages/space/SpaceProjectsPage.vue';
import SpaceFavoritesPage from '@/pages/space/SpaceFavoritesPage.vue';
import SpaceSocialPage from '@/pages/space/SpaceSocialPage.vue';

import UserInfoPage from '@/pages/UserInfoPage.vue';
import AboutPage from '@/pages/AboutPage.vue';
import EulaPage from '@/pages/EulaPage.vue';

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
        {
            path: '/login',
            name: 'login',
            component: LoginPage,
            meta: {
                useLayout: false,
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

        // {
        //     path: '/user',
        //     name: 'user',
        //     component: UserPage,
        //     meta: {
        //         useLayout: true,
        //     },
        // },

        {
            path: '/space/:userId',
            redirect: to => {
                return {
                    name: 'space.home',
                    params: to.params,
                };
            },
        },
        {
            path: '/space/:userId/home',
            name: 'space.home',
            component: SpaceHomePage,
            meta: {
                useLayout: true,
                innerLayout: SpaceLayout,
                space: 'home',
            },
        },
        {
            path: '/space/:userId/cover',
            name: 'space.cover',
            component: SpaceCoverPage,
            meta: {
                useLayout: true,
                innerLayout: SpaceLayout,
                space: 'cover',
            },
        },
        {
            path: '/space/:userId/projects',
            name: 'space.projects',
            component: SpaceProjectsPage,
            meta: {
                useLayout: true,
                innerLayout: SpaceLayout,
                space: 'projects',
            },
        },
        {
            path: '/space/:userId/favorites',
            name: 'space.favorites',
            component: SpaceFavoritesPage,
            meta: {
                useLayout: true,
                innerLayout: SpaceLayout,
                space: 'favorites',
            },
        },
        {
            path: '/space/:userId/social',
            name: 'space.social',
            component: SpaceSocialPage,
            meta: {
                useLayout: true,
                innerLayout: SpaceLayout,
                space: 'social',
            },
        },

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
        {
            path: '/eula',
            name: 'eula',
            component: EulaPage,
            meta: {
                useLayout: false,
            },
        },

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
