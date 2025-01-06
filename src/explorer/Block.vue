<script setup lang="ts">
import Header from "@/explorer/Header.vue";
import { blockStore } from "@/state/data";
import { computed, watchEffect } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const block_hash = computed(() => route.params.block_hash as string);

watchEffect(() => {
    if (!blockStore.value.data[block_hash.value]) {
        blockStore.value.load(block_hash.value);
        blockStore.value.loadTxForBlock(block_hash.value);
    }
});

const data = computed(() => blockStore.value.data?.[block_hash.value]);
</script>

<template>
    <div class="container m-auto">
        <Header></Header>
        <div class="px-8 py-4 bg-white rounded-xl text-gray-700">
            <h2 class="mb-4">Block {{ block_hash }}</h2>
            <p>
                Parent: <RouterLink :to="{ name: 'Block', params: { block_hash: data?.parent_hash } }">{{ data?.parent_hash }}</RouterLink>
            </p>
            <p>Height: {{ data?.height }}</p>
            <div class="mt-4">
                <pre class="bg-gray-100 p-4 rounded-xl text-xs font-mono">{{ JSON.stringify(data, null, 4) }}</pre>
            </div>
            <div class="mt-4">
                <h3 class="m-0">Transactions:</h3>
                <div class="flex flex-col">
                    <p v-for="tx_hash in blockStore.tx_hashes_by_block?.[block_hash] || []" :key="tx_hash">
                        <router-link :to="{ name: 'Transaction', params: { tx_hash } }"> - {{ tx_hash }} </router-link>
                    </p>
                </div>
                <pre class="mt-2 bg-gray-100 p-4 rounded-xl text-xs font-mono">{{
                    JSON.stringify(blockStore.tx_hashes_by_block?.[block_hash], null, 4)
                }}</pre>
            </div>
        </div>
    </div>
</template>
