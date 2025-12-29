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
      iconBgDark: "dark:bg-primary-500/20",
      iconText: "text-primary-600",
      iconTextDark: "dark:text-primary-400"
    },
    secondary: {
      accent: "bg-secondary-500",
      iconBg: "bg-secondary-50",
      iconBgDark: "dark:bg-secondary-500/20",
      iconText: "text-secondary-600",
      iconTextDark: "dark:text-secondary-400"
    },
    accent: {
      accent: "bg-accent-500",
      iconBg: "bg-accent-50",
      iconBgDark: "dark:bg-accent-500/20",
      iconText: "text-accent-600",
      iconTextDark: "dark:text-accent-400"
    },
    cyan: {
      accent: "bg-cyan-500",
      iconBg: "bg-cyan-50",
      iconBgDark: "dark:bg-cyan-500/20",
      iconText: "text-cyan-600",
      iconTextDark: "dark:text-cyan-400"
    },
    purple: {
      accent: "bg-purple-500",
      iconBg: "bg-purple-50",
      iconBgDark: "dark:bg-purple-500/20",
      iconText: "text-purple-600",
      iconTextDark: "dark:text-purple-400"
    }
  };
  const styles = colorStyles[color];
  return /* @__PURE__ */ jsxs("div", { className: "bg-theme-card rounded-xl border border-theme overflow-hidden shadow-sm hover:shadow-md transition-all duration-200", children: [
    /* @__PURE__ */ jsx("div", { className: `h-1 ${styles.accent}` }),
    /* @__PURE__ */ jsxs("div", { className: "p-5", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-start justify-between", children: /* @__PURE__ */ jsx("div", { className: `w-12 h-12 rounded-xl flex items-center justify-center ${styles.iconBg} ${styles.iconBgDark}`, children: /* @__PURE__ */ jsx(Icon, { className: `w-6 h-6 ${styles.iconText} ${styles.iconTextDark}` }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
        /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-theme-primary", children: value }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-theme-secondary mt-1", children: title }),
        subtitle && /* @__PURE__ */ jsx("p", { className: "text-xs text-theme-muted mt-0.5", children: subtitle })
      ] })
    ] })
  ] });
}
export {
  StatsCard as S
};
