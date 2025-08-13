<script setup lang="ts">
const { href, rel, target } = defineProps<{ href: string; rel?: string; target?: string }>();
</script>

<template>
    <a class="flex flex-col card-action-area" v-ripple :href="href" :rel="rel" :target="target">
        <div class="area-overlay" />
        <slot />
    </a>
</template>

<style>
@reference "tailwindcss";

.card-action-area {
    @apply rounded;
    position: relative;
    outline: none;
}

.card-action-area > * {
    z-index: 0;
}

.card-action-area > .v-card-title {
    z-index: 2;
}

.card-action-area > .area-overlay {
    @apply rounded;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: currentColor;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
    z-index: 1;
}

.card-action-area:hover > .area-overlay {
    opacity: calc(var(--v-hover-opacity) * var(--v-theme-overlay-multiplier));
}

.card-action-area:focus-visible > .area-overlay {
    opacity: calc(var(--v-focus-opacity) * var(--v-theme-overlay-multiplier));
}

.card-action-area::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    border: 2px solid currentColor;
    border-radius: inherit;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
}

.card-action-area:focus-visible::after {
    opacity: calc(0.25 * var(--v-theme-overlay-multiplier));
}
</style>
