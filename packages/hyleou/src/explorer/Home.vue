<script setup lang="ts">
import Header from '@/explorer/Header.vue'
import { computed } from 'vue';
import { blocks } from 'hyle-js';
import { transactionData } from 'hyle-js';
import { contractData } from 'hyle-js';

const contracts = computed(() => Object.keys(contractData));
const transactions = computed(() => Object.values(transactionData));

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
                        <p v-for="block in blocks" :key="block.header.height">
                            <RouterLink :to="{ name: 'block', params: { block_id: block.header.height } }"
                                class="border-none">
                                #{{ block.header.height }} ({{
                            block.num_txs }} txs)
                            </RouterLink>
                        </p>
                        <p style="order: -1">...</p>
                    </div>
                </div>
                <div>
                    <h2>Latest transactions</h2>
                    <div>
                        <RouterLink :to="{ name: 'transaction', params: { tx_hash: tx.hash } }"
                            v-for="tx in transactions" :key="tx.hash">
                            <p>0x<span class="tracking-tighter">{{ tx.hash.slice(0, 5) }}...{{ tx.hash.slice(-5)
                                    }}</span>
                                (block #{{ tx.height }})
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
../../../hyle-js/src/blocks../../../hyle-js/src/transactions