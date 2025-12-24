import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ isSsrBuild }) => ({
    plugins: [
        // Tailwind CSS 4.1 - First-party Vite plugin
        tailwindcss(),
        
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        
        // React 19 with automatic JSX runtime
        react({
            jsxRuntime: 'automatic',
        }),
    ],
    
    resolve: {
        alias: {
            '@': '/resources/js',
        },
    },
    
    // Vite 7 - Optimized build configuration
    build: {
        // Use baseline-widely-available target (Vite 7 default)
        target: isSsrBuild ? 'node20' : 'baseline-widely-available',
        
        // Enable CSS code splitting for better caching (client only)
        cssCodeSplit: !isSsrBuild,
        
        // Minification using default (esbuild)
        minify: isSsrBuild ? false : 'esbuild',
        
        // Source maps for production debugging (optional)
        sourcemap: false,
        
        rollupOptions: {
            output: isSsrBuild ? {} : {
                // Improved chunking strategy for better caching (client only)
                manualChunks: {
                    'react-vendor': ['react', 'react-dom'],
                    'inertia': ['@inertiajs/react'],
                    'icons': ['lucide-react'],
                },
                // Use content hash for cache busting
                chunkFileNames: 'assets/js/[name]-[hash].js',
                entryFileNames: 'assets/js/[name]-[hash].js',
                assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
            },
        },
    },
    
    // Vite 7 - Optimized dependency pre-bundling
    optimizeDeps: {
        include: [
            'react',
            'react-dom',
            '@inertiajs/react',
            'lucide-react',
        ],
    },
    
    // Development server
    server: {
        hmr: {
            host: 'localhost',
        },
        // Warm up frequently used files for faster dev experience
        warmup: {
            clientFiles: [
                './resources/js/app.tsx',
                './resources/js/Pages/**/*.tsx',
                './resources/js/Components/**/*.tsx',
            ],
        },
    },
    
    // Vite 7 - Preview server configuration
    preview: {
        port: 4173,
    },
    
    // Enable esbuild optimizations
    esbuild: {
        // Drop console.log in production (client only)
        drop: !isSsrBuild && process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    },
}));

