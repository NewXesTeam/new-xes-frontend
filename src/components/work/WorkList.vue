<script setup lang="ts">
import type { Work } from '@/types/work.ts';
import WorkCard from '@/components/work/WorkCard.vue';
import RemovedWorkCard from '@/components/work/RemovedWorkCard.vue';

interface Props {
    className?: string;
    works: Work[];
}

const { className = 'm-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2', works } =
    defineProps<Props>();
</script>

<template>
    <div :class="className">
        <component v-for="work of works" :key="work.id" :is="work.removed ? RemovedWorkCard : WorkCard" :work="work" />
    </div>
</template>

<style scoped></style>
