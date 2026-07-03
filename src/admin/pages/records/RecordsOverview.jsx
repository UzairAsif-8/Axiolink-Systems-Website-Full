import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import api from "../../api/client";
import { useAdminData } from "../../hooks/useAdminData";
import { RECORD_OVERVIEW_GROUPS, RECORD_TYPES } from "../../constants/recordsConfig";

const StatCard = ({ type, label, total, sub, subLabel, defaultStatus }) => {
  const config = RECORD_TYPES[type];
  const listPath =
    defaultStatus && type === "interns"
      ? `/admin/records/${type}?status=${defaultStatus}`
      : `/admin/records/${type}`;

  return (
    <Link
      to={listPath}
      className="group block bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm hover:border-blue-200 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-1 text-3xl font-semibold text-slate-900 tabular-nums">{total ?? "—"}</p>
          {sub != null && subLabel && (
            <p className="mt-2 inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              <CheckCircle2 className="w-3 h-3" />
              {sub} {subLabel}
            </p>
          )}
        </div>
        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
      </div>
      {config?.description && (
        <p className="mt-3 text-xs text-slate-400 line-clamp-2">{config.description}</p>
      )}
    </Link>
  );
};

const RecordsOverview = () => {
  const { data, isLoading, isError } = useAdminData(["admin-records-overview"], async () => {
    const { data: res } = await api.get("/admin/records/overview");
    return res.data?.totals || res.totals || {};
  });

  const totals = data || {};

  return (
    <div className="space-y-8">
      {isError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
          Could not load record counts. Make sure the backend is running.
        </p>
      )}

      {isLoading ? (
        <p className="text-slate-400 py-12 text-center text-sm">Loading registry totals…</p>
      ) : (
        RECORD_OVERVIEW_GROUPS.map((group) => (
          <section key={group.title}>
            <h2 className="text-sm font-semibold text-slate-700 mb-3">{group.title}</h2>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {group.items.map((item) => (
                <StatCard
                  key={item.type}
                  type={item.type}
                  label={item.label}
                  total={totals[RECORD_TYPES[item.type]?.countKey || item.type]}
                  sub={item.sub ? totals[item.sub] : null}
                  subLabel={item.subLabel}
                  defaultStatus={item.defaultStatus}
                />
              ))}
            </div>
          </section>
        ))
      )}

      <div className="rounded-xl border border-blue-100 bg-blue-50/50 px-5 py-4 text-sm text-slate-600">
        <strong className="text-slate-800">Completed internships:</strong> open{" "}
        <Link to="/admin/records/interns?status=COMPLETED" className="text-blue-600 font-medium hover:underline">
          Interns → Completed
        </Link>{" "}
        or{" "}
        <Link
          to="/admin/records/applications?status=INTERNSHIP_COMPLETED"
          className="text-blue-600 font-medium hover:underline"
        >
          Applications → Internship completed
        </Link>
        .
      </div>
    </div>
  );
};

export default RecordsOverview;
