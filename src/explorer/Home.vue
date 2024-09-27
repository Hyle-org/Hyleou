<script setup lang="ts">
import Header from "@/explorer/Header.vue";
import { computed } from "vue";

import { blockStore, contractsStore, transactionsStore } from "@/explorer/data";

const contracts = computed(() => Object.keys(contractsStore.value.contractData));
const transactions = computed(() => Object.values(transactionsStore.value.transactionData));
</script>

<template>
    <div class="container m-auto">
        <Header></Header>
        <div class="px-4">
            <h1 class="my-4">Explorer</h1>
            <div class="my-2">
                <h2>Contracts</h2>
                <div>
                    <router-link :to="{ name: 'contract', params: { contract_name: contract } }"
                        v-for="contract in contracts" :key="contract">
                        <p>- {{ contract }}</p>
                    </router-link>
                    <p v-if="contracts.length === 0">No contracts found.</p>
                </div>
            </div>
            <div class="grid grid-cols-2">
                <div>
                    <h2>Latest blocks</h2>
                    <div class="flex flex-col-reverse">
                        <p v-for="block in blockStore.blocks" :key="block.height">
                            <RouterLink :to="{ name: 'block', params: { block_id: block.height } }" class="border-none">
                                #{{ block.height }} ({{ block.txs.length }} txs)
                            </RouterLink>
                        </p>
                        <p style="order: -1">...</p>
                    </div>
                </div>
                <div>
                    <h2>Latest transactions</h2>
                    <div>
                        <RouterLink :to="{ name: 'transaction', params: { tx_hash: tx.tx_hash } }"
                            v-for="tx in transactions" :key="tx.tx_hash">
                            <p>
                                0x<span class="tracking-tighter">{{ tx.tx_hash.slice(0, 5) }}...{{ tx.tx_hash.slice(-5)
                                    }}</span> (block #{{
                                        tx.block_height
                                    }})
                            </p>
                        </RouterLink>
                        <p>...</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
