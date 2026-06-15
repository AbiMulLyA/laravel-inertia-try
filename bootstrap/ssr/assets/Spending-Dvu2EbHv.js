import { d as Card, p as StatsCard, t as AppLayout, u as PageHeader } from "./AppLayout-Cll6vCno.js";
import { Head } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Calendar, DollarSign, Receipt, TrendingUp } from "lucide-react";
//#region resources/js/Pages/Reports/Spending.tsx
function formatCurrency(value) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0
	}).format(value);
}
function formatDate(dateString) {
	return new Date(dateString).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric"
	});
}
/**
* Spending Report Page
* 
* Shows spending overview and recent transactions.
*/
function SpendingReport({ summary = {
	total_spent: 0,
	this_month: 0,
	avg_monthly: 0,
	transaction_count: 0
}, recent_spending = [], monthly_data = [], year = (/* @__PURE__ */ new Date()).getFullYear() }) {
	const maxMonthly = Math.max(...monthly_data.map((m) => m.amount), 1);
	return /* @__PURE__ */ jsxs(AppLayout, { children: [/* @__PURE__ */ jsx(Head, { title: "Spending Report" }), /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ jsx(PageHeader, {
				title: "Spending Report",
				subtitle: `Expenditure analysis for year ${year}`
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
				children: [
					/* @__PURE__ */ jsx(StatsCard, {
						title: "Total Spent",
						value: formatCurrency(summary.total_spent),
						icon: DollarSign,
						color: "primary"
					}),
					/* @__PURE__ */ jsx(StatsCard, {
						title: "This Month",
						value: formatCurrency(summary.this_month),
						icon: Calendar,
						color: "accent"
					}),
					/* @__PURE__ */ jsx(StatsCard, {
						title: "Monthly Average",
						value: formatCurrency(summary.avg_monthly),
						icon: TrendingUp,
						color: "secondary"
					}),
					/* @__PURE__ */ jsx(StatsCard, {
						title: "Transactions",
						value: summary.transaction_count,
						icon: Receipt,
						color: "cyan"
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
				children: [/* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs("div", {
					className: "p-6",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "text-lg font-semibold text-theme-primary mb-4",
						children: "Monthly Spending"
					}), /* @__PURE__ */ jsx("div", {
						className: "space-y-3",
						children: monthly_data.map((month, index) => /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-4",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "w-12 text-sm text-theme-secondary",
									children: month.month
								}),
								/* @__PURE__ */ jsx("div", {
									className: "flex-1 h-6 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden",
									children: /* @__PURE__ */ jsx("div", {
										className: "h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all duration-500",
										style: { width: `${month.amount / maxMonthly * 100}%` }
									})
								}),
								/* @__PURE__ */ jsx("span", {
									className: "w-24 text-sm font-medium text-theme-primary text-right",
									children: formatCurrency(month.amount)
								})
							]
						}, index))
					})]
				}) }), /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs("div", {
					className: "p-6",
					children: [
						/* @__PURE__ */ jsx("h3", {
							className: "text-lg font-semibold text-theme-primary mb-4",
							children: "Recent Transactions"
						}),
						/* @__PURE__ */ jsx("div", {
							className: "space-y-3",
							children: recent_spending.slice(0, 8).map((item) => /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "w-10 h-10 bg-primary-100 dark:bg-primary-900/50 rounded-lg flex items-center justify-center",
										children: /* @__PURE__ */ jsx("span", {
											className: "text-xs font-bold text-primary-600 dark:text-primary-400",
											children: item.category_code
										})
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex-1 min-w-0",
										children: [/* @__PURE__ */ jsx("p", {
											className: "text-sm font-medium text-theme-primary truncate",
											children: item.name
										}), /* @__PURE__ */ jsx("p", {
											className: "text-xs text-theme-muted",
											children: item.project_name
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "text-right",
										children: [/* @__PURE__ */ jsx("p", {
											className: "text-sm font-medium text-accent-600 dark:text-accent-400",
											children: formatCurrency(item.amount)
										}), /* @__PURE__ */ jsx("p", {
											className: "text-xs text-theme-muted",
											children: formatDate(item.date)
										})]
									})
								]
							}, item.id))
						}),
						recent_spending.length === 0 && /* @__PURE__ */ jsxs("div", {
							className: "text-center py-8",
							children: [/* @__PURE__ */ jsx(Receipt, { className: "w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" }), /* @__PURE__ */ jsx("p", {
								className: "text-theme-secondary",
								children: "No transactions yet"
							})]
						})
					]
				}) })]
			})
		]
	})] });
}
//#endregion
export { SpendingReport as default };
