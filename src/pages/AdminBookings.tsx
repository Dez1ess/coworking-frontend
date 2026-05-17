import axios from "axios";
import { useEffect, useMemo, useState } from "react";

import { toast } from "react-hot-toast";

interface Booking {
  booking_id: number;
  user_id: number;
  first_name: string;
  email: string;
  workspace_number: string;
  start_time: string;
  end_time: string;
  price: number;
  cancelled: boolean;
}

type StatusFilter = "all" | "upcoming" | "completed" | "cancelled";

function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [actionType, setActionType] = useState<"delete" | "cancel" | null>(
    null,
  );

  const token = localStorage.getItem("token");

  const fetchBookings = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/admin/bookings`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    setBookings(res.data);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  /* =========================
     MODAL OPEN
  ========================= */
  const openModal = (id: number, type: "delete" | "cancel") => {
    setSelectedId(id);
    setActionType(type);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedId(null);
    setActionType(null);
  };

  /* =========================
     CONFIRM ACTION
  ========================= */
  const confirmAction = async () => {
    if (!selectedId) return;

    if (actionType === "delete") {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/bookings/${selectedId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setBookings((prev) => prev.filter((b) => b.booking_id !== selectedId));

      toast.success("Booking deleted");
    }

    if (actionType === "cancel") {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/admin/bookings/${selectedId}`,
        { cancelled: true },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      fetchBookings();

      toast("Booking cancelled", {
        icon: "🚫",
      });
    }

    closeModal();
  };

  const processed = useMemo(() => {
    return bookings
      .map((b) => {
        const end = new Date(b.end_time);

        let status: StatusFilter = "upcoming";
        if (b.cancelled) status = "cancelled";
        else if (end < new Date()) status = "completed";

        return { ...b, status };
      })
      .filter((b) => {
        const q = search.toLowerCase();

        const matchesSearch =
          b.first_name.toLowerCase().includes(q) ||
          b.email.toLowerCase().includes(q) ||
          b.workspace_number.toLowerCase().includes(q);

        const matchesStatus =
          statusFilter === "all" || b.status === statusFilter;

        return matchesSearch && matchesStatus;
      });
  }, [bookings, search, statusFilter]);

  return (
    <section className="admin-bookings">
      <h1>Admin Bookings</h1>

      {/* CONTROL BAR */}
      <div className="admin-bookings__controls">
        <input
          className="admin-bookings__search"
          placeholder="Search user, email, workspace..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="admin-bookings__filters">
          {(["all", "upcoming", "completed", "cancelled"] as const).map((s) => (
            <button
              key={s}
              className={`filter-btn ${statusFilter === s ? "active" : ""}`}
              onClick={() => setStatusFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* GRID */}
      <div className="admin-bookings__grid">
        {processed.map((b) => {
          const start = new Date(b.start_time);
          const end = new Date(b.end_time);

          return (
            <div key={b.booking_id} className="booking-card">
              <div className="booking-card__user">
                <div className="booking-card__user-name">{b.first_name}</div>
                <div className="booking-card__user-email">{b.email}</div>
              </div>

              <div className="booking-card__info">
                <div>
                  Workspace: <span>{b.workspace_number}</span>
                </div>
                <div>
                  Time:{" "}
                  <span>
                    {start.toLocaleString()} → {end.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="booking-card__price">
                ${Number(b.price).toFixed(2)}
              </div>

              <div className={`booking-status ${b.status}`}>{b.status}</div>

              <div className="booking-card__actions">
                {b.status === "upcoming" ? (
                  <button
                    className="booking-card__actions-cancel"
                    onClick={() => openModal(b.booking_id, "cancel")}
                  >
                    Cancel
                  </button>
                ) : (
                  <button className="booking-card__actions-disabled">
                    No Action
                  </button>
                )}

                <button
                  className="booking-card__actions-delete"
                  onClick={() => openModal(b.booking_id, "delete")}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* =========================
          MODAL
      ========================= */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Action</h3>

            <p>
              Are you sure you want to <strong>{actionType}</strong> this
              booking?
            </p>

            <div className="modal__actions">
              <button className="modal__cancel" onClick={closeModal}>
                Cancel
              </button>

              <button className="modal__confirm" onClick={confirmAction}>
                Yes, confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default AdminBookings;
