import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logoImg from "../assets/logo.png";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const toggleMenu = () => setMenuOpen((p) => !p);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    setUser(stored ? JSON.parse(stored) : null);
  }, [location]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [menuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  const isAdmin = user?.role === "admin";

  const guestLinks = (
    <>
      <li className={isActive("/about") ? "active" : ""}>
        <Link to="/about">About</Link>
      </li>
      <li className={isActive("/services") ? "active" : ""}>
        <Link to="/services">Services</Link>
      </li>
      <li className={isActive("/contact") ? "active" : ""}>
        <Link to="/contact">Contact</Link>
      </li>
    </>
  );

  const userLinks = (
    <>
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
    </>
  );

  const adminLinks = (
    <>
      <li className={isActive("/admin") ? "active" : ""}>
        <Link to="/admin">Dashboard</Link>
      </li>
      <li className={isActive("/admin/tariffs") ? "active" : ""}>
        <Link to="/admin/tariffs">Tariffs</Link>
      </li>
      <li className={isActive("/admin/users") ? "active" : ""}>
        <Link to="/admin/users">Users</Link>
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
    </>
  );

  const links = isAdmin ? adminLinks : user ? userLinks : guestLinks;

  return (
    <div className="container-wr">
      <div className="container">
        <header className="header">
          <Link to={user ? "/dashboard" : "/"} className="header__logo">
            <img src={logoImg} alt="logo" />
          </Link>

          <button
            className={`burger ${menuOpen ? "active" : ""}`}
            onClick={toggleMenu}
          >
            <span />
            <span />
            <span />
          </button>

          <nav className={`header__nav ${menuOpen ? "open" : ""}`}>
            <ul>{links}</ul>

            <div className="header__mobile-only">
              {user ? (
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
              ) : (
                <div className="header__buttons header__mobile-buttons">
                  <Link to="/login" className="button">
                    Login
                  </Link>
                  <Link to="/signup" className="button">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </nav>

          <div className="header__right">
            {user ? (
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
            ) : (
              <div className="header__buttons">
                <Link to="/login" className="button">
                  Login
                </Link>
                <Link to="/signup" className="button">
                  Register
                </Link>
              </div>
            )}
          </div>
        </header>
      </div>
    </div>
  );
}

export default Header;
