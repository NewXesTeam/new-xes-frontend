<script setup lang="ts">
import AlertWrapper from '@/components/common/AlertWrapper.vue';
import type { AlertData } from '@/stores/alerts.ts';

const props = defineProps<{
    alerts: AlertData[];
}>();
</script>

<template>
    <div class="flex flex-col gap-2">
        <AlertWrapper v-for="alert of props.alerts" v-bind="alert" :key="alert.key" />
    </div>
</template>

<style scoped></style>
