<script lang="ts" setup>
import { FollowMessageInfo } from '@/types/message';
import FollowCard from './FollowCard.vue';

const { messages } = defineProps<{ messages: FollowMessageInfo['data'] }>();
const emits = defineEmits<{ read: []; refresh: [] }>();
</script>

<template>
    <div class="flex flex-col">
        <FollowCard
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
