import {mergeConfig} from "vite"

import viteApp from "./vite-app.vite.config"

const host = process.env.TAURI_DEV_HOST

export default mergeConfig(viteApp, {
  build: {
    target: "es2022",
  },
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
})
