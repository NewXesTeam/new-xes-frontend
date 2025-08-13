<script setup lang="ts">
import { computed } from 'vue';
import { getWorkLink } from '@/utils/index.ts';
import type { Work } from '@/types/work.ts';

const { work } = defineProps<{ work: Work }>();
const thumbnail = computed(
    () => work.thumbnail || 'https://static0-test.xesimg.com/programme/assets/c16477eaab146fbc22a050e2203f91b8.png',
);
const name = computed(() => work.name.replace(/<em>|<\/em>/g, ''));

const tooltip = `👀${work.views} 👍${work.likes} 👎${work.unlikes} 🗨️${work.comments}`;
</script>

<template>
    <v-card v-tooltip:top="work.created_at" :href="getWorkLink(work)">
        <v-img class="mx-auto" style="height: 138px" draggable="false" :src="thumbnail" />

        <v-card-title v-tooltip:bottom="tooltip" style="font-size: 16px;">
            {{ name }}
        </v-card-title>
    </v-card>
</template>

<style scoped></style>
