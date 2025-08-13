<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { commonFetch, useFetchState } from '@/utils';
import type { BasicResponse } from '@/types/common.ts';
import type { SpaceCover } from '@/types/space.ts';
import Loading from '@/components/common/Loading.vue';

const route = useRoute();
const spaceCoverData = useFetchState<SpaceCover>();

const fetchData = () => {
    spaceCoverData.value.reset();
    commonFetch<BasicResponse<SpaceCover>>(`/api/space/web_cover?user_id=${route.params.userId}`)
        .then(data => {
            spaceCoverData.value.resolve(data.data);
        })
        .catch(error => {
            spaceCoverData.value.reject(error.toString());
        });
};

watch(
    () => route.params.userId,
    () => {
        console.log('切换 space 页面');
        fetchData();
    },
);

onMounted(() => {
    fetchData();
});
</script>

<template>
    <v-container class="flex-1 flex flex-col">
        <Loading v-if="!spaceCoverData.completed || spaceCoverData.error" :error="spaceCoverData.error" />
        <h2 v-else-if="!spaceCoverData.data.is_show_web_tab" style="font-size: 24px;">未设置封面</h2>
        <iframe v-else :src="spaceCoverData.data.index_url" class="w-full flex-1" />
    </v-container>
</template>

<style scoped></style>
