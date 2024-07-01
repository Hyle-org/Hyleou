<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import Header from './Header.vue';
import { getNetworkApiUrl, getNetworkRpcUrl, network } from './network';

const route = useRoute();

const contract_name = computed(() => route.params.contract_name as string);

type ContractInfo = {
    verifier: string;
    program_id: string;
    state_digest: string;
}
const contractData = reactive({} as Record<string, ContractInfo>);

const transactions = ref([]);

function parseBase64(base64: string): string {
    if (!base64) return '';
    const bytes = atob(base64);
    return [...bytes].map(byte => byte.charCodeAt(0).toString(16).padStart(2, '0')).join('');
}

onMounted(async () => {
    const response = await fetch(`${getNetworkApiUrl(network.value)}/hyle/zktx/v1/contract/${contract_name.value}`);
    contractData[contract_name.value] = (await response.json()).contract;

    const txResp = await fetch(`${getNetworkRpcUrl(network.value)}/tx_search?query="hyle.zktx.v1.EventStateChange.contract_name='\\"${contract_name.value}\\"'"&page=1&per_page=10&order_by="desc"&match_events=true`);
    transactions.value = (await txResp.json()).result.txs;
});

</script>

<template>
    <div class="container m-auto">
        <Header></Header>
        <h1 class="my-4">{{ contract_name }} contract</h1>
        <p>Powered by <span class="font-anton text-sm">{{ contractData?.[contract_name]?.verifier }}</span></p>
        <p>Program ID: <code
                class="font-mono text-sm">{{ parseBase64(contractData?.[contract_name]?.program_id) }}</code></p>
        <p>State digest: <code class="font-mono text-sm">{{ parseBase64(contractData?.[contract_name]?.state_digest)
            }}</code></p>
        <div class="my-4">
            <h2>Transactions</h2>
            <RouterLink :to="{ name: 'transaction', params: { tx_hash: tx.hash } }" v-for="tx in transactions"
                :key="tx.hash">
                <p> - Tx
                    <span class="tracking-tighter">{{ tx.hash.slice(0, 5) }}...{{ tx.hash.slice(-5) }}</span>
                    (block #{{ tx.height }})
                </p>
            </RouterLink>
            <p v-if="transactions.length === 0">No transactions found</p>
        </div>
    </div>
</template>
