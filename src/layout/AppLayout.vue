<script setup lang="ts">
import AppNavbar from '@/layout/AppNavbar.vue';
import AppFooter from '@/layout/AppFooter.vue';
</script>

<template>
    <div class="flex flex-col min-h-full">
        <AppNavbar />
        <div class="mt-5 mb-5 flex-1">
            <slot />
        </div>
        <AppFooter />
    </div>
</template>

<style scoped></style>
