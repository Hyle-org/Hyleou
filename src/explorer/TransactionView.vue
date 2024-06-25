<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import Header from './Header.vue';
import { getNetworkApiUrl, getNetworkRpcUrl, network } from './network';

const route = useRoute();

const txHash = computed(() => route.params.tx_hash as string);

type TransactionInfo = {
    hash: string;
    height: number;
    status: 'success' | 'failure';
    rawData: string;
    rawFullTxData: string;
}
const transactionData = reactive({} as Record<string, TransactionInfo>);

onMounted(async () => {
    const response = await fetch(`${getNetworkRpcUrl(network.value)}/tx?hash=0x${txHash.value}`);
    const data = (await response.json());
    transactionData[txHash.value] = {
        hash: data.result.hash,
        height: data.result.height,
        status: data.result.tx_result.code === 0 ? 'success' : 'failure',
        rawData: data.result.tx,
        rawFullTxData: JSON.stringify(data.result, null, 2),
    }
});

</script>

<template>
    <div class="container m-auto">
        <Header></Header>
        <h1 class="my-4">Transaction 0x{{ txHash }}</h1>
        <p>Settled in <RouterLink
                :to="{ name: 'block', params: { block_id: transactionData?.[txHash]?.height || '0' } }">block
                #{{ transactionData?.[txHash]?.height }}</RouterLink>
        </p>
        <p>Status: <span v-if="transactionData?.[txHash]?.status === 'success'" class="text-green-500">Success</span>
            <span v-else class="text-red-500">Failure</span>
        </p>
        <p>Raw data: <code class="break-all font-mono text-sm">{{ transactionData?.[txHash]?.rawData }}</code></p>
        <code
            class="break-all my-4 text-sm font-mono whitespace-pre">{{ transactionData?.[txHash]?.rawFullTxData }}</code>
    </div>
</template>
