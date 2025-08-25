<script lang="ts" setup>
import { ref, onMounted, watch, computed } from 'vue';
import { commonFetch } from '@/utils';
import type { WorkList as IWorkList } from '@/types/work';
import WorkList from '@/components/work/WorkList.vue';

const currentPage = ref(1);
const orderType = ref('latest');
const orderLang = ref('');

const discoverWorksData = ref<IWorkList | null>(null);
const loadDiscoverWorksData = () => {
    commonFetch<IWorkList>(`/api/works/${orderType.value}?page=${currentPage.value}&lang=${orderLang.value}`)
        .then(data => {
            discoverWorksData.value = data;
        })
        .catch(err => {
            console.error(err);
        });
}
const totalPages = computed(() => Math.max(Math.ceil((discoverWorksData.value ? discoverWorksData.value.total : 0) / 10), 1));

watch(orderType, () => {
    currentPage.value = 1;
    loadDiscoverWorksData();
});

watch(orderLang, () => {
    currentPage.value = 1;
    loadDiscoverWorksData();
});

watch(currentPage, () => {
    if (discoverWorksData.value) {
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
            
            <WorkList :works="discoverWorksData ? discoverWorksData.data : []" />

            <v-pagination v-model="currentPage" :length="totalPages" rounded :total-visible="7" />
        </div>
    </v-container>
</template>

<style scoped></style>
