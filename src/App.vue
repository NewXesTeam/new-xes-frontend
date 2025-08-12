<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/app.ts';
import { commonFetch } from '@/utils/index.ts';
import type { BasicResponse } from '@/types/common.ts';
import type { UserInfo } from '@/types/user.ts';
import AppLayout from '@/layout/AppLayout.vue';

const store = useAppStore();
const router = useRouter();
const isLoading = ref(false);

onMounted(() => {
    store.loaded = false;
    store.isLoggedIn = document.cookie.includes('is_login=1;');
    if (store.isLoggedIn) {
        commonFetch<BasicResponse<UserInfo>>('/api/user/info')
            .then(data => {
                store.userInfo = data.data;
            })
            .catch(error => {
                console.error('fetch user info error: ', error);
            })
            .finally(() => {
                store.loaded = true;
            });
    }
});

router.beforeEach((to, from, next) => {
    console.log('导航开始。');
    isLoading.value = true;
    next();
});

router.afterEach((to, from) => {
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
                <AppLayout v-if="route.meta.useLayout">
                    <transition name="fade" mode="out-in">
                        <component :is="Component" />
                    </transition>
                </AppLayout>

                <transition v-else name="fade" mode="out-in">
                    <component :is="Component" />
                </transition>
            </transition>
        </router-view>
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
</style>
