<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import SearchInput from '@/components/SearchInput.vue';
import SearchAllTab from './search/SearchAllTab.vue';
import SearchUserTab from './search/SearchUserTab.vue';
import SearchProjectsTab from './search/SearchProjectsTab.vue';

const route = useRoute();
const keyword = route.query.keyword as string;

const searchTab = ref((route.query.tab as string) || 'all');

watch(searchTab, () => {
    history.pushState(null, '', `/search?keyword=${decodeURIComponent(keyword)}&tab=${searchTab.value}`);
});
</script>

<template>
    <div class="mt-5 flex flex-col items-center">
        <h1 v-if="!keyword">关键字不存在</h1>
        <SearchInput v-else :keyword="keyword" />

        <v-tabs v-model="searchTab" color="primary">
            <v-tab value="all">综合</v-tab>
            <v-tab value="users">作者</v-tab>
            <v-tab value="projects">作品</v-tab>
        </v-tabs>

        <v-divider class="w-full h-[1px]" />
    </div>

    <KeepAlive>
        <SearchAllTab v-if="searchTab === 'all'" :keyword="keyword" />
        <SearchUserTab v-else-if="searchTab === 'users'" :keyword="keyword" />
        <SearchProjectsTab v-else-if="searchTab === 'projects'" :keyword="keyword" />
    </KeepAlive>
</template>

<style scoped></style>
