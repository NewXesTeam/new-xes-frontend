<script setup lang="ts">
import UserPageWorkCard from '@/components/work/UserPageWorkCard.vue';
import WorkList from '@/components/work/WorkList.vue';
import { useAlertsStore } from '@/stores/alerts';
import { Work, WorkList as IWorkList } from '@/types/work';
import { useFetchData } from '@/utils';
import { computed, onMounted, ref, watch } from 'vue';

const alertsStore = useAlertsStore();

const type = ref('normal');
const lang = ref('projects');
const status = ref('all');
const currentPage = ref(1);
const refreshKey = ref(0);
const [userWorkData, loadUserWorkData] = useFetchData<IWorkList>(() => {
    return `/api/${lang.value}/my?type=${type.value}&published=${status.value}&page=${currentPage.value}&per_page=20`;
});

const totalPages = computed(() =>
    Math.max(Math.ceil((userWorkData.value.data ? userWorkData.value.data.total : 0) / 20), 1),
);

async function handleCancelPublish(work: Work) {
    try {
        await fetch(`/api/${lang.value}/${work.id}/cancel_publish`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                params: {
                    id: work.id,
                },
            }),
        });
        alertsStore.addAlert({
            type: 'success',
            text: '取消发布成功',
            closable: true,
        });
        refreshKey.value++;
    } catch (error) {
        alertsStore.addAlert({
            type: 'error',
            text: '取消发布失败',
            closable: true,
        });
    }
}

watch(type, () => {
    loadUserWorkData();
    currentPage.value = 1;
});
watch(lang, () => {
    loadUserWorkData();
    currentPage.value = 1;
});
watch(status, () => {
    loadUserWorkData();
    currentPage.value = 1;
});
watch(currentPage, () => {
    loadUserWorkData();
});
watch(refreshKey, () => {
    loadUserWorkData();
});
onMounted(() => {
    loadUserWorkData();
});
</script>

<template>
    <v-tabs v-model="type">
        <v-tab value="normal">个人创作</v-tab>
        <v-tab value="homework" v-tooltip:bottom="'（隋唐练习）'">随堂练习</v-tab>
    </v-tabs>
    <v-card class="mb-3 shadow-1">
        <v-card-text>
            <div class="flex gap-4 items-center">
                <span>类型</span>
                <v-tabs v-model="lang">
                    <v-tab value="projects">TurboWarp</v-tab>
                    <v-tab value="python">Python</v-tab>
                    <v-tab value="compilers">C++</v-tab>
                </v-tabs>
            </div>
            <div class="flex gap-4 items-center">
                <span>状态</span>
                <v-tabs v-model="status">
                    <v-tab value="all">全部</v-tab>
                    <v-tab value="0">未发布</v-tab>
                    <v-tab value="2">审核中</v-tab>
                    <v-tab value="1">已发布</v-tab>
                    <v-tab value="removed">已下架</v-tab>
                </v-tabs>
            </div>
        </v-card-text>
    </v-card>

    <WorkList
        :works="(userWorkData.data?.data as unknown as Work[]) || []"
        enable-removed
        :-work-card-interface="UserPageWorkCard"
        @cancel-publish="handleCancelPublish"
        refresh-key="refreshKey"
    />

    <v-pagination v-model="currentPage" :length="totalPages" rounded :total-visible="7" />
</template>

<style scoped></style>
