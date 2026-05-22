<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useFetchData } from '@/utils';
import type { SpaceIndex } from '@/types/space.ts';
import Loading from '@/components/common/Loading.vue';
import SmallWorkCard from '@/components/work/SmallWorkCard.vue';
import WorkList from '@/components/work/WorkList.vue';
import UserHorizontalList from '@/components/user/UserHorizontalList.vue';

const { userId, setSpaceTab } = defineProps<{
    userId: string;
    setSpaceTab: (tab: string) => void;
}>();
const [spaceIndexData, loadSpaceIndexData] = useFetchData<SpaceIndex>(() => `/api/space/index?user_id=${userId}`);
const overviewData = ref<[string, number][]>([]);

const gotoSpaceWorksPage = () => {
    setSpaceTab('projects');
};

const gotoSpaceFavoritesPage = () => {
    setSpaceTab('favorites');
};

const gotoSpaceSocialPage = () => {
    setSpaceTab('social');
};

watch(
    () => spaceIndexData.value.completed,
    () => {
        if (!spaceIndexData.value.success) return;
        overviewData.value = [
            ['作品总数', spaceIndexData.value.data.overview.works],
            ['被点赞总数', spaceIndexData.value.data.overview.likes],
            ['被浏览总数', spaceIndexData.value.data.overview.views],
            ['被改编总数', spaceIndexData.value.data.overview.source_code_views],
            ['被收藏总数', spaceIndexData.value.data.overview.favorites],
        ];
    },
);

onMounted(() => {
    loadSpaceIndexData();
});
</script>

<template>
    <Loading v-if="!spaceIndexData.success" :error="spaceIndexData.error" />
    <div v-else class="flex flex-col gap-6 mx-5 mt-2">
        <v-card :elevation="3" class="p-6">
            <v-card-title class="text-xl font-semibold">Ta 的成就</v-card-title>
            <v-divider class="my-4" />

            <div class="flex flex-col items-center sm:flex-row gap-6 px-3 py-2">
                <div class="flex-1 flex flex-wrap gap-4">
                    <v-card v-for="item in overviewData" :key="item[0]" variant="outlined" class="flex-1 min-w-35 p-4">
                        <v-card-text class="flex flex-col">
                            <span class="text-sm text-gray-600 dark:text-gray-400">{{ item[0] }}</span>
                            <span class="text-2xl font-bold mt-1">{{ item[1] }}</span>
                        </v-card-text>
                    </v-card>
                </div>

                <v-card variant="outlined" class="w-full sm:w-70 p-4">
                    <v-card-text class="flex flex-col">
                        <span class="text-sm text-gray-600 dark:text-gray-400 mb-2">代表作</span>
                        <span v-if="!spaceIndexData.data.representative_work" class="text-gray-400 text-sm">
                            暂无代表作
                        </span>
                        <SmallWorkCard v-else :work="spaceIndexData.data.representative_work" class="mt-2" />
                    </v-card-text>
                </v-card>
            </div>
        </v-card>

        <div class="flex flex-col gap-2">
            <div class="flex gap-2 items-baseline">
                <span style="font-size: 24px">TA 的作品</span>
                <span class="text-neutral-700 dark:text-neutral-300" style="font-size: 16px">
                    ({{ spaceIndexData.data?.works.total }})
                </span>
                <div class="flex-1" />
                <v-btn variant="text" append-icon="mdi-arrow-right" @click="gotoSpaceWorksPage"> 查看全部 </v-btn>
            </div>
            <v-divider />
            <WorkList :works="spaceIndexData.data?.works.data" />
        </div>

        <div class="flex flex-col gap-2">
            <div class="flex gap-2 items-baseline">
                <span style="font-size: 24px">TA 的收藏</span>
                <span class="text-neutral-700 dark:text-neutral-300" style="font-size: 16px">
                    ({{ spaceIndexData.data?.favorites.total }})
                </span>
                <div class="flex-1" />
                <v-btn variant="text" append-icon="mdi-arrow-right" @click="gotoSpaceFavoritesPage"> 查看全部 </v-btn>
            </div>
            <v-divider />
            <WorkList :works="spaceIndexData.data?.favorites.data" />
        </div>

        <div class="flex flex-col gap-2">
            <div class="flex gap-2 items-baseline">
                <span style="font-size: 24px">TA 的粉丝</span>
                <span class="text-neutral-700 dark:text-neutral-300" style="font-size: 16px">
                    ({{ spaceIndexData.data?.fans.total }})
                </span>
                <div class="flex-1" />
                <v-btn variant="text" append-icon="mdi-arrow-right" @click="gotoSpaceSocialPage"> 查看全部 </v-btn>
            </div>
            <v-divider />
            <UserHorizontalList :users="spaceIndexData.data?.fans.data" />
        </div>

        <div class="flex flex-col gap-2 mb-2">
            <div class="flex gap-2 items-baseline">
                <span style="font-size: 24px">TA 的关注</span>
                <span class="text-neutral-700 dark:text-neutral-300" style="font-size: 16px">
                    ({{ spaceIndexData.data?.follows.total }})
                </span>
                <div class="flex-1" />
                <v-btn variant="text" append-icon="mdi-arrow-right" @click="gotoSpaceSocialPage"> 查看全部 </v-btn>
            </div>
            <v-divider />
            <UserHorizontalList :users="spaceIndexData.data?.follows.data" />
        </div>
    </div>
</template>

<style scoped></style>
