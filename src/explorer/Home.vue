<script setup lang="ts">
import Header from "@/explorer/Header.vue";
import { blockStore, contractStore, transactionStore, proofStore } from "@/state/data";
import { getNetworkNodeApiUrl, network } from "@/state/network";
import { onMounted, ref, computed } from "vue";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import NetworkChart from "@/explorer/components/NetworkChart.vue";
import { useRouter } from "vue-router";
import { getTimeAgo } from "@/state/utils";

const router = useRouter();
const searchQuery = ref("");

const consensusInfo = ref<null | { validators: string[] }>(null);
const fetchConsensusInfo = async () => {
    const response = await fetch(getNetworkNodeApiUrl(network.value) + `/v1/consensus/info?no_cache=${Date.now()}`);
    consensusInfo.value = await response.json();
};
onMounted(() => {
    fetchConsensusInfo();
});

// Compute average block time from the latest blocks
const averageBlockTime = computed(() => {
    if (blockStore.value.latest.length < 2) return 0.5; // Default value if not enough blocks

    let totalTime = 0;
    let count = 0;

    // Calculate time differences between consecutive blocks
    for (let i = 0; i < blockStore.value.latest.length - 1; i++) {
        const currentBlock = blockStore.value.data[blockStore.value.latest[i]];
        const nextBlock = blockStore.value.data[blockStore.value.latest[i + 1]];

        if (currentBlock && nextBlock) {
            const timeDiff = new Date(currentBlock.timestamp).getTime() - new Date(nextBlock.timestamp).getTime();
            totalTime += timeDiff / 1000; // Convert to seconds
            count++;
        }
    }

    return count > 0 ? (totalTime / count).toFixed(2) : 0.5;
});

// Mock search function
const handleSearch = () => {
    const query = searchQuery.value.trim();

    if (query.match(/^[0-9]+$/)) {
        // Search by block height
        router.push({ name: "Block", params: { block_hash: query } });
    } else if (query.length === 64) {
        // Search by transaction hash
        router.push({ name: "Transaction", params: { tx_hash: query } });
    } else if (query) {
        // Search by contract name
        router.push({ name: "Contract", params: { contract_name: query } });
    }
};

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// TODO: real data
const transactionChartData = {
    labels: ["6h ago", "5h ago", "4h ago", "3h ago", "2h ago", "1h ago", "Now"],
    datasets: [
        {
            label: "Transactions per Hour",
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: true,
            borderColor: "#DF6445",
            backgroundColor: "rgba(223, 100, 69, 0.1)",
            tension: 0.4,
        },
    ],
};

// TODO: real data
const blockTimeChartData = {
    labels: ["6h ago", "5h ago", "4h ago", "3h ago", "2h ago", "1h ago", "Now"],
    datasets: [
        {
            label: "Block Time (seconds)",
            data: [0.5, 0.48, 0.52, 0.49, 0.51, 0.47, 0.5],
            fill: true,
            borderColor: "#DF6445",
            backgroundColor: "rgba(223, 100, 69, 0.1)",
            tension: 0.4,
        },
    ],
};
</script>

<template>
    <div class="min-h-screen bg-background">
        <Header />
        <div class="container mx-auto px-4 py-12">
            <div class="mb-12 max-w-4xl mx-auto text-center">
                <h1 class="text-4xl font-display text-secondary mb-3">Explore Hylé</h1>
                <p class="text-neutral text-lg mb-8">Search transactions, explore blocks, or discover smart contracts</p>
                <!-- Search bar -->
                <div class="relative bg-white/40 backdrop-blur-md rounded-2xl shadow-lg p-2">
                    <input
                        v-model="searchQuery"
                        type="search"
                        placeholder="Search by block height, transaction hash, or contract name..."
                        class="w-full bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl py-4 pl-12 pr-16 text-secondary placeholder-neutral/50 focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium transition-all duration-200 text-lg"
                        @keyup.enter="handleSearch"
                        @keydown.meta.k.prevent="($event.target as HTMLInputElement).focus()"
                        @keydown.ctrl.k.prevent="($event.target as HTMLInputElement).focus()"
                    />
                    <button
                        @click="handleSearch"
                        class="absolute right-4 top-1/2 -translate-y-1/2 p-3 group hover:bg-primary/10 rounded-lg transition-all duration-300"
                    >
                        <svg
                            class="w-6 h-6 text-primary transition-transform duration-300 group-hover:scale-110"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </button>
                </div>
            </div>
            <main class="container mx-auto px-4 py-6">
                <!-- Stats Overview -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 border border-white/20">
                        <div class="flex items-center gap-3 mb-2">
                            <svg class="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <h3 class="text-sm font-medium text-neutral uppercase">Total Transactions</h3>
                        </div>
                        <p class="text-3xl font-display text-primary mb-2">{{ transactionStore.latest.length || "156,042" }}</p>
                        <div class="grid grid-cols-2 gap-2 text-xs text-neutral">
                            <div>24H Tx: <span class="text-secondary">15,231 (fake)</span></div>
                            <div>TPS: <span class="text-secondary">23.5 (fake)</span></div>
                        </div>
                    </div>

                    <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 border border-white/20">
                        <div class="flex items-center gap-3 mb-2">
                            <svg class="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                />
                            </svg>
                            <h3 class="text-sm font-medium text-neutral uppercase">Current Block</h3>
                        </div>
                        <p class="text-3xl font-display text-primary mb-2">
                            #{{ blockStore.latest[0] ? blockStore.data[blockStore.latest[0]].height : "37,382" }}
                        </p>
                        <div class="grid grid-cols-2 gap-2 text-xs text-neutral">
                            <div>
                                Avg Time: <span class="text-secondary">{{ averageBlockTime }}s</span>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 border border-white/20">
                        <div class="flex items-center gap-3 mb-2">
                            <svg class="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                />
                            </svg>
                            <h3 class="text-sm font-medium text-neutral uppercase">Smart Contracts</h3>
                        </div>
                        <p class="text-3xl font-display text-primary mb-2">{{ Object.keys(contractStore.data).length || "8" }}</p>
                        <div class="grid grid-cols-2 gap-2 text-xs text-neutral">
                            <div>24H New: <span class="text-secondary">2 (fake)</span></div>
                            <div>Active: <span class="text-secondary">6 (fake)</span></div>
                        </div>
                    </div>

                    <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 border border-white/20">
                        <div class="flex items-center gap-3 mb-2">
                            <svg class="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                            <h3 class="text-sm font-medium text-neutral uppercase">Network</h3>
                        </div>
                        <p class="text-3xl font-display text-primary capitalize mb-2">{{ network }}</p>
                        <div class="grid grid-cols-2 gap-2 text-xs text-neutral">
                            <div>
                                Validators: <span class="text-secondary">{{ consensusInfo?.validators?.length || 1 }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Charts Section -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <NetworkChart :data="transactionChartData" title="Transaction Volume" />
                    <NetworkChart :data="blockTimeChartData" title="Average Block Time" />
                </div>

                <!-- Main Content -->
                <div class="grid gap-6 md:grid-cols-2">
                    <!-- Latest Blocks -->
                    <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 border border-white/20">
                        <div class="flex items-center justify-between mb-4">
                            <h2 class="text-lg font-medium text-secondary">Latest Blocks</h2>
                            <span class="text-xs bg-secondary/5 px-3 py-1 rounded-full text-neutral">
                                Height {{ blockStore.latest[0] ? blockStore.data[blockStore.latest[0]].height : "37,382" }}
                            </span>
                        </div>
                        <div class="divide-y divide-secondary/5">
                            <RouterLink
                                v-for="hash in blockStore.latest"
                                :key="hash"
                                :to="{ name: 'Block', params: { block_hash: hash } }"
                                class="block hover:bg-secondary/5 rounded-lg transition-colors"
                            >
                                <div class="flex items-center py-3 px-4">
                                    <div class="flex-1">
                                        <div class="flex items-center justify-between mb-1">
                                            <div class="flex items-center gap-2">
                                                <span class="text-xs text-primary px-2 py-0.5 bg-primary/5 rounded-full">
                                                    Block #{{ blockStore.data[hash].height }}
                                                </span>
                                                <span class="font-mono text-xs text-neutral"
                                                    >{{ hash.slice(0, 10) }}...{{ hash.slice(-6) }}</span
                                                >
                                            </div>
                                            <span class="text-xs text-neutral">{{ getTimeAgo(blockStore.data[hash].timestamp) }}</span>
                                        </div>
                                        <div class="flex items-center justify-between text-xs">
                                            <div class="flex items-center gap-3 text-neutral">
                                                <span
                                                    >Transactions:
                                                    <span class="text-secondary">{{
                                                        transactionStore.transactionsByBlock?.[hash]?.length || "..."
                                                    }}</span></span
                                                >
                                                <span>Size: <span class="text-secondary">24.5 KB (fake)</span></span>
                                            </div>
                                            <span class="text-xs px-2 py-0.5 bg-primary/5 text-primary rounded-full">
                                                Finalized (fake)
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </RouterLink>
                        </div>
                        <RouterLink
                            :to="{ name: 'Blocks' }"
                            class="w-full mt-4 py-2 px-4 rounded-xl bg-secondary/5 text-secondary hover:bg-secondary/10 transition-colors text-sm block text-center"
                        >
                            View All Blocks
                        </RouterLink>
                    </div>

                    <div class="flex flex-col gap-6">
                        <!-- Latest Transactions -->
                        <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 border border-white/20">
                            <div class="flex items-center justify-between mb-4">
                                <h2 class="text-lg font-medium text-secondary">Latest Transactions</h2>
                                <span class="text-xs bg-secondary/5 px-3 py-1 rounded-full text-neutral">
                                    {{ transactionStore.latest.length || "15" }} recent
                                </span>
                            </div>
                            <div class="divide-y divide-secondary/5">
                                <RouterLink
                                    v-for="tx_hash in transactionStore.latest"
                                    :key="tx_hash"
                                    :to="{ name: 'Transaction', params: { tx_hash } }"
                                    class="block hover:bg-secondary/5 rounded-lg transition-colors"
                                >
                                    <div class="flex items-center py-3 px-4">
                                        <div class="flex-1">
                                            <div class="flex items-center justify-between mb-1">
                                                <div class="flex items-center gap-2">
                                                    <span class="font-mono text-xs text-neutral"
                                                        >{{ tx_hash.slice(0, 10) }}...{{ tx_hash.slice(-6) }}</span
                                                    >
                                                    <span class="text-xs text-primary px-2 py-0.5 bg-primary/5 rounded-full">
                                                        {{ transactionStore.data[tx_hash].transaction_type }}
                                                    </span>
                                                </div>
                                                <span class="text-xs text-neutral">{{ getTimeAgo(new Date()) }} (fake)</span>
                                            </div>
                                            <div class="flex items-center justify-between text-xs">
                                                <div class="flex items-center gap-3 text-neutral">
                                                    <span>Sender: <span class="text-secondary font-mono">(unknown)</span></span>
                                                </div>
                                                <span class="text-xs px-2 py-0.5 bg-green-50 text-green-600 rounded-full">
                                                    {{ transactionStore.data[tx_hash].transaction_status }}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </RouterLink>
                            </div>
                            <RouterLink
                                :to="{ name: 'Transactions' }"
                                class="w-full mt-4 py-2 px-4 rounded-xl bg-secondary/5 text-secondary hover:bg-secondary/10 transition-colors text-sm block text-center"
                            >
                                View All Transactions
                            </RouterLink>
                        </div>

                        <!-- Latest Proofs -->
                        <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 border border-white/20">
                            <div class="flex items-center justify-between mb-4">
                                <h2 class="text-lg font-medium text-secondary">Latest Proofs</h2>
                                <span class="text-xs bg-secondary/5 px-3 py-1 rounded-full text-neutral">
                                    {{ proofStore.latest.length || "0" }} recent
                                </span>
                            </div>
                            <div class="divide-y divide-secondary/5">
                                <RouterLink
                                    v-for="proof_hash in proofStore.latest.slice(0, 5)"
                                    :key="proof_hash"
                                    :to="{ name: 'Transaction', params: { tx_hash: proof_hash } }"
                                    class="block hover:bg-secondary/5 rounded-lg transition-colors"
                                >
                                    <div class="flex items-center py-3 px-4">
                                        <div class="flex-1">
                                            <div class="flex items-center justify-between mb-1">
                                                <div class="flex items-center gap-2">
                                                    <span class="font-mono text-xs text-neutral">
                                                        {{ proof_hash.slice(0, 10) }}...{{ proof_hash.slice(-6) }}
                                                    </span>
                                                    <span class="text-xs text-primary px-2 py-0.5 bg-primary/5 rounded-full">
                                                        {{ proofStore.data[proof_hash].transaction_type }}
                                                    </span>
                                                </div>
                                            </div>
                                            <div class="flex items-center justify-between text-xs">
                                                <div class="flex items-center gap-3 text-neutral">
                                                    <span
                                                        >Block:
                                                        <RouterLink
                                                            :to="{
                                                                name: 'Block',
                                                                params: { block_hash: proofStore.data[proof_hash].block_hash },
                                                            }"
                                                            class="text-secondary hover:underline"
                                                        >
                                                            {{ proofStore.data[proof_hash].block_hash.slice(0, 8) }}...
                                                        </RouterLink>
                                                    </span>
                                                </div>
                                                <span
                                                    class="text-xs px-2 py-0.5 rounded-full"
                                                    :class="{
                                                        'bg-green-50 text-green-600':
                                                            proofStore.data[proof_hash].transaction_status === 'Success',
                                                        'bg-red-50 text-red-600':
                                                            proofStore.data[proof_hash].transaction_status !== 'Success',
                                                    }"
                                                >
                                                    {{ proofStore.data[proof_hash].transaction_status }}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </RouterLink>
                            </div>
                            <RouterLink
                                :to="{ name: 'Proofs' }"
                                class="w-full mt-4 py-2 px-4 rounded-xl bg-secondary/5 text-secondary hover:bg-secondary/10 transition-colors text-sm block text-center"
                            >
                                View All Proofs
                            </RouterLink>
                        </div>
                    </div>

                    <!-- Smart Contracts - Full Width -->
                    <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 border border-white/20 md:col-span-2">
                        <div class="flex items-center justify-between mb-4">
                            <h2 class="text-lg font-medium text-secondary">Smart Contracts</h2>
                            <span class="text-xs bg-secondary/5 px-3 py-1 rounded-full text-neutral">
                                {{ Object.keys(contractStore.data).length }} total
                            </span>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            <RouterLink
                                v-for="contract_name in Object.keys(contractStore.data)"
                                :key="contract_name"
                                :to="{ name: 'Contract', params: { contract_name } }"
                                class="flex items-center p-2 hover:bg-secondary/5 rounded-lg transition-colors"
                            >
                                <div class="w-2 h-2 bg-primary rounded-full mr-3"></div>
                                <span class="text-secondary font-medium">{{ contract_name }}</span>
                            </RouterLink>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>

<style scoped>
hr {
    @apply my-2;
}
</style>
