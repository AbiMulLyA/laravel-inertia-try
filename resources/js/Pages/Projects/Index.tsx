import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Plus, 
    Edit, 
    Trash2, 
    FolderKanban,
    Search,
    Filter
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
 * Example of a list page with filtering, search, and pagination.
 * UI Pattern: Summary cards + filters + data table + pagination.
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
            case 'active': return 'bg-blue-100 text-blue-700';
            case 'completed': return 'bg-green-100 text-green-700';
            case 'draft': return 'bg-gray-100 text-gray-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <AppLayout>
            <Head title="Projects" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
                        <p className="text-gray-500">
                            Manage projects and track progress
                        </p>
                    </div>
                    <Link
                        href="/projects/create"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
                    >
                        <Plus className="w-4 h-4" />
                        Add Project
                    </Link>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl border p-4">
                        <p className="text-2xl font-bold text-gray-900">{summary.total}</p>
                        <p className="text-sm text-gray-500">Total Projects</p>
                    </div>
                    <div 
                        className="bg-white rounded-xl border p-4 cursor-pointer hover:bg-blue-50 transition-colors"
                        onClick={() => handleFilterChange('status', 'active')}
                    >
                        <p className="text-2xl font-bold text-blue-600">{summary.active}</p>
                        <p className="text-sm text-gray-500">Active</p>
                    </div>
                    <div 
                        className="bg-white rounded-xl border p-4 cursor-pointer hover:bg-green-50 transition-colors"
                        onClick={() => handleFilterChange('status', 'completed')}
                    >
                        <p className="text-2xl font-bold text-green-600">{summary.completed}</p>
                        <p className="text-sm text-gray-500">Completed</p>
                    </div>
                    <div 
                        className="bg-white rounded-xl border p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleFilterChange('status', 'draft')}
                    >
                        <p className="text-2xl font-bold text-gray-600">{summary.draft}</p>
                        <p className="text-sm text-gray-500">Draft</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl border p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <form onSubmit={handleSearch} className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="search"
                                    defaultValue={filters.search || ''}
                                    placeholder="Search projects..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                        </form>
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-gray-400" />
                            <select
                                value={filters.category_id || ''}
                                onChange={(e) => handleFilterChange('category_id', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                            >
                                <option value="">All Categories</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                            <select
                                value={filters.status || ''}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                            >
                                <option value="">All Status</option>
                                {Object.entries(statuses).map(([key, label]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Projects Table */}
                <div className="bg-white rounded-xl border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Budget</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {projects.data.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                                <p className="text-xs text-gray-500">{item.code}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary-100 text-primary-700">
                                                {item.category?.code || '-'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <p className="text-sm text-gray-900">{formatCurrency(item.budget)}</p>
                                            <p className="text-xs text-gray-500">Spent: {formatCurrency(item.spent)}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="w-24">
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span>{item.spent_percentage}%</span>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-2">
                                                    <div 
                                                        className="h-2 rounded-full bg-primary-500"
                                                        style={{ width: `${Math.min(item.spent_percentage, 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                                                {item.status_label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link
                                                    href={`/projects/${item.id}/edit`}
                                                    className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(item.id, item.name)}
                                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
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
                            <FolderKanban className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
                            <p className="text-gray-500 mb-4">Get started by creating your first project</p>
                            <Link
                                href="/projects/create"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
                            >
                                <Plus className="w-4 h-4" />
                                Add Project
                            </Link>
                        </div>
                    )}

                    {/* Pagination */}
                    {projects.last_page > 1 && (
                        <div className="px-6 py-4 border-t flex items-center justify-between">
                            <p className="text-sm text-gray-500">
                                Showing {(projects.current_page - 1) * projects.per_page + 1} - {Math.min(projects.current_page * projects.per_page, projects.total)} of {projects.total}
                            </p>
                            <div className="flex items-center gap-1">
                                {projects.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`px-3 py-1 rounded text-sm ${
                                            link.active
                                                ? 'bg-primary-600 text-white'
                                                : link.url
                                                ? 'text-gray-600 hover:bg-gray-100'
                                                : 'text-gray-400 cursor-not-allowed'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
