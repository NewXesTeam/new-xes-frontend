<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useFetchData } from '@/utils';
import type { SpaceWorks } from '@/types/space.ts';
import Loading from '@/components/common/Loading.vue';
import WorkList from '@/components/work/WorkList.vue';

const { userId } = defineProps<{ userId: string }>();
const currentPage = ref(1);
const [spaceFavoritesData, loadSpaceFavoritesData] = useFetchData<SpaceWorks>(
    () => `/api/space/favorites?user_id=${userId}&page=${currentPage.value}&per_page=20`,
);
const totalPages = computed(() => Math.max(Math.ceil((spaceFavoritesData.value.data?.total ?? 0) / 20), 1));

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
    <div class="flex flex-col gap-2">
        <Loading v-if="!spaceFavoritesData.success" :error="spaceFavoritesData.error" />
        <h2 v-else-if="spaceFavoritesData.data.total < 1" style="font-size: 24px">暂无作品</h2>
        <WorkList v-else :works="spaceFavoritesData.data?.data || []" />

        <v-pagination v-model="currentPage" :length="totalPages" rounded :total-visible="7" />
    </div>
</template>

<style scoped></style>
