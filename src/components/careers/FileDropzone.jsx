import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, X } from "lucide-react";

const FileDropzone = ({
  label,
  required = false,
  accept = { "application/pdf": [".pdf"] },
  maxSize = 5 * 1024 * 1024,
  value,
  onChange,
  error,
  helperText = "PDF only, max 5MB",
  emptyText = "Drag & drop or click to upload",
  emptyHint,
}) => {
  const onDrop = useCallback(
    (accepted, rejected) => {
      if (rejected?.length) {
        onChange(null, "Invalid file. Please upload a PDF under 5MB.");
        return;
      }
      onChange(accepted[0] || null, null);
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
  });

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
          isDragActive
            ? "border-primary-500 bg-primary-50"
            : error
            ? "border-red-300 bg-red-50/50"
            : "border-neutral-300 hover:border-primary-400 hover:bg-neutral-50"
        }`}
      >
        <input {...getInputProps()} aria-label={label} />
        {value ? (
          <div className="flex items-center justify-center gap-3">
            <FileText className="w-8 h-8 text-primary-600" />
            <div className="text-left">
              <p className="text-sm font-medium text-neutral-900">{value.name}</p>
              <p className="text-xs text-neutral-500">
                {(value.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null, null);
              }}
              className="p-1 rounded-lg hover:bg-neutral-200 transition-colors"
              aria-label="Remove file"
            >
              <X className="w-4 h-4 text-neutral-500" />
            </button>
          </div>
        ) : (
          <>
            <Upload className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
            <p className="text-sm text-neutral-600">
              {isDragActive ? "Drop the file here..." : emptyText}
            </p>
            <p className="text-xs text-neutral-400 mt-1">{emptyHint ?? helperText}</p>
          </>
        )}
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FileDropzone;
