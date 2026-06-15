import { c as Pagination, d as Card, l as Table, n as Shimmer, p as StatsCard, t as AppLayout, u as PageHeader } from "./AppLayout-Cll6vCno.js";
import { n as useDeferredCache, t as useCachedDeferred } from "./DeferredCacheContext-B4g-AeXi.js";
import { Head, Link, router } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Activity, CheckCircle2, Edit, FileEdit, Filter, FolderKanban, Plus, Search, Trash2 } from "lucide-react";
//#region resources/js/Pages/Projects/Index.tsx
function formatCurrency(value) {
	if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
	if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
	if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
	return `$${value}`;
}
/**
* Projects Index Page
* 
* Uses deferred props with client-side caching for optimal UX.
*/
function ProjectsIndex({ projects: rawProjects, categories: rawCategories, filters = {
	category_id: null,
	status: null,
	search: null
}, summary: rawSummary, statuses = {} }) {
	const cache = useDeferredCache();
	const { data: projects, isLoading: projectsLoading } = useCachedDeferred("projects.list", rawProjects);
	const { data: categories, isLoading: categoriesLoading } = useCachedDeferred("projects.categories", rawCategories);
	const { data: summary, isLoading: summaryLoading } = useCachedDeferred("projects.summary", rawSummary);
	const handleDelete = (id, name) => {
		if (confirm(`Delete project "${name}"?`)) router.delete(`/projects/${id}`);
	};
	const handleFilterChange = (key, value) => {
		cache.invalidate("projects.list");
		router.get("/projects", {
			...filters,
			[key]: value
		}, { preserveState: true });
	};
	const handleSearch = (e) => {
		e.preventDefault();
		handleFilterChange("search", new FormData(e.currentTarget).get("search"));
	};
	const getStatusColor = (status) => {
		switch (status) {
			case "active": return "bg-primary-50 dark:bg-primary-500/20 text-primary-700 dark:text-primary-400 border border-primary-200 dark:border-primary-500/30";
			case "completed": return "bg-secondary-50 dark:bg-secondary-500/20 text-secondary-700 dark:text-secondary-400 border border-secondary-200 dark:border-secondary-500/30";
			case "draft": return "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600";
			default: return "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600";
		}
	};
	return /* @__PURE__ */ jsxs(AppLayout, { children: [/* @__PURE__ */ jsx(Head, { title: "Projects" }), /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ jsx(PageHeader, {
				title: "Projects",
				subtitle: "Manage projects and track progress",
				action: {
					label: "Add Project",
					href: "/projects/create",
					icon: Plus
				}
			}),
			summaryLoading ? /* @__PURE__ */ jsx(Shimmer.StatsCards, { count: 4 }) : summary && /* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
				children: [
					/* @__PURE__ */ jsx("div", {
						onClick: () => router.get("/projects", {}),
						children: /* @__PURE__ */ jsx(StatsCard, {
							title: "Total Projects",
							value: summary.total,
							icon: FolderKanban,
							color: "secondary"
						})
					}),
					/* @__PURE__ */ jsx("div", {
						onClick: () => handleFilterChange("status", "active"),
						children: /* @__PURE__ */ jsx(StatsCard, {
							title: "Active",
							value: summary.active,
							icon: Activity,
							color: "primary"
						})
					}),
					/* @__PURE__ */ jsx("div", {
						onClick: () => handleFilterChange("status", "completed"),
						children: /* @__PURE__ */ jsx(StatsCard, {
							title: "Completed",
							value: summary.completed,
							icon: CheckCircle2,
							color: "cyan"
						})
					}),
					/* @__PURE__ */ jsx("div", {
						onClick: () => handleFilterChange("status", "draft"),
						children: /* @__PURE__ */ jsx(StatsCard, {
							title: "Draft",
							value: summary.draft,
							icon: FileEdit,
							color: "accent"
						})
					})
				]
			}),
			/* @__PURE__ */ jsx(Card, {
				padding: "sm",
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col sm:flex-row gap-4",
					children: [/* @__PURE__ */ jsx("form", {
						onSubmit: handleSearch,
						className: "flex-1",
						children: /* @__PURE__ */ jsxs("div", {
							className: "relative",
							children: [/* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" }), /* @__PURE__ */ jsx("input", {
								type: "text",
								name: "search",
								defaultValue: filters.search || "",
								placeholder: "Search projects...",
								className: "w-full pl-10 pr-4 py-2 bg-white dark:bg-[#1a2744] border border-gray-300 dark:border-[#1e3a5f] rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
							})]
						})
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ jsx(Filter, { className: "w-4 h-4 text-gray-400" }),
							categoriesLoading ? /* @__PURE__ */ jsx("select", {
								className: "px-3 py-2 bg-white dark:bg-[#1a2744] border border-gray-300 dark:border-[#1e3a5f] rounded-lg text-sm text-gray-400",
								children: /* @__PURE__ */ jsx("option", { children: "Loading..." })
							}) : /* @__PURE__ */ jsxs("select", {
								value: filters.category_id || "",
								onChange: (e) => handleFilterChange("category_id", e.target.value),
								className: "px-3 py-2 bg-white dark:bg-[#1a2744] border border-gray-300 dark:border-[#1e3a5f] rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm text-gray-900 dark:text-white",
								children: [/* @__PURE__ */ jsx("option", {
									value: "",
									children: "All Categories"
								}), categories?.map((c) => /* @__PURE__ */ jsx("option", {
									value: c.id,
									children: c.name
								}, c.id))]
							}),
							/* @__PURE__ */ jsxs("select", {
								value: filters.status || "",
								onChange: (e) => handleFilterChange("status", e.target.value),
								className: "px-3 py-2 bg-white dark:bg-[#1a2744] border border-gray-300 dark:border-[#1e3a5f] rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm text-gray-900 dark:text-white",
								children: [/* @__PURE__ */ jsx("option", {
									value: "",
									children: "All Status"
								}), Object.entries(statuses).map(([key, label]) => /* @__PURE__ */ jsx("option", {
									value: key,
									children: label
								}, key))]
							})
						]
					})]
				})
			}),
			projectsLoading ? /* @__PURE__ */ jsx(Card, {
				padding: "none",
				className: "overflow-hidden",
				children: /* @__PURE__ */ jsx(Shimmer.Table, {
					rows: 10,
					cols: 6
				})
			}) : projects && /* @__PURE__ */ jsxs(Card, {
				padding: "none",
				className: "overflow-hidden",
				children: [
					/* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(Table.Thead, { children: /* @__PURE__ */ jsxs(Table.Tr, { children: [
						/* @__PURE__ */ jsx(Table.Th, { children: "Project" }),
						/* @__PURE__ */ jsx(Table.Th, { children: "Category" }),
						/* @__PURE__ */ jsx(Table.Th, {
							align: "right",
							children: "Budget"
						}),
						/* @__PURE__ */ jsx(Table.Th, { children: "Progress" }),
						/* @__PURE__ */ jsx(Table.Th, { children: "Status" }),
						/* @__PURE__ */ jsx(Table.Th, {
							align: "right",
							children: "Actions"
						})
					] }) }), /* @__PURE__ */ jsx(Table.Tbody, { children: projects.data.map((item) => /* @__PURE__ */ jsxs(Table.Tr, { children: [
						/* @__PURE__ */ jsx(Table.Td, { children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
							className: "text-sm font-medium text-gray-900 dark:text-white",
							children: item.name
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-gray-500 dark:text-gray-400 mt-0.5",
							children: item.code
						})] }) }),
						/* @__PURE__ */ jsx(Table.Td, { children: /* @__PURE__ */ jsx("span", {
							className: "inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-primary-50 dark:bg-primary-500/20 text-primary-700 dark:text-primary-400 border border-primary-200 dark:border-primary-500/30",
							children: item.category?.code || "-"
						}) }),
						/* @__PURE__ */ jsxs(Table.Td, {
							align: "right",
							children: [/* @__PURE__ */ jsx("p", {
								className: "text-sm font-medium text-gray-900 dark:text-white",
								children: formatCurrency(item.budget)
							}), /* @__PURE__ */ jsxs("p", {
								className: "text-xs text-gray-500 dark:text-gray-400 mt-0.5",
								children: ["Spent: ", formatCurrency(item.spent)]
							})]
						}),
						/* @__PURE__ */ jsx(Table.Td, { children: /* @__PURE__ */ jsxs("div", {
							className: "w-28",
							children: [/* @__PURE__ */ jsx("div", {
								className: "flex justify-between text-xs mb-1",
								children: /* @__PURE__ */ jsxs("span", {
									className: "font-medium text-gray-700 dark:text-gray-300",
									children: [item.spent_percentage, "%"]
								})
							}), /* @__PURE__ */ jsx("div", {
								className: "w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden",
								children: /* @__PURE__ */ jsx("div", {
									className: "h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-600",
									style: { width: `${Math.min(item.spent_percentage, 100)}%` }
								})
							})]
						}) }),
						/* @__PURE__ */ jsx(Table.Td, { children: /* @__PURE__ */ jsx("span", {
							className: `inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`,
							children: item.status_label
						}) }),
						/* @__PURE__ */ jsx(Table.Td, {
							align: "right",
							children: /* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-end gap-1",
								children: [/* @__PURE__ */ jsx(Link, {
									href: `/projects/${item.id}/edit`,
									className: "p-2 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-500/20 rounded-lg transition-colors",
									children: /* @__PURE__ */ jsx(Edit, { className: "w-4 h-4" })
								}), /* @__PURE__ */ jsx("button", {
									onClick: () => handleDelete(item.id, item.name),
									className: "p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/20 rounded-lg transition-colors",
									children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
								})]
							})
						})
					] }, item.id)) })] }),
					projects.data.length === 0 && /* @__PURE__ */ jsxs("div", {
						className: "p-12 text-center",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4",
								children: /* @__PURE__ */ jsx(FolderKanban, { className: "w-8 h-8 text-gray-400" })
							}),
							/* @__PURE__ */ jsx("h3", {
								className: "text-lg font-medium text-gray-900 dark:text-white mb-2",
								children: "No projects yet"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-gray-500 dark:text-gray-400 mb-6",
								children: "Get started by creating your first project"
							}),
							/* @__PURE__ */ jsxs(Link, {
								href: "/projects/create",
								className: "inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm",
								children: [/* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }), "Add Project"]
							})
						]
					}),
					/* @__PURE__ */ jsx(Pagination, {
						links: projects.links,
						from: (projects.current_page - 1) * projects.per_page + 1,
						to: Math.min(projects.current_page * projects.per_page, projects.total),
						total: projects.total
					})
				]
			})
		]
	})] });
}
//#endregion
export { ProjectsIndex as default };
