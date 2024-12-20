<script setup lang="ts">
import Header from "@/explorer/Header.vue";
import { transactionStore } from "@/state/data";
import { computed, watchEffect } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const tx_hash = computed(() => route.params.tx_hash as string);

watchEffect(() => {
    if (!transactionStore.value.data[tx_hash.value]) {
        transactionStore.value.load(tx_hash.value);
    }
});

const data = computed(() => transactionStore.value.data?.[tx_hash.value]);
</script>

<template>
    <div class="container m-auto">
        <Header></Header>
        <div class="px-8 py-4 bg-white rounded-xl text-gray-700">
            <h2 class="mb-4">Tx 0x{{ tx_hash }}</h2>
            <p>
                Block: <router-link :to="{ name: 'Block', params: { block_hash: data?.block_hash } }">{{ data?.block_hash }}</router-link>
            </p>
            <p>Type: {{ data?.transaction_type }}</p>
            <p>Status: {{ data?.transaction_status }}</p>
            <div class="mt-4">
                <pre class="bg-gray-100 p-4 rounded-xl text-xs font-mono">{{ JSON.stringify(data, null, 4) }}</pre>
            </div>
        </div>
    </div>
</template>
