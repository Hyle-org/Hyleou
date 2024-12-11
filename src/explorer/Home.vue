<script setup lang="ts">
import Header from "@/explorer/Header.vue";
import { blockStore, transactionStore } from "@/state/data";
</script>

<template>
    <div class="container m-auto">
        <Header></Header>
        <div class="px-4">
            <div class="grid grid-cols-2 gap-4">
                <div class="bg-white p-4 text-gray-700 rounded-xl">
                    <h2>Latest blocks</h2>
                    <hr />
                    <div class="flex flex-col">
                        <div v-for="block in blockStore.blocks">
                            <h4>Block {{ block.height }}</h4>
                            <p class="whitespace-pre font-mono text-xs">{{ block.hash }}</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white p-4 text-gray-700 rounded-xl">
                    <h2>Latest transactions</h2>
                    <hr />
                    <div class="flex flex-col">
                        <div v-for="tx_hash in transactionStore.latest_transactions" :key="tx_hash">
                            <h4>TX 0x{{ tx_hash }}</h4>
                            <p class="whitespace-pre font-mono text-xs">
                                {{ transactionStore.transaction[tx_hash].transaction_type }} ({{
                                    transactionStore.transaction[tx_hash].transaction_status
                                }})
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
hr {
    @apply my-2;
}
</style>
