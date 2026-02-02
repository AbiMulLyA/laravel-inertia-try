import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageHeader, Card, StatsCard, Table, Pagination, Shimmer } from '@/Components';
import { useCachedDeferred, useDeferredCache } from '@/Contexts/DeferredCacheContext';
import { 
    Plus, 
    Edit, 
    Trash2, 
    FolderKanban,
    Search,
    Filter,
    Activity,
    CheckCircle2,
    FileEdit
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

interface Summary {
    total: number;
    active: number;
    completed: number;
    draft: number;
}

interface Props {
    projects?: PaginatedData;
    categories?: Category[];
    filters: {
        category_id: string | null;
        status: string | null;
        search: string | null;
    };
    summary?: Summary;
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
 * Uses deferred props with client-side caching for optimal UX.
 */
export default function ProjectsIndex({ 
    projects: rawProjects,
    categories: rawCategories,
    filters = { category_id: null, status: null, search: null },
    summary: rawSummary,
    statuses = {}
}: Props) {
    const cache = useDeferredCache();

    // Use cached data
    const { data: projects, isLoading: projectsLoading } = useCachedDeferred('projects.list', rawProjects);
    const { data: categories, isLoading: categoriesLoading } = useCachedDeferred('projects.categories', rawCategories);
    const { data: summary, isLoading: summaryLoading } = useCachedDeferred('projects.summary', rawSummary);

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Delete project "${name}"?`)) {
            router.delete(`/projects/${id}`);
            // Cache will be invalidated automatically via inertia:success listener
        }
    };

    const handleFilterChange = (key: string, value: string) => {
        // Invalidate projects cache when filter changes
        cache.invalidate('projects.list');
        router.get('/projects', { ...filters, [key]: value }, { preserveState: true });
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        handleFilterChange('search', formData.get('search') as string);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-primary-50 dark:bg-primary-500/20 text-primary-700 dark:text-primary-400 border border-primary-200 dark:border-primary-500/30';
            case 'completed': return 'bg-secondary-50 dark:bg-secondary-500/20 text-secondary-700 dark:text-secondary-400 border border-secondary-200 dark:border-secondary-500/30';
            case 'draft': return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600';
            default: return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600';
        }
    };

    return (
        <AppLayout>
            <Head title="Projects" />

            <div className="space-y-6">
                {/* Header - Always visible */}
                <PageHeader 
                    title="Projects" 
                    subtitle="Manage projects and track progress"
                    action={{
                        label: 'Add Project',
                        href: '/projects/create',
                        icon: Plus
                    }}
                />

                {/* Summary Cards */}
                {summaryLoading ? (
                    <Shimmer.StatsCards count={4} />
                ) : summary && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div onClick={() => router.get('/projects', {})}>
                            <StatsCard
                                title="Total Projects"
                                value={summary.total}
                                icon={FolderKanban}
                                color="secondary"
                            />
                        </div>
                        <div onClick={() => handleFilterChange('status', 'active')}>
                            <StatsCard
                                title="Active"
                                value={summary.active}
                                icon={Activity}
                                color="primary"
                            />
                        </div>
                        <div onClick={() => handleFilterChange('status', 'completed')}>
                            <StatsCard
                                title="Completed"
                                value={summary.completed}
                                icon={CheckCircle2}
                                color="cyan"
                            />
                        </div>
                        <div onClick={() => handleFilterChange('status', 'draft')}>
                            <StatsCard
                                title="Draft"
                                value={summary.draft}
                                icon={FileEdit}
                                color="accent"
                            />
                        </div>
                    </div>
                )}

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
                                    placeholder="Search projects..."
                                    className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#1a2744] border border-gray-300 dark:border-[#1e3a5f] rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                                />
                            </div>
                        </form>
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-gray-400" />
                            {categoriesLoading ? (
                                <select className="px-3 py-2 bg-white dark:bg-[#1a2744] border border-gray-300 dark:border-[#1e3a5f] rounded-lg text-sm text-gray-400">
                                    <option>Loading...</option>
                                </select>
                            ) : (
                                <select
                                    value={filters.category_id || ''}
                                    onChange={(e) => handleFilterChange('category_id', e.target.value)}
                                    className="px-3 py-2 bg-white dark:bg-[#1a2744] border border-gray-300 dark:border-[#1e3a5f] rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm text-gray-900 dark:text-white"
                                >
                                    <option value="">All Categories</option>
                                    {categories?.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            )}
                            <select
                                value={filters.status || ''}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                className="px-3 py-2 bg-white dark:bg-[#1a2744] border border-gray-300 dark:border-[#1e3a5f] rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm text-gray-900 dark:text-white"
                            >
                                <option value="">All Status</option>
                                {Object.entries(statuses).map(([key, label]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </Card>

                {/* Projects Table */}
                {projectsLoading ? (
                    <Card padding="none" className="overflow-hidden">
                        <Shimmer.Table rows={10} cols={6} />
                    </Card>
                ) : projects && (
                    <Card padding="none" className="overflow-hidden">
                        <Table>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Project</Table.Th>
                                    <Table.Th>Category</Table.Th>
                                    <Table.Th align="right">Budget</Table.Th>
                                    <Table.Th>Progress</Table.Th>
                                    <Table.Th>Status</Table.Th>
                                    <Table.Th align="right">Actions</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {projects.data.map((item) => (
                                    <Table.Tr key={item.id}>
                                        <Table.Td>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.code}</p>
                                            </div>
                                        </Table.Td>
                                        <Table.Td>
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-primary-50 dark:bg-primary-500/20 text-primary-700 dark:text-primary-400 border border-primary-200 dark:border-primary-500/30">
                                                {item.category?.code || '-'}
                                            </span>
                                        </Table.Td>
                                        <Table.Td align="right">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(item.budget)}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Spent: {formatCurrency(item.spent)}</p>
                                        </Table.Td>
                                        <Table.Td>
                                            <div className="w-28">
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="font-medium text-gray-700 dark:text-gray-300">{item.spent_percentage}%</span>
                                                </div>
                                                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                                                    <div 
                                                        className="h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-600"
                                                        style={{ width: `${Math.min(item.spent_percentage, 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </Table.Td>
                                        <Table.Td>
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                                                {item.status_label}
                                            </span>
                                        </Table.Td>
                                        <Table.Td align="right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link
                                                    href={`/projects/${item.id}/edit`}
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

                        {projects.data.length === 0 && (
                            <div className="p-12 text-center">
                                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <FolderKanban className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No projects yet</h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-6">Get started by creating your first project</p>
                                <Link
                                    href="/projects/create"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Project
                                </Link>
                            </div>
                        )}

                        {/* Pagination */}
                        <Pagination 
                            links={projects.links}
                            from={(projects.current_page - 1) * projects.per_page + 1}
                            to={Math.min(projects.current_page * projects.per_page, projects.total)}
                            total={projects.total}
                        />
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
