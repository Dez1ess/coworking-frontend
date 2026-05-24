import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface Stats {
  users: number;
  bookings: number;
  reviews: number;
  revenue: number;
}

interface Booking {
  booking_id: number;
  first_name: string;
  workspace_number: string;
  start_time: string;
  price: number;
}

interface Review {
  review_id: number;
  username: string;
  review_text: string;
  rating: number;
}

function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    users: 0,
    bookings: 0,
    reviews: 0,
    revenue: 0,
  });

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const [charts, setCharts] = useState<any>({
    bookings: [],
    revenue: [],
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/dashboard`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setStats(res.data.stats);
      setBookings(res.data.latestBookings);
      setReviews(res.data.latestReviews);

      setCharts({
        bookings: res.data.allTimeBookings || [],
        revenue: res.data.allTimeRevenue || [],
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <h2>Loading dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* HEADER */}
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Workspace management overview</p>
      </div>

      {/* STATS */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="label">👱‍♂️ Users</span>
          <h2>{stats.users}</h2>
        </div>
        <div className="stat-card">
          <span className="label">📔 Bookings</span>
          <h2>{stats.bookings}</h2>
        </div>
        <div className="stat-card">
          <span className="label">⭐Reviews</span>
          <h2>{stats.reviews}</h2>
        </div>
        <div className="stat-card">
          <span className="label">💵 Revenue</span>
          <h2>${stats.revenue}</h2>
        </div>
      </div>

      {/* CHARTS */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Bookings (all time)</h3>

          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={charts.bookings}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="day" tickFormatter={(v) => v?.slice(5)} />

              <YAxis allowDecimals={false} />
              <Tooltip labelFormatter={(v) => `Date: ${v}`} />

              <Line
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Revenue (all time)</h3>

          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={charts.revenue}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="day" tickFormatter={(v) => v?.slice(5)} />

              <YAxis />
              <Tooltip labelFormatter={(v) => `Date: ${v}`} />

              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CONTENT */}
      <div className="dashboard-content">
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Recent Bookings</h3>
          </div>

          <div className="bookings-list">
            {bookings.map((b) => (
              <div className="booking-row" key={b.booking_id}>
                <span>{b.first_name}</span>
                <span>{b.workspace_number || "—"}</span>
                <span>{new Date(b.start_time).toLocaleDateString()}</span>
                <span>${b.price}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3>Recent Reviews</h3>
          </div>

          <div className="reviews-list">
            {reviews.map((r) => (
              <div className="review-item" key={r.review_id}>
                <div className="review-top">
                  <strong>{r.username}</strong>
                  <div>⭐ {r.rating}</div>
                </div>
                <p>{r.review_text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="quick-actions">
        <div className="action-card" onClick={() => navigate("/admin/users")}>
          <h4>👱‍♂️ Manage Users</h4>
        </div>

        <div
          className="action-card"
          onClick={() => navigate("/admin/bookings")}
        >
          <h4>📔 Manage Bookings</h4>
        </div>

        <div
          className="action-card"
          onClick={() => navigate("/admin/workspaces")}
        >
          <h4>🖥️ Manage Workspaces</h4>
        </div>

        <div className="action-card" onClick={() => navigate("/admin/tariffs")}>
          <h4>📈 Manage Tariffs</h4>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
