import { Component, type ErrorInfo, type ReactNode } from 'react';

type AppErrorBoundaryProps = {
    children: ReactNode;
};

type AppErrorBoundaryState = {
    error: Error | null;
};

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
    state: AppErrorBoundaryState = {
        error: null,
    };

    static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
        return { error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Application render error', error, errorInfo);
    }

    render() {
        if (this.state.error) {
            return (
                <main className="min-h-screen bg-slate-50 px-6 py-16 text-slate-900">
                    <div className="mx-auto max-w-xl rounded-2xl border border-red-100 bg-white p-8 shadow-sm">
                        <p className="text-sm font-semibold uppercase tracking-wide text-red-600">Application Error</p>
                        <h1 className="mt-3 text-2xl font-bold">Halaman gagal dimuat</h1>
                        <p className="mt-3 text-sm leading-6 text-slate-600">
                            Terjadi kesalahan pada tampilan. Silakan refresh halaman, atau hubungi tim teknis jika masalah berulang.
                        </p>
                        <pre className="mt-5 overflow-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-100">
                            {this.state.error.message}
                        </pre>
                    </div>
                </main>
            );
        }

        return this.props.children;
    }
}
