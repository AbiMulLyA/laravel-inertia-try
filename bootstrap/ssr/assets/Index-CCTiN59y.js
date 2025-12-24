import { jsxs, jsx } from "react/jsx-runtime";
import { A as AppLayout } from "./AppLayout-Bnl3kyBN.js";
import { Head, Link, router } from "@inertiajs/react";
import { Plus, Building2, FolderKanban, Users, TrendingUp, Edit, Trash2 } from "lucide-react";
import "react";
function BidangIndex({ bidang }) {
  const handleDelete = (id, nama) => {
    if (confirm(`Hapus bidang "${nama}"? Data ini tidak dapat dikembalikan.`)) {
      router.delete(`/bidang/${id}`);
    }
  };
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(value);
  };
  const totalAnggaran = bidang.reduce((sum, b) => sum + b.total_anggaran, 0);
  const totalRealisasi = bidang.reduce((sum, b) => sum + b.total_realisasi, 0);
  const totalProgram = bidang.reduce((sum, b) => sum + b.total_program, 0);
  const totalPelakuUsaha = bidang.reduce((sum, b) => sum + b.total_pelaku_usaha, 0);
  return /* @__PURE__ */ jsxs(AppLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Bidang" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Bidang" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: "Kelola bidang atau unit kerja di Dinas Pertanian" })
        ] }),
        /* @__PURE__ */ jsxs(
          Link,
          {
            href: "/bidang/create",
            className: "inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700",
            children: [
              /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
              "Tambah Bidang"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-white rounded-xl border p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx(Building2, { className: "w-5 h-5 text-blue-600" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-gray-900", children: bidang.length }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Total Bidang" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "bg-white rounded-xl border p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx(FolderKanban, { className: "w-5 h-5 text-green-600" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-gray-900", children: totalProgram }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Total Program" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "bg-white rounded-xl border p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx(Users, { className: "w-5 h-5 text-purple-600" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-gray-900", children: totalPelakuUsaha.toLocaleString() }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Pelaku Usaha" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "bg-white rounded-xl border p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx(TrendingUp, { className: "w-5 h-5 text-amber-600" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("p", { className: "text-lg font-bold text-gray-900", children: [
              totalAnggaran > 0 ? Math.round(totalRealisasi / totalAnggaran * 100) : 0,
              "%"
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Realisasi" })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: bidang.map((item) => /* @__PURE__ */ jsx("div", { className: "bg-white rounded-xl border overflow-hidden hover:shadow-md transition-shadow", children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-lg font-bold text-green-600", children: item.kode }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-900", children: item.nama }),
              item.kepala_bidang && /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: item.kepala_bidang })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(
              Link,
              {
                href: `/bidang/${item.id}/edit`,
                className: "p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors",
                children: /* @__PURE__ */ jsx(Edit, { className: "w-4 h-4" })
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleDelete(item.id, item.nama),
                className: "p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors",
                children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
              }
            )
          ] })
        ] }),
        item.deskripsi && /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-gray-600 line-clamp-2", children: item.deskripsi }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 grid grid-cols-3 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-center p-3 bg-gray-50 rounded-lg", children: [
            /* @__PURE__ */ jsx("p", { className: "text-lg font-semibold text-gray-900", children: item.total_program }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: "Program" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-center p-3 bg-gray-50 rounded-lg", children: [
            /* @__PURE__ */ jsx("p", { className: "text-lg font-semibold text-gray-900", children: item.total_pelaku_usaha.toLocaleString() }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: "Pelaku Usaha" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-center p-3 bg-gray-50 rounded-lg", children: [
            /* @__PURE__ */ jsxs("p", { className: "text-lg font-semibold text-gray-900", children: [
              item.total_anggaran > 0 ? Math.round(item.total_realisasi / item.total_anggaran * 100) : 0,
              "%"
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: "Realisasi" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 pt-4 border-t", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm mb-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-gray-500", children: "Total Anggaran" }),
            /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-900", children: formatCurrency(item.total_anggaran) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-100 rounded-full h-2", children: /* @__PURE__ */ jsx(
            "div",
            {
              className: "bg-green-500 h-2 rounded-full transition-all",
              style: {
                width: `${item.total_anggaran > 0 ? Math.min(item.total_realisasi / item.total_anggaran * 100, 100) : 0}%`
              }
            }
          ) })
        ] })
      ] }) }, item.id)) }),
      bidang.length === 0 && /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border p-12 text-center", children: [
        /* @__PURE__ */ jsx(Building2, { className: "w-12 h-12 text-gray-300 mx-auto mb-4" }),
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "Belum ada data bidang" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-500 mb-4", children: "Mulai dengan menambahkan bidang baru" }),
        /* @__PURE__ */ jsxs(
          Link,
          {
            href: "/bidang/create",
            className: "inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700",
            children: [
              /* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }),
              "Tambah Bidang"
            ]
          }
        )
      ] })
    ] })
  ] });
}
export {
  BidangIndex as default
};
