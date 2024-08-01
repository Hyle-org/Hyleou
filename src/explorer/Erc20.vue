<script setup lang="ts">
import { ref, computed, reactive, watchEffect } from 'vue';
import { Erc20Parser } from './erc20';
import { transactionData } from './transactions';
const props = defineProps<{
    contract_name: string;
}>();

const transactions = computed(() => {
    const txs = Object.values(transactionData).filter(tx => tx.contracts?.includes(props.contract_name))
    txs.sort((a, b) => a.height - b.height + a.index - b.index);
    return txs;
});

const contractData = ref(new Erc20Parser(props.contract_name));

watchEffect(() => {
    contractData.value = reactive(new Erc20Parser(props.contract_name));
    transactions.value.forEach(tx => {
        contractData.value.consumeTx(tx);
        if (tx.status !== "sequenced") contractData.value.settleTx(tx.hash, tx.status === "success");
    });
});


</script>

<template>
    <h2>ERC20 balances</h2>
    <div>
        <p v-for="balance, address in contractData.balancesSettled" :key="address" class="balance">
            {{ address }}: {{ balance }} <span v-if="contractData.pendingPerAccount[address]?.length > 0">(pending: {{
            contractData.balancesPending[address] }})</span>
        </p>
    </div>
</template>

<style>
.balance span {
    @apply text-blue-800;
}
</style>
