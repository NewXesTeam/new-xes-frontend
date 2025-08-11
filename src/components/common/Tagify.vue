<template v-once>
    <textarea v-if="mode === 'textarea'" />
    <input v-else>
</template>

<script>
import Tagify from "@yaireo/tagify/dist/tagify.esm.js";
import "@yaireo/tagify/dist/tagify.css";

export default {
    name: "Tags",
    props: {
        mode: String,
        settings: Object,
    },
    mounted() {
        this.tagify = new Tagify(this.$el, this.settings)
        this.tagify.off('change').on('change', event => {
            this.$emit("change", event)
        })
    }
};
</script>
