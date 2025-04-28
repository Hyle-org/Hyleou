import { ref, Ref } from 'vue';
import { BlockStore, BlockInfo } from '@/state/blocks';

export interface Event {
    NewBlock: BlockInfo;
}

export class WebSocketService {
    private ws: WebSocket | null = null;
    private reconnectTimeout: number | null = null;
    private url: string;
    private blockStore: Ref<BlockStore>;

    constructor(url: string, blockStore: Ref<BlockStore>) {
        this.url = url;
        this.blockStore = blockStore;
    }

    connect() {
        this.ws = new WebSocket(this.url);
        
        this.ws.onopen = () => {
            console.log('WebSocket connected');
            // Register for new blocks topic
            this.ws?.send(JSON.stringify({ RegisterTopic: "new_block" }));
            if (this.reconnectTimeout) {
                clearTimeout(this.reconnectTimeout);
                this.reconnectTimeout = null;
            }
        };

        this.ws.onmessage = (event) => {
            const parsed: Event = JSON.parse(event.data);
            this.handleNewBlock(parsed.NewBlock);
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        this.ws.onclose = () => {
            console.log('WebSocket disconnected');
            this.reconnect();
        };
    }

    private handleNewBlock(block: BlockInfo) {
        console.log('New block:', block);
        this.blockStore.handleNewBlock(block);
    }

    private reconnect() {
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
        }
        this.reconnectTimeout = window.setTimeout(() => {
            this.connect();
        }, 5000);
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }
    }
} 