import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageHeader, Card, StatsCard } from '@/Components';
import { Plus, Edit, Trash2, Key, Layers } from 'lucide-react';

interface Permission {
    id: number;
    name: string;
    display_name: string;
    description: string | null;
    group: string;
    roles_count: number;
}

interface Props {
    permissions: Permission[];
    grouped: Record<string, Permission[]>;
    summary: {
        total: number;
        groups: number;
    };
}

export default function PermissionsIndex({ grouped, summary }: Props) {
    const handleDelete = (permission: Permission) => {
        if (confirm(`Are you sure you want to delete "${permission.display_name}"?`)) {
            router.delete(`/settings/permissions/${permission.id}`);
        }
    };

    return (
        <AppLayout>
            <Head title="Permissions" />

            <div className="space-y-6">
                <PageHeader
                    title="Permissions"
                    subtitle="Manage system permissions"
                    action={{
                        label: 'Add Permission',
                        href: '/settings/permissions/create',
                        icon: Plus,
                    }}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <StatsCard
                        title="Total Permissions"
                        value={summary.total}
                        icon={Key}
                        color="primary"
                    />
                    <StatsCard
                        title="Permission Groups"
                        value={summary.groups}
                        icon={Layers}
                        color="secondary"
                    />
                </div>

                {Object.keys(grouped).length === 0 ? (
                    <Card>
                        <div className="p-12 text-center">
                            <Key className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                            <p className="text-theme-secondary mb-4">No permissions found</p>
                            <Link href="/settings/permissions/create" className="btn btn-primary">
                                <Plus className="w-4 h-4" />
                                Add First Permission
                            </Link>
                        </div>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        {Object.entries(grouped).map(([group, groupPermissions]) => (
                            <Card key={group} padding="none">
                                <div className="p-4 border-b border-theme">
                                    <h3 className="font-semibold text-theme-primary capitalize flex items-center gap-2">
                                        <Layers className="w-4 h-4 text-primary-500" />
                                        {group}
                                        <span className="text-sm font-normal text-theme-muted">
                                            ({groupPermissions.length} permissions)
                                        </span>
                                    </h3>
                                </div>
                                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {groupPermissions.map((permission) => (
                                        <div key={permission.id} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium text-theme-primary">{permission.display_name}</p>
                                                    <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-theme-muted">
                                                        {permission.name}
                                                    </code>
                                                </div>
                                                {permission.description && (
                                                    <p className="text-sm text-theme-secondary mt-0.5">{permission.description}</p>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-sm text-theme-muted">
                                                    {permission.roles_count} roles
                                                </span>
                                                <div className="flex items-center gap-1">
                                                    <Link
                                                        href={`/settings/permissions/${permission.id}/edit`}
                                                        className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(permission)}
                                                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
