import { PageProps as InertiaPageProps } from '@inertiajs/react';

declare global {
    interface Window {
        axios: import('axios').AxiosInstance;
    }
}

declare module '@inertiajs/react' {
    interface PageProps extends InertiaPageProps {
        auth: {
            user: {
                id: number;
                name: string;
                email: string;
            };
        };
        flash: {
            success?: string;
            error?: string;
            import_result?: {
                total: number;
                success: number;
                failed: number;
                errors: string[];
            };
        };
        ziggy: {
            url: string;
            port: number | null;
            defaults: Record<string, unknown>;
            routes: Record<string, string>;
        };
    }
}

// Route helper from Ziggy
declare function route(
    name: string,
    params?: Record<string, string | number>,
    absolute?: boolean
): string;

// Vite environment
interface ImportMetaEnv {
    readonly VITE_APP_NAME: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

export {};
