<script setup lang="ts">
import Header from "@/explorer/Header.vue";
import { transactionStore } from "@/state/data";
import { onMounted, ref, computed } from "vue";
import { getTimeAgo } from "@/state/utils";

const currentPage = ref(1);
const pageSize = 10;
const isLoading = ref(false);

// Compute total transactions from latest transactions list
const totalTransactions = computed(() => transactionStore.value.latest.length);

// Compute the current page's transaction range
const pageTransactionRange = computed(() => {
    const startIndex = (currentPage.value - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return { startIndex, endIndex };
});

// Compute the current page's transactions
const currentPageTransactions = computed(() => {
    const { startIndex, endIndex } = pageTransactionRange.value;
    return transactionStore.value.latest.slice(startIndex, endIndex).map((hash) => transactionStore.value.data[hash]);
});

const totalPages = computed(() => Math.ceil(totalTransactions.value / pageSize));

const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
    }
};

// Load latest transactions on mount
onMounted(async () => {
    if (transactionStore.value.latest.length === 0) {
        isLoading.value = true;
        try {
            await transactionStore.value.loadLatest();
        } catch (error) {
            console.error("Failed to load transactions:", error);
        } finally {
            isLoading.value = false;
        }
    }
});
</script>

<template>
    <div class="min-h-screen bg-background">
        <Header />
        <main class="container mx-auto px-4 py-6">
            <div class="mb-6">
                <h1 class="text-2xl font-display text-secondary mb-4">All Transactions</h1>
                <p class="text-neutral">Explore all transactions in the Hylé blockchain</p>
            </div>

            <!-- Transactions List -->
            <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 border border-white/20">
                <div class="space-y-4">
                    <!-- Loading State -->
                    <div v-if="isLoading" class="flex justify-center py-8">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>

                    <!-- Transactions List -->
                    <div v-else class="divide-y divide-secondary/5">
                        <RouterLink
                            v-for="tx in currentPageTransactions"
                            :key="tx.tx_hash"
                            :to="{ name: 'Transaction', params: { tx_hash: tx.tx_hash } }"
                            class="block hover:bg-secondary/5 rounded-lg transition-colors"
                        >
                            <div class="flex items-center py-3 px-4">
                                <div class="flex-1">
                                    <div class="flex items-center justify-between mb-1">
                                        <div class="flex items-center gap-2">
                                            <span class="font-mono text-xs text-neutral">
                                                {{ tx.tx_hash.slice(0, 10) }}...{{ tx.tx_hash.slice(-6) }}
                                            </span>
                                            <span class="text-xs text-primary px-2 py-0.5 bg-primary/5 rounded-full">
                                                {{ tx.transaction_type }}
                                            </span>
                                        </div>
                                        <span class="text-xs text-neutral">{{ getTimeAgo(new Date()) }} (fake)</span>
                                    </div>
                                    <div class="flex items-center justify-between text-xs">
                                        <div class="flex items-center gap-3 text-neutral">
                                            <span
                                                >Block:
                                                <RouterLink
                                                    :to="{ name: 'Block', params: { block_hash: tx.block_hash } }"
                                                    class="text-secondary hover:underline"
                                                >
                                                    {{ tx.block_hash ? `${tx.block_hash.slice(0, 8)}...` : "Pending" }}
                                                </RouterLink>
                                            </span>
                                            <span v-if="tx.blobs"
                                                >Blobs: <span class="text-secondary">{{ tx.blobs.length }}</span></span
                                            >
                                            <span v-if="tx.events"
                                                >Events: <span class="text-secondary">{{ tx.events.length }}</span></span
                                            >
                                        </div>
                                        <span
                                            class="text-xs px-2 py-0.5 rounded-full"
                                            :class="{
                                                'bg-green-50 text-green-600': tx.transaction_status === 'Success',
                                                'bg-red-50 text-red-600': tx.transaction_status !== 'Success',
                                            }"
                                        >
                                            {{ tx.transaction_status }}
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
                            class="px-4 py-2 text-sm font-medium rounded-xl bg-secondary/5 text-secondary hover:bg-secondary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <div class="flex items-center gap-2">
                            <span class="text-sm text-neutral"> Page {{ currentPage }} of {{ totalPages }} </span>
                        </div>
                        <button
                            @click="goToPage(currentPage + 1)"
                            :disabled="currentPage >= totalPages"
                            class="px-4 py-2 text-sm font-medium rounded-xl bg-secondary/5 text-secondary hover:bg-secondary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>
