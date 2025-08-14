<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useTheme } from 'vuetify';
import { useAppStore } from '@/stores/app.ts';
import { refreshInfo } from '@/utils/passport.ts';
import { useAlertsStore } from '@/stores/alerts.ts';
import Alerts from '@/components/common/Alerts.vue';

const store = useAppStore();
const alertsStore = useAlertsStore();
const router = useRouter();
const theme = useTheme();

const isLoading = ref(false);

watch(
    () => store.loaded,
    loaded => {
        if (!loaded) return;
        theme.change(store.theme);
    },
);

watch(
    () => store.theme,
    newTheme => {
        theme.change(newTheme);
    },
);

onMounted(() => {
    refreshInfo();
});

router.beforeEach((from, to, next) => {
    console.log('导航开始。');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    isLoading.value = true;
    next();
});

router.afterEach(() => {
    console.log('导航结束。');
    setTimeout(() => {
        isLoading.value = false;
    }, 500);
});
</script>

<template>
    <v-app>
        <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
                <component :is="Component" />
            </transition>
        </router-view>

        <!-- 加载中提示 -->
        <v-progress-circular indeterminate :size="30" class="loading-tip" v-if="isLoading" />

        <!-- alerts 显示位置 -->
        <Alerts class="alerts-list" :alerts="alertsStore.alerts" />
    </v-app>
</template>

<style scoped>
.alerts-list {
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 5000;
}

.loading-tip {
    position: fixed;
    top: 5px;
    right: 5px;
    z-index: 10000;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
    opacity: 1;
}
</style>
