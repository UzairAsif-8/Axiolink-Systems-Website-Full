import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import StatusBadge from "../StatusBadge";
import EmptyState from "../EmptyState";

const RecordsTable = ({ rows, columns, detailPath, emptyTitle, emptyDescription }) => {
  if (!rows?.length) {
    return (
      <EmptyState
        title={emptyTitle || "No records"}
        description={emptyDescription || "Nothing matches your filters yet."}
      />
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="table-scroll">
        <table className="w-full text-sm table-min-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
              {detailPath && (
                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Open
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => {
              const href = detailPath?.(row);
              return (
                <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                  {columns.map((col) => {
                    const value = col.render(row);
                    return (
                      <td key={col.key} className="px-4 py-3 text-slate-700 whitespace-nowrap max-w-[240px] truncate">
                        {col.badge ? <StatusBadge status={value} /> : value}
                      </td>
                    );
                  })}
                  {detailPath && (
                    <td className="px-4 py-3 text-right">
                      {href ? (
                        <Link
                          to={href}
                          className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
                        >
                          View
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-500">
        Showing {rows.length} record{rows.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
};

export default RecordsTable;
