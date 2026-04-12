<script lang="ts" setup>
import FollowList from '@/components/message/FollowList.vue';
import CommentList from '@/components/message/CommentList.vue';
import { BasicResponse } from '@/types/common';
import { CommentMessageInfo, FollowMessageInfo, MessageData } from '@/types/message';
import { Ref, ref, watch } from 'vue';

const params = new URLSearchParams(window.location.search);
const category = ref(params.get('category') || '1');
const currentTab = ref(category.value);
const currentPage = ref(1);
const refreshKey = ref(0);

const tabTitles = ['评论和回复', '', '', '', '关注'];

const messages: Ref<FollowMessageInfo['data'] | CommentMessageInfo['data'] | undefined> = ref();
const messageData: Ref<BasicResponse<MessageData> | null> = ref(null);

const readMessages = async () => {
    const messageResponse = await fetch(`/api/messages/overview`);
    const messageResponseData: BasicResponse<MessageData> = await messageResponse.json();
    messageData.value = messageResponseData;
};

const handleTabChange = (tab: string) => {
    if (tab !== currentTab.value) {
        history.replaceState(null, '', `?category=${tab}`);
        currentTab.value = tab;
        currentPage.value = 1;
    }
};
const handleRefresh = () => {
    refreshKey.value++;
};

watch(
    [currentPage, currentTab, refreshKey],
    () => {
        const fetchMessages = async () => {
            const response = await fetch(
                `/api/messages?category=${currentTab.value}&page=${currentPage.value}&per_page=10`,
            );
            const responseData = await response.json();
            messages.value = responseData.data;

            await readMessages();
        };
        fetchMessages();
    },
    { immediate: true },
);
</script>

<template>
    <v-row>
        <v-col cols="12" md="3" lg="2" class="sticky top-4 self-start">
            <v-card class="pa-4" elevation="3">
                <v-card-title class="text-h5 mb-4"> 消息中心 </v-card-title>

                <v-list>
                    <v-list-item :active="currentTab === '1'" @click="handleTabChange('1')" class="mb-2">
                        <v-list-item-title>
                            <div class="flex items-center">
                                评论和回复
                                <v-badge
                                    v-if="
                                        Array.isArray(messageData?.data) &&
                                        messageData.data.length > 0 &&
                                        messageData.data[0]?.count
                                    "
                                    color="error"
                                    :content="messageData.data[0].count"
                                    class="ml-2"
                                />
                            </div>
                        </v-list-item-title>
                    </v-list-item>

                    <v-list-item :active="currentTab === '5'" @click="handleTabChange('5')">
                        <v-list-item-title>
                            <div class="flex items-center">
                                关注
                                <v-badge
                                    v-if="
                                        Array.isArray(messageData?.data) &&
                                        messageData.data.length > 0 &&
                                        messageData?.data[2]?.count
                                    "
                                    color="error"
                                    :content="messageData.data[2].count"
                                    class="ml-2"
                                />
                            </div>
                        </v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-card>
        </v-col>

        <!-- 右侧内容区 -->
        <v-col cols="12" md="9" lg="10" class="md:pl-4">
            <v-card-title class="text-h4 mb-4">
                {{ tabTitles[parseInt(currentTab) - 1] }}
            </v-card-title>

            <div v-if="!messages || messages?.total === 0" class="text-xs">暂无消息</div>
            <div v-else>
                <comment-list
                    v-if="currentTab === '1'"
                    :messages="messages as CommentMessageInfo['data']"
                    @read="readMessages"
                    @refresh="handleRefresh"
                />
                <follow-list
                    v-if="currentTab === '5'"
                    :messages="messages as FollowMessageInfo['data']"
                    @read="readMessages"
                    @refresh="handleRefresh"
                />

                <v-pagination
                    v-if="messages?.total && messages.total > 10"
                    v-model="currentPage"
                    :length="Math.ceil(messages.total / 10)"
                    rounded
                    total-visible="7"
                    class="mt-4"
                />
            </div>
        </v-col>
    </v-row>
</template>

<style lang="css" scoped></style>
