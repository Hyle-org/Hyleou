import { defineConfig } from "vite";
import { fileURLToPath, URL } from "url";
import vue from "@vitejs/plugin-vue";
import copy from "rollup-plugin-copy";

const wasmContentTypePlugin = {
    name: "wasm-content-type-plugin",
    configureServer(server: any) {
        server.middlewares.use((req: any, res: any, next: any) => {
            if (req.url.endsWith(".wasm")) {
                res.setHeader("Content-Type", "application/wasm");
            }
            next();
        });
    },
};

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        host: true,
        port: 8000
    },
    preview: {
        host: true,
        port: 8000
    },
    esbuild: {
        target: 'esnext',
        supported: {
            'top-level-await': true
        },
    },
    optimizeDeps: {
        esbuildOptions: {
            target: 'esnext',
            supported: {
                'top-level-await': true
            },
        },
    },
    build: {
        sourcemap: 'inline',
        minify: false,
        target: 'esnext',
    },
    resolve: {
        alias: [
            { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
        ],
    },
    plugins: [
        vue(),
        copy({
            targets: [
                { src: 'node_modules/**/*.wasm', dest: 'node_modules/.vite/deps' },
            ],
            copySync: true,
            hook: 'buildStart',
        }),
        wasmContentTypePlugin
    ],
});
