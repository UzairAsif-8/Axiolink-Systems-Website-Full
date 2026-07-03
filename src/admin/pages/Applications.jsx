import { Link, useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/client";
import { useAdminData } from "../hooks/useAdminData";
import PageHeader from "../components/PageHeader";
import ApplicationBoard from "../components/ApplicationBoard";
import ApplicationDetailView from "./ApplicationDetailView";
import EmptyState from "../components/EmptyState";
import Button from "../../components/ui/Button";

const allApplicationsKey = ["admin-applications", "all"];

const ApplicationsAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [internshipFilter, setInternshipFilter] = useState("all");

  const { data: internships } = useAdminData(["admin-internships"], async () => {
    const { data: res } = await api.get("/admin/internships", { params: { limit: 100 } });
    return res.data;
  });

  const { data: list, isLoading, isError } = useAdminData(
    allApplicationsKey,
    async () => {
      const { data: res } = await api.get("/admin/applications", { params: { limit: 500 } });
      return res.data;
    },
    { enabled: !id }
  );

  const filteredList =
    internshipFilter === "all"
      ? list || []
      : (list || []).filter((a) => a.internshipId === internshipFilter);

  const handleExport = async () => {
    try {
      const res = await api.get("/admin/applications/export/csv", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "applications.csv";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      /* toast handled by caller if needed */
    }
  };

  if (id) {
    return (
      <ApplicationDetailView
        applicationId={id}
        backTo="/admin/applications"
        onDeleted={() => navigate("/admin/applications")}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Applications"
        description="Review internship and job applicants, update status, and open profiles for full details."
        actions={<Button variant="secondary" onClick={handleExport}>Export CSV</Button>}
      />

      <div className="flex flex-wrap items-center gap-3 bg-white rounded-xl border border-slate-200/80 px-4 py-3">
        <span className="text-sm text-slate-600">Show applications for:</span>
        <select
          value={internshipFilter}
          onChange={(e) => setInternshipFilter(e.target.value)}
          className="flex-1 min-w-[200px] max-w-md px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
        >
          <option value="all">All applications</option>
          {(internships || []).map((i) => (
            <option key={i.id} value={i.id}>{i.title}</option>
          ))}
        </select>
      </div>

      {isError && <p className="text-sm text-red-600">Could not load applications.</p>}

      {isLoading ? (
        <p className="text-slate-400 py-12 text-center">Loading...</p>
      ) : filteredList.length === 0 ? (
        <EmptyState
          title="No applications yet"
          description="When someone applies through the website, they will show up here."
        />
      ) : (
        <ApplicationBoard
          applications={filteredList}
          queryKey={allApplicationsKey}
          showInternshipTitle={internshipFilter === "all"}
        />
      )}
    </div>
  );
};

export default ApplicationsAdmin;
