import Navbar from "./Navbar";
import Footer from "./Footer";
import RecruitmentOpenPopup from "./RecruitmentOpenPopup";

const Layout = ({ children }) => {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
      >
        Skip to main content
      </a>
      <div className="min-h-screen bg-white overflow-x-hidden flex flex-col">
        <header>
          <Navbar />
        </header>
        <main id="main-content" className="relative flex-1 w-full min-w-0">
          {children}
        </main>
        <Footer />
        <RecruitmentOpenPopup />
      </div>
    </>
  );
};

export default Layout;
