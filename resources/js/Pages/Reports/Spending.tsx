import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import { PageHeader, Card, StatsCard } from '@/Components';
import { 
    DollarSign, 
    TrendingUp,
    Receipt,
    Calendar
} from 'lucide-react';

interface SpendingItem {
    id: number;
    name: string;
    project_name: string;
    category_code: string;
    amount: number;
    date: string;
    type: string;
}

interface MonthlySpending {
    month: string;
    amount: number;
}

interface Props {
    summary: {
        total_spent: number;
        this_month: number;
        avg_monthly: number;
        transaction_count: number;
    };
    recent_spending: SpendingItem[];
    monthly_data: MonthlySpending[];
    year: number;
}

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

/**
 * Spending Report Page
 * 
 * Shows spending overview and recent transactions.
 */
export default function SpendingReport({ 
    summary = { total_spent: 0, this_month: 0, avg_monthly: 0, transaction_count: 0 },
    recent_spending = [],
    monthly_data = [],
    year = new Date().getFullYear()
}: Props) {
    // Calculate max for chart scaling
    const maxMonthly = Math.max(...monthly_data.map(m => m.amount), 1);

    return (
        <AppLayout>
            <Head title="Spending Report" />

            <div className="space-y-6">
                {/* Header */}
                <PageHeader 
                    title="Spending Report" 
                    subtitle={`Expenditure analysis for year ${year}`}
                />

                {/* Summary Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatsCard
                        title="Total Spent"
                        value={formatCurrency(summary.total_spent)}
                        icon={DollarSign}
                        color="primary"
                    />
                    <StatsCard
                        title="This Month"
                        value={formatCurrency(summary.this_month)}
                        icon={Calendar}
                        color="accent"
                    />
                    <StatsCard
                        title="Monthly Average"
                        value={formatCurrency(summary.avg_monthly)}
                        icon={TrendingUp}
                        color="secondary"
                    />
                    <StatsCard
                        title="Transactions"
                        value={summary.transaction_count}
                        icon={Receipt}
                        color="cyan"
                    />
                </div>

                {/* Monthly Chart & Recent Spending */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Monthly Spending Chart */}
                    <Card>
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-theme-primary mb-4">Monthly Spending</h3>
                            <div className="space-y-3">
                                {monthly_data.map((month, index) => (
                                    <div key={index} className="flex items-center gap-4">
                                        <span className="w-12 text-sm text-theme-secondary">{month.month}</span>
                                        <div className="flex-1 h-6 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all duration-500"
                                                style={{ width: `${(month.amount / maxMonthly) * 100}%` }}
                                            />
                                        </div>
                                        <span className="w-24 text-sm font-medium text-theme-primary text-right">
                                            {formatCurrency(month.amount)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    {/* Recent Spending */}
                    <Card>
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-theme-primary mb-4">Recent Transactions</h3>
                            <div className="space-y-3">
                                {recent_spending.slice(0, 8).map((item) => (
                                    <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                        <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/50 rounded-lg flex items-center justify-center">
                                            <span className="text-xs font-bold text-primary-600 dark:text-primary-400">
                                                {item.category_code}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-theme-primary truncate">{item.name}</p>
                                            <p className="text-xs text-theme-muted">{item.project_name}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-accent-600 dark:text-accent-400">
                                                {formatCurrency(item.amount)}
                                            </p>
                                            <p className="text-xs text-theme-muted">{formatDate(item.date)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {recent_spending.length === 0 && (
                                <div className="text-center py-8">
                                    <Receipt className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                                    <p className="text-theme-secondary">No transactions yet</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
