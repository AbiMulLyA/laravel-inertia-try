import { jsxs, jsx } from "react/jsx-runtime";
import { A as AppLayout } from "./AppLayout-ClUKwJTp.js";
import { Head, Link, router } from "@inertiajs/react";
import { Plus, Users, UserPlus, ShieldCheck, Search, Edit, Trash2, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { S as StatsCard } from "./StatsCard-DQVB_KgP.js";
import { P as PageHeader, C as Card } from "./PageHeader-DAtmv7HV.js";
function UsersIndex({ users, summary, filters }) {
  const [search, setSearch] = useState(filters.search || "");
  const handleSearch = (e) => {
    e.preventDefault();
    router.get("/settings/users", { search }, { preserveState: true });
  };
  const handleDelete = (user) => {
    if (confirm(`Are you sure you want to delete "${user.name}"?`)) {
      router.delete(`/settings/users/${user.id}`);
    }
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };
  const getInitials = (name) => {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };
  return /* @__PURE__ */ jsxs(AppLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "User Management" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsx(
        PageHeader,
        {
          title: "User Management",
          subtitle: "Manage system users and their access",
          action: {
            label: "Add User",
            href: "/settings/users/create",
            icon: Plus
          }
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsx(
          StatsCard,
          {
            title: "Total Users",
            value: summary.total,
            icon: Users,
            color: "primary"
          }
        ),
        /* @__PURE__ */ jsx(
          StatsCard,
          {
            title: "New This Month",
            value: summary.this_month,
            icon: UserPlus,
            color: "secondary"
          }
        ),
        /* @__PURE__ */ jsx(
          StatsCard,
          {
            title: "Verified",
            value: summary.verified,
            icon: ShieldCheck,
            color: "accent"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(Card, { padding: "none", children: [
        /* @__PURE__ */ jsx("div", { className: "p-4 border-b border-theme", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSearch, className: "flex gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative flex-1 max-w-md", children: [
            /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                placeholder: "Search by name or email...",
                value: search,
                onChange: (e) => setSearch(e.target.value),
                className: "form-input pl-10"
              }
            )
          ] }),
          /* @__PURE__ */ jsx("button", { type: "submit", className: "btn btn-primary", children: "Search" })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-gray-50 dark:bg-gray-800/50", children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-semibold text-theme-secondary uppercase tracking-wider", children: "User" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-semibold text-theme-secondary uppercase tracking-wider", children: "Role" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-semibold text-theme-secondary uppercase tracking-wider", children: "Status" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-semibold text-theme-secondary uppercase tracking-wider", children: "Joined" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-right text-xs font-semibold text-theme-secondary uppercase tracking-wider", children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-100 dark:divide-gray-800", children: users.data.map((user) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors", children: [
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx("span", { className: "text-white font-semibold text-sm", children: getInitials(user.name) }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "font-medium text-theme-primary", children: user.name }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-theme-muted", children: user.email })
              ] })
            ] }) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300", children: user.role || "User" }) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: user.email_verified_at ? /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-100 dark:bg-secondary-900/50 text-secondary-700 dark:text-secondary-300", children: "Verified" }) : /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300", children: "Pending" }) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-sm text-theme-secondary", children: formatDate(user.created_at) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2", children: [
              /* @__PURE__ */ jsx(
                Link,
                {
                  href: `/settings/users/${user.id}/edit`,
                  className: "p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors",
                  children: /* @__PURE__ */ jsx(Edit, { className: "w-4 h-4" })
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => handleDelete(user),
                  className: "p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors",
                  children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
                }
              )
            ] }) })
          ] }, user.id)) })
        ] }) }),
        users.data.length === 0 && /* @__PURE__ */ jsxs("div", { className: "p-12 text-center", children: [
          /* @__PURE__ */ jsx(Users, { className: "w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" }),
          /* @__PURE__ */ jsx("p", { className: "text-theme-secondary mb-4", children: "No users found" }),
          /* @__PURE__ */ jsxs(Link, { href: "/settings/users/create", className: "btn btn-primary", children: [
            /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
            "Add First User"
          ] })
        ] }),
        users.last_page > 1 && /* @__PURE__ */ jsxs("div", { className: "px-6 py-4 border-t border-theme flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-theme-secondary", children: [
            "Showing ",
            (users.current_page - 1) * users.per_page + 1,
            " to",
            " ",
            Math.min(users.current_page * users.per_page, users.total),
            " of ",
            users.total,
            " users"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1", children: users.links.map((link, index) => {
            if (link.label.includes("Previous")) {
              return /* @__PURE__ */ jsx(
                Link,
                {
                  href: link.url || "#",
                  className: `p-2 rounded-lg ${link.url ? "text-theme-secondary hover:bg-gray-100 dark:hover:bg-gray-800" : "text-gray-300 dark:text-gray-600 cursor-not-allowed"}`,
                  preserveState: true,
                  children: /* @__PURE__ */ jsx(ChevronLeft, { className: "w-4 h-4" })
                },
                index
              );
            }
            if (link.label.includes("Next")) {
              return /* @__PURE__ */ jsx(
                Link,
                {
                  href: link.url || "#",
                  className: `p-2 rounded-lg ${link.url ? "text-theme-secondary hover:bg-gray-100 dark:hover:bg-gray-800" : "text-gray-300 dark:text-gray-600 cursor-not-allowed"}`,
                  preserveState: true,
                  children: /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4" })
                },
                index
              );
            }
            if (link.label === "...") {
              return /* @__PURE__ */ jsx("span", { className: "px-2 text-theme-muted", children: /* @__PURE__ */ jsx(MoreHorizontal, { className: "w-4 h-4" }) }, index);
            }
            return /* @__PURE__ */ jsx(
              Link,
              {
                href: link.url || "#",
                className: `px-3 py-1.5 rounded-lg text-sm font-medium ${link.active ? "bg-primary-600 text-white" : "text-theme-secondary hover:bg-gray-100 dark:hover:bg-gray-800"}`,
                preserveState: true,
                children: link.label
              },
              index
            );
          }) })
        ] })
      ] })
    ] })
  ] });
}
export {
  UsersIndex as default
};
