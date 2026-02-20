import { type Component, createApp } from 'vue';
import { createPinia } from 'pinia';
import PiniaPluginPersistedState from 'pinia-plugin-persistedstate';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const host = window.location.host;
const path = window.location.pathname;

// 页面映射
const pageMap = {
    'code.xueersi.com/': './pages/Home.vue',
    'login.xueersi.com/': './pages/Login.vue',
} as const; // 别问我为什么要加as const，单纯是因为顺眼吧

// 为每一个Vue组件的默认导出定义一个类型，防止Typescript报错
type Module = { default: Component };

// 为getPageComponents定义一个类型
type ComponentLoader = () => Promise<Module>;

// 获取所有的页面组件
const pageComponents = import.meta.glob<Module>('./pages/**/*.vue');

// 根据路由获取对应的页面组件
function getPageComponentsLoader(): ComponentLoader | undefined | null {
    if (path === '/') {
        // 依据host映射
        const key = `${host}/` as keyof typeof pageMap;
        return pageMap[key] ? pageComponents[pageMap[key]] : null;
    } else {
        // 如果是其他的路径就尝试直接匹配
        const visitPath = `./pages/${host}${path}.vue`;
        return pageComponents[visitPath];
    }
}

// 依据组件挂载页面
async function mountApp(loader: ComponentLoader | undefined | null) {
    // 预先检查loader是否存在，虽然可能没必要吧
    if (!loader) {
        console.error('[NewXesFrontned] 未找到加载器，页面注入失败');
        return;
    }

    // 清空页面Body
    document.body.innerHTML = '';
    const element = document.createElement('div');
    document.body.appendChild(element); // JS添加div元素

    // 尝试挂在组件
    try {
        // 获取页面组件
        const component = await loader();
        const PageContent: Component = component.default;

        // 初始化Pinia
        const pinia = createPinia();
        // 加一个持久化插件
        pinia.use(PiniaPluginPersistedState);

        // 创建一个Vue实例
        const instance = createApp(PageContent);
        // 使用Pinia
        instance.use(pinia);
        instance.use(
            createVuetify({
                components,
                directives,
            }),
        );

        // 挂载实例
        instance.mount(element);

        import('@mdi/font/css/materialdesignicons.css');
        import('vuetify/dist/vuetify.min.css');
        import('./styles/main.css');
    } catch (error) {
        console.error(`[NewXesFrontned] 加载错误: ${error}`);
        element.innerHTML = `<h1>页面加载错误，请稍后再试。报错内容: ${error}</h1>`;
    }
}

// 启动应用
// 获取组件加载器
const loader = getPageComponentsLoader();
if (loader) {
    // 更新页面标题
    document.title = 'NewXesFrontend';

    // 挂载页面
    (async () => {
        await mountApp(loader);
    })();
} else {
    console.warn('未找到匹配的页面组件', { host, path });
}
