import { d as Card, t as AppLayout, u as PageHeader } from "./AppLayout-Cll6vCno.js";
import { Head, useForm } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Lock, Shield, User } from "lucide-react";
import { useState } from "react";
//#region resources/js/Pages/Profile/Index.tsx
var SectionHeader = ({ icon: Icon, title, subtitle, variant = "primary" }) => {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex items-center gap-3 mb-6",
		children: [/* @__PURE__ */ jsx("div", {
			className: `w-10 h-10 rounded-lg flex items-center justify-center ${{
				primary: "bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400",
				secondary: "bg-secondary-100 dark:bg-secondary-900/50 text-secondary-600 dark:text-secondary-400",
				accent: "bg-accent-100 dark:bg-accent-900/50 text-accent-600 dark:text-accent-400"
			}[variant]}`,
			children: /* @__PURE__ */ jsx(Icon, { className: "w-5 h-5" })
		}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
			className: "text-lg font-semibold text-theme-primary",
			children: title
		}), /* @__PURE__ */ jsx("p", {
			className: "text-sm text-theme-secondary",
			children: subtitle
		})] })]
	});
};
var FormField = ({ label, error, children }) => /* @__PURE__ */ jsxs("div", { children: [
	/* @__PURE__ */ jsx("label", {
		className: "form-label",
		children: label
	}),
	children,
	error && /* @__PURE__ */ jsx("p", {
		className: "text-sm text-red-600 mt-1",
		children: error
	})
] });
function Profile({ user }) {
	const [activeTab, setActiveTab] = useState("profile");
	const profileForm = useForm({
		name: user?.name || "",
		email: user?.email || ""
	});
	const passwordForm = useForm({
		current_password: "",
		password: "",
		password_confirmation: ""
	});
	const handleProfileSubmit = (e) => {
		e.preventDefault();
		profileForm.patch("/profile", { preserveScroll: true });
	};
	const handlePasswordSubmit = (e) => {
		e.preventDefault();
		passwordForm.put("/password", {
			preserveScroll: true,
			onSuccess: () => passwordForm.reset()
		});
	};
	const tabs = [
		{
			id: "profile",
			label: "Profile Information",
			icon: User
		},
		{
			id: "role",
			label: "Role & Permissions",
			icon: Shield
		},
		{
			id: "password",
			label: "Change Password",
			icon: Lock
		}
	];
	const formatDate = (dateString) => {
		if (!dateString) return "-";
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric"
		});
	};
	return /* @__PURE__ */ jsxs(AppLayout, { children: [/* @__PURE__ */ jsx(Head, { title: "Profile" }), /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ jsx(PageHeader, {
			title: "Profile",
			subtitle: "Manage your account settings"
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex items-start gap-6",
			children: [/* @__PURE__ */ jsx("div", {
				className: "w-64 flex-shrink-0",
				children: /* @__PURE__ */ jsx("div", {
					className: "bg-white rounded-3xl p-2 border border-gray-100 dark:bg-slate-800 dark:border-slate-700",
					children: tabs.map(({ id, label, icon: Icon }) => /* @__PURE__ */ jsxs("button", {
						onClick: () => setActiveTab(id),
						className: `w-full flex items-center gap-3 px-5 py-4 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === id ? "bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-slate-700 dark:hover:text-white"}`,
						children: [/* @__PURE__ */ jsx(Icon, { className: `w-5 h-5 ${activeTab === id ? "text-primary-500" : ""}` }), label]
					}, id))
				})
			}), /* @__PURE__ */ jsx("div", {
				className: "flex-1 max-w-3xl",
				children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs("div", {
					className: "p-6",
					children: [
						activeTab === "profile" && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(SectionHeader, {
							icon: User,
							title: "Profile Information",
							subtitle: "Update your account details",
							variant: "primary"
						}), /* @__PURE__ */ jsxs("form", {
							onSubmit: handleProfileSubmit,
							className: "space-y-4",
							children: [
								/* @__PURE__ */ jsx(FormField, {
									label: "Name",
									error: profileForm.errors.name,
									children: /* @__PURE__ */ jsx("input", {
										type: "text",
										value: profileForm.data.name,
										onChange: (e) => profileForm.setData("name", e.target.value),
										className: "form-input"
									})
								}),
								/* @__PURE__ */ jsx(FormField, {
									label: "Email",
									error: profileForm.errors.email,
									children: /* @__PURE__ */ jsx("input", {
										type: "email",
										value: profileForm.data.email,
										onChange: (e) => profileForm.setData("email", e.target.value),
										className: "form-input"
									})
								}),
								/* @__PURE__ */ jsx("div", {
									className: "pt-2",
									children: /* @__PURE__ */ jsx("button", {
										type: "submit",
										disabled: profileForm.processing,
										className: "btn btn-primary",
										children: profileForm.processing ? "Saving..." : "Save Changes"
									})
								})
							]
						})] }),
						activeTab === "role" && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(SectionHeader, {
							icon: Shield,
							title: "Role & Permissions",
							subtitle: "Your assigned role in the system",
							variant: "secondary"
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-4",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex-1",
								children: [/* @__PURE__ */ jsx("p", {
									className: "text-sm text-theme-muted mb-1",
									children: "Current Role"
								}), /* @__PURE__ */ jsx("span", {
									className: "inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800",
									children: user?.role || "Administrator"
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex-1",
								children: [/* @__PURE__ */ jsx("p", {
									className: "text-sm text-theme-muted mb-1",
									children: "Member Since"
								}), /* @__PURE__ */ jsx("p", {
									className: "text-sm font-medium text-theme-primary",
									children: formatDate(user?.created_at)
								})]
							})]
						})] }),
						activeTab === "password" && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx(SectionHeader, {
							icon: Lock,
							title: "Change Password",
							subtitle: "Update your password for security",
							variant: "accent"
						}), /* @__PURE__ */ jsxs("form", {
							onSubmit: handlePasswordSubmit,
							className: "space-y-4",
							children: [
								/* @__PURE__ */ jsx(FormField, {
									label: "Current Password",
									error: passwordForm.errors.current_password,
									children: /* @__PURE__ */ jsx("input", {
										type: "password",
										value: passwordForm.data.current_password,
										onChange: (e) => passwordForm.setData("current_password", e.target.value),
										className: "form-input",
										autoComplete: "current-password"
									})
								}),
								/* @__PURE__ */ jsx(FormField, {
									label: "New Password",
									error: passwordForm.errors.password,
									children: /* @__PURE__ */ jsx("input", {
										type: "password",
										value: passwordForm.data.password,
										onChange: (e) => passwordForm.setData("password", e.target.value),
										className: "form-input",
										autoComplete: "new-password"
									})
								}),
								/* @__PURE__ */ jsx(FormField, {
									label: "Confirm New Password",
									error: passwordForm.errors.password_confirmation,
									children: /* @__PURE__ */ jsx("input", {
										type: "password",
										value: passwordForm.data.password_confirmation,
										onChange: (e) => passwordForm.setData("password_confirmation", e.target.value),
										className: "form-input",
										autoComplete: "new-password"
									})
								}),
								/* @__PURE__ */ jsx("div", {
									className: "pt-2",
									children: /* @__PURE__ */ jsx("button", {
										type: "submit",
										disabled: passwordForm.processing,
										className: "btn btn-primary",
										children: passwordForm.processing ? "Updating..." : "Update Password"
									})
								})
							]
						})] })
					]
				}) })
			})]
		})]
	})] });
}
//#endregion
export { Profile as default };
