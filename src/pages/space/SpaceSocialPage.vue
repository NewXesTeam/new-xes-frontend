<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { commonFetch, useFetchState } from '@/utils';
import type { BasicResponse } from '@/types/common.ts';
import type { SpaceSocial, SpaceWorks } from '@/types/space.ts';
import Loading from '@/components/common/Loading.vue';
import WorkList from '@/components/work/WorkList.vue';
import UserVerticalList from '@/components/user/UserVerticalList.vue';

const route = useRoute();
const spaceSocialData = useFetchState<SpaceSocial>();

const totalPages = ref(1);
const currentPage = ref(1);
const currentTab = ref('follows');

const fetchData = () => {
    spaceSocialData.value.reset();
    commonFetch<BasicResponse<SpaceSocial>>(`/api/space/${currentTab.value}?user_id=${route.params.userId}&page=${currentPage.value}&per_page=10`)
        .then(data => {
            spaceSocialData.value.resolve(data.data);
            totalPages.value = Math.ceil((spaceSocialData.value.data?.total || 1) / 10);
        })
        .catch(error => {
            spaceSocialData.value.reject(error.toString());
        });
};

watch(
    () => route.params.userId,
    () => {
        console.log('切换 space 页面');
        fetchData();
    },
);

watch(currentTab, () => {
    currentPage.value = 1;
    fetchData();
});

watch(currentPage, () => {
    if (spaceSocialData.value.completed) {
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
                <v-btn-toggle v-model="currentTab" variant="outlined" mandatory>
                    <v-btn value="follows">TA 的关注</v-btn>
                    <v-btn value="fans">TA 的粉丝</v-btn>
                </v-btn-toggle>

                <Loading v-if="!spaceSocialData.completed || spaceSocialData.error" :error="spaceSocialData.error" />
            </div>

            <h2 v-if="spaceSocialData.completed && !spaceSocialData.error && spaceSocialData.data.total < 1" style="font-size: 24px;">暂无作品</h2>
            <UserVerticalList v-else class="w-full" :users="spaceSocialData.data?.data || []" />

            <v-pagination v-model="currentPage" :length="totalPages" rounded :total-visible="7" />
        </div>
    </v-container>
</template>

<style scoped></style>
