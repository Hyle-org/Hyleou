<script setup lang="ts">
import Logo from '@/assets/Hyle_logo.svg'
import NetworkSelector from '@/explorer/NetworkSelector.vue'
</script>

<template>
    <div class="border-b border-secondary flex items-center mb-4">
        <div class="flex items-center gap-4">
            <RouterLink :to="{ name: 'Home' }">
                <h3 class="my-1"><img :src="Logo" alt="Hylé logo" class="h-16"></img></h3>
            </RouterLink>
        </div>
        <div class="flex grow items-center justify-between gap-4">
            <div class="self-stretch">
                <RouterLink class="md:inline-block hidden mr-4" :to="{ name: 'Home' }">
                    <button>Home</button>
                </RouterLink>
                <RouterLink class="inline-block  mr-4" :to="{ name: 'register_contract' }">
                    <button>new&nbsp;contract</button>
                </RouterLink>
                <RouterLink class="inline-block" :to="{ name: 'send_blob' }">
                    <button>send&nbsp;blob</button>
                </RouterLink>
            </div>
            <NetworkSelector />
        </div>
    </div>
</template>

<style scoped>
a,
button {
    @apply h-full;
}
</style>