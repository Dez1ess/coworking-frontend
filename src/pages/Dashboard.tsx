import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Dashboard_Section from "../components/sections/Dashboard_Section";

interface User {
  id: number;
  first_name: string;
  role: string;
  email: string;
}

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      navigate("/login");
      return;
    }

    setUser(JSON.parse(storedUser));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user) return <p>Loading...</p>;

  return (
    <>
      <Dashboard_Section />
    </>
  );
}

export default Dashboard;
