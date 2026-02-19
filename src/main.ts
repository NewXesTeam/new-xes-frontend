import { Component, createApp } from 'vue';
import { createVuetify } from 'vuetify/framework';
import { createPinia } from 'pinia';
import PiniaPluginPersistedState from 'pinia-plugin-persistedstate';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const host = window.location.host;
const path = window.location.pathname;

// @ts-ignore
const pageComponents = import.meta.glob('./pages/**/*.vue');
if (window.location.href === "https://code.xueersi.com/") {
    window.stop();
    document.head.innerHTML = `
        <meta charset="UTF-8">
        <title>NewXesFrontend</title>
    `;
    document.body.innerHTML = '';

    const loader = pageComponents[`./pages/App.vue`];
    const module: any = await loader();
    const App: Component = module.default;

    const element = document.createElement('div');
    document.body.append(element);
    const app = createApp(App);
    app.use(
        createVuetify({
            theme: {
                defaultTheme: 'system',
            },
            icons: {
                defaultSet: 'mdi',
                aliases,
                sets: {
                    mdi,
                },
            },
            components,
            directives,
        }),
    );

    const pinia = createPinia();
    pinia.use(PiniaPluginPersistedState);
    app.use(pinia);

    app.mount(element);

    // @ts-ignore
    import('@mdi/font/css/materialdesignicons.css');
    // @ts-ignore
    import('vuetify/dist/vuetify.min.css');
    // @ts-ignore
    import('./styles/main.css');
}
else if (
    pageComponents[`./pages/${host}${path}.vue`]
) {
    // 符合规则, 替换目标页面
    startApp().then();
} else {
    if (window.origin === 'https://code.xueersi.com') {
        // ignore
    }
}

async function startApp() {
    window.stop();
    document.head.innerHTML = `
        <meta charset="UTF-8">
        <title>NewXesFrontend</title>
    `;
    document.body.innerHTML = '';

    const loader = pageComponents[`./pages/${host}${path}.vue`];
    const module: any = await loader();
    const App: Component = module.default;

    const element = document.createElement('div');
    document.body.append(element);
    const app = createApp(App);
    app.use(
        createVuetify({
            theme: {
                defaultTheme: 'system',
            },
            icons: {
                defaultSet: 'mdi',
                aliases,
                sets: {
                    mdi,
                },
            },
            components,
            directives,
        }),
    );

    const pinia = createPinia();
    pinia.use(PiniaPluginPersistedState);
    app.use(pinia);

    app.mount(element);

    // @ts-ignore
    import('@mdi/font/css/materialdesignicons.css');
    // @ts-ignore
    import('vuetify/dist/vuetify.min.css');
    // @ts-ignore
    import('./styles/main.css');
}
