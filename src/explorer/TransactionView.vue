<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import Header from './Header.vue';
import { getNetworkApiUrl, getNetworkRpcUrl, network } from './network';
import { MsgRegisterContract } from '@/proto/tx';
import { Tx as CosmosTx } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { base64ToUint8Array } from '@/indexer';

const route = useRoute();

const txHash = computed(() => route.params.tx_hash as string);

type TransactionInfo = {
    hash: string;
    height: number;
    status: 'success' | 'failure';
    type: '/hyle.zktx.v1.MsgRegisterContract' | string;
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
        type: data.result.tx_result.events.filter((x: any) => x.type === 'message')[0].attributes.filter((x: any) => x.key === 'action')[0].value,
        rawData: data.result.tx,
        rawFullTxData: JSON.stringify(data.result, null, 2),
    }
});

function getParsedTx<T>(data: TransactionInfo): T {
    const tx = CosmosTx.decode(base64ToUint8Array(data.rawData));
    if (data.type === '/hyle.zktx.v1.MsgRegisterContract') {
        return MsgRegisterContract.decode(tx!.body!.messages.filter((x: any) => x.typeUrl === '/hyle.zktx.v1.MsgRegisterContract')[0].value) as any as T;
    }
    return undefined as any;
}

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
        <div class="my-4" v-if="transactionData?.[txHash]?.type === '/hyle.zktx.v1.MsgRegisterContract'">
            <p>Contract registration for &quot;{{ getParsedTx<MsgRegisterContract>
            (transactionData?.[txHash]).contractName }}&quot;
            </p>
            <p>Initial state: {{ Array.from(getParsedTx<MsgRegisterContract>
            (transactionData?.[txHash]).stateDigest).map(x => x.toString(16).padStart(2, '0')).join('') }}</p>
        </div>
        <p>Raw data: <code class="break-all font-mono text-sm">{{ transactionData?.[txHash]?.rawData }}</code></p>
        <code
            class="break-all my-4 text-sm font-mono whitespace-pre">{{ transactionData?.[txHash]?.rawFullTxData }}</code>
    </div>
</template>
