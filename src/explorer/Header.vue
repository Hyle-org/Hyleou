<script setup lang="ts">
import Logo from '@/assets/Hyle_logo.svg'
import NetworkSelector from '@/explorer/NetworkSelector.vue'
</script>

<template>
    <div class="border-b border-secondary flex justify-between items-center mb-4">
        <div class="flex items-center gap-4">
            <RouterLink :to="{ name: 'Home' }">
                <h3 class="my-1"><img :src="Logo" alt="Hylé logo" class="h-16"></img></h3>
            </RouterLink>
            <RouterLink :to="{ name: 'Home' }">
                <button>Home</button>
            </RouterLink>
            <RouterLink :to="{ name: 'register_contract' }">
                <button>new contract</button>
            </RouterLink>
        </div>
        <NetworkSelector />
    </div>
</template>