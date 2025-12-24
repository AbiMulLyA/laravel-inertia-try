import '../css/app.css';

import { createRoot, hydrateRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

const appName = import.meta.env.VITE_APP_NAME || 'Dinas Pertanian';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx')
        ),
    
    setup({ el, App, props }) {
        // Inertia 2.x requires passing props to App component
        if (import.meta.env.SSR) {
            hydrateRoot(el, <App {...props} />);
        } else {
            createRoot(el).render(<App {...props} />);
        }
    },
    
    progress: {
        color: '#16a34a', // Primary green color
        showSpinner: true,
    },
});
