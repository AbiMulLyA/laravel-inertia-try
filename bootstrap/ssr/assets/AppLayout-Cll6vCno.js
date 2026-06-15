import { Link, usePage } from "@inertiajs/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Database, FileText, Key, LayoutDashboard, LogOut, Menu, Palette, Plus, Settings, Shield, User, Users, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
//#region resources/js/Components/Navigation/NavItem.tsx
/**
* Recursive Navigation Item Component
* 
* Renders navigation items with support for unlimited nesting levels.
* Features:
* - Recursive tree rendering
* - Expand/collapse state persisted in localStorage
* - Indentation based on depth
* - Active state highlighting
* - Dark mode support
*/
function NavItem({ item, depth = 0, collapsed = false }) {
	const { url } = usePage();
	const hasChildren = item.children && item.children.length > 0;
	const storageKey = `nav-expand-${item.name.toLowerCase().replace(/\s/g, "-")}`;
	const [isExpanded, setIsExpanded] = useState(() => {
		if (typeof window !== "undefined") return localStorage.getItem(storageKey) === "true";
		return false;
	});
	const isActive = item.href ? url.startsWith(item.href) : false;
	const hasActiveChild = item.children?.some((child) => child.href ? url.startsWith(child.href) : false) || false;
	useEffect(() => {
		if (hasActiveChild && !isExpanded) setIsExpanded(true);
	}, [hasActiveChild]);
	const toggleExpand = () => {
		const newState = !isExpanded;
		setIsExpanded(newState);
		if (typeof window !== "undefined") localStorage.setItem(storageKey, String(newState));
	};
	const paddingLeft = collapsed ? 12 : 12 + depth * 16;
	const activeClasses = "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300";
	const inactiveClasses = "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100";
	const iconActiveClasses = "text-primary-600 dark:text-primary-400";
	const iconInactiveClasses = "text-gray-400 dark:text-gray-500";
	if (collapsed && depth === 0) return /* @__PURE__ */ jsxs("div", {
		className: "relative group",
		children: [item.href ? /* @__PURE__ */ jsx(Link, {
			href: item.href,
			className: `
                            flex items-center justify-center w-10 h-10 mx-auto rounded-lg
                            transition-all duration-200
                            ${isActive ? activeClasses : inactiveClasses}
                        `,
			children: item.icon && /* @__PURE__ */ jsx(item.icon, { className: `w-5 h-5 ${isActive ? iconActiveClasses : iconInactiveClasses}` })
		}) : /* @__PURE__ */ jsx("button", {
			onClick: toggleExpand,
			className: `
                            flex items-center justify-center w-10 h-10 mx-auto rounded-lg
                            transition-all duration-200
                            ${hasActiveChild ? activeClasses : inactiveClasses}
                        `,
			children: item.icon && /* @__PURE__ */ jsx(item.icon, { className: `w-5 h-5 ${hasActiveChild ? iconActiveClasses : iconInactiveClasses}` })
		}), /* @__PURE__ */ jsx("div", {
			className: "absolute left-full top-0 ml-2 hidden group-hover:block z-50",
			children: /* @__PURE__ */ jsxs("div", {
				className: "bg-gray-900 dark:bg-gray-700 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap shadow-lg",
				children: [item.name, item.badge && /* @__PURE__ */ jsx("span", {
					className: "ml-2 px-1.5 py-0.5 bg-primary-500 rounded text-xs",
					children: item.badge
				})]
			})
		})]
	});
	return /* @__PURE__ */ jsxs("div", { children: [hasChildren ? /* @__PURE__ */ jsxs("button", {
		onClick: toggleExpand,
		className: `
                        w-full flex items-center gap-3 py-2 rounded-lg text-sm font-medium
                        transition-all duration-200
                        ${hasActiveChild ? activeClasses : inactiveClasses}
                    `,
		style: {
			paddingLeft: `${paddingLeft}px`,
			paddingRight: "12px"
		},
		children: [
			depth === 0 && item.icon && /* @__PURE__ */ jsx(item.icon, { className: `w-5 h-5 flex-shrink-0 ${hasActiveChild ? iconActiveClasses : iconInactiveClasses}` }),
			/* @__PURE__ */ jsx("span", {
				className: "flex-1 text-left sidebar-text truncate",
				children: item.name
			}),
			item.badge && /* @__PURE__ */ jsx("span", {
				className: "px-2 py-0.5 bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 rounded-full text-xs font-medium sidebar-text",
				children: item.badge
			}),
			isExpanded ? /* @__PURE__ */ jsx(ChevronDown, { className: "w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" }) : /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" })
		]
	}) : /* @__PURE__ */ jsxs(Link, {
		href: item.href || "#",
		className: `
                        flex items-center gap-3 py-2 rounded-lg text-sm font-medium
                        transition-all duration-200
                        ${isActive ? activeClasses : inactiveClasses}
                    `,
		style: {
			paddingLeft: `${paddingLeft}px`,
			paddingRight: "12px"
		},
		children: [
			depth === 0 && item.icon && /* @__PURE__ */ jsx(item.icon, { className: `w-5 h-5 flex-shrink-0 ${isActive ? iconActiveClasses : iconInactiveClasses}` }),
			/* @__PURE__ */ jsx("span", {
				className: "flex-1 sidebar-text truncate",
				children: item.name
			}),
			item.badge && /* @__PURE__ */ jsx("span", {
				className: "px-2 py-0.5 bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 rounded-full text-xs font-medium sidebar-text",
				children: item.badge
			})
		]
	}), hasChildren && isExpanded && /* @__PURE__ */ jsx("div", {
		className: "mt-1 space-y-1",
		children: item.children.map((child, index) => /* @__PURE__ */ jsx(NavItem, {
			item: child,
			depth: depth + 1,
			collapsed
		}, `${child.name}-${index}`))
	})] });
}
//#endregion
//#region resources/js/Components/Navigation/Sidebar.tsx
/**
* Navigation Configuration
*/
var navigation = [
	{
		name: "Dashboard",
		href: "/dashboard",
		icon: LayoutDashboard
	},
	{
		name: "Master Data",
		icon: Database,
		children: [
			{
				name: "Categories",
				href: "/categories"
			},
			{
				name: "Projects",
				href: "/projects"
			},
			{
				name: "Tasks",
				href: "/tasks"
			}
		]
	},
	{
		name: "Reports",
		icon: FileText,
		children: [{
			name: "Financial",
			children: [{
				name: "Budget Report",
				href: "/reports/budget"
			}, {
				name: "Spending Report",
				href: "/reports/spending"
			}]
		}, {
			name: "Progress",
			children: [{
				name: "Project Progress",
				href: "/reports/project-progress"
			}, {
				name: "Task Progress",
				href: "/reports/task-progress"
			}]
		}]
	},
	{
		name: "Settings",
		icon: Settings,
		children: [{
			name: "User Management",
			icon: Users,
			children: [
				{
					name: "Users",
					href: "/settings/users",
					icon: User
				},
				{
					name: "Roles",
					href: "/settings/roles",
					icon: Shield
				},
				{
					name: "Permissions",
					href: "/settings/permissions",
					icon: Key
				}
			]
		}, {
			name: "Appearance",
			href: "/settings/appearance",
			icon: Palette
		}]
	}
];
/**
* Sidebar Component
* 
* Modern sidebar with:
* - Collapse toggle at top
* - User profile dropdown at bottom (Invoo style)
*/
function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
	const { auth } = usePage().props;
	const user = auth?.user;
	const [profileOpen, setProfileOpen] = useState(false);
	const profileRef = useRef(null);
	const initials = user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U";
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (profileRef.current && !profileRef.current.contains(event.target)) setProfileOpen(false);
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);
	return /* @__PURE__ */ jsxs(Fragment, { children: [mobileOpen && /* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-40 bg-black/50 lg:hidden animate-fade-in",
		onClick: onMobileClose
	}), /* @__PURE__ */ jsxs("aside", {
		className: `
                fixed inset-y-0 left-0 z-50 bg-theme-primary
                transform transition-all duration-300 ease-in-out flex flex-col
                lg:translate-x-0
                ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                ${collapsed ? "w-[72px]" : "w-64"}
            `,
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "hidden lg:flex items-center justify-end px-3 py-2",
				children: /* @__PURE__ */ jsx("button", {
					onClick: onToggle,
					className: "p-2 text-theme-muted hover:text-theme-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors",
					children: collapsed ? /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(ChevronLeft, { className: "w-4 h-4" })
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between px-4 pb-4",
				children: [/* @__PURE__ */ jsxs(Link, {
					href: "/dashboard",
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ jsx("div", {
						className: "w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center",
						children: /* @__PURE__ */ jsx("span", {
							className: "text-white font-bold text-sm",
							children: "KM"
						})
					}), !collapsed && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
						className: "font-bold text-theme-primary",
						children: "Kominfo"
					}), /* @__PURE__ */ jsx("span", {
						className: "block text-xs text-theme-muted",
						children: "Admin Panel"
					})] })]
				}), /* @__PURE__ */ jsx("button", {
					className: "lg:hidden p-2 text-theme-muted hover:text-theme-primary rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800",
					onClick: onMobileClose,
					children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
				})]
			}),
			/* @__PURE__ */ jsx("nav", {
				className: "flex-1 px-3 space-y-1 overflow-y-auto hide-scrollbar",
				children: navigation.map((item, index) => /* @__PURE__ */ jsx(NavItem, {
					item,
					collapsed
				}, `${item.name}-${index}`))
			}),
			/* @__PURE__ */ jsx("div", {
				className: "p-3",
				ref: profileRef,
				children: /* @__PURE__ */ jsxs("div", {
					className: "relative",
					children: [profileOpen && !collapsed && /* @__PURE__ */ jsxs("div", {
						className: "absolute bottom-full left-0 right-0 mb-2 bg-theme-primary rounded-xl shadow-lg border border-theme overflow-hidden animate-slide-up",
						children: [/* @__PURE__ */ jsxs(Link, {
							href: "/profile",
							className: "flex items-center gap-3 px-4 py-3 text-sm text-theme-secondary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
							onClick: () => setProfileOpen(false),
							children: [/* @__PURE__ */ jsx(User, { className: "w-4 h-4" }), /* @__PURE__ */ jsx("span", { children: "Profile" })]
						}), /* @__PURE__ */ jsxs(Link, {
							href: "/logout",
							method: "post",
							as: "button",
							className: "w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors",
							onClick: () => setProfileOpen(false),
							children: [/* @__PURE__ */ jsx(LogOut, { className: "w-4 h-4" }), /* @__PURE__ */ jsx("span", { children: "Logout" })]
						})]
					}), /* @__PURE__ */ jsxs("button", {
						onClick: () => !collapsed && setProfileOpen(!profileOpen),
						className: `
                                w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50
                                hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors
                                ${collapsed ? "justify-center" : ""}
                            `,
						children: [/* @__PURE__ */ jsx("div", {
							className: "w-10 h-10 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full flex items-center justify-center flex-shrink-0",
							children: /* @__PURE__ */ jsx("span", {
								className: "text-white font-semibold text-sm",
								children: initials
							})
						}), !collapsed && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("div", {
							className: "flex-1 min-w-0 text-left",
							children: [/* @__PURE__ */ jsx("p", {
								className: "text-sm font-medium text-theme-primary truncate",
								children: user?.name
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-theme-muted truncate",
								children: user?.email
							})]
						}), /* @__PURE__ */ jsx(ChevronUp, { className: `w-4 h-4 text-theme-muted transition-transform ${profileOpen ? "" : "rotate-180"}` })] })]
					})]
				})
			})
		]
	})] });
}
//#endregion
//#region resources/js/Components/Cards/StatsCard.tsx
/**
* StatsCard Component
* 
* Modern stat card with:
* - Colored left accent bar (Filament style)
* - Icon with matching background
* - Dark mode support
*/
function StatsCard({ title, value, icon: Icon, color = "primary", subtitle }) {
	const styles = {
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
	}[color];
	return /* @__PURE__ */ jsxs("div", {
		className: "bg-theme-card rounded-xl border border-theme overflow-hidden shadow-sm hover:shadow-md transition-all duration-200",
		children: [/* @__PURE__ */ jsx("div", { className: `h-1 ${styles.accent}` }), /* @__PURE__ */ jsxs("div", {
			className: "p-5",
			children: [/* @__PURE__ */ jsx("div", {
				className: "flex items-start justify-between",
				children: /* @__PURE__ */ jsx("div", {
					className: `w-12 h-12 rounded-xl flex items-center justify-center ${styles.iconBg} ${styles.iconBgDark}`,
					children: /* @__PURE__ */ jsx(Icon, { className: `w-6 h-6 ${styles.iconText} ${styles.iconTextDark}` })
				})
			}), /* @__PURE__ */ jsxs("div", {
				className: "mt-4",
				children: [
					/* @__PURE__ */ jsx("p", {
						className: "text-2xl font-bold text-theme-primary",
						children: value
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-sm text-theme-secondary mt-1",
						children: title
					}),
					subtitle && /* @__PURE__ */ jsx("p", {
						className: "text-xs text-theme-muted mt-0.5",
						children: subtitle
					})
				]
			})]
		})]
	});
}
//#endregion
//#region resources/js/Components/Cards/Card.tsx
/**
* Card Component
* 
* Base card wrapper with consistent styling.
*/
function Card$1({ children, className = "", padding = "md" }) {
	return /* @__PURE__ */ jsx("div", {
		className: `
            bg-theme-card
            rounded-xl 
            border border-theme 
            shadow-sm
            transition-colors duration-200
            ${{
			none: "",
			sm: "p-4",
			md: "p-6",
			lg: "p-8"
		}[padding]} ${className}
        `,
		children
	});
}
/**
* Card Header Component
* 
* Header section with title, subtitle, and optional action.
*/
function CardHeader({ title, subtitle, action, children }) {
	if (children) return /* @__PURE__ */ jsx("div", {
		className: "flex items-center justify-between mb-4",
		children
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "flex items-center justify-between mb-4",
		children: [/* @__PURE__ */ jsxs("div", { children: [title && /* @__PURE__ */ jsx("h2", {
			className: "text-lg font-semibold text-gray-900 dark:text-gray-100",
			children: title
		}), subtitle && /* @__PURE__ */ jsx("p", {
			className: "text-sm text-gray-500 dark:text-gray-400 mt-0.5",
			children: subtitle
		})] }), action && /* @__PURE__ */ jsx("div", { children: action })]
	});
}
//#endregion
//#region resources/js/Components/PageHeader.tsx
/**
* PageHeader Component
* 
* Consistent page header with title, subtitle, and optional action button.
*/
function PageHeader({ title, subtitle, action, children }) {
	const ActionIcon = action?.icon || Plus;
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6",
		children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
			className: "text-2xl font-bold text-gray-900",
			children: title
		}), subtitle && /* @__PURE__ */ jsx("p", {
			className: "text-gray-500 mt-1",
			children: subtitle
		})] }), /* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-3",
			children: [children, action && /* @__PURE__ */ jsxs(Link, {
				href: action.href,
				className: "inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm",
				children: [/* @__PURE__ */ jsx(ActionIcon, { className: "w-4 h-4" }), action.label]
			})]
		})]
	});
}
//#endregion
//#region resources/js/Components/Table/Table.tsx
var TableContext = React.createContext({});
function Table$1({ children, className = "" }) {
	return /* @__PURE__ */ jsx(TableContext.Provider, {
		value: {},
		children: /* @__PURE__ */ jsx("div", {
			className: `overflow-x-auto ${className}`,
			children: /* @__PURE__ */ jsx("table", {
				className: "w-full text-left border-collapse",
				children
			})
		})
	});
}
function Thead({ children, className = "" }) {
	return /* @__PURE__ */ jsx("thead", {
		className: `bg-gray-50 dark:bg-[#1a2744] border-b border-gray-100 dark:border-[#1e3a5f] ${className}`,
		children
	});
}
function Tbody({ children, className = "" }) {
	return /* @__PURE__ */ jsx("tbody", {
		className: `divide-y divide-gray-100 dark:divide-[#1e3a5f] ${className}`,
		children
	});
}
function Tr({ children, className = "", onClick }) {
	return /* @__PURE__ */ jsx("tr", {
		className: `transition-colors hover:bg-gray-50 dark:hover:bg-[#1a2744] ${onClick ? "cursor-pointer" : ""} ${className}`,
		onClick,
		children
	});
}
function Th({ children, className = "", align = "left" }) {
	const alignClass = {
		left: "text-left",
		center: "text-center",
		right: "text-right"
	}[align];
	return /* @__PURE__ */ jsx("th", {
		className: `px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${alignClass} ${className}`,
		children
	});
}
function Td({ children, className = "", align = "left" }) {
	const alignClass = {
		left: "text-left",
		center: "text-center",
		right: "text-right"
	}[align];
	return /* @__PURE__ */ jsx("td", {
		className: `px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white ${alignClass} ${className}`,
		children
	});
}
Table$1.Thead = Thead;
Table$1.Tbody = Tbody;
Table$1.Tr = Tr;
Table$1.Th = Th;
Table$1.Td = Td;
//#endregion
//#region resources/js/Components/Table/Pagination.tsx
function Pagination({ links, from, to, total, className = "" }) {
	if (links.length <= 1) return null;
	return /* @__PURE__ */ jsxs("div", {
		className: `flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-[#1e3a5f] bg-gray-50 dark:bg-[#1a2744] gap-4 ${className}`,
		children: [
			!!from && !!to && !!total && /* @__PURE__ */ jsxs("div", {
				className: "text-sm text-gray-500 dark:text-gray-400",
				children: [
					"Showing ",
					/* @__PURE__ */ jsx("span", {
						className: "font-medium text-gray-900 dark:text-white",
						children: from
					}),
					" to ",
					/* @__PURE__ */ jsx("span", {
						className: "font-medium text-gray-900 dark:text-white",
						children: to
					}),
					" of ",
					/* @__PURE__ */ jsx("span", {
						className: "font-medium text-gray-900 dark:text-white",
						children: total
					}),
					" results"
				]
			}),
			!total && /* @__PURE__ */ jsx("div", {}),
			" ",
			/* @__PURE__ */ jsx("div", {
				className: "flex z-0 inline-flex -space-x-px rounded-md shadow-sm",
				children: links.map((link, key) => {
					const isPrevious = link.label.includes("Previous");
					const isNext = link.label.includes("Next");
					let content = /* @__PURE__ */ jsx("span", { dangerouslySetInnerHTML: { __html: link.label } });
					if (isPrevious) content = /* @__PURE__ */ jsx(ChevronLeft, { className: "w-4 h-4" });
					if (isNext) content = /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4" });
					const baseClasses = "relative inline-flex items-center px-4 py-2 text-sm font-medium border transition-colors focus:z-10 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500";
					const activeClasses = link.active ? "z-10 bg-primary-50 dark:bg-primary-500/20 border-primary-500 text-primary-600 dark:text-primary-400" : "bg-white dark:bg-[#1e3a5f] border-gray-300 dark:border-[#2a4a75] text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#243656]";
					const disabledClasses = "cursor-not-allowed opacity-50";
					const roundedLeft = key === 0 ? "rounded-l-md" : "";
					const roundedRight = key === links.length - 1 ? "rounded-r-md" : "";
					if (link.url === null) return /* @__PURE__ */ jsx("span", {
						className: `${baseClasses} ${activeClasses} ${disabledClasses} ${roundedLeft} ${roundedRight}`,
						children: content
					}, key);
					return /* @__PURE__ */ jsx(Link, {
						href: link.url,
						className: `${baseClasses} ${activeClasses} ${roundedLeft} ${roundedRight}`,
						children: content
					}, key);
				})
			})
		]
	});
}
//#endregion
//#region resources/js/Components/Form/FormInput.tsx
function FormInput({ label, error, description, className = "", id, ...props }) {
	const inputId = id || props.name || Math.random().toString(36).substr(2, 9);
	return /* @__PURE__ */ jsxs("div", {
		className,
		children: [
			label && /* @__PURE__ */ jsxs("label", {
				htmlFor: inputId,
				className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",
				children: [
					label,
					" ",
					props.required && /* @__PURE__ */ jsx("span", {
						className: "text-red-500",
						children: "*"
					})
				]
			}),
			/* @__PURE__ */ jsx("input", {
				id: inputId,
				className: `w-full px-4 py-2.5 bg-white dark:bg-[#1a2744] border rounded-xl focus:ring-4 transition-all duration-200 ${error ? "border-red-300 focus:border-red-500 focus:ring-red-100 dark:focus:ring-red-900/30" : "border-gray-200 dark:border-gray-700 focus:border-primary-500 focus:ring-primary-100 dark:focus:ring-primary-900/30"} text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`,
				...props
			}),
			description && !error && /* @__PURE__ */ jsx("p", {
				className: "mt-1 text-sm text-gray-500 dark:text-gray-400",
				children: description
			}),
			error && /* @__PURE__ */ jsx("p", {
				className: "mt-1 text-sm text-red-500",
				children: error
			})
		]
	});
}
//#endregion
//#region resources/js/Components/Form/FormSelect.tsx
function FormSelect({ label, error, description, options = [], placeholder = "Select an option", className = "", id, children, ...props }) {
	const selectId = id || props.name || Math.random().toString(36).substr(2, 9);
	return /* @__PURE__ */ jsxs("div", {
		className,
		children: [
			label && /* @__PURE__ */ jsxs("label", {
				htmlFor: selectId,
				className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",
				children: [
					label,
					" ",
					props.required && /* @__PURE__ */ jsx("span", {
						className: "text-red-500",
						children: "*"
					})
				]
			}),
			/* @__PURE__ */ jsxs("select", {
				id: selectId,
				className: `w-full px-4 py-2.5 bg-white dark:bg-[#1a2744] border rounded-xl focus:ring-4 transition-all duration-200 ${error ? "border-red-300 focus:border-red-500 focus:ring-red-100 dark:focus:ring-red-900/30" : "border-gray-200 dark:border-gray-700 focus:border-primary-500 focus:ring-primary-100 dark:focus:ring-primary-900/30"} text-gray-900 dark:text-white`,
				...props,
				children: [/* @__PURE__ */ jsx("option", {
					value: "",
					children: placeholder
				}), options.length > 0 ? options.map((option) => /* @__PURE__ */ jsx("option", {
					value: option.value,
					children: option.label
				}, option.value)) : children]
			}),
			description && !error && /* @__PURE__ */ jsx("p", {
				className: "mt-1 text-sm text-gray-500 dark:text-gray-400",
				children: description
			}),
			error && /* @__PURE__ */ jsx("p", {
				className: "mt-1 text-sm text-red-500",
				children: error
			})
		]
	});
}
//#endregion
//#region resources/js/Components/Form/FormTextarea.tsx
function FormTextarea({ label, error, description, className = "", id, ...props }) {
	const textareaId = id || props.name || Math.random().toString(36).substr(2, 9);
	return /* @__PURE__ */ jsxs("div", {
		className,
		children: [
			label && /* @__PURE__ */ jsxs("label", {
				htmlFor: textareaId,
				className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",
				children: [
					label,
					" ",
					props.required && /* @__PURE__ */ jsx("span", {
						className: "text-red-500",
						children: "*"
					})
				]
			}),
			/* @__PURE__ */ jsx("textarea", {
				id: textareaId,
				className: `w-full px-4 py-2.5 bg-white dark:bg-[#1a2744] border rounded-xl focus:ring-4 transition-all duration-200 ${error ? "border-red-300 focus:border-red-500 focus:ring-red-100 dark:focus:ring-red-900/30" : "border-gray-200 dark:border-gray-700 focus:border-primary-500 focus:ring-primary-100 dark:focus:ring-primary-900/30"} text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`,
				...props
			}),
			description && !error && /* @__PURE__ */ jsx("p", {
				className: "mt-1 text-sm text-gray-500 dark:text-gray-400",
				children: description
			}),
			error && /* @__PURE__ */ jsx("p", {
				className: "mt-1 text-sm text-red-500",
				children: error
			})
		]
	});
}
//#endregion
//#region resources/js/Components/Form/FormSection.tsx
function FormSection({ title, description, children, className = "" }) {
	return /* @__PURE__ */ jsxs("div", {
		className: `space-y-4 ${className}`,
		children: [(title || description) && /* @__PURE__ */ jsxs("div", {
			className: "mb-4",
			children: [title && /* @__PURE__ */ jsx("h3", {
				className: "text-lg font-medium text-gray-900 dark:text-white",
				children: title
			}), description && /* @__PURE__ */ jsx("p", {
				className: "text-sm text-gray-500 dark:text-gray-400 mt-1",
				children: description
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: "grid grid-cols-1 gap-6",
			children
		})]
	});
}
//#endregion
//#region resources/js/Components/Form/FormCard.tsx
function FormCard({ children, className = "", ...props }) {
	return /* @__PURE__ */ jsx("div", {
		className: `bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 ${className}`,
		...props,
		children
	});
}
//#endregion
//#region resources/js/Components/Shimmer.tsx
var shimmerBase = `
    relative overflow-hidden
    bg-gray-200 dark:bg-gray-700
    before:absolute before:inset-0
    before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
    before:animate-[shimmer_1.5s_infinite]
`;
/**
* Single line shimmer
*/
function Line({ width = "w-full", className = "" }) {
	return /* @__PURE__ */ jsx("div", { className: `${shimmerBase} h-4 rounded ${width} ${className}` });
}
/**
* Block/Rectangle shimmer
*/
function Block({ height = "h-24", width = "w-full", className = "" }) {
	return /* @__PURE__ */ jsx("div", { className: `${shimmerBase} rounded-lg ${height} ${width} ${className}` });
}
/**
* Circle shimmer (for avatars)
*/
function Circle({ className = "" }) {
	return /* @__PURE__ */ jsx("div", { className: `${shimmerBase} w-10 h-10 rounded-full ${className}` });
}
/**
* Table skeleton with rows and columns
*/
function Table({ rows = 5, cols = 4, className = "" }) {
	return /* @__PURE__ */ jsxs("div", {
		className: `overflow-hidden ${className}`,
		children: [/* @__PURE__ */ jsx("div", {
			className: "flex gap-4 p-4 border-b border-gray-100 dark:border-gray-800",
			children: Array.from({ length: cols }).map((_, i) => /* @__PURE__ */ jsx("div", { className: `${shimmerBase} h-4 rounded flex-1` }, `header-${i}`))
		}), Array.from({ length: rows }).map((_, rowIndex) => /* @__PURE__ */ jsx("div", {
			className: "flex gap-4 p-4 border-b border-gray-50 dark:border-gray-800/50",
			children: Array.from({ length: cols }).map((_, colIndex) => /* @__PURE__ */ jsx("div", {
				className: `${shimmerBase} h-4 rounded flex-1`,
				style: { animationDelay: `${(rowIndex * cols + colIndex) * 50}ms` }
			}, `cell-${rowIndex}-${colIndex}`))
		}, `row-${rowIndex}`))]
	});
}
/**
* Card skeleton with optional image
*/
function Card({ hasImage = false, className = "" }) {
	return /* @__PURE__ */ jsxs("div", {
		className: `bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm ${className}`,
		children: [hasImage && /* @__PURE__ */ jsx("div", { className: `${shimmerBase} h-40 rounded-lg mb-4` }), /* @__PURE__ */ jsxs("div", {
			className: "space-y-3",
			children: [
				/* @__PURE__ */ jsx("div", { className: `${shimmerBase} h-5 rounded w-3/4` }),
				/* @__PURE__ */ jsx("div", { className: `${shimmerBase} h-4 rounded w-full` }),
				/* @__PURE__ */ jsx("div", { className: `${shimmerBase} h-4 rounded w-2/3` })
			]
		})]
	});
}
/**
* Stats cards grid skeleton (matches StatsCard layout)
*/
function StatsCards({ count = 4, className = "" }) {
	return /* @__PURE__ */ jsx("div", {
		className: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`,
		children: Array.from({ length: count }).map((_, i) => /* @__PURE__ */ jsx("div", {
			className: "bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm",
			children: /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-4",
				children: [/* @__PURE__ */ jsx("div", { className: `${shimmerBase} w-12 h-12 rounded-xl` }), /* @__PURE__ */ jsxs("div", {
					className: "flex-1 space-y-2",
					children: [/* @__PURE__ */ jsx("div", { className: `${shimmerBase} h-3 rounded w-20` }), /* @__PURE__ */ jsx("div", { className: `${shimmerBase} h-6 rounded w-16` })]
				})]
			})
		}, `stats-${i}`))
	});
}
/**
* Budget overview skeleton (matches Dashboard budget card)
*/
function BudgetOverview({ className = "" }) {
	return /* @__PURE__ */ jsxs("div", {
		className: `bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm ${className}`,
		children: [
			/* @__PURE__ */ jsx("div", { className: `${shimmerBase} h-5 rounded w-32 mb-6` }),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-2 gap-6 mb-6",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ jsx("div", { className: `${shimmerBase} h-3 rounded w-20` }), /* @__PURE__ */ jsx("div", { className: `${shimmerBase} h-7 rounded w-28` })]
				}), /* @__PURE__ */ jsxs("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ jsx("div", { className: `${shimmerBase} h-3 rounded w-16` }), /* @__PURE__ */ jsx("div", { className: `${shimmerBase} h-7 rounded w-24` })]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex justify-between",
					children: [/* @__PURE__ */ jsx("div", { className: `${shimmerBase} h-3 rounded w-16` }), /* @__PURE__ */ jsx("div", { className: `${shimmerBase} h-3 rounded w-10` })]
				}), /* @__PURE__ */ jsx("div", { className: `${shimmerBase} h-3 rounded-full w-full` })]
			})
		]
	});
}
/**
* List skeleton
*/
function List({ items = 5, className = "" }) {
	return /* @__PURE__ */ jsx("div", {
		className: `space-y-3 ${className}`,
		children: Array.from({ length: items }).map((_, i) => /* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-3 p-3",
			children: [
				/* @__PURE__ */ jsx("div", { className: `${shimmerBase} w-3 h-3 rounded-full flex-shrink-0` }),
				/* @__PURE__ */ jsxs("div", {
					className: "flex-1 space-y-2",
					children: [/* @__PURE__ */ jsx("div", { className: `${shimmerBase} h-4 rounded w-3/4` }), /* @__PURE__ */ jsx("div", { className: `${shimmerBase} h-3 rounded w-1/2` })]
				}),
				/* @__PURE__ */ jsx("div", { className: `${shimmerBase} h-4 rounded w-12` })
			]
		}, `list-${i}`))
	});
}
var Shimmer = {
	Line,
	Block,
	Circle,
	Table,
	Card,
	StatsCards,
	BudgetOverview,
	List
};
//#endregion
//#region resources/js/Layouts/AppLayout.tsx
/**
* AppLayout Component
* 
* Main application layout with:
* - Collapsible sidebar with tree navigation
* - No header bar - content goes full to top
* - Flash message display
* - Dark mode support
*/
function AppLayout({ children }) {
	const { flash } = usePage().props;
	const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
		if (typeof window !== "undefined") return localStorage.getItem("sidebar-collapsed") === "true";
		return false;
	});
	const [mobileOpen, setMobileOpen] = useState(false);
	useEffect(() => {
		if (typeof window !== "undefined") localStorage.setItem("sidebar-collapsed", String(sidebarCollapsed));
	}, [sidebarCollapsed]);
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-theme-secondary transition-colors duration-300",
		children: [/* @__PURE__ */ jsx(Sidebar, {
			collapsed: sidebarCollapsed,
			onToggle: () => setSidebarCollapsed(!sidebarCollapsed),
			mobileOpen,
			onMobileClose: () => setMobileOpen(false)
		}), /* @__PURE__ */ jsxs("div", {
			className: `min-h-screen transition-all duration-300 ${sidebarCollapsed ? "lg:pl-[72px]" : "lg:pl-64"}`,
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "lg:hidden sticky top-0 z-30 p-4",
					children: /* @__PURE__ */ jsx("button", {
						className: "p-2 text-theme-muted hover:text-theme-primary rounded-lg bg-theme-primary shadow-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
						onClick: () => setMobileOpen(true),
						children: /* @__PURE__ */ jsx(Menu, { className: "w-5 h-5" })
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "px-4 lg:px-6",
					children: [flash?.success && /* @__PURE__ */ jsxs("div", {
						className: "mb-4 p-4 bg-secondary-50 dark:bg-secondary-900/30 border border-secondary-200 dark:border-secondary-800 text-secondary-700 dark:text-secondary-300 rounded-xl flex items-start gap-3 animate-slide-down",
						children: [/* @__PURE__ */ jsx("div", {
							className: "w-5 h-5 bg-secondary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
							children: /* @__PURE__ */ jsx("svg", {
								className: "w-3 h-3 text-white",
								fill: "none",
								viewBox: "0 0 24 24",
								stroke: "currentColor",
								children: /* @__PURE__ */ jsx("path", {
									strokeLinecap: "round",
									strokeLinejoin: "round",
									strokeWidth: 3,
									d: "M5 13l4 4L19 7"
								})
							})
						}), /* @__PURE__ */ jsx("p", { children: flash.success })]
					}), flash?.error && /* @__PURE__ */ jsxs("div", {
						className: "mb-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl flex items-start gap-3 animate-slide-down",
						children: [/* @__PURE__ */ jsx("div", {
							className: "w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
							children: /* @__PURE__ */ jsx("svg", {
								className: "w-3 h-3 text-white",
								fill: "none",
								viewBox: "0 0 24 24",
								stroke: "currentColor",
								children: /* @__PURE__ */ jsx("path", {
									strokeLinecap: "round",
									strokeLinejoin: "round",
									strokeWidth: 3,
									d: "M6 18L18 6M6 6l12 12"
								})
							})
						}), /* @__PURE__ */ jsx("p", { children: flash.error })]
					})]
				}),
				/* @__PURE__ */ jsx("main", {
					className: "p-4 lg:p-6 lg:pt-4",
					children
				})
			]
		})]
	});
}
//#endregion
export { FormTextarea as a, Pagination as c, Card$1 as d, CardHeader as f, FormSection as i, Table$1 as l, Shimmer as n, FormSelect as o, StatsCard as p, FormCard as r, FormInput as s, AppLayout as t, PageHeader as u };
