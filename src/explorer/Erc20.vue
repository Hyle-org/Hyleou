<script setup lang="ts">
import { ref, computed, reactive, watchEffect } from "vue";
import { Erc20Parser } from "hyle-js";
import { transactionsStore } from "@/explorer/data";
const props = defineProps<{
    contract_name: string;
}>();

const transactions = computed(() => {
    const txs = Object.values(transactionsStore.value.transactionData).filter((tx) => tx.contracts?.includes(props.contract_name));
    txs.sort((a, b) => a.block_height - b.block_height + a.tx_index - b.tx_index);
    return txs;
});

const contractData = ref(new Erc20Parser(props.contract_name));

watchEffect(() => {
    contractData.value = reactive(new Erc20Parser(props.contract_name));
    transactions.value.forEach((tx) => {
        if (!tx.type) {
            transactionsStore.value.loadTransactionData(tx.tx_hash); // inefficient if we do this many times.
            return;
        }
        contractData.value.consumeTx(tx);
        //if (tx.status !== "sequenced") contractData.value.settleTx(tx.tx_hash, tx.status === "success");
    });
});
</script>

<template>
    <h2>ERC20 balances</h2>
    <div>
        <p v-for="(balance, address) in contractData.balancesSettled" :key="address" class="balance">
            {{ address }}: {{ balance }}
            <span v-if="contractData.pendingPerAccount[address]?.length > 0">(pending: {{
                contractData.balancesPending[address] }})</span>
        </p>
    </div>
</template>

<style>
.balance span {
    @apply text-blue-800;
}
</style>
