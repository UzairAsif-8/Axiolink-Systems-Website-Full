import { useState, useEffect } from "react";

import { Link, useLocation } from "react-router-dom";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ChevronRight, Trash2, Award, UserCheck, Users } from "lucide-react";

import api from "../api/client";

import ConfirmDialog from "./ConfirmDialog";
import ActiveInternsPanel from "./ActiveInternsPanel";
import InternApprovalDateModal from "./InternApprovalDateModal";
import StatusBadge from "./StatusBadge";

import {

  PIPELINE_STATUSES,

  groupApplicationsByStatus,

  countByStatus,

  filterPipelineApplications,

  filterActiveInterns,

  filterParticipants,

  filterWithdrawn,

  formatWorkMode,

  COMPLETED_STATUS,

  WITHDRAWN_STATUS,

  ACTIVE_INTERN_STATUS,

} from "../constants/applications";

import toast from "react-hot-toast";



const selectClass =

  "text-sm border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20";



const formatDate = (d) =>

  d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";



const applicantLink = (app, internshipId) =>

  internshipId

    ? `/admin/internships/${internshipId}/applications/${app.id}`

    : `/admin/applications/${app.id}`;



const InternshipMeta = ({ app }) => {

  const parts = [

    app.internshipDepartment,

    app.internshipDuration,

    formatWorkMode(app.internshipWorkMode),

  ].filter(Boolean);

  if (!parts.length && !app.internshipTitle) return null;

  return (

    <p className="text-xs text-slate-500 mt-0.5">

      {app.internshipTitle}

      {parts.length > 0 && ` · ${parts.join(" · ")}`}

    </p>

  );

};



const ApplicantTable = ({

  rows,

  showInternshipTitle,

  showStatusColumn,

  onStatusChange,

  onDelete,

  isPending,

  internshipId,

}) => {

  if (!rows.length) return null;



  const moveOptions = [...PIPELINE_STATUSES, { key: ACTIVE_INTERN_STATUS, label: "Approved" }];



  return (

    <div className="table-scroll">
      <table className="w-full text-sm table-min-sm">

        <thead>

          <tr className="border-b border-slate-100 text-left">

            <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Applicant</th>

            {showInternshipTitle && (

              <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase hidden lg:table-cell">Internship</th>

            )}

            <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">University</th>

            <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">Applied</th>

            {showStatusColumn && (

              <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Status</th>

            )}

            <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Move to</th>

            <th className="py-3 px-4 w-24" />

          </tr>

        </thead>

        <tbody className="divide-y divide-slate-50">

          {rows.map((app) => (

            <tr key={app.id} className="hover:bg-slate-50/80">

              <td className="py-3.5 px-4">

                <Link to={applicantLink(app, internshipId)} className="font-medium text-slate-900 hover:text-blue-600">

                  {app.fullName}

                </Link>

                <p className="text-xs text-slate-400 mt-0.5">{app.email}</p>

              </td>

              {showInternshipTitle && (

                <td className="py-3.5 px-4 hidden lg:table-cell text-slate-600 text-xs max-w-[180px]">

                  <p className="truncate">{app.internshipTitle || "—"}</p>

                  {app.internshipDepartment && (

                    <p className="text-slate-400 truncate">{app.internshipDepartment}</p>

                  )}

                </td>

              )}

              <td className="py-3.5 px-4 hidden md:table-cell text-slate-600">{app.university || "—"}</td>

              <td className="py-3.5 px-4 hidden sm:table-cell text-slate-500 text-xs">{formatDate(app.createdAt)}</td>

              {showStatusColumn && (

                <td className="py-3.5 px-4"><StatusBadge status={app.status} /></td>

              )}

              <td className="py-3.5 px-4">

                <select

                  value={app.status}

                  disabled={isPending}

                  onChange={(e) => onStatusChange(app.id, e.target.value)}

                  className={selectClass}

                >

                  {moveOptions.map((s) => (

                    <option key={s.key} value={s.key}>{s.label}</option>

                  ))}

                </select>

              </td>

              <td className="py-3.5 px-4">

                <div className="flex items-center justify-end gap-1">

                  <Link

                    to={applicantLink(app, internshipId)}

                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"

                  >

                    Open <ChevronRight className="w-3.5 h-3.5" />

                  </Link>

                  <button

                    type="button"

                    disabled={isPending}

                    onClick={() => onDelete(app)}

                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"

                    title="Remove applicant"

                  >

                    <Trash2 className="w-4 h-4" />

                  </button>

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

};



const ParticipantsTable = ({ rows, onCertificate, isPending, internshipId, onDelete }) => {

  if (!rows.length) return null;



  return (

    <div className="table-scroll">
      <table className="w-full text-sm table-min-sm">

        <thead>

          <tr className="border-b border-slate-100 text-left">

            <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Participant</th>

            <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">Internship</th>

            <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">Completed</th>

            <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Certificate</th>

            <th className="py-3 px-4 w-10" />

          </tr>

        </thead>

        <tbody className="divide-y divide-slate-50">

          {rows.map((app) => (

            <tr key={app.id} className="hover:bg-violet-50/30">

              <td className="py-3.5 px-4">

                <Link to={applicantLink(app, internshipId)} className="font-medium text-slate-900 hover:text-blue-600">

                  {app.fullName}

                </Link>

                <p className="text-xs text-slate-400 mt-0.5">{app.email}</p>

              </td>

              <td className="py-3.5 px-4 hidden md:table-cell">

                <InternshipMeta app={app} />

              </td>

              <td className="py-3.5 px-4 hidden sm:table-cell text-slate-500 text-xs">

                {formatDate(app.completedAt)}

              </td>

              <td className="py-3.5 px-4">

                <button

                  type="button"

                  disabled={isPending || app.certificateIssued}

                  onClick={() => onCertificate(app)}

                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${

                    app.certificateIssued

                      ? "bg-emerald-600 text-white cursor-default shadow-sm"

                      : "bg-white text-slate-700 border border-slate-200 hover:bg-violet-50 hover:border-violet-300 hover:text-violet-700"

                  }`}

                >

                  <Award className="w-4 h-4" />

                  {app.certificateIssued ? "Certificate issued" : "Issue certificate"}

                </button>

              </td>

              <td className="py-3.5 px-4">

                <button

                  type="button"

                  disabled={isPending}

                  onClick={() => onDelete(app)}

                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"

                  title="Remove"

                >

                  <Trash2 className="w-4 h-4" />

                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

};



const SectionCard = ({ icon: Icon, title, count, subtitle, children, accent = "slate" }) => {
  const accents = {
    slate: { header: "border-slate-200/80 bg-slate-50/60", icon: "text-slate-600", badge: "bg-slate-100 text-slate-600" },
    emerald: { header: "border-emerald-200/80 bg-gradient-to-r from-emerald-50/80 to-teal-50/50", icon: "text-emerald-600", badge: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200/60" },
    violet: { header: "border-violet-200/80 bg-violet-50/50", icon: "text-violet-600", badge: "bg-violet-100 text-violet-700" },
  };
  const style = accents[accent] || accents.slate;

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className={`px-5 py-4 border-b border-slate-100 flex items-center justify-between ${style.header}`}>
        <div className="flex items-center gap-3">
          {Icon && (
            <div className={`p-2 rounded-xl bg-white/80 border border-white shadow-sm ${style.icon}`}>
              <Icon className="w-5 h-5" />
            </div>
          )}
          <div>
            <h3 className="font-semibold text-slate-900">{title}</h3>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${style.badge}`}>{count}</span>
      </div>
      {children}
    </div>
  );
};



const ApplicationBoard = ({

  applications = [],

  queryKey = ["admin-applications", "all"],

  showInternshipTitle = false,

  internshipId = null,

}) => {

  const qc = useQueryClient();

  const location = useLocation();

  const [activeFilter, setActiveFilter] = useState("ALL");

  const [deleteTarget, setDeleteTarget] = useState(null);

  const [confirmComplete, setConfirmComplete] = useState(null);

  const [confirmWithdraw, setConfirmWithdraw] = useState(null);

  const [approvalTarget, setApprovalTarget] = useState(null);



  useEffect(() => {

    setActiveFilter("ALL");

  }, [location.pathname]);



  const pipelineApps = filterPipelineApplications(applications);

  const activeInterns = filterActiveInterns(applications);

  const participants = filterParticipants(applications);

  const withdrawn = filterWithdrawn(applications);



  const grouped = groupApplicationsByStatus(pipelineApps);

  const counts = countByStatus(applications);

  const total = pipelineApps.length;



  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin-applications"] });



  const statusMut = useMutation({

    mutationFn: ({ id, status, note, internshipStartDate, internshipEndDate }) =>

      api.patch(`/admin/applications/${id}/status`, {
        status,
        note,
        internshipStartDate,
        internshipEndDate,
      }),

    onSuccess: (_, vars) => {

      const labels = {

        SELECTED: "Approved — moved to Active Interns",

        INTERNSHIP_COMPLETED: "Moved to Participants",

        WITHDRAWN: "Intern withdrawn",

      };

      toast.success(labels[vars.status] || "Status updated");

      invalidate();

      setApprovalTarget(null);

    },

    onError: (err) => toast.error(err.response?.data?.message || "Update failed"),

  });



  const certificateMut = useMutation({

    mutationFn: (id) => api.patch(`/admin/applications/${id}/certificate`, { issued: true }),

    onSuccess: () => {

      toast.success("Certificate marked as issued");

      invalidate();

    },

    onError: (err) => toast.error(err.response?.data?.message || "Could not update certificate"),

  });



  const deleteMut = useMutation({

    mutationFn: (id) => api.delete(`/admin/applications/${id}`),

    onSuccess: () => {

      toast.success("Applicant removed");

      invalidate();

      setDeleteTarget(null);

    },

    onError: (err) => toast.error(err.response?.data?.message || "Delete failed"),

  });



  const tabs = [

    { key: "ALL", label: "All", count: total },

    ...PIPELINE_STATUSES.map((s) => ({ key: s.key, label: s.label, count: counts[s.key] })),

  ];



  const sectionsToShow =

    activeFilter === "ALL"

      ? PIPELINE_STATUSES.filter((s) => (grouped[s.key]?.length || 0) > 0)

      : [{ key: activeFilter, label: PIPELINE_STATUSES.find((s) => s.key === activeFilter)?.label }];



  const visibleSections = sectionsToShow.filter((s) => (grouped[s.key]?.length || 0) > 0);

  const handleStatusChange = (app, status) => {
    if (status === ACTIVE_INTERN_STATUS && app.status !== ACTIVE_INTERN_STATUS) {
      setApprovalTarget({
        id: app.id,
        fullName: app.fullName,
        note: "Approved and added to active interns",
      });
      return;
    }

    statusMut.mutate({
      id: app.id,
      status,
      note:
        status === ACTIVE_INTERN_STATUS
          ? "Approved and added to active interns"
          : `Moved to ${status.replace(/_/g, " ").toLowerCase()}`,
    });
  };

  const isPending = statusMut.isPending || deleteMut.isPending || certificateMut.isPending;



  return (

    <div className="space-y-8">

      <div>

        <h2 className="text-lg font-semibold text-slate-900 mb-1">Applicants</h2>

        <p className="text-sm text-slate-500 mb-4">Review and move candidates through the hiring pipeline. Approve to add them as active interns.</p>



        <div className="flex flex-wrap gap-2 pb-1">

          {tabs.map((tab) => (

            <button

              key={tab.key}

              type="button"

              onClick={() => setActiveFilter(tab.key)}

              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${

                activeFilter === tab.key

                  ? "bg-blue-600 text-white shadow-sm"

                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"

              }`}

            >

              {tab.label}

              <span className={`ml-1.5 ${activeFilter === tab.key ? "text-blue-100" : "text-slate-400"}`}>

                ({tab.count})

              </span>

            </button>

          ))}

        </div>



        <div className="space-y-4 mt-4">

          {visibleSections.length === 0 ? (

            <div className="text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-500 text-sm">

              No applicants in this category.

            </div>

          ) : (

            visibleSections.map((section) => (

              <div key={section.key} className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">

                {activeFilter === "ALL" && (

                  <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">

                    <h3 className="font-semibold text-slate-900">{section.label}</h3>

                    <span className="text-sm text-slate-500">

                      {grouped[section.key].length} applicant{grouped[section.key].length !== 1 ? "s" : ""}

                    </span>

                  </div>

                )}

                <ApplicantTable

                  rows={grouped[section.key]}

                  showInternshipTitle={showInternshipTitle}

                  showStatusColumn={activeFilter === "ALL"}

                  onStatusChange={(appId, status) => {
                    const app = grouped[section.key].find((row) => row.id === appId);
                    if (app) handleStatusChange(app, status);
                  }}

                  onDelete={setDeleteTarget}

                  isPending={isPending}

                  internshipId={internshipId}

                />

              </div>

            ))

          )}

        </div>

      </div>



      <div>

        <SectionCard

          icon={UserCheck}

          title="Active Interns"

          subtitle="Approved interns currently in their internship"

          count={`${activeInterns.length} intern${activeInterns.length !== 1 ? "s" : ""}`}

          accent="emerald"

        >

          <ActiveInternsPanel
            interns={activeInterns}
            internshipId={internshipId}
            isPending={isPending}
            onComplete={setConfirmComplete}
            onWithdraw={setConfirmWithdraw}
            onDelete={setDeleteTarget}
            applicantLink={applicantLink}
          />

        </SectionCard>

      </div>



      <div>

        <SectionCard

          icon={Users}

          title="Participants"

          subtitle="Interns who completed their internship — issue certificates to finish the process"

          count={`${participants.length} participant${participants.length !== 1 ? "s" : ""}`}

          accent="violet"

        >

          {participants.length === 0 ? (

            <p className="text-sm text-slate-500 text-center py-10 px-4">Completed interns will appear here after you mark them as completed.</p>

          ) : (

            <ParticipantsTable

              rows={participants}

              onCertificate={(app) => certificateMut.mutate(app.id)}

              onDelete={setDeleteTarget}

              isPending={isPending}

              internshipId={internshipId}

            />

          )}

        </SectionCard>

      </div>



      {withdrawn.length > 0 && (

        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden opacity-80">

          <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/60">

            <h3 className="font-semibold text-slate-700">Withdrawn / Discarded</h3>

            <p className="text-xs text-slate-500 mt-0.5">{withdrawn.length} intern{withdrawn.length !== 1 ? "s" : ""}</p>

          </div>

          <div className="divide-y divide-slate-50">

            {withdrawn.map((app) => (

              <div key={app.id} className="px-5 py-3 flex items-center justify-between text-sm">

                <div>

                  <span className="font-medium text-slate-700">{app.fullName}</span>

                  <span className="text-slate-400 ml-2">{app.internshipTitle}</span>

                </div>

                <StatusBadge status={WITHDRAWN_STATUS} />

              </div>

            ))}

          </div>

        </div>

      )}



      <ConfirmDialog

        open={!!deleteTarget}

        title="Remove this applicant?"

        message={`${deleteTarget?.fullName} will be removed from the list. This cannot be undone.`}

        onConfirm={() => deleteMut.mutate(deleteTarget.id)}

        onCancel={() => setDeleteTarget(null)}

        loading={deleteMut.isPending}

      />



      <ConfirmDialog

        open={!!confirmComplete}

        title="Mark internship as completed?"

        message={`${confirmComplete?.fullName} will move to the Participants section where you can issue their certificate.`}

        confirmLabel="Mark completed"
        confirmVariant="primary"

        onConfirm={() => {

          statusMut.mutate({

            id: confirmComplete.id,

            status: COMPLETED_STATUS,

            note: "Internship completed",

          });

          setConfirmComplete(null);

        }}

        onCancel={() => setConfirmComplete(null)}

        loading={statusMut.isPending}

      />



      <ConfirmDialog

        open={!!confirmWithdraw}

        title="Withdraw this intern?"

        message={`${confirmWithdraw?.fullName} will be removed from active interns and marked as withdrawn.`}

        confirmLabel="Withdraw"

        onConfirm={() => {

          statusMut.mutate({

            id: confirmWithdraw.id,

            status: WITHDRAWN_STATUS,

            note: "Intern withdrawn or discarded",

          });

          setConfirmWithdraw(null);

        }}

        onCancel={() => setConfirmWithdraw(null)}

        loading={statusMut.isPending}

      />



      <InternApprovalDateModal

        open={!!approvalTarget}

        applicantName={approvalTarget?.fullName || ""}

        loading={statusMut.isPending}

        onCancel={() => setApprovalTarget(null)}

        onConfirm={({ startDate, endDate }) =>

          statusMut.mutate({

            id: approvalTarget.id,

            status: ACTIVE_INTERN_STATUS,

            note: approvalTarget.note,

            internshipStartDate: startDate,

            internshipEndDate: endDate,

          })

        }

      />

    </div>

  );

};



export default ApplicationBoard;

