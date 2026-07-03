import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const BlogBreadcrumbs = ({ items = [] }) => (
  <nav aria-label="Breadcrumb" className="mb-6">
    <ol className="flex flex-wrap items-center gap-1 text-sm text-neutral-500">
      <li>
        <Link to="/" className="inline-flex items-center hover:text-primary-600 transition-colors">
          <Home className="w-4 h-4" />
          <span className="sr-only">Home</span>
        </Link>
      </li>
      {items.map((item, i) => (
        <li key={i} className="flex items-center gap-1">
          <ChevronRight className="w-4 h-4 text-neutral-300" />
          {item.href ? (
            <Link to={item.href} className="hover:text-primary-600 transition-colors capitalize">
              {item.label}
            </Link>
          ) : (
            <span className="text-neutral-700 font-medium line-clamp-1">{item.label}</span>
          )}
        </li>
      ))}
    </ol>
  </nav>
);

export default BlogBreadcrumbs;
