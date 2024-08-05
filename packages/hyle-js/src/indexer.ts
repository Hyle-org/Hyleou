import { getNetworkWebsocketUrl } from "./network";

export class WebSocketConnection {
    protected ws!: WebSocket;
    private url: string;

    private idCounter: number = 1;
    protected messageHandlers: { [id: number]: (result: any) => void } = {};

    private reconnectAttempts: number = 0;

    opened!: Promise<void>;

    static async connect(url: string) {
        const client = new WebSocketConnection(url);
        await client.opened;
        return client;
    }

    protected constructor(url: string) {
        this.url = url;
        this.connectWebSocket();
    }

    private async connectWebSocket() {
        this.opened = new Promise(async (resolve, reject) => {
            this.ws = new WebSocket(this.url);

            this.ws.onerror = () => {
                this.attemptReconnect().catch(reject);
            };

            this.ws.onclose = () => {
                this.attemptReconnect().catch(reject);
            };

            this.ws.onopen = () => {
                this.reconnectAttempts = 0; // Reset reconnect attempts on successful connection
                resolve();
            };
        });
        await this.opened;

        this.ws.onmessage = (event) => this.onMessage(event);
    }

    private async attemptReconnect() {
        if (this.reconnectAttempts < 3) {
            await new Promise((resolve) => setTimeout(resolve, Math.pow(2, this.reconnectAttempts) * 1000));
            this.reconnectAttempts++;
            await this.connectWebSocket();
        } else {
            throw new Error("Maximum reconnect attempts reached.");
        }
    }

    async call(method: string, params: any, handler: (result: any) => void) {
        const id = this.idCounter++;
        const payload = JSON.stringify({ jsonrpc: "2.0", method, params, id });
        this.messageHandlers[id] = handler;
        this.ws.send(payload);
    }

    private onMessage(event: MessageEvent) {
        const message = JSON.parse(event.data);
        // console.log('Received message for', message.id);
        if (message.result) {
            this.messageHandlers[message.id]?.(message.result);
        }
    }
}

class JSONRpcClient extends WebSocketConnection {
    private MAX_PAGE_SIZE = 40;

    static async connect(url: string) {
        const client = new JSONRpcClient(url);
        await client.opened;
        return client;
    }

    private async search(endpoint: string, query: string, handler: (result: any) => void) {
        const total_count = await new Promise<number>((resolve) => {
            this.call(endpoint, { query, per_page: `${this.MAX_PAGE_SIZE}`, order_by: "desc" }, (result) => {
                handler(result);
                resolve(+result.total_count);
            });
        });
        // Search results are paginated, so we need to fetch all pages
        for (let i = 1; i * this.MAX_PAGE_SIZE < total_count; i++) {
            this.call(
                endpoint,
                {
                    query,
                    page: `${i + 1}`,
                    per_page: `${this.MAX_PAGE_SIZE}`,
                    order_by: "desc",
                },
                async (result) => {
                    handler(result);
                },
            );
        }
    }

    private subscribe(query: string, handler: (result: any) => void) {
        return this.call("subscribe", { query }, (result) => {
            if (!result.data?.value?.TxResult) {
                return;
            }
            handler(result.data.value.TxResult);
        });
    }

    async searchAndSubscribe(endpoint: string, query: string, onNewResult: (client: JSONRpcClient) => void) {
        this.subscribe(query, onNewResult);
        // TODO: It's possible that we actually miss some data between subscribe and search
        // but that's fine for now.
        this.search(endpoint, query, (result) => {
            result.txs.forEach((tx: any) => onNewResult(tx));
        });
    }
}

export async function subscribeToTxSearch(network: string, query: string, handler: (result: any) => void) {
    const client = await JSONRpcClient.connect(`${getNetworkWebsocketUrl(network)}/websocket`);
    client.searchAndSubscribe("tx_search", query, handler);
    // TODO return stop function
}
