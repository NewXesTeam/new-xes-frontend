<script lang="ts" setup>
import { useAlertsStore } from '@/stores/alerts';
import { ErrorResponse } from '@/types/common';
import { ref } from 'vue';

const { topicId, commentId, show } = defineProps<{ topicId: string; commentId: number; show: boolean }>();
const emits = defineEmits<{ setShow: [show: boolean] }>();

const comment = ref('');
const alertsStore = useAlertsStore();

const onCLickComment = async () => {
    if (comment.value.trim() === '') {
        alertsStore.addAlert({
            type: 'error',
            text: '评论内容不能为空',
        });
        return;
    }
    const response = await fetch('/api/comments/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            appid: 1001108,
            comment_from: 'message',
            content: comment.value,
            target_id: commentId,
            topic_id: topicId,
        }),
    });
    if (response.ok) {
        emits('setShow', false);
        comment.value = '';
    } else {
        const responseData: ErrorResponse = await response.json();
        alertsStore.addAlert({
            type: 'error',
            text: responseData.message,
        });
    }
};
</script>

<template>
    <div v-if="show" class="p-2.5 w-full">
        <v-textarea label="评论" variant="outlined" rows="4" v-model="comment" clearable />
        <v-btn variant="outlined" color="primary" @click="onCLickComment"> 提交 </v-btn>
    </div>
</template>

<style lang="css" scoped></style>
