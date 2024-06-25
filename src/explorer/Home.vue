<script setup lang="ts">
import Header from '@/explorer/Header.vue'
import { ref, watchEffect } from 'vue';
import { getNetworkApiUrl, getNetworkRpcUrl, network } from './network';


const contracts = ref([]);
const blocks = ref([]);
const transactions = ref([]);

watchEffect(async () => {
    {
        const response = await fetch(`${getNetworkApiUrl(network.value)}/hyle/zktx/v1/contracts`);
        contracts.value = (await response.json()).contracts;
    }
    {
        const response = await fetch(`${getNetworkRpcUrl(network.value)}/blockchain`);
        blocks.value = (await response.json()).result.block_metas;
    }
    {
        const response = await fetch(`${getNetworkRpcUrl(network.value)}/tx_search?query="tx.height>=0"&page=1&per_page=10&order_by="desc"`);
        transactions.value = (await response.json()).result.txs;
    }
});

</script>

<template>
    <div class="container m-auto">
        <Header></Header>
        <div>
            <h1>Explorer</h1>
            <div>
                <h2>Contracts</h2>
                <div>
                    <router-link :to="{ name: 'contract', params: { contract_name: contract } }"
                        v-for="contract in contracts" :key="contract">
                        <p> - {{ contract }}</p>
                    </router-link>
                </div>
            </div>
            <div class="grid grid-cols-2">
                <div>
                    <h2>Latest blocks</h2>
                    <div>
                        <RouterLink :to="{ name: 'block', params: { block_id: block.header.height } }"
                            v-for="block in blocks" :key="block.header.height">
                            <p> - Block #{{ block.header.height }} ({{
                            block.num_txs }} txs)</p>
                        </RouterLink>
                        <p> - ...</p>
                    </div>
                </div>
                <div>
                    <h2>Latest transactions</h2>
                    <div>
                        <RouterLink :to="{ name: 'transaction', params: { tx_hash: tx.hash } }"
                            v-for="tx in transactions" :key="tx.hash">
                            <p> - Tx <span class="tracking-tighter">{{ tx.hash.slice(0, 5) }}...{{ tx.hash.slice(-5)
                                    }}</span>
                                (block #{{ tx.height }})
                            </p>
                        </RouterLink>
                        <p> - ...</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
