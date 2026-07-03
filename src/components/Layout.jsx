import Navbar from "./Navbar";
import Footer from "./Footer";
import RecruitmentOpenPopup from "./RecruitmentOpenPopup";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden flex flex-col">
      <Navbar />
      <main className="relative flex-1 w-full min-w-0">{children}</main>
      <Footer />
      <RecruitmentOpenPopup />
    </div>
  );
};

export default Layout;
