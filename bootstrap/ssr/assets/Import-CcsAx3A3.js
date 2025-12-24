import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { A as AppLayout } from "./AppLayout-Bnl3kyBN.js";
import { usePage, useForm, Head, Link } from "@inertiajs/react";
import { useTransition, useState } from "react";
import { ArrowLeft, CheckCircle, AlertCircle, FileSpreadsheet, Download, FileText, Upload, Loader2 } from "lucide-react";
function PelakuUsahaImport({ filterOptions }) {
  const { flash } = usePage().props;
  const importResult = flash?.import_result;
  const [isPending, startTransition] = useTransition();
  const { data, setData, post, processing, errors, reset, progress } = useForm({
    file: null,
    bidang_id: ""
  });
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState("");
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };
  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };
  const handleFile = (file) => {
    const allowedTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ];
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(csv|xlsx|xls)$/i)) {
      alert("File harus berformat CSV atau Excel (.xlsx, .xls)");
      return;
    }
    setData("file", file);
    setFileName(file.name);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    startTransition(() => {
      post("/pelaku-usaha/import", {
        forceFormData: true,
        onSuccess: () => {
          reset();
          setFileName("");
        }
      });
    });
  };
  const removeFile = () => {
    setData("file", null);
    setFileName("");
  };
  return /* @__PURE__ */ jsxs(AppLayout, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Import Pelaku Usaha" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto", children: [
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
          /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Import Data" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: "Import data pelaku usaha dari file Excel/CSV" })
        ] })
      ] }),
      importResult && /* @__PURE__ */ jsx("div", { className: `mb-6 p-4 rounded-xl border animate-slide-up ${importResult.failed === 0 ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"}`, children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
        importResult.failed === 0 ? /* @__PURE__ */ jsx(CheckCircle, { className: "w-5 h-5 text-green-500 mt-0.5" }) : /* @__PURE__ */ jsx(AlertCircle, { className: "w-5 h-5 text-yellow-500 mt-0.5" }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-900", children: "Hasil Import" }),
          /* @__PURE__ */ jsxs("div", { className: "mt-3 grid grid-cols-3 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "text-center p-3 bg-white rounded-lg", children: [
              /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-gray-900", children: importResult.total }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Total" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-center p-3 bg-white rounded-lg", children: [
              /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-green-600", children: importResult.success }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Berhasil" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-center p-3 bg-white rounded-lg", children: [
              /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold text-red-600", children: importResult.failed }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Gagal" })
            ] })
          ] }),
          importResult.errors.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-700 mb-2", children: "Error Details:" }),
            /* @__PURE__ */ jsxs("div", { className: "max-h-40 overflow-y-auto bg-white rounded-lg p-3 text-sm text-red-600 space-y-1", children: [
              importResult.errors.slice(0, 10).map((error, index) => /* @__PURE__ */ jsxs("p", { children: [
                "• ",
                error
              ] }, index)),
              importResult.errors.length > 10 && /* @__PURE__ */ jsxs("p", { className: "text-gray-500", children: [
                "...dan ",
                importResult.errors.length - 10,
                " error lainnya"
              ] })
            ] })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(FileSpreadsheet, { className: "w-8 h-8 text-blue-600" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-medium text-blue-900", children: "Template Import" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-blue-700", children: "Download template untuk format data yang benar" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: "/pelaku-usaha/template",
            className: "btn-primary bg-blue-600 hover:bg-blue-700",
            children: [
              /* @__PURE__ */ jsx(Download, { className: "w-4 h-4" }),
              "Download"
            ]
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Upload File" }),
          /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
            /* @__PURE__ */ jsxs("label", { className: "form-label", children: [
              "Bidang ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: data.bidang_id,
                onChange: (e) => setData("bidang_id", e.target.value),
                className: `form-input ${errors.bidang_id ? "form-input-error" : ""}`,
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: "Pilih Bidang" }),
                  filterOptions.bidang.map((b) => /* @__PURE__ */ jsxs("option", { value: b.id, children: [
                    b.kode,
                    " - ",
                    b.nama
                  ] }, b.id))
                ]
              }
            ),
            errors.bidang_id && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.bidang_id })
          ] }),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: `
                                relative border-2 border-dashed rounded-xl p-8 text-center transition-all
                                ${dragActive ? "border-primary-500 bg-primary-50" : fileName ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-gray-400"}
                            `,
              onDragEnter: handleDrag,
              onDragLeave: handleDrag,
              onDragOver: handleDrag,
              onDrop: handleDrop,
              children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "file",
                    id: "file-upload",
                    accept: ".csv,.xlsx,.xls",
                    onChange: handleFileInput,
                    className: "absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  }
                ),
                fileName ? /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto", children: /* @__PURE__ */ jsx(FileText, { className: "w-6 h-6 text-green-600" }) }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("p", { className: "font-medium text-gray-900", children: fileName }),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: removeFile,
                        className: "text-sm text-red-600 hover:text-red-700 mt-1",
                        children: "Hapus file"
                      }
                    )
                  ] })
                ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto", children: /* @__PURE__ */ jsx(Upload, { className: "w-6 h-6 text-gray-400" }) }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("p", { className: "font-medium text-gray-900", children: "Drag & drop file di sini" }),
                    /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500 mt-1", children: [
                      "atau ",
                      /* @__PURE__ */ jsx("span", { className: "text-primary-600", children: "browse" }),
                      " untuk memilih file"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-400", children: "Format: CSV, XLSX, XLS (Max. 10MB)" })
                ] })
              ]
            }
          ),
          errors.file && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm mt-2", children: errors.file }),
          progress && /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600", children: "Uploading..." }),
              /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium", children: [
                progress.percentage,
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "h-2 bg-gray-200 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
              "div",
              {
                className: "h-full bg-primary-500 rounded-full transition-all duration-300",
                style: { width: `${progress.percentage}%` }
              }
            ) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-3", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              href: "/pelaku-usaha",
              className: "btn-outline",
              children: "Batal"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              disabled: processing || isPending || !data.file || !data.bidang_id,
              className: "btn-primary disabled:opacity-50 disabled:cursor-not-allowed",
              children: processing || isPending ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }),
                "Mengimport..."
              ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(Upload, { className: "w-4 h-4" }),
                "Import Data"
              ] })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 bg-gray-50 rounded-xl p-6", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-semibold text-gray-900 mb-3", children: "Panduan Import" }),
        /* @__PURE__ */ jsxs("ol", { className: "list-decimal list-inside space-y-2 text-sm text-gray-600", children: [
          /* @__PURE__ */ jsx("li", { children: "Download template terlebih dahulu untuk mengetahui format data yang benar" }),
          /* @__PURE__ */ jsx("li", { children: "Isi data sesuai dengan kolom yang tersedia pada template" }),
          /* @__PURE__ */ jsx("li", { children: "Pastikan NIK unik dan tidak duplikat" }),
          /* @__PURE__ */ jsx("li", { children: "Pilih bidang yang sesuai untuk data yang akan diimport" }),
          /* @__PURE__ */ jsx("li", { children: "Upload file dan tunggu proses import selesai" })
        ] })
      ] })
    ] })
  ] });
}
export {
  PelakuUsahaImport as default
};
