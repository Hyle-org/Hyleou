<script setup lang="ts">
import { copyToClipboard } from "@/state/utils";

defineProps<{
    text: string;
}>();
</script>

<template>
    <button class="copy-button" title="Copy to clipboard" @click="copyToClipboard(text)">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
        </svg>
    </button>
</template>

<style>
.copy-button {
    @apply p-2 text-primary hover:bg-primary/5 rounded-lg transition-colors shrink-0;
}
</style>
