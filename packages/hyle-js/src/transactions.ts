import { reactive } from "@vue/reactivity";
import { getNetworkApiUrl, getNetworkRpcUrl, network } from "./network";
import { MsgPublishPayloads, MsgRegisterContract } from "./proto/tx";
import { Tx as CosmosTx } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { base64ToUint8Array } from "@/utils";

export type TransactionInfo = {
    hash: string;
    height: number;
    index: number;
    status: "success" | "failure" | "sequenced";
    type: "/hyle.zktx.v1.MsgRegisterContract" | "/hyle.zktx.v1.MsgPublishPayloads" | "/hyle.zktx.v1.MsgPublishPayloadProof";
    contracts: string[];
    rawData: string;
    rawFullTxData: any;
};

interface ParsableTx {
    type: string;
    rawData: string;
}

export class TransactionData {
    transactionData = {} as Record<string, TransactionInfo>;

    async loadTransactionData(txHash: string) {
        if (this.transactionData[txHash]?.type) return; // use type as a proxy for full loading (see below)

        const response = fetch(`${getNetworkRpcUrl(network.value)}/tx?hash=0x${txHash}`);
        const settlement = fetch(`${getNetworkApiUrl(network.value)}/hyle/zktx/v1/settlement/${txHash}`);
        const data = await (await response).json();
        const settled = await (await settlement).json();
        this.transactionData[txHash] = {
            hash: data.result.hash,
            height: data.result.height,
            index: data.result.index,
            status:
                data.result.tx_result.code === 0 ? (settled?.settled ? (settled.success ? "success" : "failure") : "sequenced") : "failure",
            type: data.result.tx_result.events
                .filter((x: any) => x.type === "message")[0]
                ?.attributes.filter((x: any) => x.key === "action")[0].value,
            rawData: data.result.tx,
            rawFullTxData: data.result,
            contracts: [],
        };
        const parsed = this.getParsedTx(this.transactionData[txHash]);
        // Find out which contract this tx is related to
        if (this.transactionData[txHash].type === "/hyle.zktx.v1.MsgRegisterContract") {
            this.transactionData[txHash].contracts = [(parsed as MsgRegisterContract).contractName];
            // There's no need to wait for registration events
            if (this.transactionData[txHash].status === "sequenced") this.transactionData[txHash].status = "success";
        } else if (this.transactionData[txHash].type === "/hyle.zktx.v1.MsgPublishPayloads") {
            this.transactionData[txHash].contracts = (parsed as MsgPublishPayloads).payloads.map((x) => x.contractName);
        } else {
            // There's no need to wait in general
            if (this.transactionData[txHash].status === "sequenced") this.transactionData[txHash].status = "success";
            // TODO settlement ?
        }
    }

    getParsedTx<T>(data: ParsableTx): T {
        const tx = CosmosTx.decode(base64ToUint8Array(data.rawData));
        if (data.type === "/hyle.zktx.v1.MsgRegisterContract") {
            return MsgRegisterContract.decode(
                tx!.body!.messages.filter((x: any) => x.typeUrl === "/hyle.zktx.v1.MsgRegisterContract")[0].value,
            ) as any as T;
        } else if (data.type === "/hyle.zktx.v1.MsgPublishPayloads") {
            return MsgPublishPayloads.decode(
                tx!.body!.messages.filter((x: any) => x.typeUrl === "/hyle.zktx.v1.MsgPublishPayloads")[0].value,
            ) as any as T;
        }
        return undefined as any;
    }

    async loadTxData() {
        const response = await fetch(
            `${getNetworkRpcUrl(network.value)}/tx_search?query="tx.height>=0"&page=1&per_page=10&order_by="desc"`,
        );
        const txs = /*transactions.value = */ (await response.json()).result.txs;
        for (const tx of txs) {
            if (this.transactionData?.[tx.hash]?.type) continue;
            // HACK
            this.transactionData[tx.hash] = {
                hash: tx.hash,
                height: tx.height,
            };
        }
    }

    async loadContractTxs(network: string, contract_name: string) {
        // TODO: load register TXs as well
        const response = await fetch(
            `${getNetworkRpcUrl(network)}/tx_search?query="hyle.zktx.v1.EventPayload.contract_name='\\"${contract_name}\\"'"&page=1&per_page=50&order_by="asc"&match_events=true`,
        );
        const txs = /*transactions.value = */ (await response.json()).result.txs;
        for (const tx of txs) {
            if (this.transactionData?.[tx.hash]?.type) continue;
            // HACK
            this.transactionData[tx.hash] = {
                hash: tx.hash,
                height: tx.height,
                contracts: [contract_name],
            };
        }
    }

    // Load the latest by default
    //loadTxData();
}

const fake = reactive(new TransactionData());

export const transactionData = fake.transactionData;
export const loadContractTxs = fake.loadContractTxs;
export const loadTxData = fake.loadTxData;
export const loadTransactionData = fake.loadTransactionData;
export const getParsedTx = fake.getParsedTx;
