<script lang="ts" setup>
import { onMounted, ref, computed, watch } from 'vue';
import { useFetchData } from '@/utils';
import type { WorkList as IWorkList } from '@/types/work';
import Loading from '@/components/common/Loading.vue';
import WorkList from '@/components/work/WorkList.vue';

const currentPage = ref(1);
const orderType = ref('comprehensive');
const orderLang = ref('all');
const { keyword } = defineProps<{ keyword: string }>();
const [searchWorkList, loadSearchWorkList] = useFetchData<IWorkList>(
    () =>
        `/api/search?keyword=${keyword}&search_type=works&order_type=${orderType.value}&lang=${orderLang.value}&page=${currentPage.value}&per_page=50`,
);
const totalPages = computed(() => Math.max(Math.ceil((searchWorkList.value.data?.total ?? 0) / 50), 1));

watch(currentPage, () => {
    if (searchWorkList.value.completed) {
        loadSearchWorkList();
    }
});

watch(orderType, () => {
    currentPage.value = 1;
    loadSearchWorkList();
});

watch(orderLang, () => {
    currentPage.value = 1;
    loadSearchWorkList();
});

onMounted(() => {
    loadSearchWorkList();
});
</script>

<template>
    <v-container class="flex-1 flex flex-col">
        <div class="flex flex-col gap-2">
            <div class="flex justify-between">
                <v-btn-toggle v-model="orderLang" variant="outlined" mandatory>
                    <v-btn value="all">全部</v-btn>
                    <v-btn value="scratch">TurboWarp</v-btn>
                    <v-btn value="python">Python</v-btn>
                    <v-btn value="cpp">C++</v-btn>
                </v-btn-toggle>

                <v-btn-toggle v-model="orderType" variant="outlined" mandatory>
                    <v-btn value="comprehensive">综合排序</v-btn>
                    <v-btn value="likes">点赞最多</v-btn>
                    <v-btn value="favorites">收藏最多</v-btn>
                    <v-btn value="source_code_views">改编最多</v-btn>
                </v-btn-toggle>
            </div>

            <Loading v-if="!searchWorkList.success" :error="searchWorkList.error" />
            <h2 v-else-if="searchWorkList.success && searchWorkList.data.total < 1" style="font-size: 24px">
                暂无作品
            </h2>
            <WorkList v-else :works="searchWorkList.data?.data || []" />

            <v-pagination v-model="currentPage" :length="totalPages" rounded :total-visible="7" />
        </div>
    </v-container>
</template>

<style scoped></style>
