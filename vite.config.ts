import { defineConfig } from "vite";
import { fileURLToPath, URL } from "url";
import vue from "@vitejs/plugin-vue";

import { visualizer } from "rollup-plugin-visualizer";
import analyze from "rollup-plugin-analyzer";

// https://vitejs.dev/config/
export default defineConfig({
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
