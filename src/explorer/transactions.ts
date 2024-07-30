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
    rawData: string;
    rawFullTxData: any;
};

export const transactionData = reactive({} as Record<string, TransactionInfo>);

export const settledTxData = reactive({} as Record<string, boolean>);

export const loadTransactionData = async (txHash: string) => {
    if (transactionData[txHash]) return;

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
    };
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
