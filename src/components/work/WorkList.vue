<script setup lang="ts">
import type { Work } from '@/types/work.ts';
import WorkCard from '@/components/work/WorkCard.vue';
import RemovedWorkCard from '@/components/work/RemovedWorkCard.vue';
import { v4 as uuid } from 'uuid';

interface Props {
    className?: string;
    works: Work[];
}

const { className = 'm-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2', works } =
    defineProps<Props>();
</script>

<template>
    <div :class="className">
        <!-- 先尝试 id，不存在可能是作品被下架了尝试 topic_id，还不存在就 tmd 是学某思搞的 null 作品 -->
        <component
            v-for="work of works"
            :key="work?.id || work?.topic_id || uuid()"
            :is="work && !work.removed ? WorkCard : RemovedWorkCard"
            :work="work"
        />
    </div>
</template>

<style scoped></style>
