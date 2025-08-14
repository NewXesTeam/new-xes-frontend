<script setup lang="ts">
import AppNavbar from '@/layouts/app/AppNavbar.vue';
import AppFooter from '@/layouts/app/AppFooter.vue';
</script>

<template>
    <div class="flex flex-col min-h-full">
        <AppNavbar />
        <div class="mt-5 mb-5 flex-1 flex flex-col">
            <router-view v-slot="{ Component }">
                <transition name="fade" mode="out-in">
                    <component :is="Component" />
                </transition>
            </router-view>
        </div>
        <AppFooter />
    </div>
</template>

<style scoped>
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
