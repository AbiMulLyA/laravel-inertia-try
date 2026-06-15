import { Head, Link, useForm } from "@inertiajs/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Landmark, Loader2, Lock, Mail } from "lucide-react";
//#region resources/js/Pages/Auth/Login.tsx
function Login() {
	const { data, setData, post, processing, errors } = useForm({
		email: "",
		password: "",
		remember: false
	});
	const handleSubmit = (e) => {
		e.preventDefault();
		post("/login");
	};
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Head, { title: "Login" }), /* @__PURE__ */ jsx("div", {
		className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-50 px-4 py-12",
		children: /* @__PURE__ */ jsxs("div", {
			className: "w-full max-w-md",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "text-center mb-8",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl mb-4 shadow-lg",
							children: /* @__PURE__ */ jsx(Landmark, { className: "w-8 h-8 text-white" })
						}),
						/* @__PURE__ */ jsx("h1", {
							className: "text-2xl font-bold text-gray-900",
							children: "Dishubkominfo"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-primary-600 font-medium text-sm",
							children: "Base Framework Web"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-gray-500 mt-2",
							children: "Masuk ke akun Anda"
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "bg-white rounded-2xl shadow-xl border border-primary-100 p-8",
					children: [/* @__PURE__ */ jsxs("form", {
						onSubmit: handleSubmit,
						className: "space-y-5",
						children: [
							/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("label", {
									className: "block text-sm font-medium text-gray-700 mb-2",
									children: "Email"
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "relative",
									children: [/* @__PURE__ */ jsx("div", {
										className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",
										children: /* @__PURE__ */ jsx(Mail, { className: "h-5 w-5 text-primary-400" })
									}), /* @__PURE__ */ jsx("input", {
										type: "email",
										value: data.email,
										onChange: (e) => setData("email", e.target.value),
										className: `
                                            block w-full pl-10 pr-4 py-3 rounded-xl border 
                                            focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                                            ${errors.email ? "border-red-500" : "border-gray-300"}
                                        `,
										placeholder: "nama@email.com"
									})]
								}),
								errors.email && /* @__PURE__ */ jsx("p", {
									className: "mt-1 text-sm text-red-500",
									children: errors.email
								})
							] }),
							/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("label", {
									className: "block text-sm font-medium text-gray-700 mb-2",
									children: "Password"
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "relative",
									children: [/* @__PURE__ */ jsx("div", {
										className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",
										children: /* @__PURE__ */ jsx(Lock, { className: "h-5 w-5 text-primary-400" })
									}), /* @__PURE__ */ jsx("input", {
										type: "password",
										value: data.password,
										onChange: (e) => setData("password", e.target.value),
										className: `
                                            block w-full pl-10 pr-4 py-3 rounded-xl border 
                                            focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                                            ${errors.password ? "border-red-500" : "border-gray-300"}
                                        `,
										placeholder: "••••••••"
									})]
								}),
								errors.password && /* @__PURE__ */ jsx("p", {
									className: "mt-1 text-sm text-red-500",
									children: errors.password
								})
							] }),
							/* @__PURE__ */ jsx("div", {
								className: "flex items-center justify-between",
								children: /* @__PURE__ */ jsxs("label", {
									className: "flex items-center gap-2 cursor-pointer",
									children: [/* @__PURE__ */ jsx("input", {
										type: "checkbox",
										checked: data.remember,
										onChange: (e) => setData("remember", e.target.checked),
										className: "w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
									}), /* @__PURE__ */ jsx("span", {
										className: "text-sm text-gray-600",
										children: "Ingat saya"
									})]
								})
							}),
							/* @__PURE__ */ jsx("button", {
								type: "submit",
								disabled: processing,
								className: "w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-medium hover:from-primary-700 hover:to-primary-800 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg",
								children: processing ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Loader2, { className: "w-5 h-5 animate-spin" }), "Memproses..."] }) : "Masuk"
							})
						]
					}), /* @__PURE__ */ jsx("div", {
						className: "mt-6 text-center",
						children: /* @__PURE__ */ jsxs("p", {
							className: "text-sm text-gray-600",
							children: [
								"Belum punya akun?",
								" ",
								/* @__PURE__ */ jsx(Link, {
									href: "/register",
									className: "text-primary-600 font-medium hover:text-primary-700",
									children: "Daftar sekarang"
								})
							]
						})
					})]
				}),
				/* @__PURE__ */ jsxs("p", {
					className: "text-center text-sm text-gray-500 mt-6",
					children: [
						"© ",
						(/* @__PURE__ */ new Date()).getFullYear(),
						" Dishubkominfo Kab. Tasikmalaya. All rights reserved."
					]
				})
			]
		})
	})] });
}
//#endregion
export { Login as default };
