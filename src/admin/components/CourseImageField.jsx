import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import api from "../api/client";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import toast from "react-hot-toast";

const CourseImageField = ({ thumbnailUrl, thumbnailPublicId, onChange }) => {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  const handleFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a JPG, PNG, or WebP image");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);
    try {
      const { data: res } = await api.post("/admin/courses/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onChange({
        thumbnailUrl: res.data.thumbnailUrl,
        thumbnailPublicId: res.data.thumbnailPublicId,
      });
      toast.success("Course image uploaded");
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const applyUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    try {
      new URL(trimmed);
      onChange({ thumbnailUrl: trimmed, thumbnailPublicId: null });
      setUrlInput("");
      toast.success("Image URL applied");
    } catch {
      toast.error("Enter a valid image URL");
    }
  };

  const clearImage = () => {
    onChange({ thumbnailUrl: null, thumbnailPublicId: null });
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-900">Course image</label>
      <p className="text-xs text-slate-500">
        Shown on the Buland Parwaz program page and course cards. Recommended: 1200×630px, JPG or PNG.
      </p>

      {thumbnailUrl ? (
        <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
          <img src={thumbnailUrl} alt="Course preview" className="w-full h-48 object-cover" />
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/90 text-slate-600 hover:text-red-600 shadow-sm"
            aria-label="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full h-48 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/80 flex flex-col items-center justify-center gap-2 text-slate-500 hover:border-blue-300 hover:bg-blue-50/30 transition-colors"
        >
          {uploading ? (
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          ) : (
            <>
              <ImagePlus className="w-8 h-8 text-slate-400" />
              <span className="text-sm font-medium">Click to upload course image</span>
              <span className="text-xs text-slate-400">PNG, JPG, WebP up to 5MB</span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      <div className="flex gap-2">
        <Input
          placeholder="Or paste image URL (https://...)"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          className="flex-1"
        />
        <Button type="button" variant="secondary" onClick={applyUrl} disabled={!urlInput.trim()}>
          Use URL
        </Button>
      </div>

      {thumbnailPublicId && (
        <p className="text-xs text-slate-400">Stored on Cloudinary · {thumbnailPublicId}</p>
      )}
    </div>
  );
};

export default CourseImageField;
