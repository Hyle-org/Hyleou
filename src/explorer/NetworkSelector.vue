<script setup lang="ts">
import { network } from "@/state/network";
</script>

<template>
    <div class="h-full">
        <select v-model="network">
            <option value="devnet">Devnet</option>
            <option value="testnet">Devnet2</option>
            <option value="localhost">Localhost</option>
        </select>
    </div>
</template>

<style scoped>
select {
    @apply bg-gray-900 rounded-lg py-2 px-4 m-0 h-full font-anton uppercase text-secondary;
}
</style>
