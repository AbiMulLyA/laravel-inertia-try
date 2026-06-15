import { a as FormTextarea, r as FormCard, s as FormInput, t as AppLayout } from "./AppLayout-Cll6vCno.js";
import { Head, Link, useForm } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowLeft, Loader2, Save } from "lucide-react";
//#region resources/js/Pages/Categories/Form.tsx
/**
* Category Form Page
* 
* Example of a simple create/edit form.
* UI Pattern: Form with validation, back button, submit action.
*/
function CategoryForm({ category }) {
	const isEdit = !!category;
	const { data, setData, post, put, processing, errors } = useForm({
		code: category?.code ?? "",
		name: category?.name ?? "",
		description: category?.description ?? "",
		is_active: category?.is_active ?? true
	});
	const handleSubmit = (e) => {
		e.preventDefault();
		if (isEdit) put(`/categories/${category.id}`);
		else post("/categories");
	};
	return /* @__PURE__ */ jsxs(AppLayout, { children: [/* @__PURE__ */ jsx(Head, { title: isEdit ? "Edit Category" : "Add Category" }), /* @__PURE__ */ jsxs("div", {
		className: "max-w-2xl mx-auto",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "mb-6",
			children: [
				/* @__PURE__ */ jsxs(Link, {
					href: "/categories",
					className: "inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4",
					children: [/* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4" }), "Back to Categories"]
				}),
				/* @__PURE__ */ jsx("h1", {
					className: "text-2xl font-bold text-gray-900",
					children: isEdit ? "Edit Category" : "Add New Category"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "text-gray-500",
					children: isEdit ? "Update category information" : "Fill in the form to add a new category"
				})
			]
		}), /* @__PURE__ */ jsx(FormCard, { children: /* @__PURE__ */ jsxs("form", {
			onSubmit: handleSubmit,
			className: "space-y-6",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 gap-6",
					children: [/* @__PURE__ */ jsx(FormInput, {
						label: "Code",
						required: true,
						value: data.code,
						onChange: (e) => setData("code", e.target.value.toUpperCase()),
						error: errors.code,
						placeholder: "e.g., DEV",
						maxLength: 20
					}), /* @__PURE__ */ jsx(FormInput, {
						label: "Name",
						required: true,
						value: data.name,
						onChange: (e) => setData("name", e.target.value),
						error: errors.name,
						placeholder: "Category name"
					})]
				}),
				/* @__PURE__ */ jsx(FormTextarea, {
					label: "Description",
					value: data.description,
					onChange: (e) => setData("description", e.target.value),
					rows: 3,
					placeholder: "Optional description...",
					error: errors.description
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsx("input", {
						type: "checkbox",
						id: "is_active",
						checked: data.is_active,
						onChange: (e) => setData("is_active", e.target.checked),
						className: "w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
					}), /* @__PURE__ */ jsx("label", {
						htmlFor: "is_active",
						className: "text-sm text-gray-700 dark:text-gray-300",
						children: "Active"
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-700",
					children: [/* @__PURE__ */ jsx(Link, {
						href: "/categories",
						className: "px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700",
						children: "Cancel"
					}), /* @__PURE__ */ jsxs("button", {
						type: "submit",
						disabled: processing,
						className: "inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 shadow-sm shadow-primary-600/20",
						children: [processing ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "w-4 h-4" }), isEdit ? "Save Changes" : "Add Category"]
					})]
				})
			]
		}) })]
	})] });
}
//#endregion
export { CategoryForm as default };
