import { Outlet } from 'react-router-dom';
import Header from "@/components/Header/index.jsx";
import Footer from "@/components/Footer/index.jsx";


function Layout() {  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
