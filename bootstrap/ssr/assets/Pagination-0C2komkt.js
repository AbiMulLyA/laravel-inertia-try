import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@inertiajs/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
function Pagination({ links, from, to, total, className = "" }) {
  if (links.length <= 1) return null;
  return /* @__PURE__ */ jsxs("div", { className: `flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-[#1e3a5f] bg-gray-50 dark:bg-[#1a2744] gap-4 ${className}`, children: [
    !!from && !!to && !!total && /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-500 dark:text-gray-400", children: [
      "Showing ",
      /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-900 dark:text-white", children: from }),
      " to ",
      /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-900 dark:text-white", children: to }),
      " of ",
      /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-900 dark:text-white", children: total }),
      " results"
    ] }),
    !total && /* @__PURE__ */ jsx("div", {}),
    " ",
    /* @__PURE__ */ jsx("div", { className: "flex z-0 inline-flex -space-x-px rounded-md shadow-sm", children: links.map((link, key) => {
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
      if (link.url === null) {
        return /* @__PURE__ */ jsx(
          "span",
          {
            className: `${baseClasses} ${activeClasses} ${disabledClasses} ${roundedLeft} ${roundedRight}`,
            children: content
          },
          key
        );
      }
      return /* @__PURE__ */ jsx(
        Link,
        {
          href: link.url,
          className: `${baseClasses} ${activeClasses} ${roundedLeft} ${roundedRight}`,
          children: content
        },
        key
      );
    }) })
  ] });
}
export {
  Pagination as P
};
