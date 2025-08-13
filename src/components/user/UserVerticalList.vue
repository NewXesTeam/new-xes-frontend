<script setup lang="ts">
import type { SimpleUserInfo } from '@/types/user.ts';
import HorizontalUserCard from '@/components/user/HorizontalUserCard.vue';

const { users } = defineProps<{ users: SimpleUserInfo[] }>();
</script>

<template>
    <div class="flex flex-col mx-auto gap-2">
        <HorizontalUserCard v-for="user of users" :user="user" />
    </div>
</template>

<style scoped></style>
