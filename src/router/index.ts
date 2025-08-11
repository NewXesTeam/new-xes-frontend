import { createRouter, createWebHistory } from 'vue-router';
import HomePage from "@/pages/HomePage.vue";
import AboutPage from '@/pages/AboutPage.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomePage,
            meta: {
                useLayout: true,
            }
        },
        // {
        //     path: '/discover',
        //     name: 'discover',
        //     component: DiscoverPage,
        // },
        {
            path: '/about',
            name: 'about',
            component: AboutPage,
            meta: {
                useLayout: true,
            }
        },
    ],
});

export default router;
