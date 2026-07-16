import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../api/client";
import { displayCertificateCode } from "../../utils/certificateCode";

const SearchAdmin = () => {
  const [params] = useSearchParams();
  const q = params.get("q") || "";

  const { data, isLoading } = useQuery({
    queryKey: ["admin-search", q],
    queryFn: async () => {
      const { data: res } = await api.get("/admin/dashboard/search", { params: { q } });
      return res.data;
    },
    enabled: q.length >= 2,
  });

  if (!q || q.length < 2) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-display font-bold">Search</h1>
        <p className="text-neutral-500 text-sm">Enter at least 2 characters in the header search bar.</p>
      </div>
    );
  }

  const sections = [
    { key: "jobs", label: "Jobs", link: (i) => `/admin/jobs/${i.id}/edit`, title: (i) => i.title || i.name },
    { key: "internships", label: "Internships", link: (i) => `/admin/internships/${i.id}/applications`, title: (i) => i.title || i.name },
    { key: "applications", label: "Applications", link: (i) => `/admin/applications/${i.id}`, title: (i) => i.fullName || i.name },
    { key: "courses", label: "Courses", link: () => "/admin/courses", title: (i) => i.title || i.name },
    { key: "certificates", label: "Certificates", link: () => "/admin/certificates", title: (i) => displayCertificateCode(i.certificateCode) || i.studentName },
    { key: "messages", label: "Messages", link: () => "/admin/messages", title: (i) => i.name || i.subject },
    { key: "blogs", label: "Blogs", link: () => "/admin/blogs", title: (i) => i.title || i.name },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold">
        Results for &ldquo;{q}&rdquo;
      </h1>

      {isLoading ? (
        <p className="text-neutral-500">Searching...</p>
      ) : (
        sections.map(({ key, label, link, title }) => {
          const items = data?.[key] || [];
          if (!items.length) return null;
          return (
            <div key={key} className="rounded-xl border bg-white dark:bg-neutral-900 p-4">
              <h2 className="font-semibold mb-3">{label}</h2>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.id}>
                    <Link
                      to={link(item)}
                      className="text-sm text-primary-600 hover:underline font-mono"
                    >
                      {title(item)}
                      {item.email ? ` (${item.email})` : ""}
                      {key === "certificates" && item.studentName
                        ? ` — ${item.studentName}`
                        : ""}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })
      )}

      {!isLoading && sections.every(({ key }) => !(data?.[key]?.length)) && (
        <p className="text-neutral-500">No results found.</p>
      )}
    </div>
  );
};

export default SearchAdmin;
