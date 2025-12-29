import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageHeader, Card, StatsCard } from '@/Components';
import { 
    Plus, 
    Edit, 
    Trash2, 
    Search,
    Users,
    UserPlus,
    ShieldCheck,
    ChevronLeft,
    ChevronRight,
    MoreHorizontal
} from 'lucide-react';
import { useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    role?: string;
    email_verified_at?: string;
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    users: {
        data: User[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: PaginationLink[];
    };
    summary: {
        total: number;
        this_month: number;
        verified: number;
    };
    filters: {
        search?: string;
    };
}

export default function UsersIndex({ users, summary, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/settings/users', { search }, { preserveState: true });
    };

    const handleDelete = (user: User) => {
        if (confirm(`Are you sure you want to delete "${user.name}"?`)) {
            router.delete(`/settings/users/${user.id}`);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    // Get user initials
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <AppLayout>
            <Head title="User Management" />

            <div className="space-y-6">
                {/* Header */}
                <PageHeader
                    title="User Management"
                    subtitle="Manage system users and their access"
                    action={{
                        label: 'Add User',
                        href: '/settings/users/create',
                        icon: Plus,
                    }}
                />

                {/* Summary Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatsCard
                        title="Total Users"
                        value={summary.total}
                        icon={Users}
                        color="primary"
                    />
                    <StatsCard
                        title="New This Month"
                        value={summary.this_month}
                        icon={UserPlus}
                        color="secondary"
                    />
                    <StatsCard
                        title="Verified"
                        value={summary.verified}
                        icon={ShieldCheck}
                        color="accent"
                    />
                </div>

                {/* Filters */}
                <Card padding="none">
                    <div className="p-4 border-b border-theme">
                        <form onSubmit={handleSearch} className="flex gap-3">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="form-input pl-10"
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">
                                Search
                            </button>
                        </form>
                    </div>

                    {/* Users Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-800/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-theme-secondary uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-theme-secondary uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-theme-secondary uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-theme-secondary uppercase tracking-wider">
                                        Joined
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-theme-secondary uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {users.data.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <span className="text-white font-semibold text-sm">
                                                        {getInitials(user.name)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-theme-primary">{user.name}</p>
                                                    <p className="text-sm text-theme-muted">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300">
                                                {user.role || 'User'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.email_verified_at ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-100 dark:bg-secondary-900/50 text-secondary-700 dark:text-secondary-300">
                                                    Verified
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                                                    Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-theme-secondary">
                                            {formatDate(user.created_at)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/settings/users/${user.id}/edit`}
                                                    className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(user)}
                                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty State */}
                    {users.data.length === 0 && (
                        <div className="p-12 text-center">
                            <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                            <p className="text-theme-secondary mb-4">No users found</p>
                            <Link href="/settings/users/create" className="btn btn-primary">
                                <Plus className="w-4 h-4" />
                                Add First User
                            </Link>
                        </div>
                    )}

                    {/* Pagination */}
                    {users.last_page > 1 && (
                        <div className="px-6 py-4 border-t border-theme flex items-center justify-between">
                            <p className="text-sm text-theme-secondary">
                                Showing {(users.current_page - 1) * users.per_page + 1} to{' '}
                                {Math.min(users.current_page * users.per_page, users.total)} of {users.total} users
                            </p>
                            <div className="flex items-center gap-1">
                                {users.links.map((link, index) => {
                                    if (link.label.includes('Previous')) {
                                        return (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`p-2 rounded-lg ${
                                                    link.url
                                                        ? 'text-theme-secondary hover:bg-gray-100 dark:hover:bg-gray-800'
                                                        : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                                                }`}
                                                preserveState
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                            </Link>
                                        );
                                    }
                                    if (link.label.includes('Next')) {
                                        return (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`p-2 rounded-lg ${
                                                    link.url
                                                        ? 'text-theme-secondary hover:bg-gray-100 dark:hover:bg-gray-800'
                                                        : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                                                }`}
                                                preserveState
                                            >
                                                <ChevronRight className="w-4 h-4" />
                                            </Link>
                                        );
                                    }
                                    if (link.label === '...') {
                                        return (
                                            <span key={index} className="px-2 text-theme-muted">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </span>
                                        );
                                    }
                                    return (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                                                link.active
                                                    ? 'bg-primary-600 text-white'
                                                    : 'text-theme-secondary hover:bg-gray-100 dark:hover:bg-gray-800'
                                            }`}
                                            preserveState
                                        >
                                            {link.label}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}
