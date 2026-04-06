import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    'react-vendor': ['react', 'react-dom', 'react-router-dom'],
                    'ui-vendor':    ['react-hot-toast', 'react-icons', '@fortawesome/react-fontawesome'],
                    'http-vendor':  ['axios'],
                },
            },
        },
        chunkSizeWarningLimit: 600,
    },
    server: {
        hmr: true,
    },
});
