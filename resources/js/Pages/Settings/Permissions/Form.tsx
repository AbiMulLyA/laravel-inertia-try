import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { PageHeader, Card } from '@/Components';
import { Key, ArrowLeft } from 'lucide-react';
import { FormEvent, useState } from 'react';

interface PermissionData {
    id?: number;
    name: string;
    display_name: string;
    description: string | null;
    group: string;
}

interface Props {
    permission: PermissionData | null;
    groups: string[];
    isEdit: boolean;
}

export default function PermissionForm({ permission, groups, isEdit }: Props) {
    const [isNewGroup, setIsNewGroup] = useState(false);
    const [newGroup, setNewGroup] = useState('');

    const form = useForm({
        name: permission?.name || '',
        display_name: permission?.display_name || '',
        description: permission?.description || '',
        group: permission?.group || groups[0] || 'general',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        
        // Update group if new group is entered
        if (isNewGroup && newGroup) {
            form.setData('group', newGroup.toLowerCase());
        }

        if (isEdit && permission?.id) {
            form.put(`/settings/permissions/${permission.id}`);
        } else {
            form.post('/settings/permissions');
        }
    };

    return (
        <AppLayout>
            <Head title={isEdit ? 'Edit Permission' : 'Add Permission'} />

            <div className="space-y-6 max-w-2xl">
                <div className="flex items-center gap-4">
                    <Link
                        href="/settings/permissions"
                        className="p-2 text-theme-muted hover:text-theme-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <PageHeader
                        title={isEdit ? 'Edit Permission' : 'Add Permission'}
                        subtitle={isEdit ? `Editing ${permission?.display_name}` : 'Create a new permission'}
                    />
                </div>

                <form onSubmit={handleSubmit}>
                    <Card>
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/50 rounded-lg flex items-center justify-center">
                                    <Key className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-theme-primary">Permission Details</h3>
                                    <p className="text-sm text-theme-secondary">Define the permission identifier and settings</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="form-label">Name (identifier)</label>
                                    <input
                                        type="text"
                                        value={form.data.name}
                                        onChange={(e) => form.setData('name', e.target.value.toLowerCase().replace(/\s/g, '.'))}
                                        className="form-input font-mono"
                                        placeholder="users.create"
                                    />
                                    <p className="text-xs text-theme-muted mt-1">Use dots to separate namespace (e.g., users.create, projects.delete)</p>
                                    {form.errors.name && <p className="text-sm text-red-600 mt-1">{form.errors.name}</p>}
                                </div>

                                <div>
                                    <label className="form-label">Display Name</label>
                                    <input
                                        type="text"
                                        value={form.data.display_name}
                                        onChange={(e) => form.setData('display_name', e.target.value)}
                                        className="form-input"
                                        placeholder="Create Users"
                                    />
                                    {form.errors.display_name && <p className="text-sm text-red-600 mt-1">{form.errors.display_name}</p>}
                                </div>

                                <div>
                                    <label className="form-label">Description</label>
                                    <textarea
                                        value={form.data.description}
                                        onChange={(e) => form.setData('description', e.target.value)}
                                        className="form-input"
                                        rows={2}
                                        placeholder="Allows creating new user accounts"
                                    />
                                </div>

                                <div>
                                    <label className="form-label">Group</label>
                                    <div className="flex items-center gap-2 mb-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                checked={!isNewGroup}
                                                onChange={() => setIsNewGroup(false)}
                                                className="text-primary-600"
                                            />
                                            <span className="text-sm text-theme-secondary">Existing group</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                checked={isNewGroup}
                                                onChange={() => setIsNewGroup(true)}
                                                className="text-primary-600"
                                            />
                                            <span className="text-sm text-theme-secondary">New group</span>
                                        </label>
                                    </div>
                                    
                                    {isNewGroup ? (
                                        <input
                                            type="text"
                                            value={newGroup}
                                            onChange={(e) => setNewGroup(e.target.value)}
                                            className="form-input"
                                            placeholder="New group name"
                                        />
                                    ) : (
                                        <select
                                            value={form.data.group}
                                            onChange={(e) => form.setData('group', e.target.value)}
                                            className="form-input"
                                        >
                                            {groups.length === 0 && <option value="general">general</option>}
                                            {groups.map((group) => (
                                                <option key={group} value={group}>{group}</option>
                                            ))}
                                        </select>
                                    )}
                                    {form.errors.group && <p className="text-sm text-red-600 mt-1">{form.errors.group}</p>}
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-theme">
                                <Link href="/settings/permissions" className="btn btn-outline">Cancel</Link>
                                <button type="submit" disabled={form.processing} className="btn btn-primary">
                                    {form.processing ? 'Saving...' : isEdit ? 'Update Permission' : 'Create Permission'}
                                </button>
                            </div>
                        </div>
                    </Card>
                </form>
            </div>
        </AppLayout>
    );
}
