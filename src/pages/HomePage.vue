<script setup lang="ts">
import WorkList from '@/components/work/WorkList.vue';

import { useAppStore } from '@/stores/app.js';
import { useFetchData } from '@/utils.js';
import type { Work } from '@/types/work.js';

const store = useAppStore();
const followsWorkData = useFetchData<Work[]>('/api/index/works/follows', {}, []);
</script>

<template>
    <v-container>
        <h1 style="font-size: 36px" v-if="!store.isLoggedIn">欢迎来到 NewXesFrontend</h1>
        <div class="flex flex-col gap-2" v-if="store.isLoggedIn">
            <h2 style="font-size: 24px">我的关注</h2>
            <v-divider />
            <WorkList :works="followsWorkData.data || []" v-if="!followsWorkData.error" />
            <v-alert text="哦豁，出错了！" type="error" v-if="followsWorkData.error" />
        </div>
    </v-container>
</template>

<style scoped></style>
