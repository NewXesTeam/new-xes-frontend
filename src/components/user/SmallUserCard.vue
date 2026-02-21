<script setup lang="ts">
import type { SimpleUserInfo } from '@/types/user.ts';

const { user } = defineProps<{ user: SimpleUserInfo }>();
const tooltip = `粉丝：${user.fans} 关注：${user.follows}`;
</script>

<template>
    <v-card v-tooltip:top="tooltip" rel="noopener" target="_blank" :href="`/space/${user.id}/home`">
        <div class="flex justify-center" style="padding: 4px">
            <v-avatar :size="80" :image="user.avatar_path" />
        </div>
        <v-card-title>
            {{ user.realname }}
        </v-card-title>
    </v-card>
</template>

<style scoped></style>
