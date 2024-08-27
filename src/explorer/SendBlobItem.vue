<script setup lang="ts">
import { ref, watchEffect } from 'vue';
const model = defineModel();

const props = defineProps<{
    contracts: string[];
}>();

const contract = ref<string>(props.contracts?.[0]);
const blob = ref<string>('');

const fileUpload = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.item(0);
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        blob.value = e.target?.result as string;
        blob.value = blob.value.slice(blob.value.indexOf(',') + 1); // skip initial 'data:application/json;base64,'
    };
    reader.readAsDataURL(file);
}

watchEffect(() => {
    model.value = {
        contractName: contract.value,
        data: blob.value,
    };
});
</script>

<template>
    <div>
        <p>
            <label for="contract_name">Contract</label><br>
            <select id="contract_name" name="contract_name" v-model="contract" required>
                <option v-for="c in props.contracts" :key="c" :value="c">{{ c }}</option>
            </select>
        </p>
        <p>
            <label for="blob_as_text">BLOB as base64</label><br>
            <input type="text" id="blob_as_text" name="blob_as_text" v-model="blob">
        </p>
        <p>
            <label for="blob">BLOB</label><br>
            <input type="file" id="blob" name="blob" @input="fileUpload">
        </p>
    </div>
</template>