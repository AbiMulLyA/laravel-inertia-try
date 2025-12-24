import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useForm, Head, Link } from "@inertiajs/react";
import { Sprout, User, Mail, Lock, Loader2 } from "lucide-react";
function Register() {
  const { data, setData, post, processing, errors } = useForm({
    name: "",
    email: "",
    password: "",
    password_confirmation: ""
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    post("/register");
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Daftar" }),
    /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-50 px-4 py-12", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-8", children: [
        /* @__PURE__ */ jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-2xl mb-4", children: /* @__PURE__ */ jsx(Sprout, { className: "w-8 h-8 text-white" }) }),
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Dinas Pertanian" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-500 mt-1", children: "Buat akun baru" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl shadow-xl border p-8", children: [
        /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Nama Lengkap" }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: /* @__PURE__ */ jsx(User, { className: "h-5 w-5 text-gray-400" }) }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: data.name,
                  onChange: (e) => setData("name", e.target.value),
                  className: `
                                            block w-full pl-10 pr-4 py-3 rounded-xl border 
                                            focus:ring-2 focus:ring-green-500 focus:border-green-500
                                            ${errors.name ? "border-red-500" : "border-gray-300"}
                                        `,
                  placeholder: "Nama lengkap Anda"
                }
              )
            ] }),
            errors.name && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-500", children: errors.name })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Email" }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: /* @__PURE__ */ jsx(Mail, { className: "h-5 w-5 text-gray-400" }) }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "email",
                  value: data.email,
                  onChange: (e) => setData("email", e.target.value),
                  className: `
                                            block w-full pl-10 pr-4 py-3 rounded-xl border 
                                            focus:ring-2 focus:ring-green-500 focus:border-green-500
                                            ${errors.email ? "border-red-500" : "border-gray-300"}
                                        `,
                  placeholder: "nama@email.com"
                }
              )
            ] }),
            errors.email && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-500", children: errors.email })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Password" }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: /* @__PURE__ */ jsx(Lock, { className: "h-5 w-5 text-gray-400" }) }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "password",
                  value: data.password,
                  onChange: (e) => setData("password", e.target.value),
                  className: `
                                            block w-full pl-10 pr-4 py-3 rounded-xl border 
                                            focus:ring-2 focus:ring-green-500 focus:border-green-500
                                            ${errors.password ? "border-red-500" : "border-gray-300"}
                                        `,
                  placeholder: "Minimal 8 karakter"
                }
              )
            ] }),
            errors.password && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-500", children: errors.password })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Konfirmasi Password" }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: /* @__PURE__ */ jsx(Lock, { className: "h-5 w-5 text-gray-400" }) }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "password",
                  value: data.password_confirmation,
                  onChange: (e) => setData("password_confirmation", e.target.value),
                  className: `
                                            block w-full pl-10 pr-4 py-3 rounded-xl border 
                                            focus:ring-2 focus:ring-green-500 focus:border-green-500
                                            ${errors.password_confirmation ? "border-red-500" : "border-gray-300"}
                                        `,
                  placeholder: "Ulangi password"
                }
              )
            ] }),
            errors.password_confirmation && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-500", children: errors.password_confirmation })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: processing,
              className: "w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
              children: processing ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(Loader2, { className: "w-5 h-5 animate-spin" }),
                "Memproses..."
              ] }) : "Daftar"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-6 text-center", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600", children: [
          "Sudah punya akun?",
          " ",
          /* @__PURE__ */ jsx(Link, { href: "/login", className: "text-green-600 font-medium hover:text-green-700", children: "Masuk" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "text-center text-sm text-gray-500 mt-6", children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " Dinas Pertanian. All rights reserved."
      ] })
    ] }) })
  ] });
}
export {
  Register as default
};
