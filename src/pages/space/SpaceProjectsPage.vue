<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useFetchData } from '@/utils';
import type { SpaceWorks } from '@/types/space.ts';
import Loading from '@/components/common/Loading.vue';
import WorkList from '@/components/work/WorkList.vue';

const route = useRoute();
const totalPages = ref(1);
const currentPage = ref(1);
const orderType = ref('time');
const [spaceWorksData, loadSpaceWorksData] = useFetchData<SpaceWorks>(`/api/space/works?user_id=${route.params.userId}&page=${currentPage.value}&per_page=20&order_type=${orderType.value}`);

watch(
    () => route.params.userId,
    () => {
        console.log('切换 space 页面');
        loadSpaceWorksData();
    },
);

watch(orderType, () => {
    currentPage.value = 1;
    loadSpaceWorksData();
});

watch(currentPage, () => {
    if (spaceWorksData.value.completed) {
        loadSpaceWorksData();
    }
});

onMounted(() => {
    loadSpaceWorksData();
});
</script>

<template>
    <v-container class="flex-1 flex flex-col">
        <div class="flex flex-col gap-2">
            <div class="flex justify-between">
                <v-btn-toggle v-model="orderType" variant="outlined" mandatory>
                    <v-btn value="time">最新发布</v-btn>
                    <v-btn value="likes">点赞最多</v-btn>
                    <v-btn value="comments">评论最多</v-btn>
                </v-btn-toggle>

                <Loading v-if="!spaceWorksData.completed || spaceWorksData.error" :error="spaceWorksData.error" />
            </div>

            <h2
                v-if="spaceWorksData.completed && !spaceWorksData.error && spaceWorksData.data.total < 1"
                style="font-size: 24px"
            >
                暂无作品
            </h2>
            <WorkList v-else :works="spaceWorksData.data?.data || []" />

            <v-pagination v-model="currentPage" :length="totalPages" rounded :total-visible="7" />
        </div>
    </v-container>
</template>

<style scoped></style>
