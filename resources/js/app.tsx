import '../css/app.css';

import { createRoot, hydrateRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { ThemeProvider } from './Contexts/ThemeContext';

const appName = import.meta.env.VITE_APP_NAME || 'Kominfo Admin';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx')
        ),
    
    setup({ el, App, props }) {
        const AppWithProviders = (
            <ThemeProvider>
                <App {...props} />
            </ThemeProvider>
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
