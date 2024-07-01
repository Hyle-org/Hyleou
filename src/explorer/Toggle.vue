<script setup lang="ts">
import { ref } from 'vue';

// Implement a v-model for a toggle button
const toggle = ref(false);
const toggleHandler = () => {
    toggle.value = !toggle.value;
    emit('update:modelValue', toggle.value);
}
const emit = defineEmits(['update:modelValue']);

</script>

<template>
    <div :class="toggle ? 'rounded-xl bg-black bg-opacity-10 max-h-[400px] overflow-auto' : ''">
        <button class="rounded-xl block" @click="toggleHandler">
            <span v-if="toggle">Hide</span>
            <span v-else>Show</span>
        </button>
        <template v-if="toggle">
            <slot></slot>
        </template>
    </div>
</template>