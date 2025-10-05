<script lang="ts" setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useFetchState, commonFetch } from '@/utils';
import type { WorkList as IWorkList } from '@/types/work';
import WorkList from '@/components/work/WorkList.vue';
import Loading from '@/components/common/Loading.vue';

const currentPage = ref(1);
const orderType = ref('latest');
const orderLang = ref('');

const discoverWorksData = useFetchState<IWorkList | null>(null);

const loadDiscoverWorksData = () => {
    discoverWorksData.value.reset();
    commonFetch<IWorkList>(`/api/works/${orderType.value}?page=${currentPage.value}&lang=${orderLang.value}`)
        .then(data => {
            discoverWorksData.value.resolve(data);
        })
        .catch(err => {
            discoverWorksData.value.reject(err.toString());
        });
};

const totalPages = computed(() =>
    Math.max(Math.ceil((discoverWorksData.value.data ? discoverWorksData.value.data.total : 0) / 20), 1),
);

watch(orderType, () => {
    currentPage.value = 1;
    loadDiscoverWorksData();
});

watch(orderLang, () => {
    currentPage.value = 1;
    loadDiscoverWorksData();
});

watch(currentPage, () => {
    if (discoverWorksData.value.data) {
        loadDiscoverWorksData();
    }
});

onMounted(() => {
    loadDiscoverWorksData();
});
</script>

<template>
    <v-container class="flex-1 flex flex-col">
        <div class="flex flex-col gap-2">
            <div class="flex justify-between">
                <v-btn-toggle v-model="orderLang" variant="outlined" mandatory>
                    <v-btn value="">全部</v-btn>
                    <v-btn value="scratch">TurboWarp</v-btn>
                    <v-btn value="python">Python</v-btn>
                    <v-btn value="cpp">C++</v-btn>
                </v-btn-toggle>

                <v-btn-toggle v-model="orderType" variant="outlined" mandatory>
                    <v-btn value="latest">最新发布</v-btn>
                    <v-btn value="popular">最受欢迎</v-btn>
                    <v-btn value="courses">随堂练习</v-btn>
                </v-btn-toggle>
            </div>

            <Loading v-if="!discoverWorksData.success" :error="discoverWorksData.error" />
            <WorkList v-else :works="discoverWorksData.data ? discoverWorksData.data.data : []" />

            <v-pagination v-model="currentPage" :length="totalPages" rounded :total-visible="7" />
        </div>
    </v-container>
</template>

<style scoped></style>
