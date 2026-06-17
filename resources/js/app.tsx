import '../css/app.css';

import { createRoot, hydrateRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import type { ResolvedComponent } from '@inertiajs/react';
import { AppErrorBoundary } from './Components/ErrorBoundary';
import { ThemeProvider } from './Contexts/ThemeContext';
import { DeferredCacheProvider } from './Contexts/DeferredCacheContext';

const appName = import.meta.env.VITE_APP_NAME || 'Kominfo Admin';
const pages = import.meta.glob<{ default: ResolvedComponent }>('./Pages/**/*.tsx');

async function resolvePageComponent(name: string) {
    const page = pages[`./Pages/${name}.tsx`];

    if (!page) {
        throw new Error(`Page not found: ${name}`);
    }

    return (await page()).default;
}

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    
    resolve: resolvePageComponent,
    
    setup({ el, App, props }) {
        const AppWithProviders = (
            <AppErrorBoundary>
                <ThemeProvider>
                    <DeferredCacheProvider>
                        <App {...props} />
                    </DeferredCacheProvider>
                </ThemeProvider>
            </AppErrorBoundary>
        );

        if (import.meta.env.SSR) {
            hydrateRoot(el, AppWithProviders);
        } else {
            createRoot(el).render(AppWithProviders);
        }
    },
    
    progress: {
        color: '#2563EB', // Primary blue color (Tasikmalaya)
        showSpinner: true,
    },
});
