<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { AlertData } from '@/stores/alerts.ts';

const props = defineProps<AlertData>();
const { title, text, type = 'info', closable = true, useAutoClose = false, autoCloseTimeout = 3000 } = props;

const isInLifecycle = ref(true);
const isShow = ref(true);

const onClose = () => {
    isShow.value = false;
    setTimeout(() => {
        isInLifecycle.value = false;
    }, 1000);
};

onMounted(() => {
    if (useAutoClose) {
        setTimeout(() => {
            onClose();
        }, autoCloseTimeout);
    }
});
</script>

<template>
    <transition name="fade" v-if="isInLifecycle">
        <v-alert :title="title" :text="text" :type="type" :closable="closable" v-if="isShow" @click:close="onClose" />
    </transition>
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
