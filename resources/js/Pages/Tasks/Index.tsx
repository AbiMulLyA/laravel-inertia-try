import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageHeader, Card, StatsCard, Table, Pagination } from '@/Components';
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div onClick={() => router.get('/tasks', {})}>
                        <StatsCard
                            title="Total Tasks"
                            value={summary.total}
                            icon={ClipboardList}
                            color="cyan"
                        />
                    </div>
                    <div onClick={() => handleFilterChange('status', 'in_progress')}>
                        <StatsCard
                            title="In Progress"
                            value={summary.in_progress}
                            icon={Clock}
                            color="primary"
                        />
                    </div>
                    <div onClick={() => handleFilterChange('status', 'completed')}>
                        <StatsCard
                            title="Completed"
                            value={summary.completed}
                            icon={CheckCircle2}
                            color="secondary"
                        />
                    </div>
                    <div onClick={() => handleFilterChange('status', 'pending')}>
                        <StatsCard
                            title="Pending"
                            value={summary.pending}
                            icon={Hourglass}
                            color="secondary"
                        />
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
                    <Table>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Task</Table.Th>
                                <Table.Th>Project</Table.Th>
                                <Table.Th>Target</Table.Th>
                                <Table.Th>Progress</Table.Th>
                                <Table.Th>Priority</Table.Th>
                                <Table.Th>Status</Table.Th>
                                <Table.Th align="right">Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {tasks.data.map((item) => (
                                <Table.Tr key={item.id}>
                                    <Table.Td>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.code}</p>
                                        </div>
                                    </Table.Td>
                                    <Table.Td>
                                        <div>
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-primary-50 dark:bg-primary-500/20 text-primary-700 dark:text-primary-400 border border-primary-200 dark:border-primary-500/30">
                                                {item.project?.category?.code || '-'}
                                            </span>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.project?.name || '-'}</p>
                                        </div>
                                    </Table.Td>
                                    <Table.Td>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {item.achieved}/{item.target} {item.unit}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{formatCurrency(item.budget)}</p>
                                    </Table.Td>
                                    <Table.Td>
                                        <div className="w-28">
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="font-medium text-gray-700 dark:text-gray-300">{item.progress}%</span>
                                            </div>
                                            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                                                <div 
                                                    className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(item.progress)}`}
                                                    style={{ width: `${item.progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    </Table.Td>
                                    <Table.Td>
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                                            {item.priority_label}
                                        </span>
                                    </Table.Td>
                                    <Table.Td>
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                                            {item.status_label}
                                        </span>
                                    </Table.Td>
                                    <Table.Td align="right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link
                                                href={`/tasks/${item.id}`}
                                                className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-500/20 rounded-lg transition-colors"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                            <Link
                                                href={`/tasks/${item.id}/edit`}
                                                className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-500/20 rounded-lg transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(item.id, item.name)}
                                                className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/20 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>

                    {tasks.data.length === 0 && (
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <ClipboardList className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No tasks yet</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">Get started by adding your first task</p>
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
                    <Pagination 
                        links={tasks.links}
                        from={(tasks.current_page - 1) * tasks.per_page + 1}
                        to={Math.min(tasks.current_page * tasks.per_page, tasks.total)}
                        total={tasks.total}
                    />
                </Card>
            </div>
        </AppLayout>
    );
}
