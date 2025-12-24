import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Plus, 
    Edit, 
    Trash2, 
    ClipboardList,
    Search,
    Filter,
    Eye
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
    category?: Category;
}

interface Task {
    id: number;
    code: string;
    name: string;
    project: Project | null;
    location: string | null;
    target: number;
    achieved: number;
    unit: string;
    budget: number;
    spent: number;
    status: string;
    status_label: string;
    progress: number;
    priority: string;
    priority_label: string;
    achieved_percentage: number;
    start_date: string | null;
    end_date: string | null;
}

interface PaginatedData {
    data: Task[];
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
    tasks: PaginatedData;
    projects: Project[];
    filters: {
        project_id: string | null;
        status: string | null;
        priority: string | null;
        search: string | null;
    };
    summary: {
        total: number;
        in_progress: number;
        completed: number;
        pending: number;
    };
    statuses: Record<string, string>;
    priorities: Record<string, string>;
}

function formatCurrency(value: number): string {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
    return `$${value}`;
}

/**
 * Tasks Index Page
 * 
 * Full-featured list page with progress tracking.
 * UI Pattern: Summary cards + multi-filter + data table with progress bars + pagination.
 */
export default function TasksIndex({ 
    tasks = { data: [], current_page: 1, last_page: 1, per_page: 20, total: 0, links: [] }, 
    projects = [], 
    filters = { project_id: null, status: null, priority: null, search: null }, 
    summary = { total: 0, in_progress: 0, completed: 0, pending: 0 },
    statuses = {},
    priorities = {}
}: Props) {
    const handleDelete = (id: number, name: string) => {
        if (confirm(`Delete task "${name}"?`)) {
            router.delete(`/tasks/${id}`);
        }
    };

    const handleFilterChange = (key: string, value: string) => {
        router.get('/tasks', { ...filters, [key]: value }, { preserveState: true });
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        handleFilterChange('search', formData.get('search') as string);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'in_progress': return 'bg-blue-100 text-blue-700';
            case 'completed': return 'bg-green-100 text-green-700';
            case 'pending': return 'bg-gray-100 text-gray-700';
            case 'on_hold': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-700';
            case 'medium': return 'bg-yellow-100 text-yellow-700';
            case 'low': return 'bg-green-100 text-green-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getProgressColor = (progress: number) => {
        if (progress >= 80) return 'bg-green-500';
        if (progress >= 50) return 'bg-blue-500';
        if (progress >= 25) return 'bg-yellow-500';
        return 'bg-gray-400';
    };

    return (
        <AppLayout>
            <Head title="Tasks" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
                        <p className="text-gray-500">
                            Manage tasks and track progress
                        </p>
                    </div>
                    <Link
                        href="/tasks/create"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
                    >
                        <Plus className="w-4 h-4" />
                        Add Task
                    </Link>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl border p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <ClipboardList className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{summary.total}</p>
                                <p className="text-sm text-gray-500">Total Tasks</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border p-4 cursor-pointer hover:bg-blue-50 transition-colors"
                        onClick={() => handleFilterChange('status', 'in_progress')}>
                        <p className="text-2xl font-bold text-blue-600">{summary.in_progress}</p>
                        <p className="text-sm text-gray-500">In Progress</p>
                    </div>
                    <div className="bg-white rounded-xl border p-4 cursor-pointer hover:bg-green-50 transition-colors"
                        onClick={() => handleFilterChange('status', 'completed')}>
                        <p className="text-2xl font-bold text-green-600">{summary.completed}</p>
                        <p className="text-sm text-gray-500">Completed</p>
                    </div>
                    <div className="bg-white rounded-xl border p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleFilterChange('status', 'pending')}>
                        <p className="text-2xl font-bold text-gray-600">{summary.pending}</p>
                        <p className="text-sm text-gray-500">Pending</p>
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
                                    placeholder="Search tasks..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                        </form>
                        <div className="flex items-center gap-2 flex-wrap">
                            <Filter className="w-4 h-4 text-gray-400" />
                            <select
                                value={filters.project_id || ''}
                                onChange={(e) => handleFilterChange('project_id', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                            >
                                <option value="">All Projects</option>
                                {projects.map((p) => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
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
                            <select
                                value={filters.priority || ''}
                                onChange={(e) => handleFilterChange('priority', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                            >
                                <option value="">All Priority</option>
                                {Object.entries(priorities).map(([key, label]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Tasks Table */}
                <div className="bg-white rounded-xl border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Target</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {tasks.data.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                                <p className="text-xs text-gray-500">{item.code}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary-100 text-primary-700">
                                                    {item.project?.category?.code || '-'}
                                                </span>
                                                <p className="text-xs text-gray-500 mt-1">{item.project?.name || '-'}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-900">
                                                {item.achieved}/{item.target} {item.unit}
                                            </p>
                                            <p className="text-xs text-gray-500">{formatCurrency(item.budget)}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="w-24">
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span>{item.progress}%</span>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-2">
                                                    <div 
                                                        className={`h-2 rounded-full ${getProgressColor(item.progress)}`}
                                                        style={{ width: `${item.progress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                                                {item.priority_label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                                                {item.status_label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link
                                                    href={`/tasks/${item.id}`}
                                                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <Link
                                                    href={`/tasks/${item.id}/edit`}
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

                    {tasks.data.length === 0 && (
                        <div className="p-12 text-center">
                            <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
                            <p className="text-gray-500 mb-4">Get started by adding your first task</p>
                            <Link
                                href="/tasks/create"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
                            >
                                <Plus className="w-4 h-4" />
                                Add Task
                            </Link>
                        </div>
                    )}

                    {/* Pagination */}
                    {tasks.last_page > 1 && (
                        <div className="px-6 py-4 border-t flex items-center justify-between">
                            <p className="text-sm text-gray-500">
                                Showing {(tasks.current_page - 1) * tasks.per_page + 1} - {Math.min(tasks.current_page * tasks.per_page, tasks.total)} of {tasks.total}
                            </p>
                            <div className="flex items-center gap-1">
                                {tasks.links.map((link, index) => (
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
