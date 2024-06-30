import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8080,
    watch: {
      followSymlinks: true,
    },
  },
  plugins: [react()],
  build: {
    sourcemap: false,
    rollupOptions: {
      maxParallelFileOps: 2,
      cache: false,
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        },
        sourcemap: true,
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        inlineDynamicImports: false,
        sourcemapIgnoreList: (relativeSourcePath) => {
          const normalizedPath = path.normalize(relativeSourcePath);
          return normalizedPath.includes('node_modules');
        },
      }
    }
  },
  esbuild: {
    logOverride: { "this-is-undefined-in-esm": "silent" },
  },
});
