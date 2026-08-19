import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
export default defineConfig(function (_a) {
    var mode = _a.mode;
    var env = loadEnv(mode, process.cwd(), "");
    return {
        plugins: [react()],
        resolve: {
            alias: { "@": path.resolve(__dirname, "src") },
        },
        server: {
            port: 5173,
            proxy: {
                "/api": {
                    target: env.VITE_API_URL || "http://localhost:5000",
                    changeOrigin: true,
                },
            },
        },
        build: {
            outDir: "dist",
            sourcemap: false,
            rollupOptions: { output: { manualChunks: undefined } },
        },
    };
});
