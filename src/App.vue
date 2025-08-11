<script setup lang="ts">
import { onMounted } from 'vue';
import { useAppStore } from '@/stores/app.ts';
import { commonFetch } from '@/utils.ts';
import type { UserInfo } from '@/types/user.ts';

const store = useAppStore();

onMounted(() => {
    store.isLoggedIn = document.cookie.includes('is_login=1;');
    if (store.isLoggedIn) {
        commonFetch<UserInfo>('/api/user/info')
            .then(data => {
                store.userInfo = data.data;
            })
            .catch(error => {
                console.error("fetch user info error: ", error)
            });
    }
})
</script>

<template>
    <v-app>
        <router-view />
    </v-app>
</template>

<style scoped></style>
