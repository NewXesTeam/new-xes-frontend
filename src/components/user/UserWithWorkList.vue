<script setup lang="ts">
import type { SearchUserList } from '@/types/user.ts';
import HorizontalUserCard from '@/components/user/HorizontalUserCard.vue';
import WorkList from '../work/WorkList.vue';

const { users } = defineProps<{ users: SearchUserList['data'] }>();
</script>

<template>
    <div class="flex flex-col mx-auto gap-2">
        <HorizontalUserCard v-for="user of users" :key="user.user.user_id" :user="user.user">
            <WorkList :works="user.works" />
        </HorizontalUserCard>
    </div>
</template>

<style scoped></style>
