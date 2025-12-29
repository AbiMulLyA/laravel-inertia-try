import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { PageHeader, Card, StatsCard } from '@/Components';
import { 
    FolderKanban,
    CheckCircle2,
    Clock,
    AlertCircle,
    ArrowRight
} from 'lucide-react';

interface Project {
    id: number;
    code: string;
    name: string;
    category_name: string;
    progress: number;
    status: string;
    status_label: string;
    tasks_total: number;
    tasks_completed: number;
    budget: number;
    spent: number;
}

interface Props {
    summary: {
        total: number;
        on_track: number;
        at_risk: number;
        completed: number;
    };
    projects: Project[];
    year: number;
}

function formatCurrency(value: number): string {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
    return `$${value}`;
}

/**
 * Project Progress Report Page
 */
export default function ProjectProgress({ 
    summary = { total: 0, on_track: 0, at_risk: 0, completed: 0 },
    projects = [],
    year = new Date().getFullYear()
}: Props) {
    const getProgressColor = (progress: number, status: string) => {
        if (status === 'completed') return 'from-secondary-400 to-secondary-600';
        if (progress >= 70) return 'from-secondary-400 to-secondary-600';
        if (progress >= 40) return 'from-primary-400 to-primary-600';
        return 'from-accent-400 to-accent-600';
    };

    const getStatusBadge = (status: string) => {
        const colors: Record<string, string> = {
            active: 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300',
            completed: 'bg-secondary-100 text-secondary-700 dark:bg-secondary-900/50 dark:text-secondary-300',
            draft: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
        };
        return colors[status] || colors.draft;
    };

    return (
        <AppLayout>
            <Head title="Project Progress Report" />

            <div className="space-y-6">
                {/* Header */}
                <PageHeader 
                    title="Project Progress" 
                    subtitle={`Project status overview for year ${year}`}
                />

                {/* Summary Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatsCard
                        title="Total Projects"
                        value={summary.total}
                        icon={FolderKanban}
                        color="primary"
                    />
                    <StatsCard
                        title="On Track"
                        value={summary.on_track}
                        icon={Clock}
                        color="secondary"
                    />
                    <StatsCard
                        title="At Risk"
                        value={summary.at_risk}
                        icon={AlertCircle}
                        color="accent"
                    />
                    <StatsCard
                        title="Completed"
                        value={summary.completed}
                        icon={CheckCircle2}
                        color="cyan"
                    />
                </div>

                {/* Projects List */}
                <Card padding="none">
                    <div className="p-6 border-b border-theme">
                        <h2 className="text-lg font-semibold text-theme-primary">All Projects</h2>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                        {projects.map((project) => (
                            <div key={project.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/50 px-2 py-0.5 rounded">
                                                {project.code}
                                            </span>
                                            <span className={`text-xs font-medium px-2 py-0.5 rounded ${getStatusBadge(project.status)}`}>
                                                {project.status_label}
                                            </span>
                                        </div>
                                        <h3 className="font-medium text-theme-primary truncate">{project.name}</h3>
                                        <p className="text-sm text-theme-muted">{project.category_name}</p>
                                    </div>
                                    <Link 
                                        href={`/projects/${project.id}/edit`}
                                        className="p-2 text-theme-muted hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
                                    >
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>

                                {/* Progress bar */}
                                <div className="mb-3">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-theme-secondary">Progress</span>
                                        <span className="font-medium text-theme-primary">{project.progress}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full bg-gradient-to-r ${getProgressColor(project.progress, project.status)} rounded-full transition-all duration-500`}
                                            style={{ width: `${project.progress}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Stats row */}
                                <div className="flex items-center gap-6 text-sm">
                                    <div>
                                        <span className="text-theme-muted">Tasks: </span>
                                        <span className="font-medium text-theme-primary">{project.tasks_completed}/{project.tasks_total}</span>
                                    </div>
                                    <div>
                                        <span className="text-theme-muted">Budget: </span>
                                        <span className="font-medium text-theme-primary">{formatCurrency(project.budget)}</span>
                                    </div>
                                    <div>
                                        <span className="text-theme-muted">Spent: </span>
                                        <span className="font-medium text-accent-600 dark:text-accent-400">{formatCurrency(project.spent)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {projects.length === 0 && (
                        <div className="p-12 text-center">
                            <FolderKanban className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                            <p className="text-theme-secondary">No projects found</p>
                        </div>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}
