<script setup lang="ts">
import { getWorkLink } from '@/utils.ts';
import type { Work } from '@/types/work.ts';
import { computed } from 'vue';

const { work } = defineProps<{ work: Work }>();
const thumbnail = computed(
    () => work.thumbnail || 'https://static0-test.xesimg.com/programme/assets/c16477eaab146fbc22a050e2203f91b8.png',
);
const name = computed(() => work.name.replace(/<em>|<\/em>/g, ''));
</script>

<template>
    <v-card v-tooltip:top="work.created_at">
        <a class="flex flex-col card-action-area" v-ripple :href="getWorkLink(work)" rel="noopener" target="_blank">
            <v-img class="mx-auto" style="width: 224px; height: 168px;" draggable="false" :src="thumbnail" />

            <v-card-title v-tooltip:bottom="name">
                {{ name }}
            </v-card-title>

            <div class="area-overlay" />
        </a>

        <v-card-actions class="flex justify-between">
            <v-btn>
                {{ work.username }}
            </v-btn>
            <div class="flex gap-2 pr-2" style="zoom: 0.75">
                <v-badge color="info" :content="work.views" label="浏览量">
                    <v-icon icon="mdi-eye" />
                </v-badge>
                <v-badge color="primary" :content="work.likes" label="点赞数">
                    <v-icon icon="mdi-heart" />
                </v-badge>
                <v-badge color="error" :content="work.unlikes" label="点赞数">
                    <v-icon icon="mdi-thumb-down" />
                </v-badge>
                <v-badge color="success" :content="work.comments" label="评论数">
                    <v-icon icon="mdi-comment-text" />
                </v-badge>
            </div>
        </v-card-actions>
    </v-card>
</template>

<style scoped>
@reference "tailwindcss";

.card-action-area {
    @apply rounded;
    position: relative;
    outline: none;
}

.card-action-area > * {
    z-index: 0;
}

.card-action-area > .v-card-title {
    z-index: 2;
}

.card-action-area > .area-overlay {
    @apply rounded;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: currentColor;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
    z-index: 1;
}

.card-action-area:hover > .area-overlay {
    opacity: calc(var(--v-hover-opacity) * var(--v-theme-overlay-multiplier));
}

.card-action-area:focus-visible > .area-overlay {
    opacity: calc(var(--v-focus-opacity) * var(--v-theme-overlay-multiplier));
}

.card-action-area::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    border: 2px solid currentColor;
    border-radius: inherit;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
}

.card-action-area:focus-visible::after {
    opacity: calc(0.25 * var(--v-theme-overlay-multiplier));
}
</style>
