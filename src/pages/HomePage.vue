<script setup lang="ts">
import WorkList from '@/components/work/WorkList.vue';
import Loading from '@/components/common/Loading.vue';
import { useAppStore } from '@/stores/app.ts';
import { useFetchData } from '@/utils/index.ts';
import type { Work } from '@/types/work.ts';
import { onMounted } from 'vue';

const store = useAppStore();
const [followsWorkData, loadFollowsWorkData] = useFetchData<Work[]>('/api/index/works/follows', {}, []);

onMounted(() => {
    loadFollowsWorkData();
});
</script>

<template>
    <v-container>
        <h1 style="font-size: 36px" v-if="!store.isLoggedIn">欢迎来到 NewXesFrontend</h1>
        <div class="flex flex-col gap-2" v-if="store.isLoggedIn">
            <h2 style="font-size: 24px">我的关注</h2>
            <v-divider />
            <Loading v-if="!followsWorkData.success" :error="followsWorkData.error" />
            <WorkList v-else :works="followsWorkData.data || []" />
        </div>
    </v-container>
</template>

<style scoped></style>
