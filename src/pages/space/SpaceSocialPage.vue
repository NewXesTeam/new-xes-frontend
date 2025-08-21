<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useFetchData } from '@/utils';
import type { SpaceSocial } from '@/types/space.ts';
import Loading from '@/components/common/Loading.vue';
import UserVerticalList from '@/components/user/UserVerticalList.vue';

const route = useRoute();
const totalPages = ref(1);
const currentPage = ref(1);
const currentTab = ref('follows');
const [spaceSocialData, loadSpaceSocialData] = useFetchData<SpaceSocial>(() => `/api/space/${currentTab.value}?user_id=${route.params.userId}&page=${currentPage.value}&per_page=10`);

watch(
    () => route.params.userId,
    () => {
        console.log('切换 space 页面');
        loadSpaceSocialData();
    },
);

watch(currentTab, () => {
    currentPage.value = 1;
    loadSpaceSocialData();
});

watch(currentPage, () => {
    if (spaceSocialData.value.completed) {
        loadSpaceSocialData();
    }
});

onMounted(() => {
    loadSpaceSocialData();
});
</script>

<template>
    <v-container class="flex-1 flex flex-col">
        <div class="flex flex-col gap-2">
            <div class="flex justify-between">
                <v-btn-toggle v-model="currentTab" variant="outlined" mandatory>
                    <v-btn value="follows">TA 的关注</v-btn>
                    <v-btn value="fans">TA 的粉丝</v-btn>
                </v-btn-toggle>

                <Loading v-if="!spaceSocialData.success" :error="spaceSocialData.error" />
            </div>

            <h2
                v-if="spaceSocialData.success && spaceSocialData.data.total < 1"
                style="font-size: 24px"
            >
                暂无作品
            </h2>
            <UserVerticalList v-else class="w-full" :users="spaceSocialData.data?.data || []" />

            <v-pagination v-model="currentPage" :length="totalPages" rounded :total-visible="7" />
        </div>
    </v-container>
</template>

<style scoped></style>
