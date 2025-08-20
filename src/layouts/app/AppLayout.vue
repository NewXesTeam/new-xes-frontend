<script setup lang="ts">
import AppNavbar from '@/layouts/app/AppNavbar.vue';
import AppFooter from '@/layouts/app/AppFooter.vue';
</script>

<template>
    <div class="flex flex-col min-h-full">
        <AppNavbar />
        <div class="mt-5 mb-5 flex-1 flex flex-col">
            <slot />
        </div>
        <AppFooter />
    </div>
</template>

<style scoped></style>
