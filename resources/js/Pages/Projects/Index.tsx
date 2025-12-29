import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageHeader, Card } from '@/Components';
import { 
    Plus, 
    Edit, 
    Trash2, 
    FolderKanban,
    Search,
    Filter,
    Activity,
    CheckCircle2,
    FileEdit
} from 'lucide-react';

interface Category {
    id: number;
    code: string;
    name: string;
}

interface Project {
    id: number;
    code: string;
    name: string;
    category: Category | null;
    year: number;
    budget: number;
    spent: number;
    spent_percentage: number;
    status: string;
    status_label: string;
    start_date: string | null;
    end_date: string | null;
}

interface PaginatedData {
    data: Project[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface Props {
    projects: PaginatedData;
    categories: Category[];
    filters: {
        category_id: string | null;
        status: string | null;
        search: string | null;
    };
    summary: {
        total: number;
        active: number;
        completed: number;
        draft: number;
    };
    statuses: Record<string, string>;
}

function formatCurrency(value: number): string {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
    return `$${value}`;
}

/**
 * Projects Index Page
 * 
 * Filament-style list page with filtering, search, and pagination.
 */
export default function ProjectsIndex({ 
    projects = { data: [], current_page: 1, last_page: 1, per_page: 15, total: 0, links: [] },
    categories = [],
    filters = { category_id: null, status: null, search: null },
    summary = { total: 0, active: 0, completed: 0, draft: 0 },
    statuses = {}
}: Props) {
    const handleDelete = (id: number, name: string) => {
        if (confirm(`Delete project "${name}"?`)) {
            router.delete(`/projects/${id}`);
        }
    };

    const handleFilterChange = (key: string, value: string) => {
        router.get('/projects', { ...filters, [key]: value }, { preserveState: true });
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        handleFilterChange('search', formData.get('search') as string);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-primary-50 text-primary-700 border border-primary-200';
            case 'completed': return 'bg-secondary-50 text-secondary-700 border border-secondary-200';
            case 'draft': return 'bg-gray-100 text-gray-600 border border-gray-200';
            default: return 'bg-gray-100 text-gray-600 border border-gray-200';
        }
    };

    return (
        <AppLayout>
            <Head title="Projects" />

            <div className="space-y-6">
                {/* Header */}
                <PageHeader 
                    title="Projects" 
                    subtitle="Manage projects and track progress"
                    action={{
                        label: 'Add Project',
                        href: '/projects/create',
                        icon: Plus
                    }}
                />

                {/* Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div 
                        className="bg-white rounded-xl border p-4 cursor-pointer hover:shadow-md transition-all"
                        onClick={() => router.get('/projects', {})}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                <FolderKanban className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{summary.total}</p>
                                <p className="text-xs text-gray-500">Total</p>
                            </div>
                        </div>
                    </div>
                    <div 
                        className="bg-white rounded-xl border p-4 cursor-pointer hover:shadow-md transition-all"
                        onClick={() => handleFilterChange('status', 'active')}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                                <Activity className="w-5 h-5 text-primary-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-primary-600">{summary.active}</p>
                                <p className="text-xs text-gray-500">Active</p>
                            </div>
                        </div>
                    </div>
                    <div 
                        className="bg-white rounded-xl border p-4 cursor-pointer hover:shadow-md transition-all"
                        onClick={() => handleFilterChange('status', 'completed')}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-secondary-50 rounded-lg flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5 text-secondary-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-secondary-600">{summary.completed}</p>
                                <p className="text-xs text-gray-500">Completed</p>
                            </div>
                        </div>
                    </div>
                    <div 
                        className="bg-white rounded-xl border p-4 cursor-pointer hover:shadow-md transition-all"
                        onClick={() => handleFilterChange('status', 'draft')}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-accent-50 rounded-lg flex items-center justify-center">
                                <FileEdit className="w-5 h-5 text-accent-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-accent-600">{summary.draft}</p>
                                <p className="text-xs text-gray-500">Draft</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <Card padding="sm">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <form onSubmit={handleSearch} className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="search"
                                    defaultValue={filters.search || ''}
                                    placeholder="Search projects..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                                />
                            </div>
                        </form>
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-gray-400" />
                            <select
                                value={filters.category_id || ''}
                                onChange={(e) => handleFilterChange('category_id', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                            >
                                <option value="">All Categories</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                            <select
                                value={filters.status || ''}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                            >
                                <option value="">All Status</option>
                                {Object.entries(statuses).map(([key, label]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </Card>

                {/* Projects Table */}
                <Card padding="none" className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Project</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Budget</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Progress</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {projects.data.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">{item.code}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-primary-50 text-primary-700 border border-primary-200">
                                                {item.category?.code || '-'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <p className="text-sm font-medium text-gray-900">{formatCurrency(item.budget)}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">Spent: {formatCurrency(item.spent)}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="w-28">
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="font-medium text-gray-700">{item.spent_percentage}%</span>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                                    <div 
                                                        className="h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-600"
                                                        style={{ width: `${Math.min(item.spent_percentage, 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                                                {item.status_label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link
                                                    href={`/projects/${item.id}/edit`}
                                                    className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(item.id, item.name)}
                                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

                    {projects.data.length === 0 && (
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <FolderKanban className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
                            <p className="text-gray-500 mb-6">Get started by creating your first project</p>
                            <Link
                                href="/projects/create"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm"
                            >
                                <Plus className="w-4 h-4" />
                                Add Project
                            </Link>
                        </div>
                    )}

                    {/* Pagination */}
                    {projects.last_page > 1 && (
                        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
                            <p className="text-sm text-gray-500">
                                Showing <span className="font-medium">{(projects.current_page - 1) * projects.per_page + 1}</span> - <span className="font-medium">{Math.min(projects.current_page * projects.per_page, projects.total)}</span> of <span className="font-medium">{projects.total}</span>
                            </p>
                            <div className="flex items-center gap-1">
                                {projects.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                            link.active
                                                ? 'bg-primary-600 text-white'
                                                : link.url
                                                ? 'text-gray-600 hover:bg-gray-200'
                                                : 'text-gray-400 cursor-not-allowed'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}
