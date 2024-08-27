<script setup lang="ts">
import { checkTxStatus, broadcastPayloadTx, setupCosmos } from 'hyle-js';
import Header from '@/explorer/Header.vue'
import { ref, computed } from 'vue';
import { getNetworkRpcUrl } from 'hyle-js';
import { contractsStore, network } from '@/explorer/data';
import { reactive } from 'vue';
import SendBlobItem from '@/explorer/SendBlobItem.vue';

const isCosmosReady = setupCosmos(`${getNetworkRpcUrl(network.value)}`);

const identity = ref<string>('');

type BlobData = {
    contractName: string;
    data: string; // base64 encoded array of bytes
}
const blobs = reactive([{}] as BlobData[]);

const contracts = computed(() => Object.keys(contractsStore.value.contractData));

const registerError = ref<string | null>(null);
const registerValue = ref<any | null>(null);
const registering = ref<boolean>(false);

const submitForm = async () => {
    if (registering.value) return;
    registering.value = true;
    registerValue.value = null;
    registerError.value = null;
    await isCosmosReady;
    registerError.value = null;
    try {
        console.log(blobs);
        const tx = await broadcastPayloadTx(
            identity.value,
            blobs,
        );
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const code = await checkTxStatus(tx.transactionHash);
        if (code.status === 'success')
            registerValue.value = tx.transactionHash;
        else
            registerError.value = code.error!;
    } catch (e: any) {
        registerError.value = e.message;
    }
    registering.value = false;
}
</script>

<template>
    <div class="container m-auto">
        <Header></Header>
        <div class="flex justify-between flex-wrap px-4">
            <div class="flex-auto basis-1/2">
                <h1>Send BLOB</h1>
                <form class="flex flex-col my-4 gap-4" id="blobForm">
                    <p>
                        <label for="identity">Identity</label><br>
                        <input type="text" id="identity" name="identity" placeholder="0xf00" v-model="identity">
                    </p>
                    <div v-for="blob, i in blobs" :key="blob.contractName" class="border-t-2">
                        <SendBlobItem v-model="blobs[i]" :contracts="contracts"></SendBlobItem>
                    </div>
                    <div>
                        <button class="rounded-lg my-4 w-auto" @click.prevent="blobs.push({})">+</button>
                    </div>
                    <div>
                        <button form="blobForm" class="rounded-lg my-4 w-auto" @click.prevent="submitForm">Send</button>
                    </div>
                </form>
            </div>
            <div class="flex-auto basis-1/2 border-l-2 border-secondary px-4">
                <p v-if="registering" class="font-anton">Sending BLOB <i class="animate spinner"></i></p>
                <div v-if="registerError">
                    <p>Error sending BLOB:</p>
                    <pre class="text-sm font-mono">{{ registerError }}</pre>
                </div>
                <div v-if="registerValue">
                    <p>BLOB sent successfully:</p>
                    <RouterLink :to="{ name: 'transaction', params: { tx_hash: registerValue } }">
                        <p>Transaction: {{ registerValue }}</p>
                    </RouterLink>
                </div>
            </div>
        </div>
    </div>
</template>
