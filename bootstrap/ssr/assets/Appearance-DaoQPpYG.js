import { jsxs, jsx } from "react/jsx-runtime";
import { A as AppLayout } from "./AppLayout-BRO-oidT.js";
import { Head } from "@inertiajs/react";
import { Sun, Moon, Monitor, Check } from "lucide-react";
import { useContext, createContext } from "react";
import { P as PageHeader, C as Card } from "./PageHeader-D62FVbSQ.js";
const ThemeContext = createContext(void 0);
function useTheme() {
  const context = useContext(ThemeContext);
  if (context === void 0) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
const themeOptions = [
  {
    value: "light",
    label: "Light",
    description: "Classic light theme with bright backgrounds",
    icon: Sun
  },
  {
    value: "dark",
    label: "Dark",
    description: "Easy on the eyes with dark backgrounds",
    icon: Moon
  },
  {
    value: "system",
    label: "System",
    description: "Automatically match your system preference",
    icon: Monitor
  }
];
const colorPalette = [
  {
    name: "Primary",
    label: "Blue",
    hex: "#2563EB",
    description: "Main actions and active states"
  },
  {
    name: "Secondary",
    label: "Green",
    hex: "#16A34A",
    description: "Success states and positive indicators"
  },
  {
    name: "Accent",
    label: "Gold",
    hex: "#F59E0B",
    description: "Highlights and warnings"
  }
];
function SettingsAppearance() {
  const { theme, setTheme } = useTheme();
  return /* @__PURE__ */ jsxs(AppLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Appearance Settings" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6 max-w-3xl", children: [
      /* @__PURE__ */ jsx(
        PageHeader,
        {
          title: "Appearance",
          subtitle: "Customize how the application looks"
        }
      ),
      /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-theme-primary mb-2", children: "Theme" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-theme-secondary mb-6", children: "Select your preferred color scheme for the application." }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: themeOptions.map((option) => {
          const isSelected = theme === option.value;
          const Icon = option.icon;
          return /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setTheme(option.value),
              className: `
                                            relative p-4 rounded-xl border-2 text-left transition-all duration-200
                                            ${isSelected ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20" : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"}
                                        `,
              children: [
                isSelected && /* @__PURE__ */ jsx("div", { className: "absolute top-3 right-3 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx(Check, { className: "w-3 h-3 text-white" }) }),
                /* @__PURE__ */ jsx("div", { className: `
                                            w-10 h-10 rounded-lg flex items-center justify-center mb-3
                                            ${isSelected ? "bg-primary-100 dark:bg-primary-800" : "bg-gray-100 dark:bg-gray-800"}
                                        `, children: /* @__PURE__ */ jsx(Icon, { className: `w-5 h-5 ${isSelected ? "text-primary-600 dark:text-primary-400" : "text-gray-500 dark:text-gray-400"}` }) }),
                /* @__PURE__ */ jsx("h4", { className: `font-medium ${isSelected ? "text-primary-700 dark:text-primary-300" : "text-theme-primary"}`, children: option.label }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-theme-secondary mt-1", children: option.description })
              ]
            },
            option.value
          );
        }) })
      ] }) }),
      /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-theme-primary mb-2", children: "Color Palette" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-theme-secondary mb-6", children: "Inspired by Kabupaten Tasikmalaya brand colors." }),
        /* @__PURE__ */ jsx("div", { className: "space-y-4", children: colorPalette.map((color) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl",
            children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "w-12 h-12 rounded-xl flex-shrink-0",
                  style: { backgroundColor: color.hex }
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("h4", { className: "font-medium text-theme-primary", children: color.name }),
                  /* @__PURE__ */ jsxs("span", { className: "text-xs text-theme-muted", children: [
                    "(",
                    color.label,
                    ")"
                  ] })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-theme-secondary mt-0.5", children: color.description })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "text-right", children: /* @__PURE__ */ jsx("code", { className: "px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono text-theme-primary", children: color.hex }) })
            ]
          },
          color.name
        )) })
      ] }) })
    ] })
  ] });
}
export {
  SettingsAppearance as default
};
