import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { Download, ExternalLink } from "lucide-react";
import api from "../../api/client";
import { useAdminData } from "../../hooks/useAdminData";
import { getRecordConfig } from "../../constants/recordsConfig";
import RecordsTable from "../../components/records/RecordsTable";
import Button from "../../../components/ui/Button";

const selectClass =
  "px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400";

const RecordsListPage = () => {
  const { type } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const config = getRecordConfig(type);

  const statusFromUrl = searchParams.get("status") || "";
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(statusFromUrl);

  if (!config) {
    return <Navigate to="/admin/records" replace />;
  }

  const queryKey = ["admin-records", type, search, status];

  const { data, isLoading, isError } = useAdminData(queryKey, async () => {
    const params = {
      limit: config.limit || 500,
      ...(search.trim() && { search: search.trim() }),
      ...(status && config.statusParam && { [config.statusParam]: status }),
    };
    const { data: res } = await api.get(config.endpoint, { params });
    const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
    return { list, meta: res?.meta };
  });

  const list = data?.list || [];
  const total = data?.meta?.total ?? list.length;

  const filtered = useMemo(() => {
    if (!search.trim() || config.endpoint.includes("search")) return list;
    const q = search.trim().toLowerCase();
    return list.filter((row) =>
      config.columns.some((col) => {
        const v = col.render(row);
        return v != null && String(v).toLowerCase().includes(q);
      })
    );
  }, [list, search, config]);

  const handleStatusChange = (value) => {
    setStatus(value);
    const next = new URLSearchParams(searchParams);
    if (value) next.set("status", value);
    else next.delete("status");
    setSearchParams(next, { replace: true });
  };

  const handleExportCsv = () => {
    const headers = config.columns.map((c) => c.label);
    const lines = filtered.map((row) =>
      config.columns
        .map((col) => {
          const v = col.render(row);
          const text = v == null ? "" : String(v).replace(/"/g, '""');
          return `"${text}"`;
        })
        .join(",")
    );
    const csv = [headers.join(","), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${type}-records.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{config.label}</h2>
          <p className="text-sm text-slate-500 mt-0.5">{config.description}</p>
          {!isLoading && (
            <p className="text-xs text-slate-400 mt-1 tabular-nums">
              {filtered.length} shown{total != null ? ` · ${total} total in database` : ""}
            </p>
          )}
        </div>
        {config.managePath && (
          <Link to={config.managePath}>
            <Button variant="secondary" className="text-sm">
              <ExternalLink className="w-4 h-4 mr-2" />
              Manage {config.label}
            </Button>
          </Link>
        )}
      </div>

      {config.highlightCompleted && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleStatusChange("COMPLETED")}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
              status === "COMPLETED"
                ? "bg-violet-100 text-violet-800 border-violet-200"
                : "bg-white text-slate-600 border-slate-200 hover:border-violet-200"
            }`}
          >
            Completed internships only
          </button>
          <button
            type="button"
            onClick={() => handleStatusChange("ACTIVE")}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
              status === "ACTIVE"
                ? "bg-blue-100 text-blue-800 border-blue-200"
                : "bg-white text-slate-600 border-slate-200 hover:border-blue-200"
            }`}
          >
            Active interns
          </button>
          <button
            type="button"
            onClick={() => handleStatusChange("")}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
              !status
                ? "bg-slate-100 text-slate-800 border-slate-300"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
            }`}
          >
            All
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 bg-white rounded-xl border border-slate-200/80 px-4 py-3">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={config.searchPlaceholder || "Search…"}
          className={`w-full sm:flex-1 sm:min-w-[140px] min-w-0 ${selectClass}`}
        />
        {config.statusOptions?.length > 0 && (
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className={`w-full sm:w-auto sm:min-w-[160px] ${selectClass}`}
          >
            {config.statusOptions.map((opt) => (
              <option key={opt.value || "all"} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}
        <Button variant="secondary" onClick={handleExportCsv} disabled={!filtered.length} className="w-full sm:w-auto shrink-0">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {isError && (
        <p className="text-sm text-red-600">Failed to load {config.label.toLowerCase()}.</p>
      )}

      {isLoading ? (
        <p className="text-slate-400 py-12 text-center text-sm">Loading records…</p>
      ) : (
        <RecordsTable
          rows={filtered}
          columns={config.columns}
          detailPath={config.detailPath}
          emptyTitle={`No ${config.label.toLowerCase()} yet`}
          emptyDescription="Records will appear here as you add data through the admin portal."
        />
      )}
    </div>
  );
};

export default RecordsListPage;
