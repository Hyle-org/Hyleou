<script setup lang="ts">
import Header from "@/explorer/Header.vue";
import { blockStore } from "@/state/data";
import { getNetworkApiUrl, network } from "@/state/network";
import { onMounted, ref, computed, watchEffect } from "vue";
import { useRouter } from 'vue-router';

const router = useRouter();
const blocks = ref<any[]>([]);
const currentPage = ref(1);
const pageSize = 10;
const isLoading = ref(false);
const totalBlocks = ref(0);

// Get the latest block height from the blockStore
const latestBlockHeight = computed(() => {
    if (blockStore.value.latest[0]) {
        return blockStore.value.data[blockStore.value.latest[0]].height;
    }
    return 0;
});

const loadBlocks = async () => {
    isLoading.value = true;
    try {
        const startBlock = latestBlockHeight.value - ((currentPage.value - 1) * pageSize);
        const response = await fetch(
            `${getNetworkApiUrl(network.value)}/v1/indexer/blocks?start_block=${startBlock}&nb_results=${pageSize}&no_cache=${Date.now()}`
        );
        const data = await response.json();
        blocks.value = data;
        
        // Update total blocks based on latest block height
        totalBlocks.value = latestBlockHeight.value;
    } catch (error) {
        console.error('Failed to load blocks:', error);
    } finally {
        isLoading.value = false;
    }
};

const totalPages = computed(() => Math.ceil(totalBlocks.value / pageSize));

const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
        loadBlocks();
    }
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

// Load latest blocks first, then load the paginated blocks
onMounted(async () => {
    // Load latest blocks if not already loaded
    if (blockStore.value.latest.length === 0) {
        await blockStore.value.loadLatest();
    }
    loadBlocks();
});

// Watch for changes in network and reload blocks
watchEffect(() => {
    const currentNetwork = network.value;
    if (blockStore.value.latest.length > 0) {
        loadBlocks();
    }
});
</script>

<template>
    <div class="min-h-screen bg-background">
        <Header />
        <main class="container mx-auto px-4 py-6">
            <div class="mb-6">
                <h1 class="text-2xl font-display text-secondary mb-4">All Blocks</h1>
                <p class="text-neutral">Explore all blocks in the Hylé blockchain</p>
            </div>

            <!-- Blocks List -->
            <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 border border-white/20">
                <div class="space-y-4">
                    <!-- Loading State -->
                    <div v-if="isLoading" class="flex justify-center py-8">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>

                    <!-- Blocks List -->
                    <div v-else class="divide-y divide-secondary/5">
                        <RouterLink
                            v-for="block in blocks"
                            :key="block.hash"
                            :to="{ name: 'Block', params: { block_hash: block.hash } }"
                            class="block hover:bg-secondary/5 rounded-lg transition-colors"
                        >
                            <div class="flex items-center py-3 px-4">
                                <div class="flex-1">
                                    <div class="flex items-center justify-between mb-1">
                                        <div class="flex items-center gap-2">
                                            <span class="text-xs text-primary px-2 py-0.5 bg-primary/5 rounded-full">
                                                Block #{{ block.height }}
                                            </span>
                                            <span class="font-mono text-xs text-neutral">
                                                {{ block.hash.slice(0, 10) }}...{{ block.hash.slice(-6) }}
                                            </span>
                                        </div>
                                        <span class="text-xs text-neutral">{{ getTimeAgo(block.timestamp) }}</span>
                                    </div>
                                    <div class="flex items-center justify-between text-xs">
                                        <div class="flex items-center gap-3 text-neutral">
                                            <span>Parent: <span class="text-secondary font-mono">{{ block.parent_hash.slice(0, 8) }}...</span></span>
                                        </div>
                                        <span class="text-xs px-2 py-0.5 bg-primary/5 text-primary rounded-full">
                                            Finalized
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </RouterLink>
                    </div>

                    <!-- Pagination -->
                    <div class="flex items-center justify-between mt-6 pt-4 border-t border-secondary/5">
                        <button 
                            @click="goToPage(currentPage - 1)"
                            :disabled="currentPage === 1"
                            class="px-4 py-2 text-sm font-medium rounded-xl bg-secondary/5 text-secondary 
                                   hover:bg-secondary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <div class="flex items-center gap-2">
                            <span class="text-sm text-neutral">
                                Page {{ currentPage }} of {{ totalPages }}
                            </span>
                        </div>
                        <button 
                            @click="goToPage(currentPage + 1)"
                            :disabled="currentPage >= totalPages"
                            class="px-4 py-2 text-sm font-medium rounded-xl bg-secondary/5 text-secondary 
                                   hover:bg-secondary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template> 