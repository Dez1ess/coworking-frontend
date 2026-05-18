import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import logoImg from "../assets/logo.png";

function Header() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);

  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string): boolean => location.pathname === path;
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  const isAdmin = user?.role === "admin";

  // =========================
  // ADMIN HEADER (separate UI)
  // =========================
  if (isAdmin) {
    return (
      <div className="container-wr">
        <div className="container">
          <header className="header">
            <Link to="/admin" className="header__logo">
              <img src={logoImg} alt="logo" />
            </Link>

            <nav className="header__nav open">
              <ul className="header__menu">
                <li className={isActive("/admin") ? "active" : ""}>
                  <Link to="/admin">Dashboard</Link>
                </li>

                <li className={isActive("/admin/workspaces") ? "active" : ""}>
                  <Link to="/admin/workspaces">Workspaces</Link>
                </li>

                <li className={isActive("/admin/bookings") ? "active" : ""}>
                  <Link to="/admin/bookings">Bookings</Link>
                </li>

                <li className={isActive("/admin/reviews") ? "active" : ""}>
                  <Link to="/admin/reviews">Reviews</Link>
                </li>
              </ul>
            </nav>

            <div className="header-user">
              <div className="header-user-info">
                <p className="header-user-info__name admin">
                  {user?.first_name} <span>(Admin)</span>
                </p>
                <p className="header-user-info__email">{user?.email}</p>
              </div>

              <button onClick={handleLogout} className="header-user__logout">
                Logout
              </button>
            </div>
          </header>
        </div>
      </div>
    );
  }

  // =========================
  // NORMAL USER HEADER
  // =========================
  return (
    <div className="container-wr">
      <div className="container">
        <header className="header">
          {/* Logo */}
          <Link to={user ? "/dashboard" : "/"} className="header__logo">
            <img src={logoImg} alt="logo" />
          </Link>

          {/* Burger */}
          <button
            className={`burger ${menuOpen ? "active" : ""}`}
            onClick={toggleMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* NAV */}
          <nav className={`header__nav ${menuOpen ? "open" : ""}`}>
            {!user ? (
              <>
                <ul className="header__menu">
                  <li className={isActive("/about") ? "active" : ""}>
                    <Link to="/about">About</Link>
                  </li>

                  <li className={isActive("/services") ? "active" : ""}>
                    <Link to="/services">Services</Link>
                  </li>

                  <li className={isActive("/contact") ? "active" : ""}>
                    <Link to="/contact">Contact</Link>
                  </li>
                </ul>

                <div className="header__buttons header__mobile-buttons">
                  <Link to="/login" className="button">
                    Login
                  </Link>
                  <Link to="/signup" className="button">
                    Register
                  </Link>
                </div>
              </>
            ) : (
              <>
                <ul className="header__menu">
                  <li className={isActive("/workspaces") ? "active" : ""}>
                    <Link to="/workspaces">Workspaces</Link>
                  </li>

                  <li className={isActive("/bookings") ? "active" : ""}>
                    <Link to="/bookings">Bookings</Link>
                  </li>

                  <li className={isActive("/payments") ? "active" : ""}>
                    <Link to="/payments">Payments</Link>
                  </li>

                  <li className={isActive("/reviews") ? "active" : ""}>
                    <Link to="/reviews">Reviews</Link>
                  </li>
                </ul>

                <div className="header-user header-user__mobile">
                  <div className="header-user-info">
                    <p
                      className={`header-user-info__name ${isAdmin ? "admin" : ""}`}
                    >
                      {user.first_name}
                      {isAdmin && <span> (Admin)</span>}
                    </p>
                    <p className="header-user-info__email">{user.email}</p>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="header-user__logout"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </nav>

          {/* DESKTOP USER BLOCK */}
          {user && (
            <div className="header-user">
              <div className="header-user-info">
                <p
                  className={`header-user-info__name ${isAdmin ? "admin" : ""}`}
                >
                  {user.first_name}
                  {isAdmin && <span> (Admin)</span>}
                </p>
                <p className="header-user-info__email">{user.email}</p>
              </div>

              <button onClick={handleLogout} className="header-user__logout">
                Logout
              </button>
            </div>
          )}

          {!user && (
            <div className="header__buttons">
              <Link to="/login" className="button">
                Login
              </Link>
              <Link to="/signup" className="button">
                Register
              </Link>
            </div>
          )}
        </header>
      </div>
    </div>
  );
}

export default Header;
