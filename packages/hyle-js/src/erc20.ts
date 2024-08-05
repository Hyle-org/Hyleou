import { MsgPublishPayloads } from "./proto/tx";
import { getParsedTx, TransactionInfo } from "./transactions";

function decimalToAscii(encodedString: string) {
    let asHex = BigInt(encodedString).toString(16);
    // Pad with 0s
    if (asHex.length % 2 !== 0) asHex = "0" + asHex;
    const asBytes = [];
    for (let i = 0; i < asHex.length; i += 2) {
        asBytes.push(String.fromCharCode(parseInt(asHex.slice(i, i + 2), 16)));
    }
    return asBytes.join("");
}

export function deserByteArray(data: string[]) {
    const words = +data[0];
    const remaining = +data.slice(-1);
    let result = "";
    for (let i = 1; i <= words; i++) {
        result += decimalToAscii(data[i]);
    }
    if (remaining > 0) result += decimalToAscii(data.slice(-2, -1)[0]);
    return result;
}

export class Erc20Parser {
    contractName = "erc20";

    balancesSettled = {} as Record<string, number>;
    balancesPending = {} as Record<string, number>;
    pendingPerAccount = {} as Record<string, string[]>;
    pendingTxs = {} as Record<string, MsgPublishPayloads>;

    constructor(contractName?: string) {
        if (contractName) this.contractName = contractName;
    }

    consumeTx(tx: TransactionInfo) {
        if (tx.type !== "/hyle.zktx.v1.MsgPublishPayloads") return;
        const msg = getParsedTx<MsgPublishPayloads>(tx);
        this.consumePayload(msg, tx.hash);
    }

    consumePayload(msg: MsgPublishPayloads, hash: string) {
        msg.payloads.forEach((payload) => {
            if (payload.contractName !== this.contractName) return;
            // TODO: check identity
            // Parse payload data as ascii
            const parsed = new TextDecoder().decode(payload.data);
            const felts = parsed.slice(1, -1).split(" ");
            const fromSize = parseInt(felts[0]);
            const from = deserByteArray(felts.slice(0, fromSize + 3));
            const toSize = parseInt(felts[3 + fromSize]);
            const to = deserByteArray(felts.slice(3 + fromSize, 3 + fromSize + toSize + 3));
            const amount = parseInt(felts.slice(-1)[0]);
            // Update balances
            this.balancesPending[from] = (this.balancesPending[from] || this.balancesSettled[from] || 0) - amount;
            this.balancesPending[to] = (this.balancesPending[to] || this.balancesSettled[to] || 0) + amount;
            this.pendingPerAccount[from] = this.pendingPerAccount[from] || [];
            this.pendingPerAccount[from].push(hash);
            this.pendingPerAccount[to] = this.pendingPerAccount[to] || [];
            this.pendingPerAccount[to].push(hash);
            this.pendingTxs[hash] = msg;
        });
    }

    settleTx(hash: string, success: boolean) {
        const msg = this.pendingTxs[hash];
        msg.payloads.forEach((payload) => {
            if (payload.contractName !== this.contractName) return;
            // Parse payload data as ascii
            const parsed = new TextDecoder().decode(payload.data);
            const felts = parsed.slice(1, -1).split(" ");
            // First item is array length, ignore
            const fromSize = parseInt(felts[0]);
            const from = deserByteArray(felts.slice(0, fromSize + 3));
            const toSize = parseInt(felts[3 + fromSize]);
            const to = deserByteArray(felts.slice(3 + fromSize, 3 + fromSize + toSize + 3));
            const amount = parseInt(felts.slice(-1)[0]);
            this.balancesPending[from] = (this.balancesPending[from] || 0) + amount;
            this.balancesPending[to] = (this.balancesPending[to] || 0) - amount;
            if (success) {
                // Update balances
                this.balancesSettled[from] = (this.balancesSettled[from] || 0) - amount;
                this.balancesSettled[to] = (this.balancesSettled[to] || 0) + amount;
            }
            // Pop pending (must exist)
            const pending = this.pendingPerAccount[from];
            pending.splice(pending.indexOf(hash), 1);
            if (pending.length === 0) delete this.pendingPerAccount[from];
            const pendingTo = this.pendingPerAccount[to];
            pendingTo.splice(pendingTo.indexOf(hash), 1);
            if (pendingTo.length === 0) delete this.pendingPerAccount[to];
        });
    }
}
