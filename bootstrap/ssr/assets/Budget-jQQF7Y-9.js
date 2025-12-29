import { jsxs, jsx } from "react/jsx-runtime";
import { A as AppLayout } from "./AppLayout-D7eJ8B4o.js";
import { Head } from "@inertiajs/react";
import { DollarSign, TrendingDown, TrendingUp, PieChart } from "lucide-react";
import "react";
import { S as StatsCard } from "./StatsCard-CnGFB2kC.js";
import { P as PageHeader, C as Card } from "./PageHeader-D62FVbSQ.js";
function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}
function BudgetReport({
  summary = { total_budget: 0, total_spent: 0, total_remaining: 0, spent_percentage: 0 },
  categories = [],
  year = (/* @__PURE__ */ new Date()).getFullYear()
}) {
  return /* @__PURE__ */ jsxs(AppLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Budget Report" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsx(
        PageHeader,
        {
          title: "Budget Report",
          subtitle: `Financial overview for year ${year}`
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: [
        /* @__PURE__ */ jsx(
          StatsCard,
          {
            title: "Total Budget",
            value: formatCurrency(summary.total_budget),
            icon: DollarSign,
            color: "primary"
          }
        ),
        /* @__PURE__ */ jsx(
          StatsCard,
          {
            title: "Total Spent",
            value: formatCurrency(summary.total_spent),
            icon: TrendingDown,
            color: "accent"
          }
        ),
        /* @__PURE__ */ jsx(
          StatsCard,
          {
            title: "Remaining",
            value: formatCurrency(summary.total_remaining),
            icon: TrendingUp,
            color: "secondary"
          }
        ),
        /* @__PURE__ */ jsx(
          StatsCard,
          {
            title: "Utilization",
            value: `${summary.spent_percentage.toFixed(1)}%`,
            icon: PieChart,
            color: "cyan"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(Card, { padding: "none", children: [
        /* @__PURE__ */ jsxs("div", { className: "p-6 border-b border-theme", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-theme-primary", children: "Budget by Category" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-theme-secondary mt-1", children: "Breakdown of budget allocation and spending" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-gray-50 dark:bg-gray-800/50", children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-semibold text-theme-secondary uppercase tracking-wider", children: "Category" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-right text-xs font-semibold text-theme-secondary uppercase tracking-wider", children: "Budget" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-right text-xs font-semibold text-theme-secondary uppercase tracking-wider", children: "Spent" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-right text-xs font-semibold text-theme-secondary uppercase tracking-wider", children: "Remaining" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-semibold text-theme-secondary uppercase tracking-wider", children: "Usage" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-100 dark:divide-gray-800", children: categories.map((category) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors", children: [
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/50 dark:to-primary-800/30 rounded-lg flex items-center justify-center border border-primary-200 dark:border-primary-700", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-primary-700 dark:text-primary-300", children: category.code }) }),
              /* @__PURE__ */ jsx("span", { className: "font-medium text-theme-primary", children: category.name })
            ] }) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right font-medium text-theme-primary", children: formatCurrency(category.budget) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right text-accent-600 dark:text-accent-400", children: formatCurrency(category.spent) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right text-secondary-600 dark:text-secondary-400", children: formatCurrency(category.remaining) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "w-24 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
                "div",
                {
                  className: `h-full rounded-full ${category.percentage > 90 ? "bg-red-500" : category.percentage > 70 ? "bg-accent-500" : "bg-secondary-500"}`,
                  style: { width: `${Math.min(category.percentage, 100)}%` }
                }
              ) }),
              /* @__PURE__ */ jsxs("span", { className: `text-sm font-medium w-12 ${category.percentage > 90 ? "text-red-600 dark:text-red-400" : "text-theme-secondary"}`, children: [
                category.percentage.toFixed(1),
                "%"
              ] })
            ] }) })
          ] }, category.id)) })
        ] }) }),
        categories.length === 0 && /* @__PURE__ */ jsxs("div", { className: "p-12 text-center", children: [
          /* @__PURE__ */ jsx(PieChart, { className: "w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" }),
          /* @__PURE__ */ jsx("p", { className: "text-theme-secondary", children: "No budget data available" })
        ] })
      ] })
    ] })
  ] });
}
export {
  BudgetReport as default
};
