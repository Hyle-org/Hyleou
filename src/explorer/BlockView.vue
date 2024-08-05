<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Header from './Header.vue';
import { blockStore } from '@/explorer/data';

const route = useRoute();

// For now just block heights, not hashes.
const blockIdentifier = computed(() => route.params.block_id as string);

blockStore.value.loadBlockData(blockIdentifier.value);

const data = computed(() => blockStore.value.blockData[blockIdentifier.value]);
</script>

<template>
    <div class="container m-auto">
        <Header></Header>
        <div class="px-4">
            <h1 class="my-4">block #{{ blockIdentifier }}</h1>
            <p>Hash: <code class="font-mono text-sm">{{ data?.hash }}</code></p>
            <p>Created on {{ data?.timestamp.toLocaleDateString() }}</p>
            <div class="my-4">
                <h2>Transactions</h2>
                <template v-if="data?.txs.length" v-for="tx in data.txs" :key="tx">
                    <RouterLink :to="{ name: 'transaction', params: { tx_hash: `${tx}` } }">
                        <p class="break-all"> - 0x{{ tx }}</p>
                    </RouterLink>
                </template>
                <p v-else>No transactions in this block.</p>
            </div>
        </div>
    </div>
</template>
