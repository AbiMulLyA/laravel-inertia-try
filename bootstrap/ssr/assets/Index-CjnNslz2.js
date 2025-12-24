import { jsxs, jsx } from "react/jsx-runtime";
import { A as AppLayout } from "./AppLayout-Bnl3kyBN.js";
import { Head, Link, router } from "@inertiajs/react";
import { Plus, FolderKanban, TrendingUp, Filter, Edit, Trash2 } from "lucide-react";
import "react";
function ProgramIndex({ program, bidang, filters, summary }) {
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - 2 + i);
  const handleDelete = (id, nama) => {
    if (confirm(`Hapus program "${nama}"? Data ini tidak dapat dikembalikan.`)) {
      router.delete(`/program/${id}`);
    }
  };
  const handleFilterChange = (key, value) => {
    router.get("/program", { ...filters, [key]: value }, { preserveState: true });
  };
  const formatCurrency = (value) => {
    if (value >= 1e12) return `Rp ${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `Rp ${(value / 1e9).toFixed(1)}M`;
    if (value >= 1e6) return `Rp ${(value / 1e6).toFixed(1)}Jt`;
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(value);
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "aktif":
        return "bg-green-100 text-green-700";
      case "selesai":
        return "bg-blue-100 text-blue-700";
      case "draft":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  const persentaseTotal = summary.total_pagu > 0 ? Math.round(summary.total_realisasi / summary.total_pagu * 100) : 0;
  return /* @__PURE__ */ jsxs(AppLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Program" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Program" }),
          /* @__PURE__ */ jsxs("p", { className: "text-gray-500", children: [
            "Kelola program kerja Dinas Pertanian tahun ",
            filters.tahun
          ] })
        ] }),
        /* @__PURE__ */ jsxs(
          Link,
          {
            href: "/program/create",
            className: "inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700",
            children: [
              /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
              "Tambah Program"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-white rounded-xl border p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx(FolderKanban, { className: "w-5 h-5 text-green-600" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-gray-900", children: summary.total_program }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Total Program" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "bg-white rounded-xl border p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx(TrendingUp, { className: "w-5 h-5 text-blue-600" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-lg font-bold text-gray-900", children: formatCurrency(summary.total_pagu) }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Total Pagu" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "bg-white rounded-xl border p-4", children: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between mb-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-500", children: "Realisasi" }),
            /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium text-green-600", children: [
              persentaseTotal,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-100 rounded-full h-3", children: /* @__PURE__ */ jsx(
            "div",
            {
              className: "bg-green-500 h-3 rounded-full transition-all",
              style: { width: `${Math.min(persentaseTotal, 100)}%` }
            }
          ) }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-gray-600", children: formatCurrency(summary.total_realisasi) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "bg-white rounded-xl border p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Filter, { className: "w-4 h-4 text-gray-400" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-500", children: "Filter:" })
        ] }),
        /* @__PURE__ */ jsx(
          "select",
          {
            value: filters.tahun,
            onChange: (e) => handleFilterChange("tahun", e.target.value),
            className: "px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm",
            children: years.map((year) => /* @__PURE__ */ jsxs("option", { value: year, children: [
              "Tahun ",
              year
            ] }, year))
          }
        ),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: filters.bidang_id || "",
            onChange: (e) => handleFilterChange("bidang_id", e.target.value),
            className: "px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "Semua Bidang" }),
              bidang.map((b) => /* @__PURE__ */ jsx("option", { value: b.id, children: b.nama }, b.id))
            ]
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-gray-50", children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Kode" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Nama Program" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Bidang" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Pagu" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Realisasi" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Status" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase", children: "Aksi" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-200", children: program.map((item) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50", children: [
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700", children: item.kode }) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-900", children: item.nama }),
              /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-500", children: [
                item.total_kegiatan,
                " kegiatan"
              ] })
            ] }) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700", children: item.bidang.kode }) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-sm text-gray-600", children: formatCurrency(item.pagu_anggaran) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "w-24", children: [
              /* @__PURE__ */ jsx("div", { className: "flex justify-between text-xs mb-1", children: /* @__PURE__ */ jsxs("span", { children: [
                item.persentase_realisasi,
                "%"
              ] }) }),
              /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-100 rounded-full h-1.5", children: /* @__PURE__ */ jsx(
                "div",
                {
                  className: "bg-green-500 h-1.5 rounded-full",
                  style: { width: `${Math.min(item.persentase_realisasi, 100)}%` }
                }
              ) })
            ] }) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`, children: item.status }) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-1", children: [
              /* @__PURE__ */ jsx(
                Link,
                {
                  href: `/program/${item.id}/edit`,
                  className: "p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg",
                  children: /* @__PURE__ */ jsx(Edit, { className: "w-4 h-4" })
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => handleDelete(item.id, item.nama),
                  className: "p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg",
                  children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
                }
              )
            ] }) })
          ] }, item.id)) })
        ] }) }),
        program.length === 0 && /* @__PURE__ */ jsxs("div", { className: "p-12 text-center", children: [
          /* @__PURE__ */ jsx(FolderKanban, { className: "w-12 h-12 text-gray-300 mx-auto mb-4" }),
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "Belum ada program" }),
          /* @__PURE__ */ jsxs("p", { className: "text-gray-500 mb-4", children: [
            "Belum ada program untuk tahun ",
            filters.tahun
          ] }),
          /* @__PURE__ */ jsxs(
            Link,
            {
              href: "/program/create",
              className: "inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700",
              children: [
                /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
                "Tambah Program"
              ]
            }
          )
        ] })
      ] })
    ] })
  ] });
}
export {
  ProgramIndex as default
};
