import { reactive, ref } from "vue";
import { getNetworkRpcUrl, getNetworkWebsocketUrl, network } from "./network";
import { WebSocketConnection } from "@/indexer";
import { base64ToUint8Array } from "@/utils";

export type BlockInfo = {
    hash: string;
    height: number;
    timestamp: Date;
    txs: string[];
};

export const blockData = reactive({} as Record<string, BlockInfo>);
export const blocks = ref(
    [] as {
        header: { height: number };
        num_txs: number;
    }[],
);

export const loadBlockData = async (blockIdentifier: string) => {
    if (blockData[blockIdentifier]) return;

    const response = await fetch(`${getNetworkRpcUrl(network.value)}/block?height=${blockIdentifier}`);
    const data = await response.json();

    let hashes = data.result.block.data.txs.map(async (x: any) => {
        const hash = await crypto.subtle.digest("SHA-256", base64ToUint8Array(x));
        return Array.from(new Uint8Array(hash))
            .map((x: number) => x.toString(16).padStart(2, "0"))
            .join("");
    });
    hashes = await Promise.all(hashes);

    blockData[blockIdentifier] = {
        hash: data.result.block_id.hash,
        height: data.result.block.header.height,
        timestamp: new Date(data.result.block.header.time),
        txs: await hashes,
    };
};

const loadBlocks = async () => {
    const response = await fetch(`${getNetworkRpcUrl(network.value)}/blockchain?no_cache=${Date.now()}`);
    blocks.value = (await response.json()).result.block_metas.reverse();
    const client = await WebSocketConnection.connect(`${getNetworkWebsocketUrl(network.value)}`);
    client.call("subscribe", { query: "tm.event='NewBlock'" }, (result) => {
        if (!result.data?.value?.block) return;
        blocks.value.push({
            header: { height: result.data.value.block.header.height },
            num_txs: result.data.value.block.data.txs.length,
        });
    });
};
loadBlocks();
