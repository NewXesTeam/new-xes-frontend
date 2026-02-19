import { Component, createApp } from 'vue';
import { createVuetify } from 'vuetify/framework';
import { createPinia } from 'pinia';
import PiniaPluginPersistedState from 'pinia-plugin-persistedstate';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const host = window.location.host;
const path = window.location.pathname;

const pageComponents = import.meta.glob('./pages/**/*.vue');
async function mountApp(loader: () => Promise<any>) {
    window.stop();
    document.head.innerHTML = `
        <meta charset="UTF-8">
        <title>NewXesFrontend</title>
    `;
    document.body.innerHTML = '';

    const module: any = await loader();
    const App: Component = module.default;

    const element = document.createElement('div');
    document.body.append(element);
    const app = createApp(App);
    app.use(
        createVuetify({
            components,
            directives,
        }),
    );

    const pinia = createPinia();
    pinia.use(PiniaPluginPersistedState);
    app.use(pinia);

    app.mount(element);

    import('@mdi/font/css/materialdesignicons.css');
    import('vuetify/dist/vuetify.min.css');
    import('./styles/main.css');
}

if (path === '/') {
    if (host === 'code.xueersi.com') {
        mountApp(() => pageComponents[`./pages/App.vue`]());
    } else if (host === 'login.xueersi.com') {
        mountApp(() => pageComponents[`./pages/Login.vue`]());
    }
} else if (pageComponents[`./pages/${host}${path}.vue`]) {
    mountApp(() => pageComponents[`./pages/${host}${path}.vue`]());
}
