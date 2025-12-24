import AppLayout from '@/Layouts/AppLayout';
import { Head, router } from '@inertiajs/react';
import { 
    Layers, 
    FolderKanban, 
    ClipboardList,
    ArrowUpRight,
    ArrowDownRight
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
 * Overview page with statistics cards, data tables, and activity feed.
 * Uses UI patterns that can be reused across other pages.
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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-gray-500">Application overview and statistics</p>
                    </div>
                    <select
                        value={year}
                        onChange={(e) => router.get('/dashboard', { year: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                        {yearOptions.map((y) => (
                            <option key={y} value={y}>Year {y}</option>
                        ))}
                    </select>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="Categories"
                        value={overview.total_categories}
                        icon={Layers}
                        color="blue"
                    />
                    <StatCard
                        title="Projects"
                        value={overview.total_projects}
                        icon={FolderKanban}
                        color="green"
                    />
                    <StatCard
                        title="Total Tasks"
                        value={overview.total_tasks}
                        icon={ClipboardList}
                        color="purple"
                    />
                    <StatCard
                        title="Completed"
                        value={overview.tasks_completed}
                        icon={ClipboardList}
                        color="orange"
                    />
                </div>

                {/* Budget Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2 bg-white rounded-xl border p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Budget Overview
                        </h2>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-gray-500">Total Budget</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {formatCurrency(overview.total_budget)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Spent</p>
                                <p className="text-2xl font-bold text-primary-600">
                                    {formatCurrency(overview.total_spent)}
                                </p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-500">Progress</span>
                                <span className="text-sm font-medium">{spentPercentage}%</span>
                            </div>
                            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-primary-500 rounded-full transition-all duration-500"
                                    style={{ width: `${Math.min(Number(spentPercentage), 100)}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Task Status
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                                    <span className="text-sm text-gray-600">In Progress</span>
                                </div>
                                <span className="font-semibold">{overview.tasks_in_progress}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                                    <span className="text-sm text-gray-600">Completed</span>
                                </div>
                                <span className="font-semibold">{overview.tasks_completed}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-gray-300 rounded-full" />
                                    <span className="text-sm text-gray-600">Other</span>
                                </div>
                                <span className="font-semibold">
                                    {overview.total_tasks - overview.tasks_in_progress - overview.tasks_completed}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistics per Category */}
                <div className="bg-white rounded-xl border overflow-hidden">
                    <div className="p-6 border-b">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Statistics by Category
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                        Projects
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                        Budget
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                        Spent
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                        Progress
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {statisticsCategory.map((category) => (
                                    <tr key={category.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                                                    <span className="text-sm font-bold text-primary-600">
                                                        {category.code}
                                                    </span>
                                                </div>
                                                <span className="font-medium text-gray-900">
                                                    {category.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-600">
                                            {category.total_projects}
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-600">
                                            {formatCurrency(category.total_budget)}
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-600">
                                            {formatCurrency(category.total_spent)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full bg-primary-500 rounded-full"
                                                        style={{ width: `${category.spent_percentage}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm text-gray-600 w-12 text-right">
                                                    {category.spent_percentage}%
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Priority Distribution & Recent Activities */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl border p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Tasks by Priority
                        </h2>
                        <div className="space-y-3">
                            {tasksByPriority.slice(0, 6).map((item, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">
                                        {item.priority_label}
                                    </span>
                                    <span className="font-semibold text-gray-900">
                                        {formatNumber(item.total)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Recent Activities
                        </h2>
                        <div className="space-y-3">
                            {recentActivities.slice(0, 5).map((activity) => (
                                <div key={activity.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                                    <div className={`
                                        w-2 h-2 rounded-full
                                        ${activity.status === 'completed' ? 'bg-green-500' : ''}
                                        ${activity.status === 'in_progress' ? 'bg-blue-500' : ''}
                                        ${activity.status === 'pending' ? 'bg-gray-400' : ''}
                                        ${activity.status === 'on_hold' ? 'bg-yellow-500' : ''}
                                    `} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {activity.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {activity.project?.category?.name}
                                        </p>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {activity.progress}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

// ============================================
// Stat Card Component - Reusable UI Pattern
// ============================================
interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: 'blue' | 'green' | 'purple' | 'orange';
    trend?: number;
}

function StatCard({ title, value, icon: Icon, color, trend }: StatCardProps) {
    const colors = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        purple: 'bg-purple-50 text-purple-600',
        orange: 'bg-orange-50 text-orange-600',
    };

    return (
        <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colors[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
                {trend !== undefined && (
                    <div className={`flex items-center gap-1 text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {trend >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>
            <div className="mt-4">
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-sm text-gray-500 mt-1">{title}</p>
            </div>
        </div>
    );
}
