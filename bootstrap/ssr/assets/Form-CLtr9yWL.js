import { jsxs, jsx } from "react/jsx-runtime";
import { A as AppLayout } from "./AppLayout-CbOP_oBK.js";
import { useForm, Head, Link } from "@inertiajs/react";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import "react";
function TaskForm({ task, projects, statuses, priorities }) {
  const isEdit = !!task;
  const { data, setData, post, put, processing, errors } = useForm({
    project_id: task?.project_id?.toString() ?? "",
    code: task?.code ?? "",
    name: task?.name ?? "",
    description: task?.description ?? "",
    location: task?.location ?? "",
    target: task?.target?.toString() ?? "",
    achieved: task?.achieved?.toString() ?? "0",
    unit: task?.unit ?? "",
    budget: task?.budget?.toString() ?? "",
    spent: task?.spent?.toString() ?? "0",
    status: task?.status ?? "pending",
    progress: task?.progress?.toString() ?? "0",
    priority: task?.priority ?? "medium",
    start_date: task?.start_date ?? "",
    end_date: task?.end_date ?? "",
    notes: task?.notes ?? ""
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      put(`/tasks/${task.id}`);
    } else {
      post("/tasks");
    }
  };
  return /* @__PURE__ */ jsxs(AppLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: isEdit ? "Edit Task" : "Add Task" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsxs(
          Link,
          {
            href: "/tasks",
            className: "inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4",
            children: [
              /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4" }),
              "Back to Tasks"
            ]
          }
        ),
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-900", children: isEdit ? "Edit Task" : "Add New Task" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: isEdit ? "Update task information" : "Fill in the form to create a new task" })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "bg-white rounded-xl border p-6 space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: [
            "Project ",
            /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: data.project_id,
              onChange: (e) => setData("project_id", e.target.value),
              className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${errors.project_id ? "border-red-500" : "border-gray-300"}`,
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "Select Project" }),
                projects.map((p) => /* @__PURE__ */ jsxs("option", { value: p.id, children: [
                  "[",
                  p.category.code,
                  "] ",
                  p.name
                ] }, p.id))
              ]
            }
          ),
          errors.project_id && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-500", children: errors.project_id })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: [
              "Code ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: data.code,
                onChange: (e) => setData("code", e.target.value.toUpperCase()),
                className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${errors.code ? "border-red-500" : "border-gray-300"}`,
                placeholder: "e.g., TSK-001"
              }
            ),
            errors.code && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-500", children: errors.code })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: [
              "Status ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              "select",
              {
                value: data.status,
                onChange: (e) => setData("status", e.target.value),
                className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500",
                children: Object.entries(statuses).map(([key, label]) => /* @__PURE__ */ jsx("option", { value: key, children: label }, key))
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: [
              "Priority ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              "select",
              {
                value: data.priority,
                onChange: (e) => setData("priority", e.target.value),
                className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500",
                children: Object.entries(priorities).map(([key, label]) => /* @__PURE__ */ jsx("option", { value: key, children: label }, key))
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: [
            "Name ",
            /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: data.name,
              onChange: (e) => setData("name", e.target.value),
              className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${errors.name ? "border-red-500" : "border-gray-300"}`,
              placeholder: "Task name"
            }
          ),
          errors.name && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-500", children: errors.name })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Description" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              value: data.description,
              onChange: (e) => setData("description", e.target.value),
              rows: 3,
              className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500",
              placeholder: "Task description..."
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Location" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: data.location,
              onChange: (e) => setData("location", e.target.value),
              className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500",
              placeholder: "Location..."
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "border-t pt-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-gray-900 mb-4", children: "Target & Budget" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: [
                "Target ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  value: data.target,
                  onChange: (e) => setData("target", e.target.value),
                  className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${errors.target ? "border-red-500" : "border-gray-300"}`,
                  placeholder: "0",
                  min: "0",
                  step: "0.01"
                }
              ),
              errors.target && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-500", children: errors.target })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: [
                "Unit ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: data.unit,
                  onChange: (e) => setData("unit", e.target.value),
                  className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${errors.unit ? "border-red-500" : "border-gray-300"}`,
                  placeholder: "e.g., units, hours"
                }
              ),
              errors.unit && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-500", children: errors.unit })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: [
                "Budget ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  value: data.budget,
                  onChange: (e) => setData("budget", e.target.value),
                  className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${errors.budget ? "border-red-500" : "border-gray-300"}`,
                  placeholder: "0",
                  min: "0"
                }
              ),
              errors.budget && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-500", children: errors.budget })
            ] })
          ] }),
          isEdit && /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Achieved" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  value: data.achieved,
                  onChange: (e) => setData("achieved", e.target.value),
                  className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500",
                  placeholder: "0",
                  min: "0",
                  step: "0.01"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Progress (%)" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  value: data.progress,
                  onChange: (e) => setData("progress", e.target.value),
                  className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500",
                  placeholder: "0",
                  min: "0",
                  max: "100"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Spent" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  value: data.spent,
                  onChange: (e) => setData("spent", e.target.value),
                  className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500",
                  placeholder: "0",
                  min: "0"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "border-t pt-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-gray-900 mb-4", children: "Timeline" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Start Date" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "date",
                  value: data.start_date,
                  onChange: (e) => setData("start_date", e.target.value),
                  className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "End Date" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "date",
                  value: data.end_date,
                  onChange: (e) => setData("end_date", e.target.value),
                  className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                }
              )
            ] })
          ] })
        ] }),
        isEdit && /* @__PURE__ */ jsxs("div", { className: "border-t pt-6", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Notes" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              value: data.notes,
              onChange: (e) => setData("notes", e.target.value),
              rows: 3,
              className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500",
              placeholder: "Additional notes..."
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-3 pt-4 border-t", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              href: "/tasks",
              className: "px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "submit",
              disabled: processing,
              className: "inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50",
              children: [
                processing ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "w-4 h-4" }),
                isEdit ? "Save Changes" : "Add Task"
              ]
            }
          )
        ] })
      ] })
    ] })
  ] });
}
export {
  TaskForm as default
};
