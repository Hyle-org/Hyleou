<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import Header from './Header.vue';
import { getNetworkApiUrl, getNetworkRpcUrl, network } from './network';
import { MsgExecuteStateChanges, MsgRegisterContract } from '@/proto/tx';
import { Tx as CosmosTx } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { base64ToUint8Array } from '@/indexer';
import Toggle from './Toggle.vue'

const route = useRoute();

const txHash = computed(() => route.params.tx_hash as string);

type TransactionInfo = {
    hash: string;
    height: number;
    status: 'success' | 'failure';
    type: '/hyle.zktx.v1.MsgRegisterContract' | string;
    rawData: string;
    rawFullTxData: any;
}
const transactionData = reactive({} as Record<string, TransactionInfo>);

onMounted(async () => {
    const response = await fetch(`${getNetworkRpcUrl(network.value)}/tx?hash=0x${txHash.value}`);
    const data = (await response.json());
    transactionData[txHash.value] = {
        hash: data.result.hash,
        height: data.result.height,
        status: data.result.tx_result.code === 0 ? 'success' : 'failure',
        type: data.result.tx_result.events.filter((x: any) => x.type === 'message')[0]?.attributes.filter((x: any) => x.key === 'action')[0].value,
        rawData: data.result.tx,
        rawFullTxData: data.result,
    }
});

function getParsedTx<T>(data: TransactionInfo): T {
    const tx = CosmosTx.decode(base64ToUint8Array(data.rawData));
    if (data.type === '/hyle.zktx.v1.MsgRegisterContract') {
        return MsgRegisterContract.decode(tx!.body!.messages.filter((x: any) => x.typeUrl === '/hyle.zktx.v1.MsgRegisterContract')[0].value) as any as T;
    } else if (data.type === '/hyle.zktx.v1.MsgExecuteStateChanges') {
        return MsgExecuteStateChanges.decode(tx!.body!.messages.filter((x: any) => x.typeUrl === '/hyle.zktx.v1.MsgExecuteStateChanges')[0].value) as any as T;
    }
    return undefined as any;
}

type regTx = MsgRegisterContract;
type xTx = MsgExecuteStateChanges;

const parsedTx = computed(() => getParsedTx(transactionData[txHash.value]));

const GetErc20Output = (tx: MsgExecuteStateChanges) => {
    if (tx.stateChanges.length === 0) {
        return [];
    }
    if (tx.stateChanges[0].contractName !== 'smile_token') {
        return [];
    }
    const x = tx.stateChanges[0];
    const proof = new DataView(x.proof.buffer, x.proof.byteOffset, x.proof.byteLength);
    const proofSize = proof.getUint32(0, true);
    const inputsSize = proof.getUint32(proofSize + 4, true);
    const outputs = proof.buffer.slice(proofSize + 8 + inputsSize);
    const hexOutputs = Array.from(new Uint8Array(outputs)).map(x => x.toString(16).padStart(2, '0')).join('');
    // Horrible
    const faucetPos = hexOutputs.search('06666175636574');
    // Parse length of other name
    const nameLength = parseInt(hexOutputs.slice(faucetPos + 14, faucetPos + 16), 16);
    // Parse name - first as a hex string
    const nameHex = hexOutputs.slice(faucetPos + 16, faucetPos + 16 + nameLength * 2);
    // then as ascii
    let name = "";
    for (let i = 0; i < nameHex.length; i += 2) {
        const charCode = parseInt(nameHex.slice(i, i + 2), 16);
        if (charCode === 0) {
            break;
        }
        name += String.fromCharCode(charCode);
    }
    // Parse int
    const intv = parseInt(hexOutputs.slice(faucetPos + 16 + nameLength * 2, faucetPos + 16 + nameLength * 2 + 2), 16);
    let val;
    const intStartPos = faucetPos + 16 + nameLength * 2 + 2;
    if (intv < 251) {
        val = intv;
    } else if (intv < 252) {
        // parse as big endian u16
        val = parseInt(hexOutputs.slice(intStartPos, intStartPos + 2), 16) + parseInt(hexOutputs.slice(intStartPos + 2, intStartPos + 4), 16) * 256;
    } else {
        // parse as big endian u32
        val = parseInt(hexOutputs.slice(intStartPos, intStartPos + 2), 16) + parseInt(hexOutputs.slice(intStartPos + 2, intStartPos + 4), 16) * 256 + parseInt(hexOutputs.slice(intStartPos + 4, intStartPos + 6), 16) * 256 * 256 + parseInt(hexOutputs.slice(intStartPos + 6, intStartPos + 8), 16) * 256 * 256 * 256;
    }
    return {
        from: "faucet",
        to: name,
        value: val,
    };
}

</script>

<template>
    <div class="container m-auto">
        <Header></Header>
        <h1 class="my-4">Transaction 0x{{ txHash }}</h1>
        <p>Settled in <RouterLink
                :to="{ name: 'block', params: { block_id: transactionData?.[txHash]?.height || '0' } }">block
                #{{ transactionData?.[txHash]?.height }}</RouterLink>
        </p>
        <p>Status: <span v-if="transactionData?.[txHash]?.status === 'success'" class="text-green-500">Success</span>
            <span v-else>Failure</span>
        </p>
        <pre
            v-if="transactionData?.[txHash]?.status === 'failure'">{{ transactionData?.[txHash]?.rawFullTxData?.tx_result?.log || 'Unknown error' }}</pre>
        <div class="my-4" v-if="transactionData?.[txHash]?.type === '/hyle.zktx.v1.MsgRegisterContract'">
            <p>Contract registration for &quot;{{ getParsedTx<MsgRegisterContract>
            (transactionData?.[txHash]).contractName }}&quot;
            </p>
            <p>Initial state: {{ Array.from(getParsedTx<MsgRegisterContract>
            (transactionData?.[txHash]).stateDigest).map(x => x.toString(16).padStart(2, '0')).join('') }}</p>
        </div>
        <div class="my-4" v-else-if="transactionData?.[txHash]?.type === '/hyle.zktx.v1.MsgExecuteStateChanges'">
            <p>State changes execution</p>
            <p>{{ (parsedTx as xTx).stateChanges.map(x => x.contractName) }}</p>
            <p>Proof outputs: {{ GetErc20Output(parsedTx as xTx) }}</p>
        </div>
        <!--<p>Raw data: <code class="break-all font-mono text-sm">{{ transactionData?.[txHash]?.rawData }}</code></p>-->
        <Toggle>
            <code
                class="break-all w-full my-4 text-sm font-mono whitespace-pre">{{ transactionData?.[txHash]?.rawFullTxData }}</code>
        </Toggle>
    </div>
</template>
