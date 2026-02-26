<script lang="ts" setup>
import { PublishWorkInfo, Work } from '@/types/work';
import { getEditWorkLink, getWorkLink } from '@/utils';
import { ref } from 'vue';
import CardActionArea from '../common/CardActionArea.vue';

const emits = defineEmits(['publish', 'cancel-publish']);
const { work } = defineProps<{ work: Work }>();
const publishedText = { 0: '未发布', 1: '已发布', 2: '审核中', removed: '已下架' };
const isShowOperators = ref(false);
const link = getWorkLink(work);
const editLink = getEditWorkLink(work);

let workStatus;
if (work.removed) {
    workStatus = publishedText['removed'];
} else {
    workStatus = publishedText[work.published as keyof typeof publishedText];
}

const statusColors = {
    未发布: 'default',
    已发布: 'green',
    审核中: 'primary',
    已下架: 'red',
};

function onShowOperators() {
    isShowOperators.value = true;
}
function onHideOperators() {
    isShowOperators.value = false;
}

function onPublish() {
    const workData = work as unknown as PublishWorkInfo;
    emits('publish', workData)
}

function onCancelPublish() {
    const workData = work as unknown as PublishWorkInfo;
    emits('cancel-publish', workData)
}
</script>

<template>
    <v-card class="relative">
        <div @mouseenter="onShowOperators" @mouseleave="onHideOperators" v-tooltip:top="work.created_at">
            <CardActionArea :href="link" target="_blank">
                <v-img
                    class="mx-auto"
                    style="width: 224px; height: 168px"
                    draggable="false"
                    :src="work.thumbnail ||
                        'https://static0-test.xesimg.com/programme/assets/c16477eaab146fbc22a050e2203f91b8.png'"
                    :alt="work.name.replace(/<em>|<\/em>/g, '')"
                />

                <v-card-title v-tooltip:bottom="work.name.replace(/<em>|<\/em>/g, '')">
                    {{ work.name.replace(/<em>|<\/em>/g, '') }}
                </v-card-title>
            </CardActionArea>

            <v-card-actions class="flex justify-between">
                <v-chip
                    size="small"
                    :color="statusColors[workStatus as keyof typeof statusColors]"
                    
                >
                    {{ workStatus }}
                </v-chip>

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

            <div 
                class="absolute top-2 right-2 gap-3 z-10"
                :style="{ display: isShowOperators ? 'block' : 'none' }"
            >
                <v-btn
                    :href="editLink"
                    target="_blank"
                    xSmall
                    color="primary"
                    class="px-1 mr-1"
                >
                    <v-icon icon="mdi-pencil"></v-icon>
                    编辑
                </v-btn>

                <v-btn
                    xSmall
                    color="green"
                    v-if="work.published === 0 && !work.removed"
                    class="px-1 mr-1"
                    @click="onPublish"
                >
                    <v-icon icon="mdi-publish"></v-icon>
                    发布
                </v-btn>

                <v-btn
                    xSmall
                    color="red"
                    v-if="work.published === 1"
                    class="px-1"
                    @click="onCancelPublish"
                >
                    <v-icon icon="mdi-cancel"></v-icon>
                    取消发布
                </v-btn>
            </div>
        </div>
    </v-card>
</template>

<style scoped>
</style>