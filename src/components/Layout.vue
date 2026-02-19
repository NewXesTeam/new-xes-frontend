<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useTheme } from 'vuetify';
import { useAppStore } from '@/stores/app.ts';
import { refreshInfo } from '@/utils/passport.ts';
import { useAlertsStore } from '@/stores/alerts.ts';
import AppLayout from '@/layouts/app/AppLayout.vue';
import Alerts from '@/components/common/Alerts.vue';

const store = useAppStore();
const alertsStore = useAlertsStore();
const theme = useTheme();

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
</script>

<template>
    <v-app>
        <transition name="fade" mode="out-in">
            <!-- 基础 Layout -->
            <AppLayout>
                <transition name="fade" mode="out-in">
                    <slot />
                </transition>
            </AppLayout>
        </transition>

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

.slide-left-enter-active,
.slide-left-leave-active {
    transition: all 0.25s ease-out;
}

.slide-left-enter-from {
    opacity: 0;
    transform: translateX(30px);
}

.slide-left-leave-to {
    opacity: 0;
    transform: translateX(-30px);
}
</style>
