<script setup lang="ts">
import Header from '@/explorer/Header.vue'
import { blockStore } from '@/state/data';

</script>

<template>
    <div class="container m-auto">
        <Header></Header>
        <div class="px-4">
            <div class="grid grid-cols-2 gap-4">
                <div class="bg-white p-4 text-gray-700 rounded-xl">
                    <h2>Latest blocks</h2>
                    <hr>
                    <div class="flex flex-col-reverse">
                        <div v-for="block in blockStore.blocks">
                            <h4>Block {{ block.height }}</h4>
                            <p class="whitespace-pre font-mono text-xs">{{ block.hash }}</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white p-4 text-gray-700 rounded-xl">
                    <h2>Latest transactions</h2>
                    <hr>
                    <div>
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
