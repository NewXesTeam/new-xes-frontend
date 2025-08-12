<script setup lang="ts">
import { VVideo } from 'vuetify/labs/VVideo';
// @ts-ignore
import Tagify from '@/components/common/Tagify.vue';
import { ref } from 'vue';

const tagText = ref();

const handleTagsChange = (event: any) => {
    console.log(event);
    const tags: { value: string }[] = event.detail.tagify.getCleanValue();
    let tag_str = '';
    tags.forEach(tag => {
        tag_str += tag.value.replaceAll(' ', '&nbsp;') + ' ';
    });
    tagText.value = tag_str;
};
</script>

<template>
    <v-container class="flex flex-col gap-4">
        <h2 style="font-size: 24px">v-video 视频播放器 (lab)</h2>
        <v-video src="https://livefile.xesimg.com/programme/python_assets/bceab5f2e467497b410095ccedc7cbfe.mp4" />

        <v-divider />

        <h2 style="font-size: 24px">v-otp-input 验证码输入框</h2>
        <div>
            <v-otp-input type="text" :length="4" class="max-w-fit mx-auto" />
        </div>

        <v-divider />

        <h2 style="font-size: 24px">v-chip-group 纸片选择器</h2>
        <v-chip-group>
            <v-chip>Chip 1</v-chip>
            <v-chip>Chip 2</v-chip>
            <v-chip>Chip 3</v-chip>
        </v-chip-group>

        <v-divider />

        <h2 style="font-size: 24px">tags 标签选择器 (tagify)</h2>
        <span>Result: {{ tagText }}</span>
        <Tagify
            :settings="{
                whitelist: ['游戏', '动画', '故事', '模拟', '艺术', '教程', '其他'],
                placeholder: '添加标签',
                dropdown: { enabled: 0 },
            }"
            @change="handleTagsChange"
        />
    </v-container>
</template>

<style scoped></style>
