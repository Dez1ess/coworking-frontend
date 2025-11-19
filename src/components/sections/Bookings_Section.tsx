import axios from "axios";
import { useState, useEffect } from "react";

interface BookingsInterface {
  booking_id: number;
  workspace_number: string;
  start_time: string;
  end_time: string;
  price: number;
  cancelled: boolean;
  status: string;
}

function Bookings_Section() {
  const [bookings, setBookings] = useState<BookingsInterface[]>([]);
  const [sortBy, setSortBy] = useState("latest");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/bookings`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setBookings(
          response.data.map((b: any) => ({
            booking_id: b.booking_id,
            workspace_number: b.workspace_number,
            start_time: b.start_time,
            end_time: b.end_time,
            price: Number(b.price),
            cancelled: b.cancelled || false,
          }))
        );
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, []);

  const handleCancelBooking = async (booking: BookingsInterface) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/bookings/cancel/${
          booking.booking_id
        }`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBookings((prev) =>
        prev.map((b) =>
          b.booking_id === booking.booking_id ? { ...b, cancelled: true } : b
        )
      );
    } catch (err) {
      console.error("Error cancelling booking:", err);
    }
  };

  const statusPriority: Record<string, number> = {
    upcoming: 1,
    completed: 2,
    cancelled: 3,
  };

  return (
    <section className="bookings">
      <div className="bookings__title">
        <h1>My Bookings</h1>
      </div>
      <div className="bookings__descr">
        <p>Manage and view all your workspace bookings</p>
      </div>

      <div className="bookings-sort">
        <div className="bookings-sort__label">Sort by:</div>
        <select
          className="bookings-sort__select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
          <option value="status">Status</option>
        </select>
      </div>

      <div className="bookings-table">
        <div className="bookings-table-head">
          <div className="bookings-table-head__item">Workspace</div>
          <div className="bookings-table-head__item date">Date & Time</div>
          <div className="bookings-table-head__item price">Price</div>
          <div className="bookings-table-head__item">Status</div>
          <div className="bookings-table-head__item">Actions</div>
        </div>

        {[...bookings]
          .map((b) => {
            const start = new Date(b.start_time);
            const end = new Date(b.end_time);
            const now = new Date();

            let status = "upcoming";
            if (b.cancelled) status = "cancelled";
            else if (end < now) status = "completed";

            return { ...b, status };
          })
          .sort((a, b) => {
            const aTime = new Date(a.start_time).getTime();
            const bTime = new Date(b.start_time).getTime();

            if (sortBy === "latest") return bTime - aTime;
            if (sortBy === "oldest") return aTime - bTime;

            if (sortBy === "status") {
              const aStatus = statusPriority[a.status];
              const bStatus = statusPriority[b.status];
              return aStatus - bStatus;
            }

            return 0;
          })
          .map((b) => {
            const start = new Date(b.start_time);
            const end = new Date(b.end_time);
            const now = new Date();

            const sameMonth =
              start.getMonth() === end.getMonth() &&
              start.getFullYear() === end.getFullYear();

            const dateDisplay = sameMonth
              ? `${start.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })} • ${start.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })} - ${end.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`
              : `${start.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })} • Full month`;

            let status = "upcoming";
            if (b.cancelled) status = "cancelled";
            else if (end < now) status = "completed";

            return (
              <div className="bookings-table-row" key={b.booking_id}>
                <div className="bookings-table-row__item bookings-table-row__item-workspace">
                  {b.workspace_number}
                </div>
                <div className="bookings-table-row__item bookings-table-row__item-datetime">
                  {dateDisplay}
                </div>
                <div className="bookings-table-row__item bookings-table-row__item-price">
                  ${b.price.toFixed(2)}
                </div>
                <div
                  className={`bookings-table-row__item bookings-table-row__item-status ${status}`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </div>
                <div className="bookings-table-row__item bookings-table-row__item-actions">
                  {status === "upcoming" ? (
                    <>
                      <div
                        className="bookings-table-row__item__cancel-btn"
                        onClick={() => handleCancelBooking(b)}
                      >
                        Cancel
                      </div>
                    </>
                  ) : (
                    <div className="bookings-table-row__item__none-btn">
                      No Actions
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </section>
  );
}

export default Bookings_Section;
