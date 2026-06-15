import { a as FormTextarea, i as FormSection, o as FormSelect, r as FormCard, s as FormInput, t as AppLayout } from "./AppLayout-Cll6vCno.js";
import { Head, Link, useForm } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowLeft, Loader2, Save } from "lucide-react";
//#region resources/js/Pages/Projects/Form.tsx
/**
* Project Form Page
* 
* Example of a form with dropdown relationships and date fields.
* UI Pattern: Sectioned form with related data selection.
*/
function ProjectForm({ project, categories, statuses }) {
	const isEdit = !!project;
	const { data, setData, post, put, processing, errors } = useForm({
		category_id: project?.category_id?.toString() ?? "",
		code: project?.code ?? "",
		name: project?.name ?? "",
		description: project?.description ?? "",
		year: project?.year?.toString() ?? (/* @__PURE__ */ new Date()).getFullYear().toString(),
		budget: project?.budget?.toString() ?? "",
		spent: project?.spent?.toString() ?? "0",
		status: project?.status ?? "draft",
		start_date: project?.start_date ?? "",
		end_date: project?.end_date ?? ""
	});
	const handleSubmit = (e) => {
		e.preventDefault();
		if (isEdit) put(`/projects/${project.id}`);
		else post("/projects");
	};
	return /* @__PURE__ */ jsxs(AppLayout, { children: [/* @__PURE__ */ jsx(Head, { title: isEdit ? "Edit Project" : "Add Project" }), /* @__PURE__ */ jsxs("div", {
		className: "max-w-3xl mx-auto",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "mb-6",
			children: [
				/* @__PURE__ */ jsxs(Link, {
					href: "/projects",
					className: "inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4",
					children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4" }), "Back to Projects"]
				}),
				/* @__PURE__ */ jsx("h1", {
					className: "text-2xl font-bold text-gray-900",
					children: isEdit ? "Edit Project" : "Add New Project"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "text-gray-500",
					children: isEdit ? "Update project information" : "Fill in the form to create a new project"
				})
			]
		}), /* @__PURE__ */ jsx(FormCard, { children: /* @__PURE__ */ jsxs("form", {
			onSubmit: handleSubmit,
			children: [
				/* @__PURE__ */ jsxs(FormSection, {
					title: "Basic Information",
					description: "General details about the project.",
					className: "mb-8",
					children: [
						/* @__PURE__ */ jsx(FormSelect, {
							label: "Category",
							required: true,
							value: data.category_id,
							onChange: (e) => setData("category_id", e.target.value),
							error: errors.category_id,
							placeholder: "Select Category",
							children: categories.map((c) => /* @__PURE__ */ jsxs("option", {
								value: c.id,
								children: [
									"[",
									c.code,
									"] ",
									c.name
								]
							}, c.id))
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-6",
							children: [/* @__PURE__ */ jsx(FormInput, {
								label: "Code",
								required: true,
								value: data.code,
								onChange: (e) => setData("code", e.target.value.toUpperCase()),
								error: errors.code,
								placeholder: "e.g., PRJ-001"
							}), /* @__PURE__ */ jsx(FormSelect, {
								label: "Status",
								required: true,
								value: data.status,
								onChange: (e) => setData("status", e.target.value),
								error: errors.status,
								options: Object.entries(statuses).map(([key, label]) => ({
									value: key,
									label
								}))
							})]
						}),
						/* @__PURE__ */ jsx(FormInput, {
							label: "Name",
							required: true,
							value: data.name,
							onChange: (e) => setData("name", e.target.value),
							error: errors.name,
							placeholder: "Project name"
						}),
						/* @__PURE__ */ jsx(FormTextarea, {
							label: "Description",
							value: data.description,
							onChange: (e) => setData("description", e.target.value),
							rows: 3,
							placeholder: "Project description...",
							error: errors.description
						})
					]
				}),
				/* @__PURE__ */ jsxs(FormSection, {
					title: "Budget & Timeline",
					description: "Financial and scheduling details.",
					className: "border-t pt-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
						children: [
							/* @__PURE__ */ jsx(FormInput, {
								label: "Year",
								type: "number",
								required: true,
								value: data.year,
								onChange: (e) => setData("year", e.target.value),
								error: errors.year,
								min: "2020",
								max: "2100"
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
							}),
							isEdit && /* @__PURE__ */ jsx(FormInput, {
								label: "Spent",
								type: "number",
								value: data.spent,
								onChange: (e) => setData("spent", e.target.value),
								placeholder: "0",
								min: "0",
								error: errors.spent
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
						children: [/* @__PURE__ */ jsx(FormInput, {
							label: "Start Date",
							type: "date",
							value: data.start_date,
							onChange: (e) => setData("start_date", e.target.value),
							error: errors.start_date
						}), /* @__PURE__ */ jsx(FormInput, {
							label: "End Date",
							type: "date",
							value: data.end_date,
							onChange: (e) => setData("end_date", e.target.value),
							error: errors.end_date
						})]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-end gap-3 pt-4 border-t",
					children: [/* @__PURE__ */ jsx(Link, {
						href: "/projects",
						className: "px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50",
						children: "Cancel"
					}), /* @__PURE__ */ jsxs("button", {
						type: "submit",
						disabled: processing,
						className: "inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50",
						children: [processing ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "w-4 h-4" }), isEdit ? "Save Changes" : "Add Project"]
					})]
				})
			]
		}) })]
	})] });
}
//#endregion
export { ProjectForm as default };
