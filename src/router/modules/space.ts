import type { RouteRecordRaw } from 'vue-router';

import SpaceLayout from '@/layouts/SpaceLayout.vue';

import SpaceHomePage from '@/pages/space/SpaceHomePage.vue';
import SpaceCoverPage from '@/pages/space/SpaceCoverPage.vue';
import SpaceProjectsPage from '@/pages/space/SpaceProjectsPage.vue';
import SpaceFavoritesPage from '@/pages/space/SpaceFavoritesPage.vue';
import SpaceSocialPage from '@/pages/space/SpaceSocialPage.vue';

export default [
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
] satisfies RouteRecordRaw[];
