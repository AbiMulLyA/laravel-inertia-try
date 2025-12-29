import AppLayout from '@/Layouts/AppLayout';
import { Head, router } from '@inertiajs/react';
import { StatsCard, Card, CardHeader, PageHeader } from '@/Components';
import { 
    Layers, 
    FolderKanban, 
    ClipboardList,
    CheckCircle2
} from 'lucide-react';

interface Overview {
    total_categories: number;
    total_projects: number;
    total_tasks: number;
    total_budget: number;
    total_spent: number;
    tasks_in_progress: number;
    tasks_completed: number;
}

interface CategoryStatistic {
    id: number;
    name: string;
    code: string;
    total_projects: number;
    total_budget: number;
    total_spent: number;
    spent_percentage: number;
}

interface Props {
    overview: Overview;
    statisticsCategory: CategoryStatistic[];
    taskProgress: any[];
    tasksByPriority: any[];
    recentActivities: any[];
    year: number;
    yearOptions: number[];
}

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

function formatNumber(value: number): string {
    return new Intl.NumberFormat('en-US').format(value);
}

/**
 * Dashboard Page
 * 
 * Overview page with Filament-style stat cards and data display.
 * Features Tasikmalaya brand colors.
 */
export default function Dashboard({
    overview,
    statisticsCategory,
    tasksByPriority,
    recentActivities,
    year,
    yearOptions,
}: Props) {
    const spentPercentage = overview.total_budget > 0 
        ? ((overview.total_spent / overview.total_budget) * 100).toFixed(1)
        : 0;

    return (
        <AppLayout>
            <Head title="Dashboard" />

            <div className="space-y-6">
                {/* Header */}
                <PageHeader 
                    title="Dashboard" 
                    subtitle="Application overview and statistics"
                >
                    <select
                        value={year}
                        onChange={(e) => router.get('/dashboard', { year: e.target.value })}
                        className="px-4 py-2 bg-white dark:bg-[#1a2744] border border-gray-300 dark:border-[#1e3a5f] rounded-lg text-sm font-medium text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                        {yearOptions.map((y) => (
                            <option key={y} value={y}>Year {y}</option>
                        ))}
                    </select>
                </PageHeader>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatsCard
                        title="Categories"
                        value={overview.total_categories}
                        icon={Layers}
                        color="primary"
                    />
                    <StatsCard
                        title="Projects"
                        value={overview.total_projects}
                        icon={FolderKanban}
                        color="secondary"
                    />
                    <StatsCard
                        title="Total Tasks"
                        value={overview.total_tasks}
                        icon={ClipboardList}
                        color="accent"
                    />
                    <StatsCard
                        title="Completed"
                        value={overview.tasks_completed}
                        icon={CheckCircle2}
                        color="cyan"
                    />
                </div>

                {/* Budget Overview & Task Status */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Budget Overview */}
                    <Card className="lg:col-span-2">
                        <CardHeader title="Budget Overview" />
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Total Budget</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {formatCurrency(overview.total_budget)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Spent</p>
                                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                                    {formatCurrency(overview.total_spent)}
                                </p>
                            </div>
                        </div>
                        <div className="mt-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Progress</span>
                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{spentPercentage}%</span>
                            </div>
                            <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all duration-700 ease-out"
                                    style={{ width: `${Math.min(Number(spentPercentage), 100)}%` }}
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Task Status */}
                    <Card>
                        <CardHeader title="Task Status" />
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-primary-500 rounded-full" />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">In Progress</span>
                                </div>
                                <span className="text-lg font-semibold text-gray-900 dark:text-white">{overview.tasks_in_progress}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-secondary-500 rounded-full" />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Completed</span>
                                </div>
                                <span className="text-lg font-semibold text-gray-900 dark:text-white">{overview.tasks_completed}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-full" />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Other</span>
                                </div>
                                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {overview.total_tasks - overview.tasks_in_progress - overview.tasks_completed}
                                </span>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Statistics by Category */}
                <Card padding="none">
                    <div className="p-6 border-b border-gray-100 dark:border-[#1e3a5f]">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Statistics by Category
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-[#1a2744]">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Projects
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Budget
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Spent
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Progress
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-[#1e3a5f]">
                                {statisticsCategory.map((category) => (
                                    <tr key={category.id} className="hover:bg-gray-50 dark:hover:bg-[#1a2744] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-500/30 dark:to-primary-500/10 rounded-lg flex items-center justify-center border border-primary-200 dark:border-primary-500/30">
                                                    <span className="text-sm font-bold text-primary-700 dark:text-primary-400">
                                                        {category.code}
                                                    </span>
                                                </div>
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    {category.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-600 dark:text-gray-400 font-medium">
                                            {category.total_projects}
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-600 dark:text-gray-400">
                                            {formatCurrency(category.total_budget)}
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-600 dark:text-gray-400">
                                            {formatCurrency(category.total_spent)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-3">
                                                <div className="w-20 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full bg-gradient-to-r from-secondary-400 to-secondary-600 rounded-full"
                                                        style={{ width: `${category.spent_percentage}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-12 text-right">
                                                    {category.spent_percentage}%
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Priority & Recent Activities */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Tasks by Priority */}
                    <Card>
                        <CardHeader title="Tasks by Priority" />
                        <div className="space-y-3">
                            {tasksByPriority.slice(0, 6).map((item, index) => (
                                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-[#1e3a5f] last:border-0">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {item.priority_label}
                                    </span>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white bg-gray-100 dark:bg-[#1a2744] px-3 py-1 rounded-full">
                                        {formatNumber(item.total)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Recent Activities */}
                    <Card>
                        <CardHeader title="Recent Activities" />
                        <div className="space-y-3">
                            {recentActivities.slice(0, 5).map((activity) => (
                                <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-[#1a2744] transition-colors">
                                    <div className={`
                                        w-2.5 h-2.5 rounded-full flex-shrink-0
                                        ${activity.status === 'completed' ? 'bg-secondary-500' : ''}
                                        ${activity.status === 'in_progress' ? 'bg-primary-500' : ''}
                                        ${activity.status === 'pending' ? 'bg-gray-400' : ''}
                                        ${activity.status === 'on_hold' ? 'bg-accent-500' : ''}
                                    `} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                            {activity.name}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {activity.project?.category?.name}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-12 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-primary-500 rounded-full"
                                                style={{ width: `${activity.progress}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-8">
                                            {activity.progress}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
