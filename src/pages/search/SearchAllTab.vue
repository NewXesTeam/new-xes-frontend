<script lang="ts" setup>
import { onMounted, ref, computed, watch } from 'vue';
import { useFetchData } from '@/utils';
import type { SearchAllList } from '@/types/user';
import Loading from '@/components/common/Loading.vue';
import UserWithWorkList from '@/components/user/UserWithWorkList.vue';
import WorkList from '@/components/work/WorkList.vue';

const currentPage = ref(1);
const { keyword } = defineProps<{ keyword: string }>();
const [searchData, loadSearchData] = useFetchData<SearchAllList>(
    () =>
        `/api/search?keyword=${keyword}&search_type=${currentPage.value == 1 ? 'all' : 'works'}&order_type=comprehensive&lang=all&page=${currentPage.value}&per_page=50`,
);
const totalPages = computed(() =>
    Math.max(Math.ceil((searchData.value.data?.total ?? searchData.value.data?.works?.total ?? 0) / 50), 1),
);

watch(currentPage, () => {
    if (searchData.value.completed) {
        loadSearchData();
    }
});

onMounted(() => {
    loadSearchData();
});
</script>

<template>
    <v-container class="flex-1 flex flex-col">
        <div class="flex flex-col gap-2">
            <Loading v-if="!searchData.success" :error="searchData.error" />
            <div v-else-if="currentPage == 1">
                <UserWithWorkList :users="searchData.data?.users?.data ?? []" />
                <v-divider class="my-4" />
                <WorkList :works="searchData.data?.works?.data ?? []" />
            </div>
            <div v-else>
                <WorkList :works="searchData.data?.data ?? []" />
            </div>

            <v-pagination v-model="currentPage" :length="totalPages" rounded :total-visible="7" />
        </div>
    </v-container>
</template>

<style scoped></style>
