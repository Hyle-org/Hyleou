<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';
import Header from './Header.vue';
import { getNetworkRpcUrl, network } from './network';
import { base64ToUint8Array } from '@/indexer';

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

    let hashes = data.result.block.data.txs.map(async (x: any) => {
        const hash = await crypto.subtle.digest("SHA-256", base64ToUint8Array(x));
        return Array.from(new Uint8Array(hash)).map((x: number) => x.toString(16).padStart(2, '0')).join('');
    })
    hashes = await Promise.all(hashes);

    blockData[blockIdentifier.value] = {
        hash: data.result.block_id.hash,
        height: data.result.block.header.height,
        timestamp: new Date(data.result.block.header.time),
        txs: await hashes,
    }
});

</script>

<template>
    <div class="container m-auto">
        <Header></Header>
        <div class="px-4">
            <h1 class="my-4">block #{{ blockIdentifier }}</h1>
            <p>Hash: <code class="font-mono text-sm">{{ blockData?.[blockIdentifier]?.hash }}</code></p>
            <p>Created on {{ blockData?.[blockIdentifier]?.timestamp.toLocaleDateString() }}</p>
            <div class="my-4">
                <h2>Transactions</h2>
                <template v-if="blockData?.[blockIdentifier]?.txs.length" v-for="tx in blockData[blockIdentifier].txs"
                    :key="tx">
                    <RouterLink :to="{ name: 'transaction', params: { tx_hash: `${tx}` } }">
                        <p class="break-all"> - 0x{{ tx }}</p>
                    </RouterLink>
                </template>
                <p v-else>No transactions in this block.</p>
            </div>
        </div>
    </div>
</template>
