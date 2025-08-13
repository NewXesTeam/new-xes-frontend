<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAppStore } from '@/stores/app.ts';
import { useFetchData } from '@/utils';
import Loading from '@/components/common/Loading.vue';
import type { SpaceProfile } from '@/types/space.ts';

const store = useAppStore();
const route = useRoute();
const router = useRouter();
const userId = route.params.userId as string;
const spaceData = useFetchData<SpaceProfile>(`/api/space/profile?user_id=${userId}`);

const spaceTab = ref(route.meta.space || 'home');
const isUserFollowed = ref(false);
const isChangingSignature = ref(false);
const signatureInput = ref("");

watch(() => store.loaded, loaded => {
    if (!loaded || !(userId === 'my'))
        return;

    router.push({
        name: route.name,
        params: {
            userId: store.userInfo?.user_id
        }
    })
})

watch(() => spaceData.value.completed, completed => {
    if (!spaceData.value.completed || spaceData.value.error)
        return;
    isUserFollowed.value = spaceData.value.data.is_follow;
})

watch(spaceTab, newTab => {
    router.push({
        name: `space.${newTab}`,
        params: route.params,
    })
})
</script>

<template>
    <v-container v-if="!spaceData.completed || spaceData.error">
        <Loading :error="spaceData.error" />
    </v-container>

    <div v-else class="flex flex-col gap-2">
        <v-container class="flex flex-col gap-2">
            <div class="flex gap-2 items-center">
                <v-avatar :size="128" :image="spaceData.data?.avatar_path" />
                <div class="flex flex-1 flex-col gap-1">
                    <div class="flex items-baseline">
                        <h2 style="font-size: 24px;">{{ spaceData.data?.realname }}</h2>
                        <span class="text-neutral-700" style="font-size: 16px">
                        ({{ spaceData.data?.user_id }})
                    </span>
                    </div>

                    <v-text-field
                        v-if="isChangingSignature"
                        class="signature-input max-w-[500px]"
                        variant="outlined"
                        :hide-details="true"
                        v-model="signatureInput"
                    />

                    <div v-else class="flex items-center">
                    <span style="font-size: 16px">
                        {{ spaceData.data?.signature }}
                    </span>

                        <v-btn
                            v-if="spaceData.data?.is_my"
                            size="small"
                            variant="outlined"
                            color="primary"
                        >
                            修改签名
                        </v-btn>
                    </div>

                    <span style="font-size: 16px">
                    关注：{{ spaceData.data?.follows }} &nbsp; 粉丝：{{ spaceData.data?.fans }}
                </span>
                </div>
                <div class="flex flex-col h-fit">
                    <v-btn
                        v-if="!spaceData.data?.is_my"
                        :variant="isUserFollowed ? 'outlined' : undefined"
                        :color="isUserFollowed ? 'secondary' : 'primary'"
                    >
                        {{ isUserFollowed ? '已关注' : '关注' }}
                    </v-btn>
                </div>
            </div>
        </v-container>

        <div class="flex flex-col items-center">
            <v-tabs v-model="spaceTab" color="primary">
                <v-tab value="home">主页</v-tab>
                <v-tab value="cover">封面</v-tab>
                <v-tab value="projects">作品</v-tab>
                <v-tab value="favorites">收藏</v-tab>
                <v-tab value="social">社交</v-tab>
            </v-tabs>

            <v-divider />
        </div>

        <slot />
    </div>
</template>

<style>
/* 奇妙 智慧 Cascading Style Sheets（ */
.signature-input.signature-input input {
    --field-padding-x: 4px;
    --field-padding-y: 8px;

    --v-field-input-padding-top: var(--field-padding-x);
    --v-field-input-padding-bottom: var(--field-padding-x);
    --v-input-padding-top: var(--field-padding-x);
    --v-field-padding-bottom: var(--field-padding-x);
    --v-field-padding-start: var(--field-padding-y);
    --v-field-padding-end: var(--field-padding-y);
    --v-input-control-height: calc(24px + var(--v-input-padding-top) + var(--v-field-padding-bottom));
}
</style>
