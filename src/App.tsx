import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Loader from "./components/Loader";

import "./App.scss";
import "./styles/_all.scss";

import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  const location = useLocation();
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    setShowLoader(true);
    const timer = window.setTimeout(() => {
      setShowLoader(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      <Header />
      {showLoader && <Loader />}
      <div
        className="container"
        style={{
          pointerEvents: showLoader ? "none" : "auto",
          filter: showLoader ? "blur(4px)" : "none",
        }}
      >
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

export default App;
