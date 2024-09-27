<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import Header from "./Header.vue";
import Erc20Vue from "./Erc20.vue";
import { contractsStore, transactionsStore } from "@/explorer/data";

const route = useRoute();

const contract_name = computed(() => route.params.contract_name as string);

contractsStore.value.loadContractData(contract_name.value);
transactionsStore.value.loadContractTxs(contract_name.value);

const transactions = computed(() =>
    Object.values(transactionsStore.value.transactionData).filter((tx) => tx.contracts?.includes(contract_name.value)),
);

const contractData = computed(() => {
    console.log("aze", contract_name.value);
    console.log("store", JSON.stringify(contractsStore.value.contractData));
    console.log("data", contractsStore.value.contractData[contract_name.value]);
    return contractsStore.value.contractData?.[contract_name.value];
});

function parseBase64(base64: string): string {
    return base64;
    //if (!base64) return "";
    //const bytes = atob(base64);
    //return [...bytes].map((byte) => byte.charCodeAt(0).toString(16).padStart(2, "0")).join("");
}
</script>

<template>
    <div class="container m-auto">
        <Header></Header>
        <h1 class="my-4">{{ contract_name }} contract</h1>
        <p>
            Powered by <span class="font-anton text-sm">{{ contractData?.verifier }}</span>
        </p>
        <p>
            Program ID:
            <code class="align-text-bottom inline-block font-mono text-sm break-all max-h-[100px] overflow-scroll">{{
                parseBase64(contractData?.program_id)
            }}</code>
        </p>
        <p>
            State digest: <code class="font-mono text-sm">{{ parseBase64(contractData?.state_digest) }}</code>
        </p>
        <div v-if="contract_name === 'fake-erc20' || contract_name === 'smile_token'" class="my-4">
            <Erc20Vue :contract_name="contract_name"></Erc20Vue>
        </div>
        <div class="my-4">
            <h2>Transactions</h2>
            <RouterLink :to="{ name: 'transaction', params: { tx_hash: tx.tx_hash } }" v-for="tx in transactions" :key="tx.tx_hash">
                <p>
                    - Tx
                    <span class="tracking-tighter">{{ tx.tx_hash.slice(0, 5) }}...{{ tx.tx_hash.slice(-5) }}</span>
                    (block #{{ tx.block_height }})
                </p>
            </RouterLink>
            <p v-if="transactions.length === 0">No transactions found</p>
        </div>
    </div>
</template>
