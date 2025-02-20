<script setup lang="ts">
import Navbar from "@/explorer/components/Navbar.vue";
import { blockStore } from "@/state/data";
import { computed, watchEffect } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const block_hash = computed(() => route.params.block_hash as string);

watchEffect(() => {
    if (!blockStore.value.data[block_hash.value]) {
        blockStore.value.load(block_hash.value);
        blockStore.value.loadTxForBlock(block_hash.value);
    }
});

const data = computed(() => blockStore.value.data?.[block_hash.value]);

const tabs = [
    { name: 'Overview', active: true },
    { name: 'Raw JSON', active: false }
];

const formatTimestamp = (date: Date) => {
    return `${getTimeAgo(date)} (${new Date(date).toLocaleString()})`;
};

function getTimeAgo(date: Date | string | number) {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return `${seconds} secs ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} mins ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
}
</script>

<template>
    <div class="min-h-screen bg-background">
        <Navbar />
        <main class="container mx-auto px-4 py-6">
            <div class="mb-6">
                <h1 class="text-2xl font-display text-secondary mb-4">Block Details</h1>
                <div class="flex gap-2">
                    <button 
                        v-for="tab in tabs" 
                        :key="tab.name"
                        :class="[
                            'px-6 py-2 text-sm font-medium transition-colors rounded-xl',
                            tab.active 
                                ? 'bg-primary/10 text-primary border border-primary/20' 
                                : 'bg-white/80 backdrop-blur-sm border border-white/20 text-secondary hover:bg-secondary/5'
                        ]"
                    >
                        {{ tab.name }}
                    </button>
                </div>
            </div>

            <!-- Basic Info Card -->
            <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 border border-white/20 mb-4">
                <div class="space-y-4">
                    <div class="grid grid-cols-[200px_1fr] gap-4 py-3 border-b border-secondary/5">
                        <span class="text-sm text-neutral">Block Hash:</span>
                        <div class="flex items-center gap-2">
                            <span class="font-mono text-sm text-secondary">{{ block_hash }}</span>
                            <button 
                                class="p-2 text-primary hover:bg-primary/5 rounded-lg transition-colors" 
                                title="Copy to clipboard"
                            >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div class="grid grid-cols-[200px_1fr] gap-4 py-3 border-b border-secondary/5">
                        <span class="text-sm text-neutral">Height:</span>
                        <span class="text-secondary font-medium">#{{ data?.height || '...' }}</span>
                    </div>

                    <div class="grid grid-cols-[200px_1fr] gap-4 py-3 border-b border-secondary/5">
                        <span class="text-sm text-neutral">Parent Block:</span>
                        <div class="flex items-center gap-2">
                            <RouterLink 
                                :to="{ name: 'Block', params: { block_hash: data?.parent_hash } }"
                                class="font-mono text-sm text-primary hover:text-primary/80"
                            >
                                {{ data?.parent_hash }}
                            </RouterLink>
                            <button 
                                class="p-2 text-primary hover:bg-primary/5 rounded-lg transition-colors" 
                                title="Copy to clipboard"
                            >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div class="grid grid-cols-[200px_1fr] gap-4 py-3 border-b border-secondary/5">
                        <span class="text-sm text-neutral">Timestamp:</span>
                        <span class="text-secondary font-medium">{{ data?.timestamp ? formatTimestamp(data.timestamp) : '...' }}</span>
                    </div>

                    <div class="grid grid-cols-[200px_1fr] gap-4 py-3 border-b border-secondary/5">
                        <span class="text-sm text-neutral">Transactions:</span>
                        <span class="text-secondary font-medium">
                            {{ blockStore.tx_hashes_by_block?.[block_hash]?.length || 0 }} transactions
                        </span>
                    </div>
                </div>
            </div>

            <!-- Transactions List -->
            <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 border border-white/20 mb-4">
                <h3 class="text-lg font-medium text-secondary mb-4">Transactions</h3>
                <div class="space-y-2">
                    <RouterLink
                        v-for="tx_hash in blockStore.tx_hashes_by_block?.[block_hash] || []"
                        :key="tx_hash"
                        :to="{ name: 'Transaction', params: { tx_hash } }"
                        class="flex items-center justify-between p-3 hover:bg-secondary/5 rounded-lg transition-colors"
                    >
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                                <span class="text-secondary text-sm">TX</span>
                            </div>
                            <span class="font-mono text-sm text-neutral">{{ tx_hash }}</span>
                        </div>
                        <svg class="w-4 h-4 text-neutral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </RouterLink>
                </div>
            </div>

            <!-- Block Data -->
            <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 border border-white/20">
                <h3 class="text-lg font-medium text-secondary mb-4">Block Data</h3>
                <pre class="bg-secondary/5 p-4 rounded-xl text-xs font-mono text-neutral overflow-x-auto">
{{ JSON.stringify(data, null, 2) }}
                </pre>
            </div>
        </main>
    </div>
</template>

<style scoped>
pre {
    max-height: 400px;
}
</style>
