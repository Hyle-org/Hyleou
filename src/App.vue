<script setup lang="ts"></script>

<template>
    <RouterView />
</template>

<style>
html {
    @apply font-text font-normal leading-snug;
}

h1,
h2,
h3,
h4,
h5,
h6 {
    @apply font-anton uppercase;
}

h1 {
    @apply text-4xl;
}

h2 {
    @apply text-xl;
}

body {
    @apply bg-primary;
}

button {
    @apply bg-gray-900 font-anton uppercase rounded-lg px-4 py-2 text-white;
}

button:hover:not(:disabled) {
    @apply tracking-widest;
}

button:active:not(:disabled) {
    @apply bg-secondary text-primary;
}

button:disabled {
    @apply bg-gray-500 text-opacity-50;
}

p a {
    @apply border-b-2 border-secondary;
}

i.spinner {
    @apply animate-spin;
    @apply inline-block border-4 border-t-4 border-secondary border-t-primary rounded-full w-4 h-4 mt-1 mx-1;
}

input,
select,
textarea {
    @apply text-primary font-mono p-2 rounded-lg leading-snug;
}

input[type="file"] {
    @apply text-secondary text-sm;
}

label {
    @apply font-anton bg-opacity-50 bg-black px-2 rounded-t-lg;
}
</style>
