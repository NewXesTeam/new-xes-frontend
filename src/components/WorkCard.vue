<script setup lang="ts">
import { getWorkLink } from '@/utils.ts';
import type { Work } from '@/types/work.js';
import { computed } from 'vue';

const { work } = defineProps<{ work: Work }>();
const thumbnail = computed(
    () => work.thumbnail || 'https://static0-test.xesimg.com/programme/assets/c16477eaab146fbc22a050e2203f91b8.png',
);
const name = computed(() => work.name.replace(/<em>|<\/em>/g, ''));
</script>

<template>
    <v-card :href="getWorkLink(work)" rel="noopener" target="_blank" v-tooltip:top="work.created_at">
        <v-img class="mx-auto" style="width: 224px; height: 168px" cover :src="thumbnail" />

        <v-card-title v-tooltip:bottom="name">
            {{ name }}
        </v-card-title>

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

<style scoped></style>
