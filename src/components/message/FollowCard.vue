<script lang="ts" setup>
import { useAlertsStore } from '@/stores/alerts';
import { FollowDataItem } from '@/types/message';
import { ref } from 'vue';

const { message, className } = defineProps<{
    message: FollowDataItem;
    className?: string;
}>();
const emits = defineEmits<{ read: []; refresh: [] }>();
const alertsStore = useAlertsStore();

const needRead = ref(message.read_at === '');
const userFollowed = ref(message.follow_status === 1);
const userLink = `/space/${message.send_user_id}/home`;

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
const onClickFollow = async () => {
    const response = await fetch('/api/space/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followed_user_id: message.send_user_id, state: !userFollowed.value }),
    });
    if (!response.ok) {
        alertsStore.addAlert({ type: 'error', text: '操作失败', autoCloseTimeout: 5000 });
        return;
    }
    userFollowed.value = !userFollowed.value;
    alertsStore.addAlert({
        type: 'success',
        text: userFollowed.value ? '关注成功' : '取消关注成功',
        autoCloseTimeout: 5000,
    });
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
    emits('refresh');
};
</script>

<template>
    <v-card :class="className" @click="needRead ? onClickRead : () => {}">
        <v-card-text class="flex items-center flex-row gap-2 justify-between">
            <div class="flex flex-row gap-2 items-center">
                <v-badge dot color="red" v-if="needRead" offset-x="0" location="left center" />
                <a :href="userLink" target="_blank">
                    <v-avatar :image="message.send_user_avatar_path" size="50" />
                </a>
                <div class="ml-2.5 mr-2.5">
                    <a :href="userLink" target="_blank" class="ml-7.75 mr-4.5">
                        {{ message.send_username }}
                    </a>
                    <div class="text-[14px]">{{ message.signature }}</div>
                    <div>
                        <span class="text-gray-500 text-xs mr-2.5">
                            {{ message.created_at }}
                        </span>
                        <v-btn size="small" @click="onClickDelete"> 删除 </v-btn>
                    </div>
                </div>
            </div>
            <v-btn
                :text="userFollowed ? '已关注' : '关注'"
                :color="userFollowed ? 'secondary' : 'primary'"
                :variant="userFollowed ? 'outlined' : undefined"
                @click="onClickFollow"
            />
        </v-card-text>
    </v-card>
</template>

<style lang="css" scoped></style>
