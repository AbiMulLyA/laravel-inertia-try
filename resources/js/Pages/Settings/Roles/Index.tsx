import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageHeader, Card, StatsCard } from '@/Components';
import { Plus, Edit, Trash2, Shield, Users } from 'lucide-react';

interface Role {
    id: number;
    name: string;
    display_name: string;
    description: string | null;
    color: string;
    is_default: boolean;
    users_count: number;
    permissions_count: number;
}

interface Props {
    roles: Role[];
    summary: {
        total: number;
        with_users: number;
    };
}

export default function RolesIndex({ roles, summary }: Props) {
    const handleDelete = (role: Role) => {
        if (role.users_count > 0) {
            alert('Cannot delete role with assigned users.');
            return;
        }
        if (confirm(`Are you sure you want to delete "${role.display_name}"?`)) {
            router.delete(`/settings/roles/${role.id}`);
        }
    };

    return (
        <AppLayout>
            <Head title="Roles" />

            <div className="space-y-6">
                <PageHeader
                    title="Roles"
                    subtitle="Manage user roles and their permissions"
                    action={{
                        label: 'Add Role',
                        href: '/settings/roles/create',
                        icon: Plus,
                    }}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <StatsCard
                        title="Total Roles"
                        value={summary.total}
                        icon={Shield}
                        color="primary"
                    />
                    <StatsCard
                        title="Roles with Users"
                        value={summary.with_users}
                        icon={Users}
                        color="secondary"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {roles.map((role) => (
                        <Card key={role.id} padding="none">
                            <div className="p-5">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div 
                                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                                            style={{ backgroundColor: `${role.color}20` }}
                                        >
                                            <Shield 
                                                className="w-5 h-5" 
                                                style={{ color: role.color }}
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-theme-primary">
                                                {role.display_name}
                                            </h3>
                                            <p className="text-xs text-theme-muted font-mono">
                                                {role.name}
                                            </p>
                                        </div>
                                    </div>
                                    {role.is_default && (
                                        <span className="px-2 py-0.5 bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 text-xs font-medium rounded">
                                            Default
                                        </span>
                                    )}
                                </div>

                                {role.description && (
                                    <p className="text-sm text-theme-secondary mb-4 line-clamp-2">
                                        {role.description}
                                    </p>
                                )}

                                <div className="flex items-center gap-4 text-sm text-theme-muted mb-4">
                                    <span className="flex items-center gap-1">
                                        <Users className="w-4 h-4" />
                                        {role.users_count} users
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Shield className="w-4 h-4" />
                                        {role.permissions_count} permissions
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 pt-3 border-t border-theme">
                                    <Link
                                        href={`/settings/roles/${role.id}/edit`}
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(role)}
                                        disabled={role.users_count > 0}
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {roles.length === 0 && (
                    <Card>
                        <div className="p-12 text-center">
                            <Shield className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                            <p className="text-theme-secondary mb-4">No roles found</p>
                            <Link href="/settings/roles/create" className="btn btn-primary">
                                <Plus className="w-4 h-4" />
                                Add First Role
                            </Link>
                        </div>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
