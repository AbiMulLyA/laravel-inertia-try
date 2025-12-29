import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { PageHeader, Card, StatsCard } from '@/Components';
import { 
    ClipboardList,
    CheckCircle2,
    Clock,
    Hourglass,
    ArrowRight
} from 'lucide-react';

interface Task {
    id: number;
    code: string;
    name: string;
    project_name: string;
    progress: number;
    status: string;
    status_label: string;
    priority: string;
    priority_label: string;
    target: number;
    achieved: number;
    unit: string;
}

interface Props {
    summary: {
        total: number;
        in_progress: number;
        completed: number;
        pending: number;
    };
    tasks: Task[];
    year: number;
}

/**
 * Task Progress Report Page
 */
export default function TaskProgress({ 
    summary = { total: 0, in_progress: 0, completed: 0, pending: 0 },
    tasks = [],
    year = new Date().getFullYear()
}: Props) {
    const getProgressColor = (progress: number) => {
        if (progress >= 80) return 'from-secondary-400 to-secondary-600';
        if (progress >= 50) return 'from-primary-400 to-primary-600';
        if (progress >= 25) return 'from-accent-400 to-accent-600';
        return 'from-gray-300 to-gray-400';
    };

    const getStatusBadge = (status: string) => {
        const colors: Record<string, string> = {
            in_progress: 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300',
            completed: 'bg-secondary-100 text-secondary-700 dark:bg-secondary-900/50 dark:text-secondary-300',
            pending: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
            on_hold: 'bg-accent-100 text-accent-700 dark:bg-accent-900/50 dark:text-accent-300',
        };
        return colors[status] || colors.pending;
    };

    const getPriorityBadge = (priority: string) => {
        const colors: Record<string, string> = {
            high: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
            medium: 'bg-accent-100 text-accent-700 dark:bg-accent-900/50 dark:text-accent-300',
            low: 'bg-secondary-100 text-secondary-700 dark:bg-secondary-900/50 dark:text-secondary-300',
        };
        return colors[priority] || colors.medium;
    };

    return (
        <AppLayout>
            <Head title="Task Progress Report" />

            <div className="space-y-6">
                {/* Header */}
                <PageHeader 
                    title="Task Progress" 
                    subtitle={`Task completion analysis for year ${year}`}
                />

                {/* Summary Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatsCard
                        title="Total Tasks"
                        value={summary.total}
                        icon={ClipboardList}
                        color="primary"
                    />
                    <StatsCard
                        title="In Progress"
                        value={summary.in_progress}
                        icon={Clock}
                        color="accent"
                    />
                    <StatsCard
                        title="Completed"
                        value={summary.completed}
                        icon={CheckCircle2}
                        color="secondary"
                    />
                    <StatsCard
                        title="Pending"
                        value={summary.pending}
                        icon={Hourglass}
                        color="cyan"
                    />
                </div>

                {/* Tasks Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {tasks.map((task) => (
                        <Card key={task.id} padding="none">
                            <div className="p-5">
                                {/* Header */}
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <span className="text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/50 px-2 py-0.5 rounded">
                                                {task.code}
                                            </span>
                                            <span className={`text-xs font-medium px-2 py-0.5 rounded ${getStatusBadge(task.status)}`}>
                                                {task.status_label}
                                            </span>
                                            <span className={`text-xs font-medium px-2 py-0.5 rounded ${getPriorityBadge(task.priority)}`}>
                                                {task.priority_label}
                                            </span>
                                        </div>
                                        <h3 className="font-medium text-theme-primary truncate">{task.name}</h3>
                                        <p className="text-sm text-theme-muted">{task.project_name}</p>
                                    </div>
                                    <Link 
                                        href={`/tasks/${task.id}/edit`}
                                        className="p-2 text-theme-muted hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
                                    >
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>

                                {/* Progress */}
                                <div className="mb-3">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-theme-secondary">Progress</span>
                                        <span className="font-medium text-theme-primary">{task.progress}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full bg-gradient-to-r ${getProgressColor(task.progress)} rounded-full transition-all duration-500`}
                                            style={{ width: `${task.progress}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Target */}
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-theme-muted">Target Achievement</span>
                                    <span className="font-medium text-theme-primary">
                                        {task.achieved} / {task.target} {task.unit}
                                    </span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {tasks.length === 0 && (
                    <Card>
                        <div className="p-12 text-center">
                            <ClipboardList className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                            <p className="text-theme-secondary">No tasks found</p>
                        </div>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
