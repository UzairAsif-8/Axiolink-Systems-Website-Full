import { usePageMeta } from "../../hooks/usePageMeta";

/** Applies noindex to all admin routes. */
const AdminSeo = () => {
  usePageMeta({
    title: "Admin Portal | Axiolink Systems",
    description: "Private administration portal.",
    noindex: true,
  });
  return null;
};

export default AdminSeo;
