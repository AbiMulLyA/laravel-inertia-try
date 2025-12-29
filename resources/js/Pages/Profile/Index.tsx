import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';
import { PageHeader, Card } from '@/Components';
import { User, Lock, Shield, LucideIcon } from 'lucide-react';
import { FormEvent, useState, ReactNode } from 'react';

interface UserData {
    id: number;
    name: string;
    email: string;
    role?: string;
    created_at?: string;
}

interface Props {
    user: UserData;
}

type TabType = 'profile' | 'role' | 'password';

interface TabConfig {
    id: TabType;
    label: string;
    icon: LucideIcon;
}

// Reusable Section Header Component
const SectionHeader = ({ icon: Icon, title, subtitle, variant = 'primary' }: {
    icon: LucideIcon;
    title: string;
    subtitle: string;
    variant?: 'primary' | 'secondary' | 'accent';
}) => {
    const variantStyles = {
        primary: 'bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400',
        secondary: 'bg-secondary-100 dark:bg-secondary-900/50 text-secondary-600 dark:text-secondary-400',
        accent: 'bg-accent-100 dark:bg-accent-900/50 text-accent-600 dark:text-accent-400',
    };

    return (
        <div className="flex items-center gap-3 mb-6">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${variantStyles[variant]}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <h3 className="text-lg font-semibold text-theme-primary">{title}</h3>
                <p className="text-sm text-theme-secondary">{subtitle}</p>
            </div>
        </div>
    );
};

// Reusable Form Field Component
const FormField = ({ label, error, children }: {
    label: string;
    error?: string;
    children: ReactNode;
}) => (
    <div>
        <label className="form-label">{label}</label>
        {children}
        {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
);

export default function Profile({ user }: Props) {
    const [activeTab, setActiveTab] = useState<TabType>('profile');

    const profileForm = useForm({
        name: user?.name || '',
        email: user?.email || '',
    });

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleProfileSubmit = (e: FormEvent) => {
        e.preventDefault();
        profileForm.patch('/profile', { preserveScroll: true });
    };

    const handlePasswordSubmit = (e: FormEvent) => {
        e.preventDefault();
        passwordForm.put('/password', {
            preserveScroll: true,
            onSuccess: () => passwordForm.reset(),
        });
    };

    const tabs: TabConfig[] = [
        { id: 'profile', label: 'Profile Information', icon: User },
        { id: 'role', label: 'Role & Permissions', icon: Shield },
        { id: 'password', label: 'Change Password', icon: Lock },
    ];

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <AppLayout>
            <Head title="Profile" />

            <div className="space-y-6">
                <PageHeader title="Profile" subtitle="Manage your account settings" />

                {/* Main Layout - Invoo Style */}
                <div className="flex items-start gap-6">
                    {/* Sidebar Navigation */}
                    <div className="w-64 flex-shrink-0">
                        <div className="bg-white rounded-3xl p-2 border border-gray-100 dark:bg-slate-800 dark:border-slate-700">
                            {tabs.map(({ id, label, icon: Icon }) => (
                                <button
                                    key={id}
                                    onClick={() => setActiveTab(id)}
                                    className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                                        activeTab === id
                                            ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-slate-700 dark:hover:text-white'
                                    }`}
                                >
                                    <Icon className={`w-5 h-5 ${activeTab === id ? 'text-primary-500' : ''}`} />
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 max-w-3xl">
                        <Card>
                            <div className="p-6">
                                {/* Profile Information Tab */}
                                {activeTab === 'profile' && (
                                    <div>
                                        <SectionHeader
                                            icon={User}
                                            title="Profile Information"
                                            subtitle="Update your account details"
                                            variant="primary"
                                        />
                                        <form onSubmit={handleProfileSubmit} className="space-y-4">
                                            <FormField label="Name" error={profileForm.errors.name}>
                                                <input
                                                    type="text"
                                                    value={profileForm.data.name}
                                                    onChange={(e) => profileForm.setData('name', e.target.value)}
                                                    className="form-input"
                                                />
                                            </FormField>
                                            <FormField label="Email" error={profileForm.errors.email}>
                                                <input
                                                    type="email"
                                                    value={profileForm.data.email}
                                                    onChange={(e) => profileForm.setData('email', e.target.value)}
                                                    className="form-input"
                                                />
                                            </FormField>
                                            <div className="pt-2">
                                                <button type="submit" disabled={profileForm.processing} className="btn btn-primary">
                                                    {profileForm.processing ? 'Saving...' : 'Save Changes'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {/* Role & Permissions Tab */}
                                {activeTab === 'role' && (
                                    <div>
                                        <SectionHeader
                                            icon={Shield}
                                            title="Role & Permissions"
                                            subtitle="Your assigned role in the system"
                                            variant="secondary"
                                        />
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1">
                                                <p className="text-sm text-theme-muted mb-1">Current Role</p>
                                                <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
                                                    {user?.role || 'Administrator'}
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-theme-muted mb-1">Member Since</p>
                                                <p className="text-sm font-medium text-theme-primary">
                                                    {formatDate(user?.created_at)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Change Password Tab */}
                                {activeTab === 'password' && (
                                    <div>
                                        <SectionHeader
                                            icon={Lock}
                                            title="Change Password"
                                            subtitle="Update your password for security"
                                            variant="accent"
                                        />
                                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                            <FormField label="Current Password" error={passwordForm.errors.current_password}>
                                                <input
                                                    type="password"
                                                    value={passwordForm.data.current_password}
                                                    onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                                    className="form-input"
                                                    autoComplete="current-password"
                                                />
                                            </FormField>
                                            <FormField label="New Password" error={passwordForm.errors.password}>
                                                <input
                                                    type="password"
                                                    value={passwordForm.data.password}
                                                    onChange={(e) => passwordForm.setData('password', e.target.value)}
                                                    className="form-input"
                                                    autoComplete="new-password"
                                                />
                                            </FormField>
                                            <FormField label="Confirm New Password" error={passwordForm.errors.password_confirmation}>
                                                <input
                                                    type="password"
                                                    value={passwordForm.data.password_confirmation}
                                                    onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                                    className="form-input"
                                                    autoComplete="new-password"
                                                />
                                            </FormField>
                                            <div className="pt-2">
                                                <button type="submit" disabled={passwordForm.processing} className="btn btn-primary">
                                                    {passwordForm.processing ? 'Updating...' : 'Update Password'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
