import { d as Card, p as StatsCard, t as AppLayout, u as PageHeader } from "./AppLayout-Cll6vCno.js";
import { Head, Link } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowRight, CheckCircle2, ClipboardList, Clock, Hourglass } from "lucide-react";
//#region resources/js/Pages/Reports/TaskProgress.tsx
/**
* Task Progress Report Page
*/
function TaskProgress({ summary = {
	total: 0,
	in_progress: 0,
	completed: 0,
	pending: 0
}, tasks = [], year = (/* @__PURE__ */ new Date()).getFullYear() }) {
	const getProgressColor = (progress) => {
		if (progress >= 80) return "from-secondary-400 to-secondary-600";
		if (progress >= 50) return "from-primary-400 to-primary-600";
		if (progress >= 25) return "from-accent-400 to-accent-600";
		return "from-gray-300 to-gray-400";
	};
	const getStatusBadge = (status) => {
		const colors = {
			in_progress: "bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300",
			completed: "bg-secondary-100 text-secondary-700 dark:bg-secondary-900/50 dark:text-secondary-300",
			pending: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
			on_hold: "bg-accent-100 text-accent-700 dark:bg-accent-900/50 dark:text-accent-300"
		};
		return colors[status] || colors.pending;
	};
	const getPriorityBadge = (priority) => {
		const colors = {
			high: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300",
			medium: "bg-accent-100 text-accent-700 dark:bg-accent-900/50 dark:text-accent-300",
			low: "bg-secondary-100 text-secondary-700 dark:bg-secondary-900/50 dark:text-secondary-300"
		};
		return colors[priority] || colors.medium;
	};
	return /* @__PURE__ */ jsxs(AppLayout, { children: [/* @__PURE__ */ jsx(Head, { title: "Task Progress Report" }), /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ jsx(PageHeader, {
				title: "Task Progress",
				subtitle: `Task completion analysis for year ${year}`
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
				children: [
					/* @__PURE__ */ jsx(StatsCard, {
						title: "Total Tasks",
						value: summary.total,
						icon: ClipboardList,
						color: "primary"
					}),
					/* @__PURE__ */ jsx(StatsCard, {
						title: "In Progress",
						value: summary.in_progress,
						icon: Clock,
						color: "accent"
					}),
					/* @__PURE__ */ jsx(StatsCard, {
						title: "Completed",
						value: summary.completed,
						icon: CheckCircle2,
						color: "secondary"
					}),
					/* @__PURE__ */ jsx(StatsCard, {
						title: "Pending",
						value: summary.pending,
						icon: Hourglass,
						color: "cyan"
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-1 lg:grid-cols-2 gap-4",
				children: tasks.map((task) => /* @__PURE__ */ jsx(Card, {
					padding: "none",
					children: /* @__PURE__ */ jsxs("div", {
						className: "p-5",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-start justify-between gap-4 mb-4",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex-1 min-w-0",
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-2 mb-1 flex-wrap",
											children: [
												/* @__PURE__ */ jsx("span", {
													className: "text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/50 px-2 py-0.5 rounded",
													children: task.code
												}),
												/* @__PURE__ */ jsx("span", {
													className: `text-xs font-medium px-2 py-0.5 rounded ${getStatusBadge(task.status)}`,
													children: task.status_label
												}),
												/* @__PURE__ */ jsx("span", {
													className: `text-xs font-medium px-2 py-0.5 rounded ${getPriorityBadge(task.priority)}`,
													children: task.priority_label
												})
											]
										}),
										/* @__PURE__ */ jsx("h3", {
											className: "font-medium text-theme-primary truncate",
											children: task.name
										}),
										/* @__PURE__ */ jsx("p", {
											className: "text-sm text-theme-muted",
											children: task.project_name
										})
									]
								}), /* @__PURE__ */ jsx(Link, {
									href: `/tasks/${task.id}/edit`,
									className: "p-2 text-theme-muted hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors",
									children: /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mb-3",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex justify-between text-sm mb-1",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-theme-secondary",
										children: "Progress"
									}), /* @__PURE__ */ jsxs("span", {
										className: "font-medium text-theme-primary",
										children: [task.progress, "%"]
									})]
								}), /* @__PURE__ */ jsx("div", {
									className: "h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden",
									children: /* @__PURE__ */ jsx("div", {
										className: `h-full bg-gradient-to-r ${getProgressColor(task.progress)} rounded-full transition-all duration-500`,
										style: { width: `${task.progress}%` }
									})
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between text-sm",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-theme-muted",
									children: "Target Achievement"
								}), /* @__PURE__ */ jsxs("span", {
									className: "font-medium text-theme-primary",
									children: [
										task.achieved,
										" / ",
										task.target,
										" ",
										task.unit
									]
								})]
							})
						]
					})
				}, task.id))
			}),
			tasks.length === 0 && /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs("div", {
				className: "p-12 text-center",
				children: [/* @__PURE__ */ jsx(ClipboardList, { className: "w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" }), /* @__PURE__ */ jsx("p", {
					className: "text-theme-secondary",
					children: "No tasks found"
				})]
			}) })
		]
	})] });
}
//#endregion
export { TaskProgress as default };
