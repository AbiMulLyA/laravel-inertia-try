import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { FormInput, FormSelect, FormTextarea, FormCard } from '@/Components';

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
                <FormCard>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Project Selection */}
                        <FormSelect
                            label="Project"
                            required
                            value={data.project_id}
                            onChange={(e) => setData('project_id', e.target.value)}
                            error={errors.project_id}
                            placeholder="Select Project"
                        >
                            {projects.map((p) => (
                                <option key={p.id} value={p.id}>
                                    [{p.category.code}] {p.name}
                                </option>
                            ))}
                        </FormSelect>

                        {/* Basic Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <FormInput
                                label="Code"
                                required
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                error={errors.code}
                                placeholder="e.g., TSK-001"
                            />

                            <FormSelect
                                label="Status"
                                required
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                options={Object.entries(statuses).map(([key, label]) => ({
                                    value: key,
                                    label: label
                                }))}
                            />

                            <FormSelect
                                label="Priority"
                                required
                                value={data.priority}
                                onChange={(e) => setData('priority', e.target.value)}
                                options={Object.entries(priorities).map(([key, label]) => ({
                                    value: key,
                                    label: label
                                }))}
                            />
                        </div>

                        <FormInput
                            label="Name"
                            required
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            error={errors.name}
                            placeholder="Task name"
                        />

                        <FormTextarea
                            label="Description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows={3}
                            placeholder="Task description..."
                        />

                        <FormInput
                            label="Location"
                            value={data.location}
                            onChange={(e) => setData('location', e.target.value)}
                            placeholder="Location..."
                        />

                        {/* Target & Budget */}
                        <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4">Target & Budget</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <FormInput
                                    label="Target"
                                    type="number"
                                    required
                                    value={data.target}
                                    onChange={(e) => setData('target', e.target.value)}
                                    error={errors.target as string} // inertia type workaround
                                    placeholder="0"
                                    min="0"
                                    step="0.01"
                                />
                                <FormInput
                                    label="Unit"
                                    required
                                    value={data.unit}
                                    onChange={(e) => setData('unit', e.target.value)}
                                    error={errors.unit}
                                    placeholder="e.g., units, hours"
                                />
                                <FormInput
                                    label="Budget"
                                    type="number"
                                    required
                                    value={data.budget}
                                    onChange={(e) => setData('budget', e.target.value)}
                                    error={errors.budget}
                                    placeholder="0"
                                    min="0"
                                />
                            </div>

                            {isEdit && (
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
                                    <FormInput
                                        label="Achieved"
                                        type="number"
                                        value={data.achieved}
                                        onChange={(e) => setData('achieved', e.target.value)}
                                        placeholder="0"
                                        min="0"
                                        step="0.01"
                                    />
                                    <FormInput
                                        label="Progress (%)"
                                        type="number"
                                        value={data.progress}
                                        onChange={(e) => setData('progress', e.target.value)}
                                        placeholder="0"
                                        min="0"
                                        max="100"
                                    />
                                    <FormInput
                                        label="Spent"
                                        type="number"
                                        value={data.spent}
                                        onChange={(e) => setData('spent', e.target.value)}
                                        placeholder="0"
                                        min="0"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Timeline */}
                        <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4">Timeline</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <FormInput
                                    label="Start Date"
                                    type="date"
                                    value={data.start_date}
                                    onChange={(e) => setData('start_date', e.target.value)}
                                />
                                <FormInput
                                    label="End Date"
                                    type="date"
                                    value={data.end_date}
                                    onChange={(e) => setData('end_date', e.target.value)}
                                />
                            </div>
                        </div>

                        {isEdit && (
                            <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
                                <FormTextarea
                                    label="Notes"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    rows={3}
                                    placeholder="Additional notes..."
                                />
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-700">
                            <Link
                                href="/tasks"
                                className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 shadow-sm shadow-primary-600/20"
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
                </FormCard>
            </div>
        </AppLayout>
    );
}
