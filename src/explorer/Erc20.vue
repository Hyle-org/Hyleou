<script setup lang="ts">
import { reactive } from 'vue';
import { Erc20Parser } from './erc20';
import { base64ToUint8Array } from '@/utils';


const props = defineProps<{
    contract_name: string;
}>();

const contractData = reactive(new Erc20Parser(props.contract_name));

contractData.balancesSettled['faucet'] = 1000000;
contractData.balancesSettled['jojo'] = 2453;
const payload = "WzcgMCAxMTI1Njg3NjczMDkxNzIgNiAwIDE1NTQ5ODI0NDMzMDQ4ODA0NTMwNjg1MDI4NzU4OTY2NDE3NzIwMDY3MjAwMzIyNDExMyAyMSAxMDAwXQ==";
const data = base64ToUint8Array(payload);
contractData.consumeSettledMsg({
    payloads: [
        {
            contractName: props.contract_name,
            data,
        },
    ],
}, '0x1234');
contractData.consumePendingMsg({
    payloads: [
        {
            contractName: props.contract_name,
            data,
        },
    ],
}, '0x12343');
contractData.consumePendingMsg({
    payloads: [
        {
            contractName: props.contract_name,
            data,
        },
    ],
}, '0x12345');
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
