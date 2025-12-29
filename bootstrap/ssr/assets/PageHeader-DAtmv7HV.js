import { jsx, jsxs } from "react/jsx-runtime";
import { Link } from "@inertiajs/react";
import { Plus } from "lucide-react";
function Card({ children, className = "", padding = "md" }) {
  const paddingStyles = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8"
  };
  return /* @__PURE__ */ jsx("div", { className: `
            bg-theme-card
            rounded-xl 
            border border-theme 
            shadow-sm
            transition-colors duration-200
            ${paddingStyles[padding]} ${className}
        `, children });
}
function CardHeader({ title, subtitle, action, children }) {
  if (children) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between mb-4", children });
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      title && /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-gray-900 dark:text-gray-100", children: title }),
      subtitle && /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400 mt-0.5", children: subtitle })
    ] }),
    action && /* @__PURE__ */ jsx("div", { children: action })
  ] });
}
function PageHeader({
  title,
  subtitle,
  action,
  children
}) {
  const ActionIcon = action?.icon || Plus;
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-900", children: title }),
      subtitle && /* @__PURE__ */ jsx("p", { className: "text-gray-500 mt-1", children: subtitle })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      children,
      action && /* @__PURE__ */ jsxs(
        Link,
        {
          href: action.href,
          className: "inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm",
          children: [
            /* @__PURE__ */ jsx(ActionIcon, { className: "w-4 h-4" }),
            action.label
          ]
        }
      )
    ] })
  ] });
}
export {
  Card as C,
  PageHeader as P,
  CardHeader as a
};
