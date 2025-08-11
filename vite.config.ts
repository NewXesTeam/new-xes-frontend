import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vueDevTools from 'vite-plugin-vue-devtools';
import TailwindCSS from '@tailwindcss/vite';
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue({
            template: { transformAssetUrls },
        }),
        vueJsx(),
        vueDevTools(),
        TailwindCSS(),
        Vuetify(),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    server: {
        port: 3000,
        proxy: {
            '/api': {
                target: 'https://code.xueersi.com',
                changeOrigin: true,
                cookieDomainRewrite: '',
                rewrite: path => path.replace(/^\/api/, '/api'),
            },
            '/passport/captcha': {
                target: 'https://passport.100tal.com',
                changeOrigin: true,
                cookieDomainRewrite: '',
                headers: {
                    Referer: 'https://login.xueersi.com/',
                },
                rewrite: path => path.replace(/^\/passport\/captcha/, '/v1/web/captcha/get'),
            },
            '/passport/login': {
                target: 'https://passport.100tal.com',
                changeOrigin: true,
                cookieDomainRewrite: '',
                headers: {
                    Referer: 'https://login.xueersi.com/',
                },
                rewrite: path => path.replace(/^\/passport\/login/, '/v1/web/login/pwd'),
            },
            '/passport/get_token': {
                target: 'https://login.xueersi.com',
                changeOrigin: true,
                cookieDomainRewrite: '',
                headers: {
                    Referer: 'https://login.xueersi.com/',
                },
                rewrite: path => path.replace(/^\/passport\/get_token/, '/V1/Web/getToken'),
            },
            '/passport/logout': {
                target: 'https://login.xueersi.com',
                changeOrigin: true,
                cookieDomainRewrite: '',
                headers: {
                    Referer: 'https://login.xueersi.com/',
                },
                rewrite: path => path.replace(/^\/passport\/logout/, '/newLogin/logout'),
            },
        },
    },
});
