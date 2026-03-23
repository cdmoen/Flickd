import NavBar from "../NavBar/NavBar";
import Footer from "../Footer/Footer";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="layout">
      <NavBar />
      <main className="layoutContent">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}