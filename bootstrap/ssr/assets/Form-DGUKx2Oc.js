import { jsxs, jsx } from "react/jsx-runtime";
import { A as AppLayout } from "./AppLayout-Bnl3kyBN.js";
import { useForm, Head, Link } from "@inertiajs/react";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import "react";
function PelakuUsahaForm({ pelakuUsaha, filterOptions, jenisUsaha }) {
  const isEdit = !!pelakuUsaha?.id;
  const { data, setData, post, put, processing, errors } = useForm({
    bidang_id: pelakuUsaha?.bidang_id || "",
    nik: pelakuUsaha?.nik || "",
    nama: pelakuUsaha?.nama || "",
    jenis_kelamin: pelakuUsaha?.jenis_kelamin || "L",
    alamat: pelakuUsaha?.alamat || "",
    kecamatan: pelakuUsaha?.kecamatan || "",
    desa: pelakuUsaha?.desa || "",
    rt: pelakuUsaha?.rt || "",
    rw: pelakuUsaha?.rw || "",
    no_hp: pelakuUsaha?.no_hp || "",
    email: pelakuUsaha?.email || "",
    jenis_usaha: pelakuUsaha?.jenis_usaha || "",
    luas_lahan: pelakuUsaha?.luas_lahan || "",
    jumlah_ternak: pelakuUsaha?.jumlah_ternak || "",
    komoditas: pelakuUsaha?.komoditas || [],
    kelompok_tani: pelakuUsaha?.kelompok_tani || ""
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      put(`/pelaku-usaha/${pelakuUsaha.id}`);
    } else {
      post("/pelaku-usaha");
    }
  };
  const isPetani = ["petani_padi", "petani_palawija", "petani_hortikultura"].includes(data.jenis_usaha);
  const isPeternak = ["peternak_sapi", "peternak_kambing", "peternak_ayam", "peternak_ikan"].includes(data.jenis_usaha);
  return /* @__PURE__ */ jsxs(AppLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: isEdit ? "Edit Pelaku Usaha" : "Tambah Pelaku Usaha" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-6", children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            href: "/pelaku-usaha",
            className: "p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg",
            children: /* @__PURE__ */ jsx(ArrowLeft, { className: "w-5 h-5" })
          }
        ),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-900", children: isEdit ? "Edit Pelaku Usaha" : "Tambah Pelaku Usaha" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: isEdit ? "Perbarui data pelaku usaha" : "Tambahkan data pelaku usaha baru" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Data Diri" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "md:col-span-2", children: [
              /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: [
                "Bidang ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: data.bidang_id,
                  onChange: (e) => setData("bidang_id", e.target.value),
                  className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${errors.bidang_id ? "border-red-500" : "border-gray-300"}`,
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: "Pilih Bidang" }),
                    filterOptions.bidang.map((b) => /* @__PURE__ */ jsx("option", { value: b.id, children: b.nama }, b.id))
                  ]
                }
              ),
              errors.bidang_id && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.bidang_id })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: [
                "NIK ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: data.nik,
                  onChange: (e) => setData("nik", e.target.value.replace(/\D/g, "").slice(0, 16)),
                  placeholder: "16 digit NIK",
                  maxLength: 16,
                  className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${errors.nik ? "border-red-500" : "border-gray-300"}`
                }
              ),
              errors.nik && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.nik })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: [
                "Nama Lengkap ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: data.nama,
                  onChange: (e) => setData("nama", e.target.value),
                  className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${errors.nama ? "border-red-500" : "border-gray-300"}`
                }
              ),
              errors.nama && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.nama })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: [
                "Jenis Kelamin ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-4 mt-2", children: [
                /* @__PURE__ */ jsxs("label", { className: "flex items-center", children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "radio",
                      value: "L",
                      checked: data.jenis_kelamin === "L",
                      onChange: (e) => setData("jenis_kelamin", e.target.value),
                      className: "text-green-600 focus:ring-green-500"
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { className: "ml-2", children: "Laki-laki" })
                ] }),
                /* @__PURE__ */ jsxs("label", { className: "flex items-center", children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "radio",
                      value: "P",
                      checked: data.jenis_kelamin === "P",
                      onChange: (e) => setData("jenis_kelamin", e.target.value),
                      className: "text-green-600 focus:ring-green-500"
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { className: "ml-2", children: "Perempuan" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "No. HP" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: data.no_hp,
                  onChange: (e) => setData("no_hp", e.target.value.replace(/\D/g, "").slice(0, 15)),
                  placeholder: "08xxxxxxxxxx",
                  className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Email" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "email",
                  value: data.email,
                  onChange: (e) => setData("email", e.target.value),
                  className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Alamat" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "md:col-span-2", children: [
              /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: [
                "Alamat Lengkap ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  value: data.alamat,
                  onChange: (e) => setData("alamat", e.target.value),
                  rows: 2,
                  className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${errors.alamat ? "border-red-500" : "border-gray-300"}`
                }
              ),
              errors.alamat && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.alamat })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "RT" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: data.rt,
                    onChange: (e) => setData("rt", e.target.value),
                    maxLength: 5,
                    className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "RW" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: data.rw,
                    onChange: (e) => setData("rw", e.target.value),
                    maxLength: 5,
                    className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: [
                "Kecamatan ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: data.kecamatan,
                  onChange: (e) => setData("kecamatan", e.target.value),
                  list: "kecamatan-list",
                  className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${errors.kecamatan ? "border-red-500" : "border-gray-300"}`
                }
              ),
              /* @__PURE__ */ jsx("datalist", { id: "kecamatan-list", children: filterOptions.kecamatan.map((k) => /* @__PURE__ */ jsx("option", { value: k }, k)) }),
              errors.kecamatan && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.kecamatan })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: [
                "Desa ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: data.desa,
                  onChange: (e) => setData("desa", e.target.value),
                  className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${errors.desa ? "border-red-500" : "border-gray-300"}`
                }
              ),
              errors.desa && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.desa })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Data Usaha" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: [
                "Jenis Usaha ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: data.jenis_usaha,
                  onChange: (e) => setData("jenis_usaha", e.target.value),
                  className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${errors.jenis_usaha ? "border-red-500" : "border-gray-300"}`,
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: "Pilih Jenis Usaha" }),
                    Object.entries(jenisUsaha).map(([value, label]) => /* @__PURE__ */ jsx("option", { value, children: label }, value))
                  ]
                }
              ),
              errors.jenis_usaha && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.jenis_usaha })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Kelompok Tani" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: data.kelompok_tani,
                  onChange: (e) => setData("kelompok_tani", e.target.value),
                  list: "kelompok-list",
                  className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                }
              ),
              /* @__PURE__ */ jsx("datalist", { id: "kelompok-list", children: filterOptions.kelompok_tani.map((k) => /* @__PURE__ */ jsx("option", { value: k }, k)) })
            ] }),
            isPetani && /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Luas Lahan (Ha)" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  step: "0.01",
                  value: data.luas_lahan,
                  onChange: (e) => setData("luas_lahan", e.target.value),
                  className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                }
              )
            ] }),
            isPeternak && /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Jumlah Ternak" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "number",
                  value: data.jumlah_ternak,
                  onChange: (e) => setData("jumlah_ternak", e.target.value),
                  className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-3", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              href: "/pelaku-usaha",
              className: "px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50",
              children: "Batal"
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "submit",
              disabled: processing,
              className: "inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50",
              children: [
                processing ? /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "w-4 h-4" }),
                isEdit ? "Simpan Perubahan" : "Simpan Data"
              ]
            }
          )
        ] })
      ] })
    ] })
  ] });
}
export {
  PelakuUsahaForm as default
};
