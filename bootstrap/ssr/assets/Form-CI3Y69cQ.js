import { jsxs, jsx } from "react/jsx-runtime";
import { A as AppLayout } from "./AppLayout-Bnl3kyBN.js";
import { useForm, Head, Link } from "@inertiajs/react";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import "react";
function ProgramForm({ program, bidang }) {
  const isEdit = !!program;
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  const { data, setData, post, put, processing, errors } = useForm({
    bidang_id: program?.bidang_id?.toString() ?? "",
    kode: program?.kode ?? "",
    nama: program?.nama ?? "",
    deskripsi: program?.deskripsi ?? "",
    tahun_anggaran: program?.tahun_anggaran?.toString() ?? currentYear.toString(),
    pagu_anggaran: program?.pagu_anggaran?.toString() ?? "",
    realisasi_anggaran: program?.realisasi_anggaran?.toString() ?? "0",
    status: program?.status ?? "draft",
    tanggal_mulai: program?.tanggal_mulai ?? "",
    tanggal_selesai: program?.tanggal_selesai ?? ""
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      put(`/program/${program.id}`);
    } else {
      post("/program");
    }
  };
  return /* @__PURE__ */ jsxs(AppLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: isEdit ? "Edit Program" : "Tambah Program" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-2xl mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsxs(
          Link,
          {
            href: "/program",
            className: "inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4",
            children: [
              /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4" }),
              "Kembali ke Daftar Program"
            ]
          }
        ),
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-900", children: isEdit ? "Edit Program" : "Tambah Program Baru" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: isEdit ? "Perbarui informasi program" : "Isi form untuk menambah program baru" })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "bg-white rounded-xl border p-6 space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: [
            "Bidang ",
            /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: data.bidang_id,
              onChange: (e) => setData("bidang_id", e.target.value),
              className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${errors.bidang_id ? "border-red-500" : "border-gray-300"}`,
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "Pilih Bidang" }),
                bidang.map((b) => /* @__PURE__ */ jsxs("option", { value: b.id, children: [
                  b.kode,
                  " - ",
                  b.nama
                ] }, b.id))
              ]
            }
          ),
          errors.bidang_id && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-500", children: errors.bidang_id })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: [
              "Kode Program ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: data.kode,
                onChange: (e) => setData("kode", e.target.value.toUpperCase()),
                className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${errors.kode ? "border-red-500" : "border-gray-300"}`,
                placeholder: "Contoh: PRG-001"
              }
            ),
            errors.kode && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-500", children: errors.kode })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: [
              "Tahun Anggaran ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              "select",
              {
                value: data.tahun_anggaran,
                onChange: (e) => setData("tahun_anggaran", e.target.value),
                className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500",
                children: Array.from({ length: 6 }, (_, i) => currentYear - 2 + i).map((year) => /* @__PURE__ */ jsx("option", { value: year, children: year }, year))
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: [
            "Nama Program ",
            /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: data.nama,
              onChange: (e) => setData("nama", e.target.value),
              className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${errors.nama ? "border-red-500" : "border-gray-300"}`,
              placeholder: "Nama program"
            }
          ),
          errors.nama && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-500", children: errors.nama })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Deskripsi" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              value: data.deskripsi,
              onChange: (e) => setData("deskripsi", e.target.value),
              rows: 3,
              className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500",
              placeholder: "Deskripsi program..."
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: [
              "Pagu Anggaran ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                value: data.pagu_anggaran,
                onChange: (e) => setData("pagu_anggaran", e.target.value),
                className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${errors.pagu_anggaran ? "border-red-500" : "border-gray-300"}`,
                placeholder: "0",
                min: "0"
              }
            ),
            errors.pagu_anggaran && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-500", children: errors.pagu_anggaran })
          ] }),
          isEdit && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Realisasi Anggaran" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                value: data.realisasi_anggaran,
                onChange: (e) => setData("realisasi_anggaran", e.target.value),
                className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500",
                placeholder: "0",
                min: "0"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: [
              "Status ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: data.status,
                onChange: (e) => setData("status", e.target.value),
                className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "draft", children: "Draft" }),
                  /* @__PURE__ */ jsx("option", { value: "aktif", children: "Aktif" }),
                  /* @__PURE__ */ jsx("option", { value: "selesai", children: "Selesai" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Tanggal Mulai" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "date",
                value: data.tanggal_mulai,
                onChange: (e) => setData("tanggal_mulai", e.target.value),
                className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Tanggal Selesai" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "date",
                value: data.tanggal_selesai,
                onChange: (e) => setData("tanggal_selesai", e.target.value),
                className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-3 pt-4 border-t", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              href: "/program",
              className: "px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50",
              children: "Batal"
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "submit",
              disabled: processing,
              className: "inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50",
              children: [
                processing ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "w-4 h-4" }),
                isEdit ? "Simpan Perubahan" : "Tambah Program"
              ]
            }
          )
        ] })
      ] })
    ] })
  ] });
}
export {
  ProgramForm as default
};
