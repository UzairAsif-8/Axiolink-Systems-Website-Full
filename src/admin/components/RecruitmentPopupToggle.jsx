import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Megaphone, Loader2 } from "lucide-react";
import api from "../api/client";
import { useAdminData } from "../hooks/useAdminData";
import toast from "react-hot-toast";

const DEFAULT_POPUPS = { internships: false, jobs: false, courses: false };

const RecruitmentPopupToggle = ({ type, label }) => {
  const qc = useQueryClient();

  const { data: settings, isLoading } = useAdminData(["admin-settings"], async () => {
    const { data: res } = await api.get("/admin/settings");
    return res.data;
  });

  const popups = useMemo(() => {
    const row = (settings || []).find((s) => s.key === "recruitment_popups");
    return { ...DEFAULT_POPUPS, ...(row?.value || {}) };
  }, [settings]);

  const enabled = popups[type] === true;
  const enabledAtKey = `${type}EnabledAt`;

  const toggleMut = useMutation({
    mutationFn: async (next) => {
      await api.put("/admin/settings/bulk", {
        recruitment_popups: {
          ...popups,
          [type]: next,
          [enabledAtKey]: next ? Date.now() : popups[enabledAtKey] || 0,
        },
      });
    },
    onSuccess: (_, next) => {
      toast.success(next ? `${label} popup enabled on website` : `${label} popup disabled`);
      qc.invalidateQueries({ queryKey: ["admin-settings"] });
      qc.invalidateQueries({ queryKey: ["public-settings"] });
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to update popup setting"),
  });

  return (
    <div className="mb-6 rounded-xl border border-slate-200/80 bg-gradient-to-r from-slate-50 to-white p-4 sm:p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
            <Megaphone className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Website popup — {label}</h3>
            <p className="mt-0.5 text-sm text-slate-500">
              Show an animated bottom-right alert on the public site when new {label.toLowerCase()} are open.
            </p>
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          disabled={isLoading || toggleMut.isPending}
          onClick={() => toggleMut.mutate(!enabled)}
          className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-60 ${
            enabled ? "bg-primary-600" : "bg-slate-300"
          }`}
        >
          <span
            className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform ${
              enabled ? "translate-x-7" : "translate-x-1"
            }`}
          />
          {toggleMut.isPending && (
            <Loader2 className="absolute -right-7 h-4 w-4 animate-spin text-slate-400" />
          )}
        </button>
      </div>
    </div>
  );
};

export default RecruitmentPopupToggle;
