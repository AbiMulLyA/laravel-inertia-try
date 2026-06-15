import { createInertiaApp } from '@inertiajs/react';
import type { ResolvedComponent } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { renderToString } from 'react-dom/server';

const appName = import.meta.env.VITE_APP_NAME || 'Kominfo Base Laravel Inertia';
const pages = import.meta.glob<{ default: ResolvedComponent }>('./Pages/**/*.tsx');

async function resolvePageComponent(name: string) {
    const page = pages[`./Pages/${name}.tsx`];

    if (!page) {
        throw new Error(`Page not found: ${name}`);
    }

    return (await page()).default;
}

createServer((page) =>
    createInertiaApp({
        page,
        render: renderToString,
        
        title: (title) => `${title} - ${appName}`,
        
        resolve: resolvePageComponent,
        
        setup: ({ App, props }) => <App {...props} />,
    })
);
