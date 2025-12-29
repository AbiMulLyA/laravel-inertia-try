import { jsxs, jsx } from "react/jsx-runtime";
import { A as AppLayout } from "./AppLayout-D7eJ8B4o.js";
import { Head, Link } from "@inertiajs/react";
import { FolderKanban, Clock, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import "react";
import { S as StatsCard } from "./StatsCard-CnGFB2kC.js";
import { P as PageHeader, C as Card } from "./PageHeader-D62FVbSQ.js";
function formatCurrency(value) {
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
  return `$${value}`;
}
function ProjectProgress({
  summary = { total: 0, on_track: 0, at_risk: 0, completed: 0 },
  projects = [],
  year = (/* @__PURE__ */ new Date()).getFullYear()
}) {
  const getProgressColor = (progress, status) => {
    if (status === "completed") return "from-secondary-400 to-secondary-600";
    if (progress >= 70) return "from-secondary-400 to-secondary-600";
    if (progress >= 40) return "from-primary-400 to-primary-600";
    return "from-accent-400 to-accent-600";
  };
  const getStatusBadge = (status) => {
    const colors = {
      active: "bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300",
      completed: "bg-secondary-100 text-secondary-700 dark:bg-secondary-900/50 dark:text-secondary-300",
      draft: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
    };
    return colors[status] || colors.draft;
  };
  return /* @__PURE__ */ jsxs(AppLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Project Progress Report" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsx(
        PageHeader,
        {
          title: "Project Progress",
          subtitle: `Project status overview for year ${year}`
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: [
        /* @__PURE__ */ jsx(
          StatsCard,
          {
            title: "Total Projects",
            value: summary.total,
            icon: FolderKanban,
            color: "primary"
          }
        ),
        /* @__PURE__ */ jsx(
          StatsCard,
          {
            title: "On Track",
            value: summary.on_track,
            icon: Clock,
            color: "secondary"
          }
        ),
        /* @__PURE__ */ jsx(
          StatsCard,
          {
            title: "At Risk",
            value: summary.at_risk,
            icon: AlertCircle,
            color: "accent"
          }
        ),
        /* @__PURE__ */ jsx(
          StatsCard,
          {
            title: "Completed",
            value: summary.completed,
            icon: CheckCircle2,
            color: "cyan"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(Card, { padding: "none", children: [
        /* @__PURE__ */ jsx("div", { className: "p-6 border-b border-theme", children: /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-theme-primary", children: "All Projects" }) }),
        /* @__PURE__ */ jsx("div", { className: "divide-y divide-gray-100 dark:divide-gray-800", children: projects.map((project) => /* @__PURE__ */ jsxs("div", { className: "p-6 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4 mb-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/50 px-2 py-0.5 rounded", children: project.code }),
                /* @__PURE__ */ jsx("span", { className: `text-xs font-medium px-2 py-0.5 rounded ${getStatusBadge(project.status)}`, children: project.status_label })
              ] }),
              /* @__PURE__ */ jsx("h3", { className: "font-medium text-theme-primary truncate", children: project.name }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-theme-muted", children: project.category_name })
            ] }),
            /* @__PURE__ */ jsx(
              Link,
              {
                href: `/projects/${project.id}/edit`,
                className: "p-2 text-theme-muted hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors",
                children: /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm mb-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-theme-secondary", children: "Progress" }),
              /* @__PURE__ */ jsxs("span", { className: "font-medium text-theme-primary", children: [
                project.progress,
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
              "div",
              {
                className: `h-full bg-gradient-to-r ${getProgressColor(project.progress, project.status)} rounded-full transition-all duration-500`,
                style: { width: `${project.progress}%` }
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6 text-sm", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-theme-muted", children: "Tasks: " }),
              /* @__PURE__ */ jsxs("span", { className: "font-medium text-theme-primary", children: [
                project.tasks_completed,
                "/",
                project.tasks_total
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-theme-muted", children: "Budget: " }),
              /* @__PURE__ */ jsx("span", { className: "font-medium text-theme-primary", children: formatCurrency(project.budget) })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-theme-muted", children: "Spent: " }),
              /* @__PURE__ */ jsx("span", { className: "font-medium text-accent-600 dark:text-accent-400", children: formatCurrency(project.spent) })
            ] })
          ] })
        ] }, project.id)) }),
        projects.length === 0 && /* @__PURE__ */ jsxs("div", { className: "p-12 text-center", children: [
          /* @__PURE__ */ jsx(FolderKanban, { className: "w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" }),
          /* @__PURE__ */ jsx("p", { className: "text-theme-secondary", children: "No projects found" })
        ] })
      ] })
    ] })
  ] });
}
export {
  ProjectProgress as default
};
