import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../api/client";

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
    { key: "jobs", label: "Jobs", link: (i) => `/admin/jobs/${i.id}/edit` },
    { key: "internships", label: "Internships", link: (i) => `/admin/internships/${i.id}/applications` },
    { key: "applications", label: "Applications", link: (i) => `/admin/applications/${i.id}` },
    { key: "courses", label: "Courses", link: () => "/admin/courses" },
    { key: "messages", label: "Messages", link: () => "/admin/messages" },
    { key: "blogs", label: "Blogs", link: () => "/admin/blogs" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold">
        Results for &ldquo;{q}&rdquo;
      </h1>

      {isLoading ? (
        <p className="text-neutral-500">Searching...</p>
      ) : (
        sections.map(({ key, label, link }) => {
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
                      className="text-sm text-primary-600 hover:underline"
                    >
                      {item.title || item.fullName || item.name} {item.email ? `(${item.email})` : ""}
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
