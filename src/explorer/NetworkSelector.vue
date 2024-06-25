<script setup lang="ts">
import { network } from '@/explorer/network';
</script>

<template>
    <div>
        <select v-model="network">
            <option value="devnet">Devnet</option>
            <option value="localhost">Localhost</option>
        </select>
    </div>
</template>

<style scoped>
select {
    @apply bg-gray-900 rounded-lg py-1 px-2 font-anton uppercase text-sm;
}
</style>