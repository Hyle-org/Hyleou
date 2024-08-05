import { getNetworkRpcUrl, getNetworkWebsocketUrl } from "./network";
import { WebSocketConnection } from "@/indexer";
import { base64ToUint8Array } from "@/utils";

export type BlockInfo = {
    hash: string;
    height: number;
    timestamp: Date;
    txs: string[];
};

export class BlockStore {
    network: string;
    blockData: Record<string, BlockInfo>;
    blocks: { header: { height: number }; num_txs: number }[];

    constructor(network: string) {
        this.network = network;
        this.blockData = {};
        this.blocks = [];
    }

    async loadBlockData(blockIdentifier: string) {
        if (this.blockData[blockIdentifier]) return;

        const response = await fetch(`${getNetworkRpcUrl(this.network)}/block?height=${blockIdentifier}`);
        const data = await response.json();

        let hashes = data.result.block.data.txs.map(async (x: any) => {
            const hash = await crypto.subtle.digest("SHA-256", base64ToUint8Array(x));
            return Array.from(new Uint8Array(hash))
                .map((x: number) => x.toString(16).padStart(2, "0"))
                .join("");
        });
        hashes = await Promise.all(hashes);

        this.blockData[blockIdentifier] = {
            hash: data.result.block_id.hash,
            height: data.result.block.header.height,
            timestamp: new Date(data.result.block.header.time),
            txs: await hashes,
        };
    }

    async loadBlocks() {
        const response = await fetch(`${getNetworkRpcUrl(this.network)}/blockchain?no_cache=${Date.now()}`);
        this.blocks = (await response.json()).result.block_metas.reverse();
        const client = await WebSocketConnection.connect(`${getNetworkWebsocketUrl(this.network)}`);
        client.call("subscribe", { query: "tm.event='NewBlock'" }, (result) => {
            if (!result.data?.value?.block) return;
            this.blocks.push({
                header: { height: result.data.value.block.header.height },
                num_txs: result.data.value.block.data.txs.length,
            });
        });
    }
}
