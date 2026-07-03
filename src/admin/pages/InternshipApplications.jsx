import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";
import api from "../api/client";
import { useAdminData } from "../hooks/useAdminData";
import ApplicationBoard from "../components/ApplicationBoard";
import ApplicationDetailView from "./ApplicationDetailView";
import StatusBadge from "../components/StatusBadge";
import Button from "../../components/ui/Button";

const applicationsQueryKey = (internshipId) => ["admin-applications", "internship", internshipId];

const InternshipApplications = () => {
  const { internshipId, applicationId } = useParams();
  const navigate = useNavigate();
  const listPath = `/admin/internships/${internshipId}/applications`;

  const { data: internship } = useAdminData(
    ["internship", internshipId],
    async () => {
      const { data: res } = await api.get(`/admin/internships/${internshipId}`);
      return res.data;
    },
    { enabled: !!internshipId }
  );

  const { data: applications, isLoading, isError } = useAdminData(
    applicationsQueryKey(internshipId),
    async () => {
      const { data: res } = await api.get("/admin/applications", {
        params: { internshipId, limit: 500 },
      });
      return res.data;
    },
    { enabled: !!internshipId && !applicationId }
  );

  if (applicationId) {
    return (
      <ApplicationDetailView
        applicationId={applicationId}
        backTo={listPath}
        onDeleted={() => navigate(listPath)}
      />
    );
  }

  const apps = applications || [];

  return (
    <div className="space-y-6">
      <Link to="/admin/internships" className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700">
        <ArrowLeft className="w-4 h-4" />Back to internships
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{internship?.title || "Applicants"}</h1>
          <p className="text-slate-500 mt-1">
            {internship?.department && `${internship.department} · `}
            {apps.length} application{apps.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {internship && <StatusBadge status={internship.status} />}
          <Link to={`/admin/internships/${internshipId}/edit`}>
            <Button variant="secondary" size="sm"><Pencil className="w-4 h-4 mr-1" />Edit listing</Button>
          </Link>
        </div>
      </div>

      {isError && <p className="text-sm text-red-600">Could not load applications.</p>}

      {isLoading ? (
        <p className="text-slate-400 py-12 text-center">Loading...</p>
      ) : apps.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200/80">
          <p className="text-slate-500">No one has applied to this internship yet.</p>
        </div>
      ) : (
        <ApplicationBoard
          applications={apps}
          queryKey={applicationsQueryKey(internshipId)}
          internshipId={internshipId}
        />
      )}
    </div>
  );
};

export default InternshipApplications;
