<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import Header from './Header.vue';
import { getNetworkApiUrl, getNetworkRpcUrl, network } from './network';

const route = useRoute();

// For now just block heights, not hashes.
const blockIdentifier = computed(() => route.params.block_id as string);

type BlockInfo = {
    hash: string;
    height: number;
    timestamp: Date;
    txs: string[];
}
const blockData = reactive({} as Record<string, BlockInfo>);

onMounted(async () => {
    const response = await fetch(`${getNetworkRpcUrl(network.value)}/block?height=${blockIdentifier.value}`);
    const data = (await response.json());
    blockData[blockIdentifier.value] = {
        hash: data.result.block_id.hash,
        height: data.result.block.header.height,
        timestamp: new Date(data.result.block.header.time),
        txs: data.result.block.data.txs,
    }
});

</script>

<template>
    <div class="container m-auto">
        <Header></Header>
        <h1 class="my-4">block #{{ blockIdentifier }}</h1>
        <p>Hash: <code class="font-mono text-sm">{{ blockData?.[blockIdentifier]?.hash }}</code></p>
        <p>Created on {{ blockData?.[blockIdentifier]?.timestamp.toLocaleDateString() }}</p>
        <div class="my-4">
            <h2>Transactions</h2>
            <RouterLink :to="{ name: 'transaction', params: { tx_hash: '???' } }"
                v-if="blockData?.[blockIdentifier]?.txs.length" v-for="tx in blockData[blockIdentifier].txs" :key="tx">
                <p class="break-all"> - Tx ??? (data: {{ tx }})</p>
            </RouterLink>
            <p v-else>No transactions in this block.</p>
        </div>
    </div>
</template>
