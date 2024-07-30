<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Header from './Header.vue';
import { MsgPublishPayloads, MsgRegisterContract } from '@/proto/tx';
import Toggle from './Toggle.vue'
import { getParsedTx, loadTransactionData, transactionData } from './transactions';

const route = useRoute();

const txHash = computed(() => route.params.tx_hash as string);

loadTransactionData(txHash.value);

type regTx = MsgRegisterContract;
type xTx = MsgPublishPayloads;

const parsedTx = computed(() => getParsedTx(transactionData[txHash.value]));
</script>

<template>
    <div class="container m-auto">
        <Header></Header>
        <div class="px-4">
            <h1 class="my-4 break-all">Transaction 0x{{ txHash }}</h1>
            <p>Settled in <RouterLink
                    :to="{ name: 'block', params: { block_id: transactionData?.[txHash]?.height || '0' } }">block
                    #{{ transactionData?.[txHash]?.height }}</RouterLink>
            </p>
            <p>Status: {{ transactionData?.[txHash]?.status || 'unknown' }}</p>
            <pre
                v-if="transactionData?.[txHash]?.status === 'failure'">{{ transactionData?.[txHash]?.rawFullTxData?.tx_result?.log || 'Unknown error' }}</pre>
            <div class="my-4" v-if="transactionData?.[txHash]?.type === '/hyle.zktx.v1.MsgRegisterContract'">
                <p>Contract registration for <RouterLink
                        :to="{ name: 'contract', params: { contract_name: getParsedTx<MsgRegisterContract>(transactionData?.[txHash]).contractName } }">
                        {{ getParsedTx<MsgRegisterContract>
                (transactionData?.[txHash]).contractName }}</RouterLink>
                </p>
                <p>Initial state: {{ Array.from(getParsedTx<MsgRegisterContract>
                (transactionData?.[txHash]).stateDigest).map(x => x.toString(16).padStart(2, '0')).join('') }}
                </p>
            </div>
            <div class="my-4" v-else-if="transactionData?.[txHash]?.type === '/hyle.zktx.v1.MsgPublishPayloads'">
                <p>Payload</p>
                <p>{{ (parsedTx as xTx).payloads.map(x => x.contractName) }}</p>
                <p>{{ (parsedTx as xTx).payloads.map(x => x.data) }}</p>
            </div>
            <!--<p>Raw data: <code class="break-all font-mono text-sm">{{ transactionData?.[txHash]?.rawData }}</code></p>-->
            <Toggle>
                <code
                    class="break-all w-full my-4 text-sm font-mono whitespace-pre">{{ transactionData?.[txHash]?.rawFullTxData }}</code>
            </Toggle>
        </div>
    </div>
</template>
