<script setup lang="ts">
import type { SimpleUserInfo } from '@/types/user.ts';
import SmallUserCard from '@/components/user/SmallUserCard.vue';

const { users } = defineProps<{ users: SimpleUserInfo[] }>();
</script>

<template>
    <div class="flex mx-auto w-fit gap-2">
        <SmallUserCard v-for="user of users" :key="user.user_id" :user="user" />
    </div>
</template>

<style scoped></style>
