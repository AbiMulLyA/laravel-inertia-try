import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { PageHeader, Card } from '@/Components';
import { User, Mail, Lock, Shield, ArrowLeft } from 'lucide-react';
import { FormEvent } from 'react';

interface UserData {
    id?: number;
    name: string;
    email: string;
    role?: string;
    email_verified_at?: string;
    created_at?: string;
}

interface Props {
    user: UserData | null;
    isEdit: boolean;
}

export default function UserForm({ user, isEdit }: Props) {
    const form = useForm({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        password_confirmation: '',
        role: user?.role || 'User',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (isEdit && user?.id) {
            form.put(`/settings/users/${user.id}`);
        } else {
            form.post('/settings/users');
        }
    };

    const roleOptions = ['Administrator', 'User', 'Editor', 'Viewer'];

    return (
        <AppLayout>
            <Head title={isEdit ? 'Edit User' : 'Add User'} />

            <div className="space-y-6 max-w-3xl">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/settings/users"
                        className="p-2 text-theme-muted hover:text-theme-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <PageHeader
                        title={isEdit ? 'Edit User' : 'Add User'}
                        subtitle={isEdit ? `Editing ${user?.name}` : 'Create a new user account'}
                    />
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/50 rounded-lg flex items-center justify-center">
                                    <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-theme-primary">User Information</h3>
                                    <p className="text-sm text-theme-secondary">Basic account details</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="form-label">Name</label>
                                    <input
                                        type="text"
                                        value={form.data.name}
                                        onChange={(e) => form.setData('name', e.target.value)}
                                        className="form-input"
                                        placeholder="Enter full name"
                                    />
                                    {form.errors.name && (
                                        <p className="text-sm text-red-600 mt-1">{form.errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="form-label">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="email"
                                            value={form.data.email}
                                            onChange={(e) => form.setData('email', e.target.value)}
                                            className="form-input pl-10"
                                            placeholder="user@example.com"
                                        />
                                    </div>
                                    {form.errors.email && (
                                        <p className="text-sm text-red-600 mt-1">{form.errors.email}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Role */}
                    <Card>
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-secondary-100 dark:bg-secondary-900/50 rounded-lg flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-theme-primary">Role & Access</h3>
                                    <p className="text-sm text-theme-secondary">Assign user permissions</p>
                                </div>
                            </div>

                            <div>
                                <label className="form-label">Role</label>
                                <select
                                    value={form.data.role}
                                    onChange={(e) => form.setData('role', e.target.value)}
                                    className="form-input"
                                >
                                    {roleOptions.map((role) => (
                                        <option key={role} value={role}>
                                            {role}
                                        </option>
                                    ))}
                                </select>
                                {form.errors.role && (
                                    <p className="text-sm text-red-600 mt-1">{form.errors.role}</p>
                                )}
                            </div>
                        </div>
                    </Card>

                    {/* Password */}
                    <Card>
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-accent-100 dark:bg-accent-900/50 rounded-lg flex items-center justify-center">
                                    <Lock className="w-5 h-5 text-accent-600 dark:text-accent-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-theme-primary">
                                        {isEdit ? 'Change Password' : 'Set Password'}
                                    </h3>
                                    <p className="text-sm text-theme-secondary">
                                        {isEdit ? 'Leave blank to keep current password' : 'Create a secure password'}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="form-label">Password</label>
                                    <input
                                        type="password"
                                        value={form.data.password}
                                        onChange={(e) => form.setData('password', e.target.value)}
                                        className="form-input"
                                        placeholder={isEdit ? '••••••••' : 'Enter password'}
                                        autoComplete="new-password"
                                    />
                                    {form.errors.password && (
                                        <p className="text-sm text-red-600 mt-1">{form.errors.password}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="form-label">Confirm Password</label>
                                    <input
                                        type="password"
                                        value={form.data.password_confirmation}
                                        onChange={(e) => form.setData('password_confirmation', e.target.value)}
                                        className="form-input"
                                        placeholder="Confirm password"
                                        autoComplete="new-password"
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3">
                        <Link
                            href="/settings/users"
                            className="btn btn-outline"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="btn btn-primary"
                        >
                            {form.processing
                                ? 'Saving...'
                                : isEdit
                                    ? 'Update User'
                                    : 'Create User'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
