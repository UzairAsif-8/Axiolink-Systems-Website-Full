import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedAdmin from "./admin/components/ProtectedAdmin";
import AdminLogin from "./admin/pages/Login";
import AdminRoutes from "./admin/AdminRoutes";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Careers from "./pages/Careers";
import InternshipDetail from "./pages/InternshipDetail";
import InternshipApply from "./pages/InternshipApply";
import JobDetail from "./pages/JobDetail";
import JobApply from "./pages/JobApply";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import BlogArchive from "./pages/BlogArchive";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import BulandParwaz from "./pages/BulandParwaz";
import BulandParwazCourse from "./pages/BulandParwazCourse";
import VerifyCertificate from "./pages/VerifyCertificate";

function App() {
  return (
    <div className="App">
      <ScrollToTop />
      <Routes>
        {/* Admin — no public layout */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route element={<ProtectedAdmin />}>
          <Route path="/admin/*" element={<AdminRoutes />} />
        </Route>

        {/* Public site */}
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/buland-parwaz" element={<BulandParwaz />} />
                <Route
                  path="/buland-parwaz/course/:courseId"
                  element={<BulandParwazCourse />}
                />
                <Route path="/services" element={<Services />} />
                <Route path="/services/:slug" element={<ServiceDetail />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/careers/apply" element={<InternshipApply />} />
                <Route path="/careers/jobs/apply" element={<JobApply />} />
                <Route path="/careers/jobs/:slug/apply" element={<JobApply />} />
                <Route path="/careers/jobs/:slug" element={<JobDetail />} />
                <Route path="/careers/:slug/apply" element={<InternshipApply />} />
                <Route path="/careers/:slug" element={<InternshipDetail />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/category/:category" element={<BlogArchive filterType="category" />} />
                <Route path="/blog/tag/:tag" element={<BlogArchive filterType="tag" />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/verify-certificate" element={<VerifyCertificate />} />
                <Route
                  path="/verify-certificate/:code"
                  element={<VerifyCertificate />}
                />
                <Route path="/legal/privacy" element={<Privacy />} />
                <Route path="/legal/terms" element={<Terms />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
