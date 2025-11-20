import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

interface Payment {
  payment_id: number;
  booking_id: number;
  payment_date: string;
  amount: number;
  payment_method: "card" | "cash" | "transfer";
}

interface BookingsInterface {
  booking_id: number;
  workspace_number: string;
  start_time: string;
  end_time: string;
  price: number;
  cancelled: boolean;
  status: string;
}

function Dashboard_Section() {
  const [bookings, setBookings] = useState<BookingsInterface[]>([]);
  const [recentBookings, setRecentBookings] = useState<BookingsInterface[]>([]);
  const token = localStorage.getItem("token");

  const [payments, setPayments] = useState<Payment[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/payments`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setPayments(response.data);

        // Розраховуємо загальну суму
        const total = response.data.reduce(
          (sum: number, payment: Payment) => sum + Number(payment.amount),
          0
        );
        setTotalSpent(total);
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };

    fetchPayments();
  }, []);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/bookings/recent`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setRecentBookings(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    console.log(import.meta.env.VITE_API_URL)

    fetchRecent();
  }, [token]);

  useEffect(() => {
    const fetchAllBookings = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/bookings/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setBookings(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAllBookings();
  }, [token]);

  const upcomingBookings = [...bookings]
    .map((b) => {
      const start = new Date(b.start_time);
      const end = new Date(b.end_time);
      const now = new Date();

      let status = "upcoming";
      if (b.cancelled) status = "cancelled";
      else if (end < now) status = "completed";

      return { ...b, status };
    })
    .filter((b) => b.status === "upcoming");

  console.log("Upcoming Bookings:", upcomingBookings);

  const getBookingStatus = (booking: BookingsInterface): string => {
    if (booking.cancelled) return "cancelled";
    const end = new Date(booking.end_time);
    const now = new Date();
    return end < now ? "completed" : "upcoming";
  };

  return (
    <>
      <section className="dashboard">
        <div className="dashboard__welcome">Welcome back, David! 👋</div>
        <div className="dashboard__buttons">
          <Link className="book-btn" to={"/workspaces"}>
            📅 Book a Workspace
          </Link>
          <Link className="view-btn" to={"/bookings"}>
            📋 View My Bookings
          </Link>
        </div>
        <div className="dashboard__cards">
          <div className="dashboard-card">
            <div className="dashboard-card__title">📅 Upcoming Bookings</div>
            <div className="dashboard-card__value">
              {upcomingBookings.length}
            </div>
          </div>
          <div className="dashboard-card">
            <div className="dashboard-card__title">💳 Payments Summary</div>
            <div className="dashboard-card__value">
              ${totalSpent.toFixed(2)}
            </div>
          </div>
        </div>
        <div className="dashboard__bookings">
          <div className="dashboard__bookings-title">Recent Bookings</div>
          <div className="dashboard__bookings-cards">
            {recentBookings.length === 0 && (
              <div style={{ textAlign: "center" }}>No recent bookings</div>
            )}

            {recentBookings.map((b) => {
              const status = getBookingStatus(b);
              return (
                <div key={b.booking_id} className="bookings-card">
                  <div className="bookings-card-header">
                    <div className="bookings-card-header__title">
                      {b.workspace_number}
                    </div>
                    <div className="bookings-card-header__date">
                      {new Date(b.start_time).toLocaleString()} –{" "}
                      {new Date(b.end_time).toLocaleString()}
                    </div>
                  </div>

                  <div className="bookings-card-body">
                    <div className="bookings-card-body__price">
                      ${Number(b.price).toFixed(2)}
                    </div>
                    <div className={`bookings-card-body__status ${status}`}>
                      <span>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

export default Dashboard_Section;
