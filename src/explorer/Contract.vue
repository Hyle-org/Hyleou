<script setup lang="ts">
import Header from "@/explorer/Header.vue";
import { contractStore } from "@/state/data";
import { computed, watchEffect } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const contract_name = computed(() => route.params.contract_name as string);

watchEffect(() => {
    if (!contractStore.value.data[contract_name.value]) {
        contractStore.value.load(contract_name.value);
    }
});

const data = computed(() => contractStore.value.data?.[contract_name.value]);

const tabs = [
    { name: 'Overview', active: true },
    { name: 'Raw JSON', active: false }
];
</script>

<template>
    <div class="min-h-screen bg-background">
        <Header />
        <main class="container mx-auto px-4 py-6">
            <div class="mb-6">
                <h1 class="text-2xl font-display text-secondary mb-4">Contract Details</h1>
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
                        <span class="text-sm text-neutral">Contract Name:</span>
                        <div class="flex items-center gap-2">
                            <span class="font-medium text-secondary">{{ contract_name }}</span>
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
                        <span class="text-sm text-neutral">Transaction Hash:</span>
                        <span class="font-medium text-secondary">{{ data?.tx_hash }}</span>
                    </div>

                    <div class="grid grid-cols-[200px_1fr] gap-4 py-3 border-b border-secondary/5">
                        <span class="text-sm text-neutral">Verifier:</span>
                        <span class="font-medium text-secondary">{{ data?.verifier }}</span>
                    </div>

                    <div class="grid grid-cols-[200px_1fr] gap-4 py-3 border-b border-secondary/5">
                        <span class="text-sm text-neutral">Program ID:</span>
                        <span class="font-medium text-secondary">{{ data?.program_id }}</span>
                    </div>

                    <div class="grid grid-cols-[200px_1fr] gap-4 py-3 border-b border-secondary/5">
                        <span class="text-sm text-neutral">State Digest:</span>
                        <textarea 
                            :value="data?.state_digest"
                            readonly
                            class="font-medium text-secondary bg-transparent resize-y min-h-[24px] overflow-hidden"
                            @click="$event.target.style.height = 'auto'; $event.target.style.height = $event.target.scrollHeight + 'px'"
                        ></textarea>
                    </div>

                    <div class="grid grid-cols-[200px_1fr] gap-4 py-3 border-b border-secondary/5">
                        <span class="text-sm text-neutral">Total Transactions:</span>
                        <span class="text-secondary font-medium">{{ data?.total_transactions || '0' }}</span>
                    </div>
                </div>
            </div>


            <!-- Contract Data -->
            <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 border border-white/20">
                <h3 class="text-lg font-medium text-secondary mb-4">Contract Data</h3>
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
