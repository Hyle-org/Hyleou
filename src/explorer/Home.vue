<script setup lang="ts">
import Header from "@/explorer/Header.vue";
import { blockStore, contractStore, transactionStore } from "@/state/data";
import { getNetworkNodeApiUrl, network } from "@/state/network";
import { onMounted, ref } from "vue";

const consensusInfo = ref(null);

const fetchConsensusInfo = async () => {
    const response = await fetch(getNetworkNodeApiUrl(network.value) + `/v1/consensus/info?no_cache=${Date.now()}`);
    consensusInfo.value = await response.json();
};

onMounted(() => {
    fetchConsensusInfo();
});
</script>

<template>
    <div class="container m-auto">
        <Header></Header>
        <div>
            <div class="flex justify-stretch gap-4">
                <div class="flex-1 max-w-[40vw] bg-white p-8 py-4 text-gray-700 rounded-xl mb-4">
                    <h2>Smart Contracts</h2>
                    <hr />
                    <div class="flex flex-col">
                        <RouterLink
                            :to="{ name: 'Contract', params: { contract_name } }"
                            v-for="contract_name in Object.keys(contractStore.data)"
                            :key="contract_name"
                        >
                            <div>
                                <p class="capitalize">- {{ contract_name }}</p>
                            </div>
                        </RouterLink>
                    </div>
                </div>
                <div class="flex-1 bg-white p-8 py-4 text-gray-700 rounded-xl mb-4">
                    <h2>Consensus info</h2>
                    <hr />
                    <h4>Validators</h4>
                    <div class="flex flex-col">
                        <p v-for="validator in consensusInfo?.validators" :key="validator">
                            - {{ validator.slice(0, 7) }}...{{ validator.slice(-7) }}
                        </p>
                    </div>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div class="bg-white px-8 py-4 text-gray-700 rounded-xl">
                    <h2>Latest blocks</h2>
                    <hr />
                    <div class="flex flex-col">
                        <RouterLink :to="{ name: 'Block', params: { block_hash: hash } }" v-for="hash in blockStore.latest" :key="hash">
                            <div>
                                <h4>Block {{ blockStore.data[hash].height }}</h4>
                                <p class="whitespace-pre text-xs">{{ hash }}</p>
                            </div>
                        </RouterLink>
                    </div>
                </div>
                <div class="bg-white px-8 py-4 text-gray-700 rounded-xl">
                    <h2>Latest transactions</h2>
                    <hr />
                    <div class="flex flex-col">
                        <RouterLink :to="`/tx/${tx_hash}`" v-for="tx_hash in transactionStore.latest" :key="tx_hash">
                            <div>
                                <h4>TX 0x{{ tx_hash }}</h4>
                                <p class="whitespace-pre text-xs">
                                    {{ transactionStore.data[tx_hash].transaction_type }} ({{
                                        transactionStore.data[tx_hash].transaction_status
                                    }})
                                </p>
                            </div>
                        </RouterLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
hr {
    @apply my-2;
}
</style>
