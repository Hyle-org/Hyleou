<script setup lang="ts">
import Header from "@/explorer/Header.vue";
</script>

<template>
    <div class="min-h-screen bg-background">
        <Header />
        <main class="container mx-auto px-4 py-6">
            <div class="mb-6">
                <h1 class="text-2xl font-display text-secondary mb-4">All Transactions</h1>
                <p class="text-neutral">Explore all transactions in the Hylé blockchain</p>
            </div>

            <!-- Placeholder Card -->
            <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 border border-white/20">
                <div class="flex flex-col items-center justify-center py-12">
                    <svg class="w-16 h-16 text-primary/20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <h3 class="text-lg font-medium text-secondary mb-2">Coming Soon</h3>
                    <p class="text-neutral text-sm">Transaction history page is under development</p>
                </div>
            </div>
        </main>
    </div>
</template>
