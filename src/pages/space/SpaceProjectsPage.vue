<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { commonFetch, useFetchState } from '@/utils';
import type { BasicResponse } from '@/types/common.ts';
import type { SpaceWorks } from '@/types/space.ts';
import Loading from '@/components/common/Loading.vue';
import WorkList from '@/components/work/WorkList.vue';

const route = useRoute();
const spaceWorksData = useFetchState<SpaceWorks>();

const totalPages = ref(1);
const currentPage = ref(1);
const orderType = ref('time');

const fetchData = () => {
    spaceWorksData.value.reset();
    commonFetch<BasicResponse<SpaceWorks>>(`/api/space/works?user_id=${route.params.userId}&page=${currentPage.value}&per_page=20&order_type=${orderType.value}`)
        .then(data => {
            spaceWorksData.value.resolve(data.data);
            totalPages.value = Math.ceil((spaceWorksData.value.data?.total || 1) / 20);
        })
        .catch(error => {
            spaceWorksData.value.reject(error.toString());
        });
};

watch(
    () => route.params.userId,
    () => {
        console.log('切换 space 页面');
        fetchData();
    },
);

watch(orderType, () => {
    currentPage.value = 1;
    fetchData();
});

watch(currentPage, () => {
    if (spaceWorksData.value.completed) {
        fetchData();
    }
});

onMounted(() => {
    fetchData();
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

            <h2 v-if="spaceWorksData.completed && !spaceWorksData.error && spaceWorksData.data.total < 1" style="font-size: 24px;">暂无作品</h2>
            <WorkList v-else :works="spaceWorksData.data?.data || []" />

            <v-pagination v-model="currentPage" :length="totalPages" rounded :total-visible="7" />
        </div>
    </v-container>
</template>

<style scoped></style>
