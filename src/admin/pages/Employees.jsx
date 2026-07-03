import { Link, useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Users } from "lucide-react";
import api from "../api/client";
import { useAdminData } from "../hooks/useAdminData";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";
import ConfirmDialog from "../components/ConfirmDialog";
import Panel from "../components/Panel";
import Button from "../../components/ui/Button";
import QuickAddDropdown from "../components/QuickAddDropdown";
import toast from "react-hot-toast";

const EMPLOYEE_STATUSES = ["ACTIVE", "INACTIVE", "ON_LEAVE", "TERMINATED"];

const EmployeesAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data: list, isLoading, isError } = useAdminData(
    ["admin-employees", search, statusFilter],
    async () => {
      const { data: res } = await api.get("/admin/employees", {
        params: {
          limit: 200,
          ...(search && { search }),
          ...(statusFilter !== "all" && { status: statusFilter }),
        },
      });
      return res.data;
    },
    { enabled: !id }
  );

  const { data: detail, refetch } = useAdminData(
    ["employee", id],
    async () => {
      const { data: res } = await api.get(`/admin/employees/${id}`);
      return res.data;
    },
    { enabled: !!id }
  );

  const deleteMut = useMutation({
    mutationFn: (empId) => api.delete(`/admin/employees/${empId}`),
    onSuccess: () => {
      toast.success("Employee archived");
      qc.invalidateQueries({ queryKey: ["admin-employees"] });
      setDeleteTarget(null);
      if (id) navigate("/admin/employees");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Delete failed"),
  });

  if (id && detail) {
    return (
      <div className="max-w-4xl space-y-6">
        <Link to="/admin/employees" className="text-sm font-medium text-blue-600 hover:text-blue-700">
          ← Back to employees
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">{detail.fullName}</h1>
            <p className="text-slate-500 mt-1">{detail.email} · {detail.employeeCode}</p>
          </div>
          <StatusBadge status={detail.status} />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Panel title="Profile">
            <dl className="space-y-2 text-sm">
              <div><dt className="text-slate-500">Department</dt><dd>{detail.department || "—"}</dd></div>
              <div><dt className="text-slate-500">Designation</dt><dd>{detail.designation || detail.jobTitle || "—"}</dd></div>
              <div><dt className="text-slate-500">Phone</dt><dd>{detail.phone || "—"}</dd></div>
              <div><dt className="text-slate-500">CNIC</dt><dd>{detail.cnic || "—"}</dd></div>
              <div><dt className="text-slate-500">Hire date</dt><dd>{detail.hireDate ? new Date(detail.hireDate).toLocaleDateString() : "—"}</dd></div>
              <div><dt className="text-slate-500">Training date</dt><dd>{detail.trainingDate ? new Date(detail.trainingDate).toLocaleDateString() : "—"}</dd></div>
            </dl>
          </Panel>
          <Panel title="Emergency & Notes">
            <dl className="space-y-2 text-sm">
              <div><dt className="text-slate-500">Emergency contact</dt><dd>{detail.emergencyContact || "—"}</dd></div>
              <div><dt className="text-slate-500">Emergency phone</dt><dd>{detail.emergencyPhone || "—"}</dd></div>
              <div><dt className="text-slate-500">Address</dt><dd className="whitespace-pre-wrap">{detail.address || "—"}</dd></div>
              <div><dt className="text-slate-500">Notes</dt><dd className="whitespace-pre-wrap">{detail.notes || "—"}</dd></div>
            </dl>
          </Panel>
        </div>

        <Panel title="Documents">
          {(detail.documents || []).length === 0 ? (
            <p className="text-sm text-slate-500">No documents uploaded yet.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {detail.documents.map((doc) => (
                <li key={doc.id} className="py-3 flex items-center justify-between gap-3 text-sm">
                  <div>
                    <p className="font-medium text-slate-900">{doc.title}</p>
                    <p className="text-slate-500">{doc.documentType}{doc.fileName ? ` · ${doc.fileName}` : ""}</p>
                  </div>
                  <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                    View
                  </a>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    );
  }

  const items = list || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employees"
        description="Manage employee profiles, documents, and employment lifecycle."
        actions={
          <div className="flex flex-wrap gap-2">
            <Link to="/admin/employees/new">
              <Button><Plus className="w-4 h-4 mr-2" />New Employee</Button>
            </Link>
            <QuickAddDropdown label="Quick Add" sectionIds={["organization", "recruitment"]} />
          </div>
        }
      />

      <div className="flex flex-wrap gap-3 bg-white rounded-xl border border-slate-200/80 px-4 py-3">
        <input
          type="search"
          placeholder="Search by name, email, or code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] px-3 py-2 text-sm border border-slate-200 rounded-lg"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
        >
          <option value="all">All statuses</option>
          {EMPLOYEE_STATUSES.map((s) => (
            <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
          ))}
        </select>
      </div>

      {isError && <p className="text-sm text-red-600">Failed to load employees.</p>}

      {isLoading ? (
        <p className="text-slate-400 py-12 text-center">Loading...</p>
      ) : items.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No employees yet"
          description="Add your first employee to start building your team directory."
          actionLabel="Add employee"
          actionTo="/admin/employees/new"
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="table-scroll">
          <table className="w-full text-sm table-min-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase">Employee</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">Department</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="text-right px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60">
                  <td className="px-6 py-4">
                    <Link to={`/admin/employees/${item.id}`} className="font-medium text-slate-900 hover:text-blue-600">
                      {item.fullName}
                    </Link>
                    <p className="text-xs text-slate-500">{item.email}</p>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell text-slate-500">{item.department || "—"}</td>
                  <td className="px-4 py-4"><StatusBadge status={item.status} /></td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <Link to={`/admin/employees/${item.id}`} className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50">
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button type="button" onClick={() => setDeleteTarget(item)} className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Archive employee?"
        message={`Archive ${deleteTarget?.fullName}? This is a soft delete.`}
        confirmLabel="Archive"
        onConfirm={() => deleteMut.mutate(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default EmployeesAdmin;
