import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { PageHeader, Card } from '@/Components';
import { Shield, ArrowLeft, Check } from 'lucide-react';
import { FormEvent } from 'react';

interface PermissionData {
    id: number;
    name: string;
    display_name: string;
    description: string | null;
    group: string;
}

interface RoleData {
    id?: number;
    name: string;
    display_name: string;
    description: string | null;
    color: string;
    is_default: boolean;
    permissions: number[];
}

interface Props {
    role: RoleData | null;
    permissions: Record<string, PermissionData[]>;
    isEdit: boolean;
}

const colorOptions = [
    { name: 'Blue', value: '#2563EB' },
    { name: 'Green', value: '#16A34A' },
    { name: 'Gold', value: '#F59E0B' },
    { name: 'Red', value: '#DC2626' },
    { name: 'Purple', value: '#7C3AED' },
    { name: 'Cyan', value: '#0891B2' },
    { name: 'Pink', value: '#DB2777' },
    { name: 'Gray', value: '#6B7280' },
];

export default function RoleForm({ role, permissions, isEdit }: Props) {
    const form = useForm({
        name: role?.name || '',
        display_name: role?.display_name || '',
        description: role?.description || '',
        color: role?.color || '#2563EB',
        is_default: role?.is_default || false,
        permissions: role?.permissions || [],
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (isEdit && role?.id) {
            form.put(`/settings/roles/${role.id}`);
        } else {
            form.post('/settings/roles');
        }
    };

    const togglePermission = (permissionId: number) => {
        const current = form.data.permissions;
        if (current.includes(permissionId)) {
            form.setData('permissions', current.filter(id => id !== permissionId));
        } else {
            form.setData('permissions', [...current, permissionId]);
        }
    };

    const toggleGroup = (group: string) => {
        const groupPermissionIds = permissions[group]?.map(p => p.id) || [];
        const allSelected = groupPermissionIds.every(id => form.data.permissions.includes(id));
        
        if (allSelected) {
            form.setData('permissions', form.data.permissions.filter(id => !groupPermissionIds.includes(id)));
        } else {
            const newPermissions = [...new Set([...form.data.permissions, ...groupPermissionIds])];
            form.setData('permissions', newPermissions);
        }
    };

    return (
        <AppLayout>
            <Head title={isEdit ? 'Edit Role' : 'Add Role'} />

            <div className="space-y-6 max-w-4xl">
                <div className="flex items-center gap-4">
                    <Link
                        href="/settings/roles"
                        className="p-2 text-theme-muted hover:text-theme-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <PageHeader
                        title={isEdit ? 'Edit Role' : 'Add Role'}
                        subtitle={isEdit ? `Editing ${role?.display_name}` : 'Create a new role with permissions'}
                    />
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <Card>
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div 
                                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                                    style={{ backgroundColor: `${form.data.color}20` }}
                                >
                                    <Shield className="w-5 h-5" style={{ color: form.data.color }} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-theme-primary">Role Information</h3>
                                    <p className="text-sm text-theme-secondary">Basic role details</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="form-label">Name (slug)</label>
                                    <input
                                        type="text"
                                        value={form.data.name}
                                        onChange={(e) => form.setData('name', e.target.value.toLowerCase().replace(/\s/g, '_'))}
                                        className="form-input font-mono"
                                        placeholder="admin"
                                    />
                                    {form.errors.name && <p className="text-sm text-red-600 mt-1">{form.errors.name}</p>}
                                </div>

                                <div>
                                    <label className="form-label">Display Name</label>
                                    <input
                                        type="text"
                                        value={form.data.display_name}
                                        onChange={(e) => form.setData('display_name', e.target.value)}
                                        className="form-input"
                                        placeholder="Administrator"
                                    />
                                    {form.errors.display_name && <p className="text-sm text-red-600 mt-1">{form.errors.display_name}</p>}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        value={form.data.description}
                                        onChange={(e) => form.setData('description', e.target.value)}
                                        className="form-input"
                                        rows={2}
                                        placeholder="Brief description of this role..."
                                    />
                                </div>

                                <div>
                                    <label className="form-label">Color</label>
                                    <div className="flex flex-wrap gap-2">
                                        {colorOptions.map((color) => (
                                            <button
                                                key={color.value}
                                                type="button"
                                                onClick={() => form.setData('color', color.value)}
                                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-transform ${
                                                    form.data.color === color.value ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''
                                                }`}
                                                style={{ backgroundColor: color.value }}
                                                title={color.name}
                                            >
                                                {form.data.color === color.value && (
                                                    <Check className="w-4 h-4 text-white" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={form.data.is_default}
                                            onChange={(e) => form.setData('is_default', e.target.checked)}
                                            className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                        />
                                        <span className="text-sm font-medium text-theme-primary">Set as default role for new users</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Permissions */}
                    <Card>
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-theme-primary mb-2">Permissions</h3>
                            <p className="text-sm text-theme-secondary mb-6">Select which permissions this role should have</p>

                            {Object.keys(permissions).length === 0 ? (
                                <div className="text-center py-8 text-theme-muted">
                                    <p>No permissions available. Create some permissions first.</p>
                                    <Link href="/settings/permissions/create" className="btn btn-outline mt-4">
                                        Add Permission
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {Object.entries(permissions).map(([group, groupPermissions]) => {
                                        const groupIds = groupPermissions.map(p => p.id);
                                        const allSelected = groupIds.every(id => form.data.permissions.includes(id));

                                        return (
                                            <div key={group} className="border border-theme rounded-xl p-4">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h4 className="font-medium text-theme-primary capitalize">{group}</h4>
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleGroup(group)}
                                                        className="text-sm text-primary-600 hover:text-primary-700"
                                                    >
                                                        {allSelected ? 'Deselect all' : 'Select all'}
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                                    {groupPermissions.map((permission) => (
                                                        <label
                                                            key={permission.id}
                                                            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                                                                form.data.permissions.includes(permission.id)
                                                                    ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800'
                                                                    : 'bg-gray-50 dark:bg-gray-800/50 border border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                                                            }`}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={form.data.permissions.includes(permission.id)}
                                                                onChange={() => togglePermission(permission.id)}
                                                                className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                                            />
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium text-theme-primary truncate">
                                                                    {permission.display_name}
                                                                </p>
                                                                <p className="text-xs text-theme-muted font-mono truncate">
                                                                    {permission.name}
                                                                </p>
                                                            </div>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3">
                        <Link href="/settings/roles" className="btn btn-outline">Cancel</Link>
                        <button type="submit" disabled={form.processing} className="btn btn-primary">
                            {form.processing ? 'Saving...' : isEdit ? 'Update Role' : 'Create Role'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
