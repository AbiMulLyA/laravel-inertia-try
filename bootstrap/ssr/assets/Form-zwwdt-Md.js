import { a as FormTextarea, o as FormSelect, r as FormCard, s as FormInput, t as AppLayout } from "./AppLayout-Cll6vCno.js";
import { Head, Link, useForm } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowLeft, Loader2, Save } from "lucide-react";
//#region resources/js/Pages/Tasks/Form.tsx
/**
* Task Form Page
* 
* Example of a comprehensive form with multiple sections.
* UI Pattern: Multi-section form with all field types.
*/
function TaskForm({ task, projects, statuses, priorities }) {
	const isEdit = !!task;
	const { data, setData, post, put, processing, errors } = useForm({
		project_id: task?.project_id?.toString() ?? "",
		code: task?.code ?? "",
		name: task?.name ?? "",
		description: task?.description ?? "",
		location: task?.location ?? "",
		target: task?.target?.toString() ?? "",
		achieved: task?.achieved?.toString() ?? "0",
		unit: task?.unit ?? "",
		budget: task?.budget?.toString() ?? "",
		spent: task?.spent?.toString() ?? "0",
		status: task?.status ?? "pending",
		progress: task?.progress?.toString() ?? "0",
		priority: task?.priority ?? "medium",
		start_date: task?.start_date ?? "",
		end_date: task?.end_date ?? "",
		notes: task?.notes ?? ""
	});
	const handleSubmit = (e) => {
		e.preventDefault();
		if (isEdit) put(`/tasks/${task.id}`);
		else post("/tasks");
	};
	return /* @__PURE__ */ jsxs(AppLayout, { children: [/* @__PURE__ */ jsx(Head, { title: isEdit ? "Edit Task" : "Add Task" }), /* @__PURE__ */ jsxs("div", {
		className: "max-w-3xl mx-auto",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "mb-6",
			children: [
				/* @__PURE__ */ jsxs(Link, {
					href: "/tasks",
					className: "inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4",
					children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4" }), "Back to Tasks"]
				}),
				/* @__PURE__ */ jsx("h1", {
					className: "text-2xl font-bold text-gray-900",
					children: isEdit ? "Edit Task" : "Add New Task"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "text-gray-500",
					children: isEdit ? "Update task information" : "Fill in the form to create a new task"
				})
			]
		}), /* @__PURE__ */ jsx(FormCard, { children: /* @__PURE__ */ jsxs("form", {
			onSubmit: handleSubmit,
			className: "space-y-6",
			children: [
				/* @__PURE__ */ jsx(FormSelect, {
					label: "Project",
					required: true,
					value: data.project_id,
					onChange: (e) => setData("project_id", e.target.value),
					error: errors.project_id,
					placeholder: "Select Project",
					children: projects.map((p) => /* @__PURE__ */ jsxs("option", {
						value: p.id,
						children: [
							"[",
							p.category.code,
							"] ",
							p.name
						]
					}, p.id))
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 sm:grid-cols-3 gap-6",
					children: [
						/* @__PURE__ */ jsx(FormInput, {
							label: "Code",
							required: true,
							value: data.code,
							onChange: (e) => setData("code", e.target.value.toUpperCase()),
							error: errors.code,
							placeholder: "e.g., TSK-001"
						}),
						/* @__PURE__ */ jsx(FormSelect, {
							label: "Status",
							required: true,
							value: data.status,
							onChange: (e) => setData("status", e.target.value),
							options: Object.entries(statuses).map(([key, label]) => ({
								value: key,
								label
							}))
						}),
						/* @__PURE__ */ jsx(FormSelect, {
							label: "Priority",
							required: true,
							value: data.priority,
							onChange: (e) => setData("priority", e.target.value),
							options: Object.entries(priorities).map(([key, label]) => ({
								value: key,
								label
							}))
						})
					]
				}),
				/* @__PURE__ */ jsx(FormInput, {
					label: "Name",
					required: true,
					value: data.name,
					onChange: (e) => setData("name", e.target.value),
					error: errors.name,
					placeholder: "Task name"
				}),
				/* @__PURE__ */ jsx(FormTextarea, {
					label: "Description",
					value: data.description,
					onChange: (e) => setData("description", e.target.value),
					rows: 3,
					placeholder: "Task description..."
				}),
				/* @__PURE__ */ jsx(FormInput, {
					label: "Location",
					value: data.location,
					onChange: (e) => setData("location", e.target.value),
					placeholder: "Location..."
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "border-t border-gray-100 dark:border-gray-700 pt-6",
					children: [
						/* @__PURE__ */ jsx("h3", {
							className: "text-sm font-medium text-gray-900 dark:text-gray-100 mb-4",
							children: "Target & Budget"
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-1 sm:grid-cols-3 gap-6",
							children: [
								/* @__PURE__ */ jsx(FormInput, {
									label: "Target",
									type: "number",
									required: true,
									value: data.target,
									onChange: (e) => setData("target", e.target.value),
									error: errors.target,
									placeholder: "0",
									min: "0",
									step: "0.01"
								}),
								/* @__PURE__ */ jsx(FormInput, {
									label: "Unit",
									required: true,
									value: data.unit,
									onChange: (e) => setData("unit", e.target.value),
									error: errors.unit,
									placeholder: "e.g., units, hours"
								}),
								/* @__PURE__ */ jsx(FormInput, {
									label: "Budget",
									type: "number",
									required: true,
									value: data.budget,
									onChange: (e) => setData("budget", e.target.value),
									error: errors.budget,
									placeholder: "0",
									min: "0"
								})
							]
						}),
						isEdit && /* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6",
							children: [
								/* @__PURE__ */ jsx(FormInput, {
									label: "Achieved",
									type: "number",
									value: data.achieved,
									onChange: (e) => setData("achieved", e.target.value),
									placeholder: "0",
									min: "0",
									step: "0.01"
								}),
								/* @__PURE__ */ jsx(FormInput, {
									label: "Progress (%)",
									type: "number",
									value: data.progress,
									onChange: (e) => setData("progress", e.target.value),
									placeholder: "0",
									min: "0",
									max: "100"
								}),
								/* @__PURE__ */ jsx(FormInput, {
									label: "Spent",
									type: "number",
									value: data.spent,
									onChange: (e) => setData("spent", e.target.value),
									placeholder: "0",
									min: "0"
								})
							]
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "border-t border-gray-100 dark:border-gray-700 pt-6",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "text-sm font-medium text-gray-900 dark:text-gray-100 mb-4",
						children: "Timeline"
					}), /* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-6",
						children: [/* @__PURE__ */ jsx(FormInput, {
							label: "Start Date",
							type: "date",
							value: data.start_date,
							onChange: (e) => setData("start_date", e.target.value)
						}), /* @__PURE__ */ jsx(FormInput, {
							label: "End Date",
							type: "date",
							value: data.end_date,
							onChange: (e) => setData("end_date", e.target.value)
						})]
					})]
				}),
				isEdit && /* @__PURE__ */ jsx("div", {
					className: "border-t border-gray-100 dark:border-gray-700 pt-6",
					children: /* @__PURE__ */ jsx(FormTextarea, {
						label: "Notes",
						value: data.notes,
						onChange: (e) => setData("notes", e.target.value),
						rows: 3,
						placeholder: "Additional notes..."
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-700",
					children: [/* @__PURE__ */ jsx(Link, {
						href: "/tasks",
						className: "px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700",
						children: "Cancel"
					}), /* @__PURE__ */ jsxs("button", {
						type: "submit",
						disabled: processing,
						className: "inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 shadow-sm shadow-primary-600/20",
						children: [processing ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "w-4 h-4" }), isEdit ? "Save Changes" : "Add Task"]
					})]
				})
			]
		}) })]
	})] });
}
//#endregion
export { TaskForm as default };
