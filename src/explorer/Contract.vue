<script setup lang="ts">
import Header from "@/explorer/Header.vue";
import { contractStore } from "@/state/data";
import { computed, watchEffect } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const contract_name = computed(() => route.params.contract_name as string);

watchEffect(() => {
    if (!contractStore.value.data[contract_name.value]) {
        contractStore.value.load(contract_name.value);
    }
});

const data = computed(() => contractStore.value.data?.[contract_name.value]);
</script>

<template>
    <div class="container m-auto">
        <Header></Header>
        <div class="px-8 py-4 bg-white rounded-xl text-gray-700">
            <h2 class="mb-4">Contract {{ contract_name }}</h2>
            <div class="mt-4">
                <pre class="bg-gray-100 p-4 rounded-xl text-xs font-mono">{{ JSON.stringify(data, null, 4) }}</pre>
            </div>
        </div>
    </div>
</template>
