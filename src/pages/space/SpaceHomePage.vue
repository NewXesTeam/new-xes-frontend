<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { commonFetch, useFetchState } from '@/utils';
import type { SpaceIndex } from '@/types/space.ts';
import type { BasicResponse } from '@/types/common.ts';
import Loading from '@/components/common/Loading.vue';
import SmallWorkCard from '@/components/work/SmallWorkCard.vue';
import WorkList from '@/components/work/WorkList.vue';
import UserHorizontalList from '@/components/user/UserHorizontalList.vue';

const route = useRoute();
const router = useRouter();
const spaceIndexData = useFetchState<SpaceIndex>();
const overviewData = ref<[string, number][]>([]);

const fetchData = () => {
    spaceIndexData.value.reset();
    commonFetch<BasicResponse<SpaceIndex>>(`/api/space/index?user_id=${route.params.userId}`)
        .then(data => {
            spaceIndexData.value.resolve(data.data);
        })
        .catch(error => {
            spaceIndexData.value.reject(error.toString());
        });
};

const gotoSpaceWorksPage = () => {
    router.push({
        name: 'space.projects',
        params: route.params,
    });
};

const gotoSpaceFavoritesPage = () => {
    router.push({
        name: 'space.favorites',
        params: route.params,
    });
};

const gotoSpaceSocialFansPage = () => {
    router.push({
        name: 'space.social',
        params: route.params,
        query: {
            type: 'fans',
        },
    });
};

const gotoSpaceSocialFollowsPage = () => {
    router.push({
        name: 'space.social',
        params: route.params,
        query: {
            type: 'follows',
        },
    });
};

watch(
    () => route.params.userId,
    () => {
        console.log('切换 space 页面');
        fetchData();
    },
);

watch(
    () => spaceIndexData.value.completed,
    () => {
        if (!spaceIndexData.value.completed || spaceIndexData.value.error) return;
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
    fetchData();
});
</script>

<template>
    <v-container>
        <Loading v-if="!spaceIndexData.completed || spaceIndexData.error" :error="spaceIndexData.error" />
        <div v-else class="flex flex-col gap-6">
            <v-card :elevation="3">
                <v-card-title>Ta 的成就</v-card-title>
                <v-divider />
                <v-card-text class="flex gap-4 justify-center">
                    <v-card v-for="item in overviewData" variant="outlined" class="w-fit h-fit">
                        <v-card-text class="flex flex-col pr-8">
                            <span style="font-size: 16px">{{ item[0] }}</span>
                            <span style="font-size: 24px">{{ item[1] }}</span>
                        </v-card-text>
                    </v-card>
                    <v-card variant="outlined" class="w-fit h-fit">
                        <v-card-text class="flex flex-col">
                            <span style="font-size: 16px">代表作</span>
                            <span v-if="!spaceIndexData.data.representative_work" style="font-size: 24px"
                                >暂无代表作</span
                            >
                            <SmallWorkCard v-else :work="spaceIndexData.data.representative_work" />
                        </v-card-text>
                    </v-card>
                </v-card-text>
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
                    <v-btn variant="text" append-icon="mdi-arrow-right" @click="gotoSpaceFavoritesPage">
                        查看全部
                    </v-btn>
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
                    <v-btn variant="text" append-icon="mdi-arrow-right" @click="gotoSpaceSocialFansPage">
                        查看全部
                    </v-btn>
                </div>
                <v-divider />
                <UserHorizontalList :users="spaceIndexData.data?.fans.data" />
            </div>

            <div class="flex flex-col gap-2">
                <div class="flex gap-2 items-baseline">
                    <span style="font-size: 24px">TA 的关注</span>
                    <span class="text-neutral-700 dark:text-neutral-300" style="font-size: 16px">
                        ({{ spaceIndexData.data?.follows.total }})
                    </span>
                    <div class="flex-1" />
                    <v-btn variant="text" append-icon="mdi-arrow-right" @click="gotoSpaceSocialFollowsPage">
                        查看全部
                    </v-btn>
                </div>
                <v-divider />
                <UserHorizontalList :users="spaceIndexData.data?.follows.data" />
            </div>
        </div>
    </v-container>
</template>

<style scoped></style>
