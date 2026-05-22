<template>
    <Layout>
        <div>
            <component :is="Component" v-bind="$attrs" />
        </div>
    </Layout>
</template>

<script setup lang="ts">
import Layout from '@/components/Layout.vue';
import { markRaw, ref } from 'vue';

const props = defineProps<{
    component: any;
    componentProps?: Record<string, any>;
}>();

const Component = ref(markRaw(props.component));
</script>
