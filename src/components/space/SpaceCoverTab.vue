<script setup lang="ts">
import { onMounted } from 'vue';
import { useFetchData } from '@/utils';
import type { SpaceCover } from '@/types/space.ts';
import Loading from '@/components/common/Loading.vue';

const { userId } = defineProps<{ userId: string }>();
const [spaceCoverData, loadSpaceCoverData] = useFetchData<SpaceCover>(() => `/api/space/web_cover?user_id=${userId}`);

onMounted(() => {
    loadSpaceCoverData();
});
</script>

<template>
    <Loading v-if="!spaceCoverData.success" :error="spaceCoverData.error" />
    <h2 v-else-if="!spaceCoverData.data.is_show_web_tab" style="font-size: 24px">未设置封面</h2>
    <iframe v-else :src="spaceCoverData.data.index_url" class="w-full min-h-screen" />
</template>

<style scoped></style>
