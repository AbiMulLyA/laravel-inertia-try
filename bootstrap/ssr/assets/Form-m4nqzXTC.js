import { jsxs, jsx } from "react/jsx-runtime";
import { A as AppLayout } from "./AppLayout-Bnl3kyBN.js";
import { useForm, Head, Link } from "@inertiajs/react";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import "react";
function BidangForm({ bidang }) {
  const isEdit = !!bidang;
  const { data, setData, post, put, processing, errors } = useForm({
    kode: bidang?.kode ?? "",
    nama: bidang?.nama ?? "",
    deskripsi: bidang?.deskripsi ?? "",
    kepala_bidang: bidang?.kepala_bidang ?? "",
    nip_kepala: bidang?.nip_kepala ?? "",
    is_active: bidang?.is_active ?? true
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      put(`/bidang/${bidang.id}`);
    } else {
      post("/bidang");
    }
  };
  return /* @__PURE__ */ jsxs(AppLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: isEdit ? "Edit Bidang" : "Tambah Bidang" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-2xl mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsxs(
          Link,
          {
            href: "/bidang",
            className: "inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4",
            children: [
              /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4" }),
              "Kembali ke Daftar Bidang"
            ]
          }
        ),
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-900", children: isEdit ? "Edit Bidang" : "Tambah Bidang Baru" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: isEdit ? "Perbarui informasi bidang" : "Isi form untuk menambah bidang baru" })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "bg-white rounded-xl border p-6 space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: [
              "Kode ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: data.kode,
                onChange: (e) => setData("kode", e.target.value.toUpperCase()),
                className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${errors.kode ? "border-red-500" : "border-gray-300"}`,
                placeholder: "Contoh: TPH",
                maxLength: 10
              }
            ),
            errors.kode && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-500", children: errors.kode })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: [
              "Nama Bidang ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: data.nama,
                onChange: (e) => setData("nama", e.target.value),
                className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${errors.nama ? "border-red-500" : "border-gray-300"}`,
                placeholder: "Contoh: Tanaman Pangan dan Hortikultura"
              }
            ),
            errors.nama && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-500", children: errors.nama })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Deskripsi" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              value: data.deskripsi,
              onChange: (e) => setData("deskripsi", e.target.value),
              rows: 3,
              className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500",
              placeholder: "Deskripsi singkat tentang bidang ini..."
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Kepala Bidang" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: data.kepala_bidang,
                onChange: (e) => setData("kepala_bidang", e.target.value),
                className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500",
                placeholder: "Nama kepala bidang"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "NIP" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: data.nip_kepala,
                onChange: (e) => setData("nip_kepala", e.target.value),
                className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500",
                placeholder: "NIP kepala bidang"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              id: "is_active",
              checked: data.is_active,
              onChange: (e) => setData("is_active", e.target.checked),
              className: "rounded border-gray-300 text-green-600 focus:ring-green-500"
            }
          ),
          /* @__PURE__ */ jsx("label", { htmlFor: "is_active", className: "text-sm text-gray-700", children: "Bidang aktif" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-3 pt-4 border-t", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              href: "/bidang",
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
                isEdit ? "Simpan Perubahan" : "Tambah Bidang"
              ]
            }
          )
        ] })
      ] })
    ] })
  ] });
}
export {
  BidangForm as default
};
