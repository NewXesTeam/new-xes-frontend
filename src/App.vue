<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import AppLayout from '@/layouts/app/AppLayout.vue';
import { refreshInfo } from '@/utils/passport.ts';

const router = useRouter();
const isLoading = ref(false);

onMounted(() => {
    refreshInfo();
});

router.beforeEach((from, to, next) => {
    console.log('导航开始。');
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
        <router-view v-slot="{ Component, route }">
            <transition name="fade" mode="out-in">
                <!-- 基础 Layout -->
                <AppLayout v-if="route.meta.useLayout">
                    <transition name="fade" mode="out-in">
                        <!-- 叠加 Layout -->
                        <component v-if="route.meta.innerLayout" :is="route.meta.innerLayout">
                            <transition name="slide-left" mode="out-in">
                                <component :is="Component" />
                            </transition>
                        </component>

                        <component v-else :is="Component" />
                    </transition>
                </AppLayout>

                <!-- 无 Layout -->
                <transition v-else name="fade" mode="out-in">
                    <component :is="Component" />
                </transition>
            </transition>
        </router-view>

        <!-- 加载中提示 -->
        <v-progress-circular indeterminate :size="30" class="loading-tip" v-if="isLoading" />
    </v-app>
</template>

<style scoped>
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
