import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import monkey, { cdn, MonkeyUserScript } from 'vite-plugin-monkey';
import tailwindcss from "@tailwindcss/vite";
import { hostNames } from './src/injections/injection-config.ts';
import { fileURLToPath } from 'node:url';

let userscriptConfig: MonkeyUserScript = {
    name: 'NewXesFrontend',
    version: new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14),
    author: 'NewXesTeam',
    icon: 'https://static0.xesimg.com/talcode/assets/logo.ico',
    namespace: 'npm/vite-plugin-monkey',
    match: hostNames.map(s => `https://${s}/*`),
    noframes: false,
    'run-at': 'document-start',
};

export default defineConfig({
    plugins: [
        vue(),
        monkey({
            entry: 'src/main.ts',
            userscript: userscriptConfig,
            build: {
                fileName: 'xes-chat.user.js',
                externalGlobals: {
                    vue: cdn.jsdelivr('Vue', 'dist/vue.global.prod.js'),
                },
            },
        }),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
});
