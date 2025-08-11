<!-- SearchInput bug: 按下按键不放会明显卡顿，不管了 -->

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { computed, ref, watch } from 'vue';
import type { AssociateWord } from '@/types/common.ts';
import { debounce } from 'lodash';
import { commonFetch } from '@/utils.ts';

const router = useRouter();
const inputKeyword = ref('');
const suggestions = ref<AssociateWord[]>([]);
const autocompleteSelects = computed(() => {
    return suggestions.value.map(item => item.word.replaceAll("<em>", "").replaceAll("</em>", "").trim());
});
const selectedSuggestion = ref('');
const isLoading = ref(false);

const onChangeSearch = debounce((query: string) => {
    if (!query) return;
    isLoading.value = true;
    commonFetch<AssociateWord[]>(`/api/search/associate_words?keyword=${inputKeyword.value}`)
        .then(data => {
            suggestions.value = data.data;
        })
        .catch(error => {
            suggestions.value = [];
            console.error("拉取建议词时出错：", error)
        })
        .finally(() => {
            isLoading.value = false;
        });
}, 300);

watch(inputKeyword, () => {
    onChangeSearch(inputKeyword.value.trim());
});

watch(selectedSuggestion, () => {
    if (!selectedSuggestion.value) return;
    inputKeyword.value = '';
    console.log("Go Search > ", selectedSuggestion.value);
    // router.push(`/search?keyword=${encodeURIComponent(selectedSuggestion.value)}`)
})
</script>

<template>
    <v-autocomplete
        v-model="selectedSuggestion"
        v-model:search="inputKeyword"
        class="w-64"
        placeholder="搜索..."
        role="search"
        name="keyword"
        hide-details
        auto-select-first
        clearable
        prepend-inner-icon="mdi-magnify"
        menu-icon=""
        density="comfortable"
        :items="autocompleteSelects"
        :loading="isLoading"
    >
        <template v-slot:no-data>
            <v-list-item>
                <v-list-item-title>未找到相关结果</v-list-item-title>
            </v-list-item>
        </template>
    </v-autocomplete>
</template>

<style scoped></style>
