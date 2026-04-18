<script setup lang="ts">
import AppNavbar from '@/layouts/app/AppNavbar.vue';
import AppFooter from '@/layouts/app/AppFooter.vue';

const host = document.location.host;
</script>

<template>
    <div class="flex flex-col min-h-full">
        <AppNavbar v-if="host !== 'login.xueersi.com'" />
        <div class="mt-5 mb-5 mx-10 flex-1 flex flex-col">
            <slot />
        </div>
        <AppFooter />
    </div>
</template>

<style scoped></style>
