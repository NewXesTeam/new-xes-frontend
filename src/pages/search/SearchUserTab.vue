<script lang="ts" setup>
import { onMounted, ref, computed, watch } from 'vue';
import { useFetchData } from '@/utils';
import type { SearchUserList } from '@/types/user';
import UserWithWorkList from '@/components/user/UserWithWorkList.vue';
import Loading from '@/components/common/Loading.vue';

const currentPage = ref(1);
const { keyword } = defineProps<{ keyword: string }>();
const [searchUserList, loadSearchUserList] = useFetchData<SearchUserList>(
    () => `/api/search?keyword=${keyword}&search_type=users&page=${currentPage.value}&per_page=10`,
);
const totalPages = computed(() => Math.max(Math.ceil((searchUserList.value.data?.total ?? 0) / 10), 1));

watch(currentPage, () => {
    if (searchUserList.value.completed) {
        loadSearchUserList();
    }
});

onMounted(() => {
    loadSearchUserList();
});
</script>

<template>
    <v-container class="flex-1 flex flex-col">
        <Loading v-if="!searchUserList.success" :error="searchUserList.error" />
        <h2 v-else-if="searchUserList.success && searchUserList.data.total < 1" style="font-size: 24px">暂无数据</h2>
        <UserWithWorkList v-else class="w-full" :users="searchUserList.data?.data || []" />

        <v-pagination v-model="currentPage" :length="totalPages" rounded :total-visible="7" />
    </v-container>
</template>

<style scoped></style>
