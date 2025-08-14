<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useFetchData } from '@/utils';
import type { SpaceCover } from '@/types/space.ts';
import Loading from '@/components/common/Loading.vue';

const route = useRoute();
const [spaceCoverData, loadSpaceCoverData] = useFetchData<SpaceCover>(
    `/api/space/web_cover?user_id=${route.params.userId}`,
);

watch(
    () => route.params.userId,
    () => {
        console.log('切换 space 页面');
        loadSpaceCoverData();
    },
);

onMounted(() => {
    loadSpaceCoverData();
});
</script>

<template>
    <v-container class="flex-1 flex flex-col">
        <Loading v-if="!spaceCoverData.success" :error="spaceCoverData.error" />
        <h2 v-else-if="!spaceCoverData.data.is_show_web_tab" style="font-size: 24px">未设置封面</h2>
        <iframe v-else :src="spaceCoverData.data.index_url" class="w-full flex-1" />
    </v-container>
</template>

<style scoped></style>
