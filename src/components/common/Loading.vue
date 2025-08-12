<script setup lang="ts">
const {
    error = false,
    loadingMessage = 'Loading...',
    errorMessage = '哦豁，出错了！',
} = defineProps<{
    error?: boolean;
    loadingMessage?: string;
    errorMessage?: string;
}>();
</script>

<template>
    <Transition name="slide-up" mode="out-in">
        <div v-if="!error" class="flex w-fit gap-2 items-center">
            <v-progress-circular :size="40" :width="7" indeterminate />
            <h4 style="font-size: 24px">{{ loadingMessage }}</h4>
        </div>
        <div v-else class="flex w-fit gap-2 items-center">
            <v-icon :size="40" icon="mdi-alert-circle" color="red" />
            <h4 style="font-size: 24px">{{ errorMessage }}</h4>
        </div>
    </Transition>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
    transition: all 0.25s ease-out;
}

.slide-up-enter-from {
    opacity: 0;
    transform: translateX(30px);
}

.slide-up-leave-to {
    opacity: 0;
    transform: translateX(-30px);
}
</style>
