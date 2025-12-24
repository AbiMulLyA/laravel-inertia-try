import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { A as AppLayout } from "./AppLayout-Bnl3kyBN.js";
import { router, Head, Link } from "@inertiajs/react";
import { useState, useMemo } from "react";
import { Upload, Download, Plus, Search, List, LayoutGrid, Filter, ChevronDown, ChevronRight, MoreVertical, Eye, Edit, Trash2 } from "lucide-react";
import debounce from "lodash/debounce.js";
const defaultPaginatedData = {
  data: [],
  current_page: 1,
  last_page: 1,
  per_page: 50,
  total: 0,
  links: []
};
const defaultFilterOptions = {
  bidang: [],
  kecamatan: [],
  jenis_usaha: [],
  kelompok_tani: []
};
function PelakuUsahaIndex({
  data = defaultPaginatedData,
  filters = {},
  filterOptions = defaultFilterOptions,
  viewMode: initialViewMode = "table",
  statistik = []
}) {
  const [viewMode, setViewMode] = useState(initialViewMode || "table");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [expandedBidang, setExpandedBidang] = useState([]);
  const [searchTerm, setSearchTerm] = useState(filters?.search || "");
  const safeData = data || defaultPaginatedData;
  const safeFilterOptions = filterOptions || defaultFilterOptions;
  const safeStatistik = statistik || [];
  const isGrouped = viewMode === "grouped";
  const isPaginated = !isGrouped && safeData && "data" in safeData;
  const debouncedSearch = useMemo(
    () => debounce((value) => {
      router.get("/pelaku-usaha", { ...filters, search: value }, { preserveState: true });
    }, 300),
    [filters]
  );
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    debouncedSearch(e.target.value);
  };
  const handleFilterChange = (key, value) => {
    router.get("/pelaku-usaha", { ...filters, [key]: value }, { preserveState: true });
  };
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    router.get("/pelaku-usaha", { ...filters, view_mode: mode }, { preserveState: true });
  };
  const toggleBidang = (bidangId) => {
    setExpandedBidang(
      (prev) => prev.includes(bidangId) ? prev.filter((id) => id !== bidangId) : [...prev, bidangId]
    );
  };
  const toggleSelectAll = () => {
    if (isPaginated) {
      const allIds = data.data.map((item) => item.id);
      setSelectedIds(selectedIds.length === allIds.length ? [] : allIds);
    }
  };
  const toggleSelect = (id) => {
    setSelectedIds(
      (prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };
  const handleBulkDelete = () => {
    if (confirm(`Hapus ${selectedIds.length} data?`)) {
      router.delete("/pelaku-usaha/bulk-destroy", {
        data: { ids: selectedIds },
        onSuccess: () => setSelectedIds([])
      });
    }
  };
  const handleExport = () => {
    const params = new URLSearchParams(filters);
    window.location.href = `/pelaku-usaha/export?${params.toString()}`;
  };
  const clearFilters = () => {
    router.get("/pelaku-usaha");
    setSearchTerm("");
  };
  const hasActiveFilters = Object.values(filters).some((v) => v);
  return /* @__PURE__ */ jsxs(AppLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Pelaku Usaha" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Pelaku Usaha" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: "Kelola data petani, peternak, dan pelaku usaha pertanian" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxs(
            Link,
            {
              href: "/pelaku-usaha/import",
              className: "inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50",
              children: [
                /* @__PURE__ */ jsx(Upload, { className: "w-4 h-4" }),
                "Import"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: handleExport,
              className: "inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50",
              children: [
                /* @__PURE__ */ jsx(Download, { className: "w-4 h-4" }),
                "Export"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            Link,
            {
              href: "/pelaku-usaha/create",
              className: "inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700",
              children: [
                /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
                "Tambah Data"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-4", children: safeStatistik.map((stat) => /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border p-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
          /* @__PURE__ */ jsx("div", { className: "w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-green-600", children: stat.kode }) }),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-700 truncate", children: stat.nama })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-gray-900", children: stat.total_aktif.toLocaleString() }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: "pelaku usaha aktif" })
      ] }, stat.id)) }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border p-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
            /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: searchTerm,
                onChange: handleSearchChange,
                placeholder: "Cari nama, NIK, atau kelompok tani...",
                className: "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center border border-gray-300 rounded-lg overflow-hidden", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleViewModeChange("table"),
                className: `p-2 ${viewMode === "table" ? "bg-green-50 text-green-600" : "text-gray-500 hover:bg-gray-50"}`,
                children: /* @__PURE__ */ jsx(List, { className: "w-5 h-5" })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleViewModeChange("grouped"),
                className: `p-2 ${viewMode === "grouped" ? "bg-green-50 text-green-600" : "text-gray-500 hover:bg-gray-50"}`,
                children: /* @__PURE__ */ jsx(LayoutGrid, { className: "w-5 h-5" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setShowFilters(!showFilters),
              className: `inline-flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium ${hasActiveFilters ? "border-green-500 text-green-600 bg-green-50" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`,
              children: [
                /* @__PURE__ */ jsx(Filter, { className: "w-4 h-4" }),
                "Filter",
                hasActiveFilters && /* @__PURE__ */ jsx("span", { className: "w-5 h-5 bg-green-600 text-white rounded-full text-xs flex items-center justify-center", children: Object.values(filters).filter(Boolean).length })
              ]
            }
          )
        ] }),
        showFilters && /* @__PURE__ */ jsxs("div", { className: "mt-4 pt-4 border-t grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Bidang" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: filters.bidang_id || "",
                onChange: (e) => handleFilterChange("bidang_id", e.target.value),
                className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: "Semua Bidang" }),
                  safeFilterOptions.bidang.map((b) => /* @__PURE__ */ jsx("option", { value: b.id, children: b.nama }, b.id))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Jenis Usaha" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: filters.jenis_usaha || "",
                onChange: (e) => handleFilterChange("jenis_usaha", e.target.value),
                className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: "Semua Jenis" }),
                  safeFilterOptions.jenis_usaha.map((j) => /* @__PURE__ */ jsx("option", { value: j.value, children: j.label }, j.value))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Kecamatan" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: filters.kecamatan || "",
                onChange: (e) => handleFilterChange("kecamatan", e.target.value),
                className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: "Semua Kecamatan" }),
                  safeFilterOptions.kecamatan.map((k) => /* @__PURE__ */ jsx("option", { value: k, children: k }, k))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex items-end", children: /* @__PURE__ */ jsx(
            "button",
            {
              onClick: clearFilters,
              className: "w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50",
              children: "Reset Filter"
            }
          ) })
        ] })
      ] }),
      selectedIds.length > 0 && /* @__PURE__ */ jsxs("div", { className: "bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("span", { className: "text-sm text-green-700", children: [
          selectedIds.length,
          " data dipilih"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setSelectedIds([]),
              className: "px-3 py-1 text-sm text-gray-600 hover:text-gray-800",
              children: "Batal"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleBulkDelete,
              className: "px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700",
              children: "Hapus"
            }
          )
        ] })
      ] }),
      isGrouped ? /* @__PURE__ */ jsx(
        GroupedView,
        {
          data: safeData || [],
          expandedBidang,
          toggleBidang
        }
      ) : /* @__PURE__ */ jsx(
        TableView,
        {
          data: safeData || defaultPaginatedData,
          selectedIds,
          toggleSelect,
          toggleSelectAll
        }
      )
    ] })
  ] });
}
function GroupedView({ data, expandedBidang, toggleBidang }) {
  return /* @__PURE__ */ jsx("div", { className: "space-y-4", children: data.map((bidang) => /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border overflow-hidden", children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => toggleBidang(bidang.id),
        className: "w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "font-bold text-green-600", children: bidang.kode }) }),
            /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-900", children: bidang.nama }),
              /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500", children: [
                bidang.total,
                " pelaku usaha"
              ] })
            ] })
          ] }),
          expandedBidang.includes(bidang.id) ? /* @__PURE__ */ jsx(ChevronDown, { className: "w-5 h-5 text-gray-400" }) : /* @__PURE__ */ jsx(ChevronRight, { className: "w-5 h-5 text-gray-400" })
        ]
      }
    ),
    expandedBidang.includes(bidang.id) && /* @__PURE__ */ jsx("div", { className: "border-t", children: /* @__PURE__ */ jsxs("table", { className: "w-full", children: [
      /* @__PURE__ */ jsx("thead", { className: "bg-gray-50", children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "NIK" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Nama" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Kecamatan" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Jenis Usaha" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Kelompok" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase", children: "Aksi" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-200", children: bidang.pelaku_usaha.map((pelaku) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50", children: [
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-sm text-gray-600", children: pelaku.nik }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-sm font-medium text-gray-900", children: pelaku.nama }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-sm text-gray-600", children: pelaku.kecamatan }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-sm text-gray-600", children: pelaku.jenis_usaha }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-sm text-gray-600", children: pelaku.kelompok_tani || "-" }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsx(ActionMenu, { pelakuId: pelaku.id }) })
      ] }, pelaku.id)) })
    ] }) })
  ] }, bidang.id)) });
}
function TableView({ data, selectedIds, toggleSelect, toggleSelectAll }) {
  const allSelected = data.data.length > 0 && selectedIds.length === data.data.length;
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full", children: [
      /* @__PURE__ */ jsx("thead", { className: "bg-gray-50", children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3 w-10", children: /* @__PURE__ */ jsx(
          "input",
          {
            type: "checkbox",
            checked: allSelected,
            onChange: toggleSelectAll,
            className: "rounded border-gray-300 text-green-600 focus:ring-green-500"
          }
        ) }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "NIK" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Nama" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Bidang" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Kecamatan" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Jenis Usaha" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Status" }),
        /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase", children: "Aksi" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-200", children: data.data.map((pelaku) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50", children: [
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx(
          "input",
          {
            type: "checkbox",
            checked: selectedIds.includes(pelaku.id),
            onChange: () => toggleSelect(pelaku.id),
            className: "rounded border-gray-300 text-green-600 focus:ring-green-500"
          }
        ) }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-sm text-gray-600 font-mono", children: pelaku.nik }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-sm font-medium text-gray-900", children: pelaku.nama }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700", children: pelaku.bidang?.kode }) }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-sm text-gray-600", children: pelaku.kecamatan }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-sm text-gray-600", children: pelaku.jenis_usaha }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { className: `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${pelaku.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`, children: pelaku.is_active ? "Aktif" : "Nonaktif" }) }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsx(ActionMenu, { pelakuId: pelaku.id }) })
      ] }, pelaku.id)) })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "px-6 py-4 border-t flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500", children: [
        "Menampilkan ",
        (data.current_page - 1) * data.per_page + 1,
        " - ",
        Math.min(data.current_page * data.per_page, data.total),
        " dari ",
        data.total,
        " data"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1", children: data.links.map((link, index) => /* @__PURE__ */ jsx(
        Link,
        {
          href: link.url || "#",
          className: `px-3 py-1 rounded text-sm ${link.active ? "bg-green-600 text-white" : link.url ? "text-gray-600 hover:bg-gray-100" : "text-gray-400 cursor-not-allowed"}`,
          dangerouslySetInnerHTML: { __html: link.label }
        },
        index
      )) })
    ] })
  ] });
}
function ActionMenu({ pelakuId }) {
  const [open, setOpen] = useState(false);
  return /* @__PURE__ */ jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => setOpen(!open),
        className: "p-1 text-gray-500 hover:text-gray-700 rounded",
        children: /* @__PURE__ */ jsx(MoreVertical, { className: "w-5 h-5" })
      }
    ),
    open && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-10", onClick: () => setOpen(false) }),
      /* @__PURE__ */ jsxs("div", { className: "absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border py-1 z-20", children: [
        /* @__PURE__ */ jsxs(
          Link,
          {
            href: `/pelaku-usaha/${pelakuId}`,
            className: "flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100",
            children: [
              /* @__PURE__ */ jsx(Eye, { className: "w-4 h-4" }),
              "Lihat Detail"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Link,
          {
            href: `/pelaku-usaha/${pelakuId}/edit`,
            className: "flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100",
            children: [
              /* @__PURE__ */ jsx(Edit, { className: "w-4 h-4" }),
              "Edit"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Link,
          {
            href: `/pelaku-usaha/${pelakuId}`,
            method: "delete",
            as: "button",
            className: "flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50",
            onClick: (e) => {
              if (!confirm("Hapus data ini?")) {
                e.preventDefault();
              }
            },
            children: [
              /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" }),
              "Hapus"
            ]
          }
        )
      ] })
    ] })
  ] });
}
export {
  PelakuUsahaIndex as default
};
