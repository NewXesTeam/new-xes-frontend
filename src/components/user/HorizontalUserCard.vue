<script setup lang="ts">
import { computed, ref } from 'vue';
import { useAlertsStore } from '@/stores/alerts.ts';
import type { SimpleUserInfo } from '@/types/user.ts';
import CardActionArea from '@/components/common/CardActionArea.vue';

const alertsStore = useAlertsStore();

const { user } = defineProps<{ user: SimpleUserInfo }>();
const userLink = computed(() => `/space/${user.user_id}/`);
const userName = computed(() => {
    return user.user_id === undefined ? '666 这位是 undefined 先生' : user.realname.replace(/<em>|<\/em>/g, '');
});
const isUserFollowed = ref(user.is_followed);

const onClickFollow = async () => {
    await fetch('/api/space/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followed_user_id: user.user_id, state: !isUserFollowed.value }),
    });
    isUserFollowed.value = !isUserFollowed.value;
    alertsStore.addAlert({
        type: 'success',
        text: isUserFollowed.value ? '关注成功' : '取消关注成功',
        useAutoClose: true,
    });
};
</script>

<template>
    <v-card style="display: flex">
        <CardActionArea class="flex-1" :href="userLink" rel="noopener" target="_blank">
            <v-card-text class="flex gap-2">
                <v-avatar :size="108" :image="user.avatar_path" />
                <div class="flex flex-col gap-2">
                    <h6 style="font-size: 24px">{{ userName }}</h6>
                    <div class="flex gap-4" style="font-size: 14px">
                        <span>关注：{{ user.follows }}</span>
                        <span>粉丝：{{ user.fans }}</span>
                        <span>UID：{{ user.id }}</span>
                    </div>
                    <div style="font-size: 16px">{{ user.signature }}</div>
                </div>
            </v-card-text>
        </CardActionArea>
        <div class="flex flex-col h-fit my-auto" style="padding: 8px">
            <v-btn
                :variant="isUserFollowed ? 'outlined' : undefined"
                :color="isUserFollowed ? 'secondary' : 'primary'"
                @click="onClickFollow"
            >
                {{ isUserFollowed ? '已关注' : '关注' }}
            </v-btn>
        </div>
    </v-card>
</template>

<style scoped></style>
