<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Header from './Header.vue';
import { MsgPublishPayloads, MsgRegisterContract } from 'hyle-js';
import Toggle from './Toggle.vue'
import { getParsedTx } from 'hyle-js';
import { transactionsStore } from '@/explorer/data';

const route = useRoute();

const txHash = computed(() => route.params.tx_hash as string);

transactionsStore.value.loadTransactionData(txHash.value);

type regTx = MsgRegisterContract;
type xTx = MsgPublishPayloads;

const txData = computed(() => transactionsStore.value.transactionData[txHash.value]);
const parsedTx = computed(() => getParsedTx(txData.value));
</script>

<template>
    <div class="container m-auto">
        <Header></Header>
        <div class="px-4">
            <h1 class="my-4 break-all">Transaction 0x{{ txHash }}</h1>
            <p>Settled in <RouterLink :to="{ name: 'block', params: { block_id: txData?.height || '0' } }">block
                    #{{ txData?.height }}</RouterLink>
            </p>
            <p>Status: {{ txData?.status || 'unknown' }}</p>
            <pre
                v-if="txData?.status === 'failure'">{{ txData?.rawFullTxData?.tx_result?.log || 'Unknown error' }}</pre>
            <div class="my-4" v-if="txData?.type === '/hyle.zktx.v1.MsgRegisterContract'">
                <p>Contract registration for <RouterLink
                        :to="{ name: 'contract', params: { contract_name: getParsedTx<MsgRegisterContract>(txData).contractName } }">
                        {{ getParsedTx<MsgRegisterContract>(txData).contractName }}</RouterLink>
                </p>
                <p>Initial state: {{ Array.from(getParsedTx<MsgRegisterContract>
                (txData).stateDigest).map(x => x.toString(16).padStart(2, '0')).join('') }}
                </p>
            </div>
            <div class="my-4" v-else-if="txData?.type === '/hyle.zktx.v1.MsgPublishPayloads'">
                <p>Payload</p>
                <p>{{ (parsedTx as xTx).payloads.map(x => x.contractName) }}</p>
                <p>{{ (parsedTx as xTx).payloads.map(x => x.data) }}</p>
            </div>
            <!--<p>Raw data: <code class="break-all font-mono text-sm">{{ txData?.rawData }}</code></p>-->
            <Toggle>
                <code class="break-all w-full my-4 text-sm font-mono whitespace-pre">{{ txData?.rawFullTxData }}</code>
            </Toggle>
        </div>
    </div>
</template>
