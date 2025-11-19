import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import App from "./App";

// Public Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";

// User Pages
import Dashboard from "./pages/Dashboard";
import Workspaces from "./pages/Workspaces";
import Bookings from "./pages/Bookings";
import Payments from "./pages/Payments";
import Reviews from "./pages/Reviews";

const PublicLayout = () => {
  const user = localStorage.getItem("user");

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

const ProtectedLayout = () => {
  const user = localStorage.getItem("user");

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          { path: "/", element: <Home /> },
          { path: "/about", element: <About /> },
          { path: "/services", element: <Services /> },
          { path: "/contact", element: <Contact /> },
          { path: "/signup", element: <SignUp /> },
          { path: "/login", element: <Login /> },
        ],
      },
      {
        element: <ProtectedLayout />,
        children: [
          { path: "/dashboard", element: <Dashboard /> },
          { path: "/workspaces", element: <Workspaces /> },
          { path: "/bookings", element: <Bookings /> },
          { path: "/payments", element: <Payments /> },
          { path: "/reviews", element: <Reviews /> },
        ],
      },
    ],
  },
]);
