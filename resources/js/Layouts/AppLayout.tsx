import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, useState } from 'react';
import { 
    LayoutDashboard, 
    Users, 
    FolderKanban, 
    ClipboardList,
    Building2,
    Menu,
    X,
    ChevronDown,
    LogOut,
    User
} from 'lucide-react';

interface User {
    name: string;
    email: string;
}

interface PageProps {
    auth: {
        user: User;
    };
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Bidang', href: '/bidang', icon: Building2 },
    { name: 'Program', href: '/program', icon: FolderKanban },
    { name: 'Kegiatan', href: '/kegiatan', icon: ClipboardList },
    { name: 'Pelaku Usaha', href: '/pelaku-usaha', icon: Users },
];

export default function AppLayout({ children }: PropsWithChildren) {
    const { auth, flash } = usePage<PageProps>().props;
    const { url } = usePage();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden animate-fade-in"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 
                transform transition-transform duration-300 ease-in-out
                lg:translate-x-0
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-6 border-b">
                    <Link 
                        href="/dashboard" 
                        className="flex items-center gap-2"
                        prefetch="mount" // Inertia 2.x prefetching
                    >
                        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">DP</span>
                        </div>
                        <span className="font-semibold text-gray-900">Dinas Pertanian</span>
                    </Link>
                    <button 
                        className="lg:hidden p-1 text-gray-500 hover:text-gray-700"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation with prefetching */}
                <nav className="p-4 space-y-1">
                    {navigation.map((item) => {
                        const isActive = url.startsWith(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                prefetch="hover" // Inertia 2.x - prefetch on hover
                                className={`
                                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                                    transition-all duration-200
                                    ${isActive 
                                        ? 'bg-primary-50 text-primary-700' 
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    }
                                `}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? 'text-primary-600' : 'text-gray-400'}`} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top bar */}
                <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200">
                    <div className="h-full px-4 flex items-center justify-between">
                        <button 
                            className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        {/* User dropdown */}
                        <div className="relative ml-auto">
                            <button
                                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                            >
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <User className="w-4 h-4 text-green-600" />
                                </div>
                                <span className="hidden sm:block text-sm font-medium text-gray-700">
                                    {auth.user.name}
                                </span>
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                            </button>

                            {userMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1">
                                    <Link
                                        href="/profile"
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        <User className="w-4 h-4" />
                                        Profil
                                    </Link>
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Keluar
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Flash messages */}
                {flash?.success && (
                    <div className="mx-4 mt-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="mx-4 mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                        {flash.error}
                    </div>
                )}

                {/* Page content */}
                <main className="p-4 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
