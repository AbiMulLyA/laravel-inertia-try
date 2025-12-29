import { jsxs, jsx } from "react/jsx-runtime";
function StatsCard({
  title,
  value,
  icon: Icon,
  color = "primary",
  subtitle
}) {
  const colorStyles = {
    primary: {
      accent: "bg-primary-500",
      iconBg: "bg-primary-50",
      iconText: "text-primary-600"
    },
    secondary: {
      accent: "bg-secondary-500",
      iconBg: "bg-secondary-50",
      iconText: "text-secondary-600"
    },
    accent: {
      accent: "bg-accent-500",
      iconBg: "bg-accent-50",
      iconText: "text-accent-600"
    },
    cyan: {
      accent: "bg-cyan-500",
      iconBg: "bg-cyan-50",
      iconText: "text-cyan-600"
    },
    purple: {
      accent: "bg-purple-500",
      iconBg: "bg-purple-50",
      iconText: "text-purple-600"
    }
  };
  const styles = colorStyles[color];
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200", children: [
    /* @__PURE__ */ jsx("div", { className: `h-1 ${styles.accent}` }),
    /* @__PURE__ */ jsxs("div", { className: "p-5", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-start justify-between", children: /* @__PURE__ */ jsx("div", { className: `w-12 h-12 rounded-xl flex items-center justify-center ${styles.iconBg}`, children: /* @__PURE__ */ jsx(Icon, { className: `w-6 h-6 ${styles.iconText}` }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
        /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-gray-900", children: value }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-1", children: title }),
        subtitle && /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400 mt-0.5", children: subtitle })
      ] })
    ] })
  ] });
}
export {
  StatsCard as S
};
