<script setup lang="ts">
import AppLayout from '@/layout/AppLayout.vue';
import WorkList from '@/components/WorkList.vue';

import { useAppStore } from '@/stores/app.js';
import { fetchData } from '@/utils.js';
import type { Work } from '@/types/work.js';

const store = useAppStore();
const followsWorkData = fetchData<Work[]>('/api/index/works/follows', {}, [])
</script>

<template>
    <AppLayout>
        <v-container>
            <h1 style="font-size: 36px;" v-if="!store.isLoggedIn">欢迎来到 NewXesFrontend</h1>
            <div class="flex flex-col gap-2" v-if="store.isLoggedIn">
                <h2 style="font-size: 24px;">我的关注</h2>
                <v-divider />
                <WorkList :works="followsWorkData.data || []" v-if="!followsWorkData.error" />
                <v-alert text="哦豁，出错了！" type="error" v-if="followsWorkData.error" />
            </div>
        </v-container>
    </AppLayout>
</template>

<style scoped>

</style>
