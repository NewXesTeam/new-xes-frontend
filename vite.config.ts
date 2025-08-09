import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [reactRouter(), tsconfigPaths(), tailwindcss()],
    optimizeDeps: {
        esbuildOptions: {
            tsconfig: 'tsconfig.json',
        },
    },
    server: {
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
