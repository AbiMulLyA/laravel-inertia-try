import { d as Card, t as AppLayout, u as PageHeader } from "./AppLayout-Cll6vCno.js";
import { Head, Link, useForm } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowLeft, Lock, Mail, Shield, User } from "lucide-react";
//#region resources/js/Pages/Settings/Users/Form.tsx
function UserForm({ user, isEdit }) {
	const form = useForm({
		name: user?.name || "",
		email: user?.email || "",
		password: "",
		password_confirmation: "",
		role: user?.role || "User"
	});
	const handleSubmit = (e) => {
		e.preventDefault();
		if (isEdit && user?.id) form.put(`/settings/users/${user.id}`);
		else form.post("/settings/users");
	};
	return /* @__PURE__ */ jsxs(AppLayout, { children: [/* @__PURE__ */ jsx(Head, { title: isEdit ? "Edit User" : "Add User" }), /* @__PURE__ */ jsxs("div", {
		className: "space-y-6 max-w-3xl",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-4",
			children: [/* @__PURE__ */ jsx(Link, {
				href: "/settings/users",
				className: "p-2 text-theme-muted hover:text-theme-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors",
				children: /* @__PURE__ */ jsx(ArrowLeft, { className: "w-5 h-5" })
			}), /* @__PURE__ */ jsx(PageHeader, {
				title: isEdit ? "Edit User" : "Add User",
				subtitle: isEdit ? `Editing ${user?.name}` : "Create a new user account"
			})]
		}), /* @__PURE__ */ jsxs("form", {
			onSubmit: handleSubmit,
			className: "space-y-6",
			children: [
				/* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs("div", {
					className: "p-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3 mb-6",
						children: [/* @__PURE__ */ jsx("div", {
							className: "w-10 h-10 bg-primary-100 dark:bg-primary-900/50 rounded-lg flex items-center justify-center",
							children: /* @__PURE__ */ jsx(User, { className: "w-5 h-5 text-primary-600 dark:text-primary-400" })
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
							className: "text-lg font-semibold text-theme-primary",
							children: "User Information"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-sm text-theme-secondary",
							children: "Basic account details"
						})] })]
					}), /* @__PURE__ */ jsxs("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("label", {
								className: "form-label",
								children: "Name"
							}),
							/* @__PURE__ */ jsx("input", {
								type: "text",
								value: form.data.name,
								onChange: (e) => form.setData("name", e.target.value),
								className: "form-input",
								placeholder: "Enter full name"
							}),
							form.errors.name && /* @__PURE__ */ jsx("p", {
								className: "text-sm text-red-600 mt-1",
								children: form.errors.name
							})
						] }), /* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("label", {
								className: "form-label",
								children: "Email"
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "relative",
								children: [/* @__PURE__ */ jsx(Mail, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" }), /* @__PURE__ */ jsx("input", {
									type: "email",
									value: form.data.email,
									onChange: (e) => form.setData("email", e.target.value),
									className: "form-input pl-10",
									placeholder: "user@example.com"
								})]
							}),
							form.errors.email && /* @__PURE__ */ jsx("p", {
								className: "text-sm text-red-600 mt-1",
								children: form.errors.email
							})
						] })]
					})]
				}) }),
				/* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs("div", {
					className: "p-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3 mb-6",
						children: [/* @__PURE__ */ jsx("div", {
							className: "w-10 h-10 bg-secondary-100 dark:bg-secondary-900/50 rounded-lg flex items-center justify-center",
							children: /* @__PURE__ */ jsx(Shield, { className: "w-5 h-5 text-secondary-600 dark:text-secondary-400" })
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
							className: "text-lg font-semibold text-theme-primary",
							children: "Role & Access"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-sm text-theme-secondary",
							children: "Assign user permissions"
						})] })]
					}), /* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx("label", {
							className: "form-label",
							children: "Role"
						}),
						/* @__PURE__ */ jsx("select", {
							value: form.data.role,
							onChange: (e) => form.setData("role", e.target.value),
							className: "form-input",
							children: [
								"Administrator",
								"User",
								"Editor",
								"Viewer"
							].map((role) => /* @__PURE__ */ jsx("option", {
								value: role,
								children: role
							}, role))
						}),
						form.errors.role && /* @__PURE__ */ jsx("p", {
							className: "text-sm text-red-600 mt-1",
							children: form.errors.role
						})
					] })]
				}) }),
				/* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs("div", {
					className: "p-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3 mb-6",
						children: [/* @__PURE__ */ jsx("div", {
							className: "w-10 h-10 bg-accent-100 dark:bg-accent-900/50 rounded-lg flex items-center justify-center",
							children: /* @__PURE__ */ jsx(Lock, { className: "w-5 h-5 text-accent-600 dark:text-accent-400" })
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
							className: "text-lg font-semibold text-theme-primary",
							children: isEdit ? "Change Password" : "Set Password"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-sm text-theme-secondary",
							children: isEdit ? "Leave blank to keep current password" : "Create a secure password"
						})] })]
					}), /* @__PURE__ */ jsxs("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("label", {
								className: "form-label",
								children: "Password"
							}),
							/* @__PURE__ */ jsx("input", {
								type: "password",
								value: form.data.password,
								onChange: (e) => form.setData("password", e.target.value),
								className: "form-input",
								placeholder: isEdit ? "••••••••" : "Enter password",
								autoComplete: "new-password"
							}),
							form.errors.password && /* @__PURE__ */ jsx("p", {
								className: "text-sm text-red-600 mt-1",
								children: form.errors.password
							})
						] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "form-label",
							children: "Confirm Password"
						}), /* @__PURE__ */ jsx("input", {
							type: "password",
							value: form.data.password_confirmation,
							onChange: (e) => form.setData("password_confirmation", e.target.value),
							className: "form-input",
							placeholder: "Confirm password",
							autoComplete: "new-password"
						})] })]
					})]
				}) }),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-end gap-3",
					children: [/* @__PURE__ */ jsx(Link, {
						href: "/settings/users",
						className: "btn btn-outline",
						children: "Cancel"
					}), /* @__PURE__ */ jsx("button", {
						type: "submit",
						disabled: form.processing,
						className: "btn btn-primary",
						children: form.processing ? "Saving..." : isEdit ? "Update User" : "Create User"
					})]
				})
			]
		})]
	})] });
}
//#endregion
export { UserForm as default };
