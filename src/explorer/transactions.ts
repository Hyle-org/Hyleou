import { reactive } from "vue";
import { getNetworkApiUrl, getNetworkRpcUrl, network } from "./network";
import { MsgPublishPayloads, MsgRegisterContract } from "@/proto/tx";
import { Tx as CosmosTx } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { base64ToUint8Array } from "@/indexer";

export type TransactionInfo = {
    hash: string;
    height: number;
    status: "success" | "failure" | "sequenced";
    type:
        | "/hyle.zktx.v1.MsgRegisterContract"
        | "/hyle.zktx.v1.MsgPublishPayloads"
        | "/hyle.zktx.v1.MsgPublishPayloadProof";
    contracts: string[];
    rawData: string;
    rawFullTxData: any;
};

export const transactionData = reactive({} as Record<string, TransactionInfo>);

export const settledTxData = reactive({} as Record<string, boolean>);

export const loadTransactionData = async (txHash: string) => {
    if (transactionData[txHash]?.type) return; // use type as a proxy for full loading (see below)

    const response = fetch(
        `${getNetworkRpcUrl(network.value)}/tx?hash=0x${txHash}`,
    );
    const settlement = fetch(
        `${getNetworkApiUrl(network.value)}/hyle/zktx/v1/settlement/${txHash}`,
    );
    const data = await (await response).json();
    const settled = await (await settlement).json();
    transactionData[txHash] = {
        hash: data.result.hash,
        height: data.result.height,
        status:
            data.result.tx_result.code === 0
                ? settled.settled
                    ? "success" // TODO: this is a lie we might have actually failed
                    : "sequenced"
                : "failure",
        type: data.result.tx_result.events
            .filter((x: any) => x.type === "message")[0]
            ?.attributes.filter((x: any) => x.key === "action")[0].value,
        rawData: data.result.tx,
        rawFullTxData: data.result,
        contracts: [],
    };
    const parsed = getParsedTx(transactionData[txHash]);
    // Find out which contract this tx is related to
    if (transactionData[txHash].type === "/hyle.zktx.v1.MsgRegisterContract") {
        transactionData[txHash].contracts = [
            (parsed as MsgRegisterContract).contractName,
        ];
    } else if (
        transactionData[txHash].type === "/hyle.zktx.v1.MsgPublishPayloads"
    ) {
        transactionData[txHash].contracts = (
            parsed as MsgPublishPayloads
        ).payloads.map((x) => x.contractName);
    } else {
        // TODO settlement ?
    }
};

export function getParsedTx<T>(data: TransactionInfo): T {
    const tx = CosmosTx.decode(base64ToUint8Array(data.rawData));
    if (data.type === "/hyle.zktx.v1.MsgRegisterContract") {
        return MsgRegisterContract.decode(
            tx!.body!.messages.filter(
                (x: any) => x.typeUrl === "/hyle.zktx.v1.MsgRegisterContract",
            )[0].value,
        ) as any as T;
    } else if (data.type === "/hyle.zktx.v1.MsgPublishPayloads") {
        return MsgPublishPayloads.decode(
            tx!.body!.messages.filter(
                (x: any) => x.typeUrl === "/hyle.zktx.v1.MsgPublishPayloads",
            )[0].value,
        ) as any as T;
    }
    return undefined as any;
}

export const loadTxData = async () => {
    const response = await fetch(
        `${getNetworkRpcUrl(network.value)}/tx_search?query="tx.height>=0"&page=1&per_page=10&order_by="desc"`,
    );
    const txs = /*transactions.value = */ (await response.json()).result.txs;
    for (const tx of txs) {
        // HACK
        transactionData[tx.hash] = {
            hash: tx.hash,
            height: tx.height,
        };
    }
};

export const loadContractTxs = async (
    network: string,
    contract_name: string,
) => {
    // TODO: load register TXs as well
    const response = await fetch(
        `${getNetworkRpcUrl(network)}/tx_search?query="hyle.zktx.v1.EventPayload.contract_name='\\"${contract_name}\\"'"&page=1&per_page=10&order_by="desc"&match_events=true`,
    );
    const txs = /*transactions.value = */ (await response.json()).result.txs;
    for (const tx of txs) {
        // HACK
        transactionData[tx.hash] = {
            hash: tx.hash,
            height: tx.height,
            contracts: [contract_name],
        };
    }
};

// Load the latest by default
loadTxData();
