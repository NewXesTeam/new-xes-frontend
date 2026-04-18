<script lang="ts" setup>
import { useAlertsStore } from '@/stores/alerts';
import { CommentDataItem } from '@/types/message';
import { ref } from 'vue';
import { processEmojiReplace, processLinkReplace } from './utils';
import DOMPurify from 'dompurify';
import CommentBox from './CommentBox.vue';

const { message, className } = defineProps<{
    message: CommentDataItem;
    className?: string;
}>();
const emits = defineEmits<{ read: []; refresh: [] }>();
const alertsStore = useAlertsStore();

const needRead = ref(message.read_at === '');
const show = ref(false);
const sendUserLink = `/space/${message.send_user_id}/home`;

const setShow = (value: boolean) => {
    show.value = value;
};

const onClickRead = async () => {
    const response = await fetch('/api/messages/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: 1, id: message.id }),
    });
    if (!response.ok) {
        alertsStore.addAlert({
            type: 'error',
            text: '标记已读失败',
            autoCloseTimeout: 5000,
        });
        return;
    }
    needRead.value = false;
    alertsStore.addAlert({
        type: 'success',
        text: '已阅读',
        autoCloseTimeout: 5000,
    });
    emits('read');
};

const onClickDelete = async () => {
    await fetch('/api/messages/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: message.category, id: message.id }),
    });
    alertsStore.addAlert({
        type: 'error',
        text: '删除成功',
        autoCloseTimeout: 5000,
    });
    show.value = false;
    emits('refresh');
};
</script>

<template>
    <v-card :class="className">
        <v-card-text class="flex flex-row">
            <v-badge dot color="red" v-if="needRead" offset-x="0" location="left center" />
            <a :href="sendUserLink" target="_blank" class="self-start">
                <v-avatar :image="message.send_user_avatar_path" size="50" />
            </a>
            <div class="mx-2.5">
                <div class="block pb-1.25">
                    <a :href="sendUserLink" target="_blank" class="text-[18px]">
                        {{ message.send_username }}
                    </a>

                    <div class="inline" v-if="!message.content?.sub">
                        <span class="text-gray-500 text-sm ml-1.25"> 评论了你的作品： </span>
                        <template v-if="message.topic">
                            <a :href="message.topic.link" target="_blank" class="no-underline text-[15px]">
                                {{ message.topic.text }}
                            </a>
                        </template>
                        <template v-else>
                            <span class="no-underline text-[15px] text-gray-400">（作品信息已不可用）</span>
                        </template>
                    </div>
                    <div class="inline" v-else>
                        <span class="text-gray-500 text-sm ml-1.25"> 回复了你的评论： </span>
                        <div
                            class="inline no-underline text-[15px]"
                            v-html="
                                message.content?.sub
                                    ? processEmojiReplace(
                                          DOMPurify.sanitize(message.content.sub.content),
                                          message.content.sub.emojis,
                                      )
                                    : ''
                            "
                        />
                    </div>
                </div>
                <div
                    class="block no-underline pb-1.25"
                    v-html="
                        message.content?.main
                            ? processLinkReplace(
                                  processEmojiReplace(
                                      DOMPurify.sanitize(message.content.main.content),
                                      message.content.main.emojis,
                                  ),
                                  message.content.main.links,
                              )
                            : ''
                    "
                />
                <div>
                    <span class="text-gray-500 text-[12px] mr-2.5">
                        {{ message.created_at }}
                    </span>
                    <v-btn size="small" @click="onClickDelete"> 删除 </v-btn>
                    <v-btn size="small" @click="show = true"> {{ message.has_reply ? '已回复' : '回复' }} </v-btn>
                    <v-btn size="small" @click="onClickRead" v-if="needRead"> 已读 </v-btn>
                </div>
            </div>
            <template v-if="message.topic">
                <a class="ms-auto self-start" :href="message.topic.link" target="_blank" v-tooltip="message.topic.text">
                    <img
                        :src="message.topic.thumbnail"
                        :alt="message.topic.text"
                        width="107"
                        height="80"
                        class="rounded-md border border-gray-300"
                    />
                </a>
            </template>
            <template v-else>
                <div
                    class="ms-auto self-start w-26.75 h-20 flex items-center justify-center text-gray-400 border border-gray-200 rounded-md"
                >
                    已删除
                </div>
            </template>
        </v-card-text>
        <v-card-actions v-if="show" class="w-full">
            <comment-box
                :topic-id="message.topic_id"
                :comment-id="message.comment_id"
                :show="show"
                @set-show="setShow"
            ></comment-box>
        </v-card-actions>
    </v-card>
</template>

<style scoped></style>
