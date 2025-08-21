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
const [spaceFavoritesData, loadSpaceFavoritesData] = useFetchData<SpaceWorks>(
    () => `/api/space/favorites?user_id=${route.params.userId}&page=${currentPage.value}&per_page=20`,
);

watch(
    () => route.params.userId,
    () => {
        console.log('切换 space 页面');
        loadSpaceFavoritesData();
    },
);

watch(currentPage, () => {
    if (spaceFavoritesData.value.completed) {
        loadSpaceFavoritesData();
    }
});

onMounted(() => {
    loadSpaceFavoritesData();
});
</script>

<template>
    <v-container class="flex-1 flex flex-col">
        <div class="flex flex-col gap-2">
            <Loading v-if="!spaceFavoritesData.success" :error="spaceFavoritesData.error" />
            <h2 v-else-if="spaceFavoritesData.data.total < 1" style="font-size: 24px">暂无作品</h2>
            <WorkList v-else :works="spaceFavoritesData.data?.data || []" />

            <v-pagination v-model="currentPage" :length="totalPages" rounded :total-visible="7" />
        </div>
    </v-container>
</template>

<style scoped></style>
