import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedAdmin from "./admin/components/ProtectedAdmin";
import AdminSeo from "./admin/components/AdminSeo";

const PageLoader = () => (
  <div className="min-h-[50vh] flex items-center justify-center" role="status" aria-live="polite">
    <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
    <span className="sr-only">Loading page…</span>
  </div>
);

const withSuspense = (Component) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

const AdminLogin = lazy(() => import("./admin/pages/Login"));
const AdminRoutes = lazy(() => import("./admin/AdminRoutes"));
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const Careers = lazy(() => import("./pages/Careers"));
const InternshipDetail = lazy(() => import("./pages/InternshipDetail"));
const InternshipApply = lazy(() => import("./pages/InternshipApply"));
const JobDetail = lazy(() => import("./pages/JobDetail"));
const JobApply = lazy(() => import("./pages/JobApply"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const BlogArchive = lazy(() => import("./pages/BlogArchive"));
const Contact = lazy(() => import("./pages/Contact"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const BulandParwaz = lazy(() => import("./pages/BulandParwaz"));
const BulandParwazCourse = lazy(() => import("./pages/BulandParwazCourse"));
const VerifyCertificate = lazy(() => import("./pages/VerifyCertificate"));

function App() {
  return (
    <div className="App">
      <ScrollToTop />
      <Routes>
        <Route path="/admin/login" element={withSuspense(AdminLogin)} />
        <Route element={<ProtectedAdmin />}>
          <Route path="/admin/*" element={withSuspense(AdminRoutes)} />
        </Route>

        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="/" element={withSuspense(Home)} />
                <Route path="/about" element={withSuspense(About)} />
                <Route path="/buland-parwaz" element={withSuspense(BulandParwaz)} />
                <Route
                  path="/buland-parwaz/course/:courseId"
                  element={withSuspense(BulandParwazCourse)}
                />
                <Route path="/services" element={withSuspense(Services)} />
                <Route path="/services/:slug" element={withSuspense(ServiceDetail)} />
                <Route path="/careers" element={withSuspense(Careers)} />
                <Route path="/careers/apply" element={withSuspense(InternshipApply)} />
                <Route path="/careers/jobs/apply" element={withSuspense(JobApply)} />
                <Route path="/careers/jobs/:slug/apply" element={withSuspense(JobApply)} />
                <Route path="/careers/jobs/:slug" element={withSuspense(JobDetail)} />
                <Route path="/careers/:slug/apply" element={withSuspense(InternshipApply)} />
                <Route path="/careers/:slug" element={withSuspense(InternshipDetail)} />
                <Route path="/blog" element={withSuspense(Blog)} />
                <Route
                  path="/blog/category/:category"
                  element={withSuspense(() => <BlogArchive filterType="category" />)}
                />
                <Route
                  path="/blog/tag/:tag"
                  element={withSuspense(() => <BlogArchive filterType="tag" />)}
                />
                <Route path="/blog/:slug" element={withSuspense(BlogPost)} />
                <Route path="/contact" element={withSuspense(Contact)} />
                <Route path="/verify-certificate" element={withSuspense(VerifyCertificate)} />
                <Route
                  path="/verify-certificate/:code"
                  element={withSuspense(VerifyCertificate)}
                />
                <Route path="/legal/privacy" element={withSuspense(Privacy)} />
                <Route path="/legal/terms" element={withSuspense(Terms)} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
