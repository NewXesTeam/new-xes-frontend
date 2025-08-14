<template v-once>
    <textarea v-if="mode === 'textarea'" />
    <input v-else />
</template>

<script lang="ts">
// @ts-ignore
import Tagify from '@yaireo/tagify/dist/tagify.esm.js';
import '@yaireo/tagify/dist/tagify.css';

export default {
    name: 'Tagify',
    emits: ['change'],
    props: {
        mode: String,
        settings: Object,
    },
    data() {
        return {
            tagify: null as Tagify | null,
        };
    },
    mounted() {
        this.tagify = new Tagify(this.$el, this.settings);
        this.tagify.off('change').on('change', (event: CustomEvent) => {
            this.$emit('change', event);
        });
    },
};
</script>
