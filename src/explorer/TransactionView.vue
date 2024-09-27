<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import Header from "./Header.vue";
import { ProofData, BlobData, RegisterContractData } from "hyle-js";
import Toggle from "./Toggle.vue";
import { transactionsStore } from "@/explorer/data";
const route = useRoute();

const txHash = computed(() => route.params.tx_hash as string);

transactionsStore.value.loadTransactionData(txHash.value);

const txData = computed(() => {
    console.log("aze", txHash.value);
    console.log("store", transactionsStore.value.transactionData);
    console.log("data", transactionsStore.value.transactionData[txHash.value]);
    return transactionsStore.value.transactionData[txHash.value];
});
</script>

<template>
    <div class="container m-auto">
        <Header></Header>
        <div class="px-4">
            <h1 class="my-4 break-all">Transaction 0x{{ txHash }}</h1>
            <p>
                Settled in
                <RouterLink :to="{ name: 'block', params: { block_id: txData?.block_height || '0' } }"
                    >block #{{ txData?.block_height }}</RouterLink
                >
            </p>
            <p>type: {{ txData?.type }}</p>
            <p>Status: {{ txData?.status || "unknown" }}</p>
            <pre v-if="txData?.status === 'failure'"
                >{{ txData?.rawFullTxData?.tx_result?.log || "Unknown error" }}
            </pre>
            <div class="my-4" v-if="txData?.type === 'RegisterContract'">
                <p>
                    Contract registration for
                    <RouterLink :to="{ name: 'contract', params: { contract_name: (txData.data as RegisterContractData).contract_name } }">
                        {{ (txData.data as RegisterContractData).contract_name }}</RouterLink
                    >
                </p>
                <p>Initial state: {{ (txData.data as RegisterContractData).state_digest }}</p>
            </div>
            <div class="my-4" v-else-if="txData?.type === 'Blob'">
                <p>{{ (txData.data as BlobData).blobs.length }} blobs:</p>
                <ol>
                    <li v-for="blob in (txData.data as BlobData).blobs" :key="blob.contract_name">
                        <p>Contract: {{ blob.contract_name }}</p>
                        <p>Data: {{ blob.data }}</p>
                    </li>
                </ol>
            </div>
            <div class="my-4" v-else-if="txData?.type === 'Proof'">
                <p>Proof for:</p>
                <ol>
                    <li v-for="proof in (txData.data as ProofData).blobs_references" :key="proof.contract_name">
                        <p>Contract: {{ proof.contract_name }}</p>
                        <p>
                            Blob tx hash:
                            <RouterLink :to="{ name: 'transaction', params: { tx_hash: proof.blob_tx_hash } }">
                                0x{{ proof.blob_tx_hash }}</RouterLink
                            >
                        </p>
                        <p>Blob index: {{ proof.blob_index }}</p>
                    </li>
                </ol>
                <p></p>
            </div>
            <!--<p>Raw data: <code class="break-all font-mono text-sm">{{ txData?.rawData }}</code></p>-->
            <Toggle>
                <code class="break-all w-full my-4 text-sm font-mono whitespace-pre">{{ txData?.data }}</code>
            </Toggle>
        </div>
    </div>
</template>
