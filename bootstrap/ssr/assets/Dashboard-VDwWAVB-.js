import { jsxs, jsx } from "react/jsx-runtime";
import { A as AppLayout } from "./AppLayout-Bnl3kyBN.js";
import { Head, router } from "@inertiajs/react";
import { Building2, FolderKanban, ClipboardList, Users, ArrowUpRight, ArrowDownRight } from "lucide-react";
import "react";
function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}
function formatNumber(value) {
  return new Intl.NumberFormat("id-ID").format(value);
}
function Dashboard({
  overview,
  statistikBidang,
  distribusiPelakuUsaha,
  recentActivities,
  tahun,
  tahunOptions
}) {
  const persentaseRealisasi = overview.total_anggaran > 0 ? (overview.total_realisasi / overview.total_anggaran * 100).toFixed(1) : 0;
  return /* @__PURE__ */ jsxs(AppLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Dashboard" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Dashboard" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: "Overview data Dinas Pertanian" })
        ] }),
        /* @__PURE__ */ jsx(
          "select",
          {
            value: tahun,
            onChange: (e) => router.get("/dashboard", { tahun: e.target.value }),
            className: "px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500",
            children: tahunOptions.map((t) => /* @__PURE__ */ jsxs("option", { value: t, children: [
              "Tahun ",
              t
            ] }, t))
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: [
        /* @__PURE__ */ jsx(
          StatCard,
          {
            title: "Total Bidang",
            value: overview.total_bidang,
            icon: Building2,
            color: "blue"
          }
        ),
        /* @__PURE__ */ jsx(
          StatCard,
          {
            title: "Total Program",
            value: overview.total_program,
            icon: FolderKanban,
            color: "green"
          }
        ),
        /* @__PURE__ */ jsx(
          StatCard,
          {
            title: "Total Kegiatan",
            value: overview.total_kegiatan,
            icon: ClipboardList,
            color: "purple"
          }
        ),
        /* @__PURE__ */ jsx(
          StatCard,
          {
            title: "Pelaku Usaha",
            value: formatNumber(overview.total_pelaku_usaha),
            icon: Users,
            color: "orange"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 bg-white rounded-xl border p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Realisasi Anggaran" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Pagu Anggaran" }),
              /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-gray-900", children: formatCurrency(overview.total_anggaran) })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Realisasi" }),
              /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-green-600", children: formatCurrency(overview.total_realisasi) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-500", children: "Progress" }),
              /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium", children: [
                persentaseRealisasi,
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "h-3 bg-gray-200 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
              "div",
              {
                className: "h-full bg-green-500 rounded-full transition-all duration-500",
                style: { width: `${Math.min(Number(persentaseRealisasi), 100)}%` }
              }
            ) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Status Kegiatan" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("div", { className: "w-3 h-3 bg-blue-500 rounded-full" }),
                /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600", children: "Berjalan" })
              ] }),
              /* @__PURE__ */ jsx("span", { className: "font-semibold", children: overview.kegiatan_berjalan })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("div", { className: "w-3 h-3 bg-green-500 rounded-full" }),
                /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600", children: "Selesai" })
              ] }),
              /* @__PURE__ */ jsx("span", { className: "font-semibold", children: overview.kegiatan_selesai })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("div", { className: "w-3 h-3 bg-gray-300 rounded-full" }),
                /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600", children: "Lainnya" })
              ] }),
              /* @__PURE__ */ jsx("span", { className: "font-semibold", children: overview.total_kegiatan - overview.kegiatan_berjalan - overview.kegiatan_selesai })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "p-6 border-b", children: /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-gray-900", children: "Statistik per Bidang" }) }),
        /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full", children: [
          /* @__PURE__ */ jsx("thead", { className: "bg-gray-50", children: /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Bidang" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase", children: "Program" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase", children: "Pelaku Usaha" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase", children: "Anggaran" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase", children: "Realisasi" }),
            /* @__PURE__ */ jsx("th", { className: "px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase", children: "Progress" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-gray-200", children: statistikBidang.map((bidang) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-gray-50", children: [
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-green-600", children: bidang.kode }) }),
              /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-900", children: bidang.nama })
            ] }) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right text-gray-600", children: bidang.total_program }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right text-gray-600", children: formatNumber(bidang.total_pelaku_usaha) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right text-gray-600", children: formatCurrency(bidang.total_anggaran) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right text-gray-600", children: formatCurrency(bidang.total_realisasi) }),
            /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2", children: [
              /* @__PURE__ */ jsx("div", { className: "w-16 h-2 bg-gray-200 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
                "div",
                {
                  className: "h-full bg-green-500 rounded-full",
                  style: { width: `${bidang.persentase_realisasi}%` }
                }
              ) }),
              /* @__PURE__ */ jsxs("span", { className: "text-sm text-gray-600 w-12 text-right", children: [
                bidang.persentase_realisasi,
                "%"
              ] })
            ] }) })
          ] }, bidang.id)) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Distribusi Pelaku Usaha per Jenis" }),
          /* @__PURE__ */ jsx("div", { className: "space-y-3", children: distribusiPelakuUsaha.slice(0, 6).map((item, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600", children: item.jenis_usaha_label }),
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-gray-900", children: formatNumber(item.total) })
          ] }, index)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Aktivitas Terbaru" }),
          /* @__PURE__ */ jsx("div", { className: "space-y-3", children: recentActivities.slice(0, 5).map((activity) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50", children: [
            /* @__PURE__ */ jsx("div", { className: `
                                        w-2 h-2 rounded-full
                                        ${activity.status === "selesai" ? "bg-green-500" : ""}
                                        ${activity.status === "berjalan" ? "bg-blue-500" : ""}
                                        ${activity.status === "belum_mulai" ? "bg-gray-400" : ""}
                                        ${activity.status === "tertunda" ? "bg-yellow-500" : ""}
                                    ` }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-900 truncate", children: activity.nama }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: activity.program?.bidang?.nama })
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "text-sm text-gray-500", children: [
              activity.progress,
              "%"
            ] })
          ] }, activity.id)) })
        ] })
      ] })
    ] })
  ] });
}
function StatCard({ title, value, icon: Icon, color, trend }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600"
  };
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border p-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("div", { className: `w-12 h-12 rounded-lg flex items-center justify-center ${colors[color]}`, children: /* @__PURE__ */ jsx(Icon, { className: "w-6 h-6" }) }),
      trend !== void 0 && /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-1 text-sm ${trend >= 0 ? "text-green-600" : "text-red-600"}`, children: [
        trend >= 0 ? /* @__PURE__ */ jsx(ArrowUpRight, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(ArrowDownRight, { className: "w-4 h-4" }),
        Math.abs(trend),
        "%"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
      /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-gray-900", children: value }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-1", children: title })
    ] })
  ] });
}
export {
  Dashboard as default
};
