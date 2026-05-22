<script lang="ts" setup>
import { CommentMessageInfo } from '@/types/message';
import CommentCard from './CommentCard.vue';

const { messages } = defineProps<{ messages: CommentMessageInfo['data'] }>();
const emits = defineEmits<{ read: []; refresh: [] }>();
</script>

<template>
    <div class="flex flex-col">
        <CommentCard
            v-for="(message, index) in messages.data"
            :key="message.id || index"
            :message="message"
            :class="Number(index) >= 1 ? 'mt-2' : ''"
            @read="emits('read')"
            @refresh="emits('refresh')"
        />
    </div>
</template>

<style scoped></style>
