import { jsxs, jsx } from "react/jsx-runtime";
import { A as AppLayout } from "./AppLayout-D7eJ8B4o.js";
import { useForm, Head } from "@inertiajs/react";
import { User, Shield, Lock } from "lucide-react";
import "react";
import { P as PageHeader, C as Card } from "./PageHeader-D62FVbSQ.js";
function Profile({ user }) {
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
    profileForm.patch("/profile", {
      preserveScroll: true
    });
  };
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    passwordForm.put("/password", {
      preserveScroll: true,
      onSuccess: () => passwordForm.reset()
    });
  };
  return /* @__PURE__ */ jsxs(AppLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Profile" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6 max-w-3xl", children: [
      /* @__PURE__ */ jsx(
        PageHeader,
        {
          title: "Profile",
          subtitle: "Manage your account settings"
        }
      ),
      /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
          /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-primary-100 dark:bg-primary-900/50 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx(User, { className: "w-5 h-5 text-primary-600 dark:text-primary-400" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-theme-primary", children: "Profile Information" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-theme-secondary", children: "Update your account details" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("form", { onSubmit: handleProfileSubmit, className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "form-label", children: "Name" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: profileForm.data.name,
                onChange: (e) => profileForm.setData("name", e.target.value),
                className: "form-input"
              }
            ),
            profileForm.errors.name && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600 mt-1", children: profileForm.errors.name })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "form-label", children: "Email" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "email",
                value: profileForm.data.email,
                onChange: (e) => profileForm.setData("email", e.target.value),
                className: "form-input"
              }
            ),
            profileForm.errors.email && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600 mt-1", children: profileForm.errors.email })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "pt-2", children: /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: profileForm.processing,
              className: "btn btn-primary",
              children: profileForm.processing ? "Saving..." : "Save Changes"
            }
          ) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
          /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-secondary-100 dark:bg-secondary-900/50 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx(Shield, { className: "w-5 h-5 text-secondary-600 dark:text-secondary-400" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-theme-primary", children: "Role & Permissions" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-theme-secondary", children: "Your assigned role in the system" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm text-theme-muted mb-1", children: "Current Role" }),
            /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800", children: user?.role || "Administrator" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm text-theme-muted mb-1", children: "Member Since" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-theme-primary", children: user?.created_at ? new Date(user.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric"
            }) : "-" })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
          /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-accent-100 dark:bg-accent-900/50 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx(Lock, { className: "w-5 h-5 text-accent-600 dark:text-accent-400" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-theme-primary", children: "Change Password" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-theme-secondary", children: "Update your password for security" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("form", { onSubmit: handlePasswordSubmit, className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "form-label", children: "Current Password" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "password",
                value: passwordForm.data.current_password,
                onChange: (e) => passwordForm.setData("current_password", e.target.value),
                className: "form-input",
                autoComplete: "current-password"
              }
            ),
            passwordForm.errors.current_password && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600 mt-1", children: passwordForm.errors.current_password })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "form-label", children: "New Password" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "password",
                value: passwordForm.data.password,
                onChange: (e) => passwordForm.setData("password", e.target.value),
                className: "form-input",
                autoComplete: "new-password"
              }
            ),
            passwordForm.errors.password && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600 mt-1", children: passwordForm.errors.password })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "form-label", children: "Confirm New Password" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "password",
                value: passwordForm.data.password_confirmation,
                onChange: (e) => passwordForm.setData("password_confirmation", e.target.value),
                className: "form-input",
                autoComplete: "new-password"
              }
            ),
            passwordForm.errors.password_confirmation && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600 mt-1", children: passwordForm.errors.password_confirmation })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "pt-2", children: /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: passwordForm.processing,
              className: "btn btn-primary",
              children: passwordForm.processing ? "Updating..." : "Update Password"
            }
          ) })
        ] })
      ] }) })
    ] })
  ] });
}
export {
  Profile as default
};
