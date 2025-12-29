import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageHeader, Card } from '@/Components';
import { 
    Plus, 
    Edit, 
    Trash2, 
    ClipboardList,
    Search,
    Filter,
    Eye,
    Clock,
    CheckCircle2,
    Hourglass
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
 * Filament-style list page with progress tracking.
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
            case 'in_progress': return 'bg-primary-50 text-primary-700 border border-primary-200';
            case 'completed': return 'bg-secondary-50 text-secondary-700 border border-secondary-200';
            case 'pending': return 'bg-gray-100 text-gray-600 border border-gray-200';
            case 'on_hold': return 'bg-accent-50 text-accent-700 border border-accent-200';
            default: return 'bg-gray-100 text-gray-600 border border-gray-200';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'bg-red-50 text-red-700 border border-red-200';
            case 'medium': return 'bg-accent-50 text-accent-700 border border-accent-200';
            case 'low': return 'bg-secondary-50 text-secondary-700 border border-secondary-200';
            default: return 'bg-gray-100 text-gray-600 border border-gray-200';
        }
    };

    const getProgressColor = (progress: number) => {
        if (progress >= 80) return 'from-secondary-400 to-secondary-600';
        if (progress >= 50) return 'from-primary-400 to-primary-600';
        if (progress >= 25) return 'from-accent-400 to-accent-600';
        return 'from-gray-300 to-gray-400';
    };

    return (
        <AppLayout>
            <Head title="Tasks" />

            <div className="space-y-6">
                {/* Header */}
                <PageHeader 
                    title="Tasks" 
                    subtitle="Manage tasks and track progress"
                    action={{
                        label: 'Add Task',
                        href: '/tasks/create',
                        icon: Plus
                    }}
                />

                {/* Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div 
                        className="bg-white rounded-xl border p-4 cursor-pointer hover:shadow-md transition-all"
                        onClick={() => router.get('/tasks', {})}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                                <ClipboardList className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{summary.total}</p>
                                <p className="text-xs text-gray-500">Total Tasks</p>
                            </div>
                        </div>
                    </div>
                    <div 
                        className="bg-white rounded-xl border p-4 cursor-pointer hover:shadow-md transition-all"
                        onClick={() => handleFilterChange('status', 'in_progress')}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                                <Clock className="w-5 h-5 text-primary-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-primary-600">{summary.in_progress}</p>
                                <p className="text-xs text-gray-500">In Progress</p>
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
                        onClick={() => handleFilterChange('status', 'pending')}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                <Hourglass className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-600">{summary.pending}</p>
                                <p className="text-xs text-gray-500">Pending</p>
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
                                    placeholder="Search tasks..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                                />
                            </div>
                        </form>
                        <div className="flex items-center gap-2 flex-wrap">
                            <Filter className="w-4 h-4 text-gray-400" />
                            <select
                                value={filters.project_id || ''}
                                onChange={(e) => handleFilterChange('project_id', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                            >
                                <option value="">All Projects</option>
                                {projects.map((p) => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
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
                            <select
                                value={filters.priority || ''}
                                onChange={(e) => handleFilterChange('priority', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                            >
                                <option value="">All Priority</option>
                                {Object.entries(priorities).map(([key, label]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </Card>

                {/* Tasks Table */}
                <Card padding="none" className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Task</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Project</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Target</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Progress</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {tasks.data.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">{item.code}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-primary-50 text-primary-700 border border-primary-200">
                                                    {item.project?.category?.code || '-'}
                                                </span>
                                                <p className="text-xs text-gray-500 mt-1">{item.project?.name || '-'}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium text-gray-900">
                                                {item.achieved}/{item.target} {item.unit}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-0.5">{formatCurrency(item.budget)}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="w-28">
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="font-medium text-gray-700">{item.progress}%</span>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                                    <div 
                                                        className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(item.progress)}`}
                                                        style={{ width: `${item.progress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                                                {item.priority_label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                                                {item.status_label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link
                                                    href={`/tasks/${item.id}`}
                                                    className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <Link
                                                    href={`/tasks/${item.id}/edit`}
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

                    {tasks.data.length === 0 && (
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <ClipboardList className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
                            <p className="text-gray-500 mb-6">Get started by adding your first task</p>
                            <Link
                                href="/tasks/create"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm"
                            >
                                <Plus className="w-4 h-4" />
                                Add Task
                            </Link>
                        </div>
                    )}

                    {/* Pagination */}
                    {tasks.last_page > 1 && (
                        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
                            <p className="text-sm text-gray-500">
                                Showing <span className="font-medium">{(tasks.current_page - 1) * tasks.per_page + 1}</span> - <span className="font-medium">{Math.min(tasks.current_page * tasks.per_page, tasks.total)}</span> of <span className="font-medium">{tasks.total}</span>
                            </p>
                            <div className="flex items-center gap-1">
                                {tasks.links.map((link, index) => (
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
