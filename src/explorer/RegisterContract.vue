<script setup lang="ts">
import { checkContractExists, checkTxStatus, registerContract, setupCosmos } from 'hyle-js';
import Header from '@/explorer/Header.vue'
import { ref } from 'vue';
import { getNetworkRpcUrl } from 'hyle-js';
import { network } from '@/explorer/data';

const isCosmosReady = setupCosmos(`${getNetworkRpcUrl(network.value)}`);

const name = ref<string>('');
const verifierType = ref<string>('risczero');
const programId = ref<string>('');
const initialStateDigest = ref<string>('')

const stringToBytes = (val: string) => {
    try {
        // Parse as hex string first
        if (val.length % 2 !== 0) {
            throw new Error('Invalid hex string');
        }
        return new Uint8Array(val.match(/.{2}/g)!.map((byte) => +BigInt(`0x${byte}`).toString(10)));
    } catch (e) {
        // Parse as base64
        return new Uint8Array(atob(val).split('').map((c) => c.charCodeAt(0)));
    }
}

const registerError = ref<string | null>(null);
const registerValue = ref<any | null>(null);
const registering = ref<boolean>(false);

const submitForm = async () => {
    if (registering.value) return;
    registering.value = true;
    registerValue.value = null;
    registerError.value = null;
    await isCosmosReady;
    if (await checkContractExists(network.value, name.value)) {
        registerError.value = 'Contract already exists';
        registering.value = false;
        return;
    }
    registerError.value = null;
    try {
        const tx = await registerContract(
            verifierType.value,
            name.value,
            stringToBytes(programId.value),
            stringToBytes(initialStateDigest.value)
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
                <h1>Register a new contract</h1>
                <form class="flex flex-col my-4 gap-4">
                    <p>
                        <label for="name">Name</label><br>
                        <input type="text" id="name" name="name" placeholder="my_contract" v-model="name" required>
                    </p>
                    <p>
                        <label for="verifier_type">Verifier Type</label><br>
                        <select id="verifier_type" name="verifier_type" v-model="verifierType" required>
                            <option value="risczero">RISC Zero</option>
                            <option value="cairo">Cairo VM</option>
                            <option value="gnark-groth16-te-BN254">Groth16 (BN254)</option>
                            <option value="noir">Noir</option>
                        </select>
                    </p>
                    <p>
                        <label for="program_id">Program ID</label><br>
                        <textarea id="program_id" name="program_id" placeholder="FOOBAR" v-model="programId"
                            class="resize" rows="1" required />
                    </p>
                    <p>
                        <label for="initial_state_digest">Initial State Digest</label><br>
                        <input type="text" id="initial_state_digest" name="initial_state_digest" placeholder="00"
                            v-model="initialStateDigest" required>
                    </p>
                    <div>
                        <button class="rounded-lg my-4 w-auto" @click.prevent="submitForm">Register</button>
                    </div>
                </form>
            </div>
            <div class="flex-auto basis-1/2 border-l-2 border-secondary px-4">
                <p v-if="registering" class="font-anton">Registering contract <i class="animate spinner"></i></p>
                <div v-if="registerError">
                    <p>Error registering contract:</p>
                    <pre class="text-sm font-mono">{{ registerError }}</pre>
                </div>
                <div v-if="registerValue">
                    <p>Contract registered successfully:</p>
                    <RouterLink :to="{ name: 'transaction', params: { tx_hash: registerValue } }">
                        <p>Transaction: {{ registerValue }}</p>
                    </RouterLink>
                </div>
            </div>
        </div>
    </div>
</template>
