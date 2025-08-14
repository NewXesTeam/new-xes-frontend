<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { useAppStore } from '@/stores/app.ts';
import { useRouter } from 'vue-router';
import Loading from '@/components/common/Loading.vue';
import { useFetchData } from '@/utils/index.ts';
import type { SpaceProfile } from '@/types/space.ts';

const store = useAppStore();
const router = useRouter();

const [spaceData, loadSpaceData] = useFetchData<SpaceProfile>(`/api/space/profile?user_id=${store.userInfo?.user_id}`);
const sexName = computed(() => ['男', '女', '未知'][Math.max(Number(store.userInfo?.sex) - 1, 0)]);

watch(
    () => store.loaded,
    loaded => {
        if (!loaded) return;
        if (!store.isLoggedIn) {
            router.push('/login');
            return;
        }

        loadSpaceData();
    },
);

onMounted(() => {
    if (!store.isLoggedIn) return;
    loadSpaceData();
});
</script>

<template>
    <v-container class="flex flex-col gap-2">
        <h1 style="font-size: 36px">个人信息展示页面</h1>
        <v-divider />
        <Loading v-if="!spaceData.success" :error="spaceData.error" />
        <div v-else class="flex flex-col gap-2">
            <div class="flex items-center gap-2">
                <v-avatar :size="128" :image="store.userInfo?.avatar_path" />
                <div class="flex flex-col h-fit">
                    <h2 style="font-size: 24px">{{ store.userInfo?.realname }}</h2>
                    <h3 class="text-rose-600 dark:text-rose-400">
                        Dangerous: 消息中心的“点赞与收藏”部分的api有问题，会返回包括但不限于下面他人不可见的内容。
                    </h3>
                </div>
            </div>
            <v-table>
                <thead>
                    <tr>
                        <th>属性</th>
                        <th>值</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th>用户 ID</th>
                        <th>{{ store.userInfo?.user_id }}</th>
                    </tr>
                    <tr>
                        <th>用户名（他人不可见）</th>
                        <th>{{ store.userInfo?.name }}</th>
                    </tr>
                    <tr>
                        <th>真名</th>
                        <th>{{ store.userInfo?.realname }}</th>
                    </tr>
                    <tr>
                        <th>昵称（他人不可见）</th>
                        <th>{{ store.userInfo?.nickname }}</th>
                    </tr>
                    <tr>
                        <th>英文名（他人不可见）</th>
                        <th>{{ store.userInfo?.en_name }}</th>
                    </tr>
                    <tr>
                        <th>性别</th>
                        <th>{{ sexName }}</th>
                    </tr>
                    <tr>
                        <th>头像 URL</th>
                        <th>{{ store.userInfo?.avatar_path }}</th>
                    </tr>
                    <tr>
                        <th>创建时间（他人不可见）</th>
                        <th>{{ store.userInfo?.create_time }}</th>
                    </tr>
                    <tr>
                        <th>年级名称（他人不可见）</th>
                        <th>{{ store.userInfo?.grade_name }}</th>
                    </tr>
                    <tr>
                        <th>个人签名</th>
                        <th>{{ spaceData.data?.signature }}</th>
                    </tr>
                    <tr>
                        <th>关注数量</th>
                        <th>{{ spaceData.data?.follows }}</th>
                    </tr>
                    <tr>
                        <th>粉丝数量</th>
                        <th>{{ spaceData.data?.fans }}</th>
                    </tr>
                </tbody>
            </v-table>
        </div>
        <span class="block text-center w-full">「国之殇，未敢忘。——尸体的神韵」</span>
    </v-container>
</template>

<style scoped></style>
