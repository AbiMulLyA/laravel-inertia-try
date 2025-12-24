import { jsxs, jsx } from "react/jsx-runtime";
import { A as AppLayout } from "./AppLayout-Bnl3kyBN.js";
import { useForm, Head, Link } from "@inertiajs/react";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import "react";
function KegiatanForm({ kegiatan, program }) {
  const isEdit = !!kegiatan;
  const { data, setData, post, put, processing, errors } = useForm({
    program_id: kegiatan?.program_id?.toString() ?? "",
    kode: kegiatan?.kode ?? "",
    nama: kegiatan?.nama ?? "",
    deskripsi: kegiatan?.deskripsi ?? "",
    lokasi: kegiatan?.lokasi ?? "",
    kecamatan: kegiatan?.kecamatan ?? "",
    desa: kegiatan?.desa ?? "",
    target: kegiatan?.target?.toString() ?? "",
    realisasi: kegiatan?.realisasi?.toString() ?? "0",
    satuan: kegiatan?.satuan ?? "",
    anggaran: kegiatan?.anggaran?.toString() ?? "",
    realisasi_anggaran: kegiatan?.realisasi_anggaran?.toString() ?? "0",
    status: kegiatan?.status ?? "draft",
    progress: kegiatan?.progress?.toString() ?? "0",
    tanggal_mulai: kegiatan?.tanggal_mulai ?? "",
    tanggal_selesai: kegiatan?.tanggal_selesai ?? "",
    catatan: kegiatan?.catatan ?? ""
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      put(`/kegiatan/${kegiatan.id}`);
    } else {
      post("/kegiatan");
    }
  };
  return /* @__PURE__ */ jsxs(AppLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: isEdit ? "Edit Kegiatan" : "Tambah Kegiatan" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsxs(
          Link,
          {
            href: "/kegiatan",
            className: "inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4",
            children: [
              /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4" }),
              "Kembali ke Daftar Kegiatan"
            ]
          }
        ),
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-900", children: isEdit ? "Edit Kegiatan" : "Tambah Kegiatan Baru" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: isEdit ? "Perbarui informasi kegiatan" : "Isi form untuk menambah kegiatan baru" })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "bg-white rounded-xl border p-6 space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: [
            "Program ",
            /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              value: data.program_id,
              onChange: (e) => setData("program_id", e.target.value),
              className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${errors.program_id ? "border-red-500" : "border-gray-300"}`,
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "Pilih Program" }),
                program.map((p) => /* @__PURE__ */ jsxs("option", { value: p.id, children: [
                  "[",
                  p.bidang.kode,
                  "] ",
                  p.nama
                ] }, p.id))
              ]
            }
          ),
          errors.program_id && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-500", children: errors.program_id })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: [
              "Kode Kegiatan ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: data.kode,
                onChange: (e) => setData("kode", e.target.value.toUpperCase()),
                className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${errors.kode ? "border-red-500" : "border-gray-300"}`,
                placeholder: "Contoh: KGT-001"
              }
            ),
            errors.kode && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-500", children: errors.kode })
          ] }),
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
                  /* @__PURE__ */ jsx("option", { value: "berjalan", children: "Berjalan" }),
                  /* @__PURE__ */ jsx("option", { value: "selesai", children: "Selesai" }),
                  /* @__PURE__ */ jsx("option", { value: "dibatalkan", children: "Dibatalkan" })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: [
            "Nama Kegiatan ",
            /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: data.nama,
              onChange: (e) => setData("nama", e.target.value),
              className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${errors.nama ? "border-red-500" : "border-gray-300"}`,
              placeholder: "Nama kegiatan"
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
              placeholder: "Deskripsi kegiatan..."
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "border-t pt-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-gray-900 mb-4", children: "Lokasi" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Kecamatan" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: data.kecamatan,
                  onChange: (e) => setData("kecamatan", e.target.value),
                  className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500",
                  placeholder: "Nama kecamatan"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Desa" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: data.desa,
                  onChange: (e) => setData("desa", e.target.value),
                  className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500",
                  placeholder: "Nama desa"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Detail Lokasi" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: data.lokasi,
                  onChange: (e) => setData("lokasi", e.target.value),
                  className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500",
                  placeholder: "Detail lokasi"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "border-t pt-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-gray-900 mb-4", children: "Target & Anggaran" }),
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
                  className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${errors.target ? "border-red-500" : "border-gray-300"}`,
                  placeholder: "0",
                  min: "0",
                  step: "0.01"
                }
              ),
              errors.target && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-500", children: errors.target })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: [
                "Satuan ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: data.satuan,
                  onChange: (e) => setData("satuan", e.target.value),
                  className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${errors.satuan ? "border-red-500" : "border-gray-300"}`,
                  placeholder: "contoh: Ha, Ekor, Orang"
                }
              ),
              errors.satuan && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-500", children: errors.satuan })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: [
                "Anggaran ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  value: data.anggaran,
                  onChange: (e) => setData("anggaran", e.target.value),
                  className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${errors.anggaran ? "border-red-500" : "border-gray-300"}`,
                  placeholder: "0",
                  min: "0"
                }
              ),
              errors.anggaran && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-500", children: errors.anggaran })
            ] })
          ] }),
          isEdit && /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Realisasi" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  value: data.realisasi,
                  onChange: (e) => setData("realisasi", e.target.value),
                  className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500",
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
                  className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500",
                  placeholder: "0",
                  min: "0",
                  max: "100"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
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
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "border-t pt-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-gray-900 mb-4", children: "Timeline" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
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
          ] })
        ] }),
        isEdit && /* @__PURE__ */ jsxs("div", { className: "border-t pt-6", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Catatan" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              value: data.catatan,
              onChange: (e) => setData("catatan", e.target.value),
              rows: 3,
              className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500",
              placeholder: "Catatan tambahan..."
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-3 pt-4 border-t", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              href: "/kegiatan",
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
                isEdit ? "Simpan Perubahan" : "Tambah Kegiatan"
              ]
            }
          )
        ] })
      ] })
    ] })
  ] });
}
export {
  KegiatanForm as default
};
