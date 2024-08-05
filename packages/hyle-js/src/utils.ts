export function hexToUint8Array(hex: string): Uint8Array {
    let evenHex = hex;
    if (hex.length % 2 !== 0) evenHex = "0" + hex;
    const len = evenHex.length / 2;
    const arr = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        arr[i] = parseInt(evenHex.slice(i * 2, 2), 16);
    }
    return arr;
}

export function uint8ArrayToBase64(array: Uint8Array): string {
    if (typeof Buffer !== "undefined") return Buffer.from(array).toString("base64");
    // Work around call stack issues with large arrays
    const CHUNK_SIZE = 0x8000;
    let index = 0;
    const length = array.length;
    let result = "";
    while (index < length) {
        const end = Math.min(length, index + CHUNK_SIZE);
        result += String.fromCharCode.apply(null, array.slice(index, end) as any);
        index = end;
    }
    return btoa(result);
}

export function base64ToUint8Array(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}
