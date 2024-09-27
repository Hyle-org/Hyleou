<script setup lang="ts">
import { ref } from "vue";
import { broadcastProofTx, checkTxStatus } from "hyle-js";
import { getNetworkRpcUrl } from "hyle-js";
import { setupCosmos } from "hyle-js";
import { network } from "@/explorer/data";

const props = defineProps<{
    payloadIndex: number;
    contractName: string;
    hash: string;
}>();

const isCosmosReady = setupCosmos(`${getNetworkRpcUrl(network.value)}`);

const executeError = ref<string | null>(null);
const executeValue = ref<any | null>(null);
const executing = ref<boolean>(false);

const postProof = async (elem: Event) => {
    if (executing.value) return;
    executeError.value = null;
    executeValue.value = null;
    executing.value = true;
    try {
        await isCosmosReady;
        const file = (elem.target! as HTMLInputElement).files?.[0];
        const fileText = await file!.text();
        const tx = await broadcastProofTx(props.hash, props.payloadIndex, props.contractName, btoa(fileText));
        await new Promise((resolve) => setTimeout(resolve, 1000));
        executeValue.value = await checkTxStatus(tx.transactionHash);
    } catch (e: any) {
        executeError.value = e.message;
    }
    executing.value = false;
};
</script>

<template>
    <div class="my-4 flex gap-4 items-center">
        <p v-if="!executing && !executeValue">
            <label for="Proof" class="rounded-lg">Upload proof</label>
            <input type="file" name="proof" @input="postProof" required />
        </p>
        <p v-if="executing">Sending proof <i class="spinner"></i></p>
        <p v-if="executeValue">Proof sent.</p>
        <p v-if="executeError">Error sending proof:</p>
        <pre class="text-sm font-mono">{{ executeError }}</pre>
    </div>
</template>
