<script lang="ts" setup>
import { ref, watch } from 'vue';
import SearchInput from '@/components/SearchInput.vue';
import SearchAllTab from '@/components/search/SearchAllTab.vue';
import SearchUserTab from '@/components/search/SearchUserTab.vue';
import SearchProjectsTab from '@/components/search/SearchProjectsTab.vue';

const getSafeUrlParam = (paramName: string): string => {
    try {
        if (!location?.search) return '';
        const params = new URLSearchParams(location.search);
        const value = params.get(paramName) || '';
        return decodeURIComponent(value);
    } catch (e) {
        console.warn(`解析URL参数 ${paramName} 失败`, e);
        return '';
    }
};

const keyword = getSafeUrlParam('keyword');
const searchTab = ref(getSafeUrlParam('tab') || 'all');

watch(
    searchTab,
    newTab => {
        try {
            const newUrl = `/search-center?keyword=${encodeURIComponent(keyword)}&tab=${encodeURIComponent(newTab)}`;
            history.pushState(null, '', newUrl);
        } catch (error) {
            console.error('更新搜索URL失败:', error);
            history.replaceState(null, '', `/search-center?keyword=&tab=all`);
        }
    },
    { immediate: false },
);
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

        <v-divider class="w-full h-px" />
    </div>

    <v-tabs-window v-model="searchTab">
        <v-tabs-window-item value="all">
            <SearchAllTab :keyword="keyword" />
        </v-tabs-window-item>
        <v-tabs-window-item value="users">
            <SearchUserTab :keyword="keyword" />
        </v-tabs-window-item>
        <v-tabs-window-item value="projects">
            <SearchProjectsTab :keyword="keyword" />
        </v-tabs-window-item>
    </v-tabs-window>
</template>

<style scoped></style>
