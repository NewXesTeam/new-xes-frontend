import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from '@/router';

import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';

import App from '@/App.vue';
import '@/styles/app.css';

const app = createApp(App);

app.use(
    createVuetify({
        theme: {
            defaultTheme: 'light',
        },
        icons: {
            defaultSet: 'mdi',
            aliases,
            sets: {
                mdi,
            },
        },
    }),
);
app.use(createPinia());
app.use(router);

Reflect.set(window, 'app', app);

app.mount('#app');
