<script setup lang="ts">
import type { Work } from '@/types/work.ts';
import WorkCard from '@/components/WorkCard.vue';

interface Props {
    className?: string;
    works: Work[];
}

const { className = "m-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2", works } = defineProps<Props>();

</script>

<template>
    <div :class="className">
        <WorkCard v-for="work of works" :work="work" :key="work.id" />
    </div>
</template>

<style scoped>

</style>
