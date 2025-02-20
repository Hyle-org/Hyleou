<script setup lang="ts">
import Header from "@/explorer/Header.vue";
import { transactionStore } from "@/state/data";
import { computed, watchEffect } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const tx_hash = computed(() => route.params.tx_hash as string);

watchEffect(() => {
    if (!transactionStore.value.data[tx_hash.value]) {
        transactionStore.value.load(tx_hash.value);
    }
});

const data = computed(() => transactionStore.value.data?.[tx_hash.value]);

const tabs = [
    { name: 'Overview', active: true },
    { name: 'Raw JSON', active: false }
];

const formatTimestamp = (date: Date) => {
    return `${getTimeAgo(date)} (${date.toLocaleString()})`;
};

function getTimeAgo(date: Date) {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds} secs ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} mins ago`;
    return `${Math.floor(minutes / 60)} hours ago`;
}
</script>

<template>
    <div class="min-h-screen bg-background">
        <Header />
        <main class="container mx-auto px-4 py-6">
            <div class="mb-6">
                <h1 class="text-2xl font-display text-secondary mb-4">Transaction Details</h1>
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
                        <span class="text-sm text-neutral">Transaction Hash:</span>
                        <div class="flex items-center gap-2">
                            <span class="font-mono text-sm text-secondary">{{ tx_hash }}</span>
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
                        <span class="text-sm text-neutral">Block:</span>
                        <RouterLink 
                            :to="{ name: 'Block', params: { block_hash: data?.block_hash } }"
                            class="text-primary hover:text-primary/80 font-medium"
                        >
                            #{{ data?.block_hash?.slice(0, 8) || '...' }}
                        </RouterLink>
                    </div>
<div class="grid grid-cols-[200px_1fr] gap-4 py-3 border-b border-secondary/5">
                        <span class="text-sm text-neutral">Transaction Type:</span>
                        <span class="text-secondary">{{ data?.transaction_type || 'BlobTransaction' }}</span>
                    </div>

                    <div class="grid grid-cols-[200px_1fr] gap-4 py-3 border-b border-secondary/5">
                        <span class="text-sm text-neutral">Status:</span>
                        <div class="flex items-center gap-2">
                            <div class="w-2 h-2 rounded-full" :class="{
                                'bg-green-500': data?.transaction_status === 'Success',
                                'bg-red-500': data?.transaction_status === 'Failed',
                                'bg-yellow-500': !data?.transaction_status
                            }"></div>
                            <span class="text-secondary font-medium">{{ data?.transaction_status || 'Pending' }}</span>
                        </div>
                    </div>

                    <div class="grid grid-cols-[200px_1fr] gap-4 py-3 border-b border-secondary/5">
                        <span class="text-sm text-neutral">Timestamp:</span>
                        <span class="text-secondary">{{ formatTimestamp(new Date()) }}</span>
                    </div>

                </div>
            </div>

            <!-- Transaction Details Card -->
            <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 border border-white/20 mb-4">
                <div class="space-y-4">
                    

                    <div class="grid grid-cols-[200px_1fr] gap-4 py-3 border-b border-secondary/5">
                        <span class="text-sm text-neutral">Version:</span>
                        <span class="text-secondary">{{ data?.version || 1 }}</span>
                    </div>

                    

                    <div class="grid grid-cols-[200px_1fr] gap-4 py-3 border-b border-secondary/5">
                        <span class="text-sm text-neutral">Fee:</span>
                        <span class="text-secondary font-medium">0.02064 HYLE</span>
                    </div>
                </div>
            </div>

            <!-- Transaction Data -->
            <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 border border-white/20">
                <h3 class="text-lg font-medium text-secondary mb-4">Transaction Data</h3>
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
