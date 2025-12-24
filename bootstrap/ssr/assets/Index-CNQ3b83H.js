import { jsxs, jsx } from "react/jsx-runtime";
import { A as AppLayout } from "./AppLayout-Bnl3kyBN.js";
import { Head, Link, router } from "@inertiajs/react";
import { Plus, ClipboardList, Search, Filter, MapPin, Eye, Edit, Trash2 } from "lucide-react";
import "react";
function KegiatanIndex({
  kegiatan = { data: [], current_page: 1, last_page: 1, per_page: 20, total: 0, links: [] },
  program = [],
  kecamatanList = [],
  filters = { program_id: null, status: null, kecamatan: null, search: null },
  summary = { total: 0, berjalan: 0, selesai: 0, lainnya: 0 }
}) {
  const handleDelete = (id, nama) => {
    if (confirm(`Hapus kegiatan "${nama}"?`)) {
      router.delete(`/kegiatan/${id}`);
    }
  };
  const handleFilterChange = (key, value) => {
    router.get("/kegiatan", { ...filters, [key]: value }, { preserveState: true });
  };
  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    handleFilterChange("search", formData.get("search"));
  };
  const formatCurrency = (value) => {
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
      case "berjalan":
        return "bg-blue-100 text-blue-700";
      case "selesai":
        return "bg-green-100 text-green-700";
      case "draft":
        return "bg-gray-100 text-gray-700";
      case "dibatalkan":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  const getProgressColor = (progress) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-blue-500";
    if (progress >= 25) return "bg-yellow-500";
    return "bg-gray-400";
  };
  return /* @__PURE__ */ jsxs(AppLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Kegiatan" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Kegiatan" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: "Kelola kegiatan dan monitoring progress" })
        ] }),
        /* @__PURE__ */ jsxs(
          Link,
          {
            href: "/kegiatan/create",
            className: "inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700",
            children: [
              /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
              "Tambah Kegiatan"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-white rounded-xl border p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx(ClipboardList, { className: "w-5 h-5 text-purple-600" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-gray-900", children: summary.total }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Total Kegiatan" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "bg-white rounded-xl border p-4 cursor-pointer hover:bg-blue-50 transition-colors",
            onClick: () => handleFilterChange("status", "berjalan"),
            children: [
              /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-blue-600", children: summary.berjalan }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Berjalan" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "bg-white rounded-xl border p-4 cursor-pointer hover:bg-green-50 transition-colors",
            onClick: () => handleFilterChange("status", "selesai"),
            children: [
              /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-green-600", children: summary.selesai }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Selesai" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "bg-white rounded-xl border p-4 cursor-pointer hover:bg-gray-50 transition-colors",
            onClick: () => handleFilterChange("status", ""),
            children: [
              /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-gray-600", children: summary.lainnya }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Lainnya" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "bg-white rounded-xl border p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [
        /* @__PURE__ */ jsx("form", { onSubmit: handleSearch, className: "flex-1", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              name: "search",
              defaultValue: filters.search || "",
              placeholder: "Cari kegiatan...",
              className: "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Filter, { className: "w-4 h-4 text-gray-400" }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: filters.program_id || "",
              onChange: (e) => handleFilterChange("program_id", e.target.value),
              className: "px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm",
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "Semua Program" }),
                program.map((p) => /* @__PURE__ */ jsx("option", { value: p.id, children: p.nama }, p.id))
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: filters.status || "",
              onChange: (e) => handleFilterChange("status", e.target.value),
              className: "px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm",
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "Semua Status" }),
                /* @__PURE__ */ jsx("option", { value: "draft", children: "Draft" }),
                /* @__PURE__ */ jsx("option", { value: "berjalan", children: "Berjalan" }),
                /* @__PURE__ */ jsx("option", { value: "selesai", children: "Selesai" }),
                /* @__PURE__ */ jsx("option", { value: "dibatalkan", children: "Dibatalkan" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: filters.kecamatan || "",
              onChange: (e) => handleFilterChange("kecamatan", e.target.value),
              className: "px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm",
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "Semua Kecamatan" }),
                kecamatanList.map((k) => /* @__PURE__ */ jsx("option", { value: k, children: k }, k))
              ]
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-gray-50", children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Kegiatan" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Program" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Lokasi" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Target" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Progress" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Status" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase", children: "Aksi" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-200", children: kegiatan.data.map((item) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50", children: [
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-900", children: item.nama }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: item.kode })
            ] }) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700", children: item.program?.bidang?.kode || "-" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-1", children: item.program?.nama || "-" })
            ] }) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-1", children: [
              /* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4 text-gray-400 mt-0.5" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-900", children: item.kecamatan || "-" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: item.desa })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxs("td", { className: "px-6 py-4", children: [
              /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-900", children: [
                item.realisasi,
                "/",
                item.target,
                " ",
                item.satuan
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: formatCurrency(item.anggaran) })
            ] }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "w-24", children: [
              /* @__PURE__ */ jsx("div", { className: "flex justify-between text-xs mb-1", children: /* @__PURE__ */ jsxs("span", { children: [
                item.progress,
                "%"
              ] }) }),
              /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-100 rounded-full h-2", children: /* @__PURE__ */ jsx(
                "div",
                {
                  className: `h-2 rounded-full ${getProgressColor(item.progress)}`,
                  style: { width: `${item.progress}%` }
                }
              ) })
            ] }) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`, children: item.status }) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-1", children: [
              /* @__PURE__ */ jsx(
                Link,
                {
                  href: `/kegiatan/${item.id}`,
                  className: "p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg",
                  children: /* @__PURE__ */ jsx(Eye, { className: "w-4 h-4" })
                }
              ),
              /* @__PURE__ */ jsx(
                Link,
                {
                  href: `/kegiatan/${item.id}/edit`,
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
        kegiatan.data.length === 0 && /* @__PURE__ */ jsxs("div", { className: "p-12 text-center", children: [
          /* @__PURE__ */ jsx(ClipboardList, { className: "w-12 h-12 text-gray-300 mx-auto mb-4" }),
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "Belum ada kegiatan" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-500 mb-4", children: "Mulai dengan menambahkan kegiatan baru" }),
          /* @__PURE__ */ jsxs(
            Link,
            {
              href: "/kegiatan/create",
              className: "inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700",
              children: [
                /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
                "Tambah Kegiatan"
              ]
            }
          )
        ] }),
        kegiatan.last_page > 1 && /* @__PURE__ */ jsxs("div", { className: "px-6 py-4 border-t flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500", children: [
            "Menampilkan ",
            (kegiatan.current_page - 1) * kegiatan.per_page + 1,
            " - ",
            Math.min(kegiatan.current_page * kegiatan.per_page, kegiatan.total),
            " dari ",
            kegiatan.total,
            " data"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1", children: kegiatan.links.map((link, index) => /* @__PURE__ */ jsx(
            Link,
            {
              href: link.url || "#",
              className: `px-3 py-1 rounded text-sm ${link.active ? "bg-green-600 text-white" : link.url ? "text-gray-600 hover:bg-gray-100" : "text-gray-400 cursor-not-allowed"}`,
              dangerouslySetInnerHTML: { __html: link.label }
            },
            index
          )) })
        ] })
      ] })
    ] })
  ] });
}
export {
  KegiatanIndex as default
};
