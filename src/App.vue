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
    @apply font-display uppercase;
}

h1 {
    @apply text-4xl;
}

h2 {
    @apply text-xl;
}

body {
    @apply bg-background text-foreground;
}

button {
    @apply font-display uppercase rounded-xl transition-all duration-200;
}

button:not([class*="bg-"]) {
    @apply bg-white/80 backdrop-blur-sm border border-white/20 text-secondary hover:bg-secondary/5;
}

button:active:not(:disabled) {
    @apply bg-primary/10 text-primary border-primary/20;
}

button:disabled {
    @apply opacity-50 cursor-not-allowed;
}

p a {
    @apply border-b-2 border-primary;
}

i.spinner {
    @apply animate-spin;
    @apply inline-block border-4 border-t-4 border-secondary border-t-primary rounded-full w-4 h-4 mt-1 mx-1;
}

input,
select,
textarea {
    @apply text-foreground font-text p-2 rounded-lg leading-snug;
}

input[type="file"] {
    @apply text-neutral text-sm;
}

label {
    @apply font-display bg-secondary/10 px-2 rounded-t-lg text-secondary;
}
</style>
