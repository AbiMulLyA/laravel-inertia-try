import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

interface Category {
    id: number;
    code: string;
    name: string;
}

interface Project {
    id: number;
    category_id: number;
    code: string;
    name: string;
    category: Category;
}

interface Task {
    id: number;
    project_id: number;
    code: string;
    name: string;
    description: string | null;
    location: string | null;
    target: number;
    achieved: number;
    unit: string;
    budget: number;
    spent: number;
    status: string;
    progress: number;
    priority: string;
    start_date: string | null;
    end_date: string | null;
    notes: string | null;
}

interface Props {
    task?: Task;
    projects: Project[];
    statuses: Record<string, string>;
    priorities: Record<string, string>;
}

/**
 * Task Form Page
 * 
 * Example of a comprehensive form with multiple sections.
 * UI Pattern: Multi-section form with all field types.
 */
export default function TaskForm({ task, projects, statuses, priorities }: Props) {
    const isEdit = !!task;

    const { data, setData, post, put, processing, errors } = useForm({
        project_id: task?.project_id?.toString() ?? '',
        code: task?.code ?? '',
        name: task?.name ?? '',
        description: task?.description ?? '',
        location: task?.location ?? '',
        target: task?.target?.toString() ?? '',
        achieved: task?.achieved?.toString() ?? '0',
        unit: task?.unit ?? '',
        budget: task?.budget?.toString() ?? '',
        spent: task?.spent?.toString() ?? '0',
        status: task?.status ?? 'pending',
        progress: task?.progress?.toString() ?? '0',
        priority: task?.priority ?? 'medium',
        start_date: task?.start_date ?? '',
        end_date: task?.end_date ?? '',
        notes: task?.notes ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(`/tasks/${task.id}`);
        } else {
            post('/tasks');
        }
    };

    return (
        <AppLayout>
            <Head title={isEdit ? 'Edit Task' : 'Add Task'} />

            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        href="/tasks"
                        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Tasks
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isEdit ? 'Edit Task' : 'Add New Task'}
                    </h1>
                    <p className="text-gray-500">
                        {isEdit ? 'Update task information' : 'Fill in the form to create a new task'}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-6 space-y-6">
                    {/* Project Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Project <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={data.project_id}
                            onChange={(e) => setData('project_id', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                                errors.project_id ? 'border-red-500' : 'border-gray-300'
                            }`}
                        >
                            <option value="">Select Project</option>
                            {projects.map((p) => (
                                <option key={p.id} value={p.id}>
                                    [{p.category.code}] {p.name}
                                </option>
                            ))}
                        </select>
                        {errors.project_id && <p className="mt-1 text-sm text-red-500">{errors.project_id}</p>}
                    </div>

                    {/* Basic Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Code <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                                    errors.code ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="e.g., TSK-001"
                            />
                            {errors.code && <p className="mt-1 text-sm text-red-500">{errors.code}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            >
                                {Object.entries(statuses).map(([key, label]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Priority <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={data.priority}
                                onChange={(e) => setData('priority', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            >
                                {Object.entries(priorities).map(([key, label]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                                errors.name ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Task name"
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            placeholder="Task description..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Location
                        </label>
                        <input
                            type="text"
                            value={data.location}
                            onChange={(e) => setData('location', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            placeholder="Location..."
                        />
                    </div>

                    {/* Target & Budget */}
                    <div className="border-t pt-6">
                        <h3 className="text-sm font-medium text-gray-900 mb-4">Target & Budget</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Target <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={data.target}
                                    onChange={(e) => setData('target', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                                        errors.target ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="0"
                                    min="0"
                                    step="0.01"
                                />
                                {errors.target && <p className="mt-1 text-sm text-red-500">{errors.target}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Unit <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.unit}
                                    onChange={(e) => setData('unit', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                                        errors.unit ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="e.g., units, hours"
                                />
                                {errors.unit && <p className="mt-1 text-sm text-red-500">{errors.unit}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Budget <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={data.budget}
                                    onChange={(e) => setData('budget', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
                                        errors.budget ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="0"
                                    min="0"
                                />
                                {errors.budget && <p className="mt-1 text-sm text-red-500">{errors.budget}</p>}
                            </div>
                        </div>

                        {isEdit && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Achieved
                                    </label>
                                    <input
                                        type="number"
                                        value={data.achieved}
                                        onChange={(e) => setData('achieved', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        placeholder="0"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Progress (%)
                                    </label>
                                    <input
                                        type="number"
                                        value={data.progress}
                                        onChange={(e) => setData('progress', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        placeholder="0"
                                        min="0"
                                        max="100"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Spent
                                    </label>
                                    <input
                                        type="number"
                                        value={data.spent}
                                        onChange={(e) => setData('spent', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                        placeholder="0"
                                        min="0"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Timeline */}
                    <div className="border-t pt-6">
                        <h3 className="text-sm font-medium text-gray-900 mb-4">Timeline</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    value={data.start_date}
                                    onChange={(e) => setData('start_date', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    value={data.end_date}
                                    onChange={(e) => setData('end_date', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                        </div>
                    </div>

                    {isEdit && (
                        <div className="border-t pt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Notes
                            </label>
                            <textarea
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                placeholder="Additional notes..."
                            />
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t">
                        <Link
                            href="/tasks"
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50"
                        >
                            {processing ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            {isEdit ? 'Save Changes' : 'Add Task'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
