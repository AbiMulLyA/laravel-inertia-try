import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import { PageHeader, Card, StatsCard } from '@/Components';
import { 
    DollarSign, 
    TrendingUp, 
    TrendingDown,
    PieChart
} from 'lucide-react';

interface CategoryBudget {
    id: number;
    code: string;
    name: string;
    budget: number;
    spent: number;
    remaining: number;
    percentage: number;
}

interface Props {
    summary: {
        total_budget: number;
        total_spent: number;
        total_remaining: number;
        spent_percentage: number;
    };
    categories: CategoryBudget[];
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

/**
 * Budget Report Page
 * 
 * Shows budget overview and breakdown by category.
 */
export default function BudgetReport({ 
    summary = { total_budget: 0, total_spent: 0, total_remaining: 0, spent_percentage: 0 },
    categories = [],
    year = new Date().getFullYear()
}: Props) {
    return (
        <AppLayout>
            <Head title="Budget Report" />

            <div className="space-y-6">
                {/* Header */}
                <PageHeader 
                    title="Budget Report" 
                    subtitle={`Financial overview for year ${year}`}
                />

                {/* Summary Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatsCard
                        title="Total Budget"
                        value={formatCurrency(summary.total_budget)}
                        icon={DollarSign}
                        color="primary"
                    />
                    <StatsCard
                        title="Total Spent"
                        value={formatCurrency(summary.total_spent)}
                        icon={TrendingDown}
                        color="accent"
                    />
                    <StatsCard
                        title="Remaining"
                        value={formatCurrency(summary.total_remaining)}
                        icon={TrendingUp}
                        color="secondary"
                    />
                    <StatsCard
                        title="Utilization"
                        value={`${summary.spent_percentage.toFixed(1)}%`}
                        icon={PieChart}
                        color="cyan"
                    />
                </div>

                {/* Budget by Category */}
                <Card padding="none">
                    <div className="p-6 border-b border-theme">
                        <h2 className="text-lg font-semibold text-theme-primary">Budget by Category</h2>
                        <p className="text-sm text-theme-secondary mt-1">Breakdown of budget allocation and spending</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-800/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-theme-secondary uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-theme-secondary uppercase tracking-wider">Budget</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-theme-secondary uppercase tracking-wider">Spent</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-theme-secondary uppercase tracking-wider">Remaining</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-theme-secondary uppercase tracking-wider">Usage</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {categories.map((category) => (
                                    <tr key={category.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/50 dark:to-primary-800/30 rounded-lg flex items-center justify-center border border-primary-200 dark:border-primary-700">
                                                    <span className="text-sm font-bold text-primary-700 dark:text-primary-300">
                                                        {category.code}
                                                    </span>
                                                </div>
                                                <span className="font-medium text-theme-primary">{category.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium text-theme-primary">
                                            {formatCurrency(category.budget)}
                                        </td>
                                        <td className="px-6 py-4 text-right text-accent-600 dark:text-accent-400">
                                            {formatCurrency(category.spent)}
                                        </td>
                                        <td className="px-6 py-4 text-right text-secondary-600 dark:text-secondary-400">
                                            {formatCurrency(category.remaining)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-24 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full rounded-full ${
                                                            category.percentage > 90 
                                                                ? 'bg-red-500' 
                                                                : category.percentage > 70 
                                                                    ? 'bg-accent-500' 
                                                                    : 'bg-secondary-500'
                                                        }`}
                                                        style={{ width: `${Math.min(category.percentage, 100)}%` }}
                                                    />
                                                </div>
                                                <span className={`text-sm font-medium w-12 ${
                                                    category.percentage > 90 
                                                        ? 'text-red-600 dark:text-red-400' 
                                                        : 'text-theme-secondary'
                                                }`}>
                                                    {category.percentage.toFixed(1)}%
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {categories.length === 0 && (
                        <div className="p-12 text-center">
                            <PieChart className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                            <p className="text-theme-secondary">No budget data available</p>
                        </div>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}
