import { defineConfig } from "vite";
import { fileURLToPath, URL } from "url";
import vue from "@vitejs/plugin-vue";

import { visualizer } from "rollup-plugin-visualizer";
import analyze from "rollup-plugin-analyzer";

let root = fileURLToPath(new URL("./", import.meta.url));
if (!root.endsWith("/packages/hyleou/")) root += "/packages/hyleou/";

// https://vitejs.dev/config/
export default defineConfig({
    root,
    server: {
        host: true,
        port: 8000,
    },
    preview: {
        host: true,
        port: 8000,
    },
    build: {
        sourcemap: true,
        target: "esnext",
    },
    resolve: {
        alias: [
            {
                find: "@",
                replacement: fileURLToPath(new URL("./src", import.meta.url)),
            },
        ],
    },
    plugins: [vue() /*, visualizer(), analyze()*/],
});
