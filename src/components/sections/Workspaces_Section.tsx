import { useState, useEffect, JSX } from "react";
import axios from "axios";

interface Space {
  workspace_id: number;
  workspace_number: string;
  type: string;
  status: string;
}

interface Tariff {
  tariff_id: number;
  plan_type: string;
  plan_name: string;
  price: number;
  icon: string;
  description: string;
}

function Workspaces_Section() {
  const [selectedPlan, setSelectedPlan] = useState("standard");
  const [selectedPrice, setSelectedPrice] = useState(15);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSpace, setSelectedSpace] = useState<string | null>(null);
  const [calendarHTML, setCalendarHTML] = useState<JSX.Element[]>([]);
  const [spaces, setSpaces] = useState<Record<string, Space[]>>({});
  const [tariffs, setTariffs] = useState<Tariff[]>([]);

  // ===== Fetch tariffs =====
  useEffect(() => {
    const fetchTariffs = async () => {
      try {
        const response = await axios.get("/api/tariffs");
        setTariffs(response.data);
      } catch (err) {
        console.error("Error fetching tariffs:", err);
      }
    };
    fetchTariffs();
  }, []);

  // ===== Map tariffs =====
  const planMap = tariffs.reduce((acc, t) => {
    acc[t.plan_type] = t;
    return acc;
  }, {} as Record<string, Tariff>);

  // Функція для перевірки занятості при виборі дати в календарі
  const getAvailabilityCheckRange = (date: Date, plan: string) => {
    if (!planMap[plan]) return null;

    const start = new Date(date);
    const end = new Date(date);

    // Для всіх планів перевіряємо тільки обраний день
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    return { start: start.toISOString(), end: end.toISOString() };
  };

  // Функція для розрахунку часу бронювання (для API при створенні)
  const getBookingTimeRange = (date: Date, plan: string) => {
    if (!planMap[plan]) return null;

    const start = new Date(date);
    let end = new Date(date);

    if (plan === "standard" || plan === "meeting_room") {
      start.setHours(8, 0, 0, 0);
      end.setHours(17, 0, 0, 0);
    } else if (plan === "premium") {
      // Бронювання на місяц
      start.setHours(0, 0, 0, 0);
      end.setMonth(end.getMonth() + 1);
      end.setHours(23, 59, 59, 999);
    }

    return { start: start.toISOString(), end: end.toISOString() };
  };
  // ===== Fetch spaces =====
  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        // Отримуємо ВСІ workspace'и
        const allResponse = await axios.get("/api/workspaces");
        let allSpaces: Record<string, Space[]> = {
          standard: [],
          premium: [],
          meeting_room: [],
        };

        if (Array.isArray(allResponse.data)) {
          allResponse.data.forEach((space: Space) => {
            if (allSpaces[space.type]) {
              allSpaces[space.type].push(space);
            }
          });
        }

        let availableIds = new Set<number>();

        // Якщо вибрана дата, отримуємо доступні
        if (selectedDate) {
          const timeRange = getAvailabilityCheckRange(
            selectedDate,
            selectedPlan
          );

          if (timeRange) {
            const url = `/api/workspaces?start_time=${encodeURIComponent(
              timeRange.start
            )}&end_time=${encodeURIComponent(timeRange.end)}`;
            const availableResponse = await axios.get(url);
            availableIds = new Set(
              availableResponse.data
                .filter((s: Space) => s.status === "available")
                .map((s: Space) => s.workspace_id)
            );
          }
        } else {
          // всі доступні
          Object.values(allSpaces).forEach((typeSpaces) =>
            typeSpaces.forEach((s) => availableIds.add(s.workspace_id))
          );
        }

        // Позначаємо статуси
        const grouped: Record<string, Space[]> = {
          standard: [],
          premium: [],
          meeting_room: [],
        };

        Object.keys(allSpaces).forEach((type) => {
          grouped[type] = allSpaces[type].map((space) => ({
            ...space,
            status: availableIds.has(space.workspace_id)
              ? "available"
              : "booked",
          }));
        });

        setSpaces(grouped);
      } catch (error) {
        console.error("Error fetching workspaces:", error);
      }
    };

    if (Object.keys(planMap).length > 0) {
      fetchSpaces();
    }
  }, [selectedPlan, selectedDate, planMap]);

  const updatePricing = () => {
    const tax = selectedPrice * 0.1;
    const total = selectedPrice + tax;
    return { subtotal: selectedPrice, tax, total };
  };

  const handlePlanSelect = (plan: string) => {
    setSelectedPlan(plan);
    setSelectedPrice(Number(planMap[plan]?.price) || 0);
    setSelectedDate(null);
    setSelectedSpace(null);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedSpace(null);
  };

  const handleSpaceSelect = (spaceNumber: string) => {
    setSelectedSpace(spaceNumber);
  };

  // =============================
  //      CREATE BOOKING
  // =============================
  const completeBooking = async () => {
    if (!selectedDate || !selectedSpace) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to book a space");
        return;
      }

      const workspace = Object.values(spaces)
        .flat()
        .find((s) => s.workspace_number === selectedSpace);

      if (!workspace) {
        alert("Workspace not found");
        return;
      }

      const tariff = planMap[selectedPlan];
      if (!tariff) {
        alert("Tariff not found");
        return;
      }

      const timeRange = getBookingTimeRange(selectedDate, selectedPlan);
      if (!timeRange) {
        alert("Could not determine booking time");
        return;
      }

      const { total } = updatePricing();

      const res = await axios.post(
        "/api/bookings",
        {
          workspace_id: workspace.workspace_id,
          workspace_number: workspace.workspace_number,
          tariff_id: tariff.tariff_id,
          start_time: timeRange.start,
          end_time: timeRange.end,
          price: total,
          cancelled: false,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 200 || res.status === 201) {
        const startDate = new Date(timeRange.start);
        alert(
          `✅ Booking Confirmed!\n\nPlan: ${
            tariff.plan_name
          }\nDate: ${startDate.toLocaleDateString()}\nSpace: ${selectedSpace}\nTotal: $${total.toFixed(
            2
          )}`
        );

        // Очищаємо форму
        setSelectedDate(null);
        setSelectedSpace(null);
      }
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 409) {
        alert(
          "This workspace is no longer available. Please select another one."
        );
      } else {
        alert("Booking error");
      }
    }
  };

  // ===== Build Calendar =====
  useEffect(() => {
    const today = new Date();
    const months: JSX.Element[] = [];
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    for (let i = 0; i < 2; i++) {
      const current = new Date(today.getFullYear(), today.getMonth() + i, 1);
      const lastDay = new Date(
        current.getFullYear(),
        current.getMonth() + 1,
        0
      ).getDate();
      const firstDay = current.getDay();
      const weeks: JSX.Element[] = [];
      let cells: JSX.Element[] = [];

      for (let j = 0; j < firstDay; j++) {
        cells.push(<td key={`empty-${i}-${j}`} />);
      }

      for (let day = 1; day <= lastDay; day++) {
        const date = new Date(current.getFullYear(), current.getMonth(), day);
        const disabled = date < today;
        const selected =
          selectedDate && date.toDateString() === selectedDate.toDateString();

        cells.push(
          <td
            key={day}
            className={`calendar__cell ${
              disabled ? "calendar__cell--disabled" : ""
            } ${selected ? "calendar__cell--selected" : ""}`}
            onClick={() => !disabled && handleDateSelect(date)}
          >
            {day}
          </td>
        );

        if (cells.length === 7) {
          weeks.push(<tr key={`week-${day}`}>{cells}</tr>);
          cells = [];
        }
      }

      if (cells.length > 0) weeks.push(<tr key={`last-${i}`}>{cells}</tr>);

      months.push(
        <tbody key={`month-${i}`}>
          <tr>
            <th colSpan={7} className="calendar__month">
              {monthNames[current.getMonth()]} {current.getFullYear()}
            </th>
          </tr>
          <tr>
            {dayNames.map((d) => (
              <th key={d} className="calendar__day">
                {d}
              </th>
            ))}
          </tr>
          {weeks}
        </tbody>
      );
    }
    setCalendarHTML(months);
  }, [selectedDate]);

  const { subtotal, tax, total } = updatePricing();
  const canBook = !!selectedDate && !!selectedSpace;

  return (
    <section className="workspace">
      <header className="workspace__header">
        <h1 className="workspace__title">Book Your Workspace</h1>
        <p className="workspace__subtitle">
          Choose a plan, select dates, and book your perfect space
        </p>
      </header>

      {/* === Step 1: Plan Selection === */}
      <div className="workspace__plans">
        <h2 className="workspace__step">Step 1: Choose Your Plan</h2>
        <div className="workspace__plans-grid">
          {tariffs.map((t) => (
            <div
              key={t.tariff_id}
              className={`plan-card ${
                selectedPlan === t.plan_type ? "plan-card--selected" : ""
              }`}
              onClick={() => handlePlanSelect(t.plan_type)}
            >
              <div className="plan-card__icon">{t.icon}</div>
              <p className="plan-card__name">{t.plan_name}</p>
              <p className="plan-card__price">${t.price}</p>
              <p className="plan-card__descr">{t.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* === Step 2: Calendar + Details === */}
      <div className="workspace__booking">
        <div className="calendar-box">
          <h3 className="workspace__step">Step 2: Select Date</h3>
          <table className="calendar">{calendarHTML}</table>
        </div>

        <div className="details-box">
          <h3 className="workspace__step">Booking Details</h3>
          <div className="details-box__row">
            <span>Selected Plan</span>
            <span>{planMap[selectedPlan]?.plan_name || "Not selected"}</span>
          </div>
          <div className="details-box__row">
            <span>Date</span>
            <span>
              {selectedDate
                ? selectedDate.toLocaleDateString("en-US")
                : "Not selected"}
            </span>
          </div>
          <div className="details-box__row">
            <span>Subtotal</span>
            <span className="special">${Number(subtotal || 0).toFixed(2)}</span>
          </div>
          <div className="details-box__row">
            <span>Tax (10%)</span>
            <span>${Number(tax || 0).toFixed(2)}</span>
          </div>
          <div className="details-box__row details-box__row--total">
            <span>Total</span>
            <span className="special">${Number(total || 0).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* === Step 3: Spaces === */}
      <div className="workspace__spaces">
        <h3 className="workspace__step">Step 3: Select Your Space</h3>
        <div className="workspace__spaces-grid">
          {spaces[selectedPlan]?.length > 0 ? (
            spaces[selectedPlan].map((space) => (
              <div
                key={space.workspace_id}
                className={`space-card ${
                  selectedSpace === space.workspace_number
                    ? "space-card--selected"
                    : ""
                } ${
                  space.status !== "available" ? "space-card--disabled" : ""
                }`}
                onClick={() => {
                  if (space.status === "available") {
                    handleSpaceSelect(space.workspace_number);
                  }
                }}
                style={{
                  cursor:
                    space.status === "available" ? "pointer" : "not-allowed",
                }}
              >
                <p className="space-card__name">{space.workspace_number}</p>
                <p className="space-card__capacity">
                  {space.status === "available" ? "Available" : "Booked"}
                </p>
              </div>
            ))
          ) : (
            <p className="workspace__no-spaces">
              {selectedDate
                ? "No spaces available for this date"
                : "Select a date to see available spaces"}
            </p>
          )}
        </div>
      </div>

      {/* === Summary === */}
      <div className="workspace__summary">
        <h3 className="workspace__summary-title">Ready to Book?</h3>
        <div className="workspace__summary-text">
          {selectedDate && selectedSpace ? (
            <>
              <div>Date: {selectedDate.toLocaleDateString()}</div>
              <div>Space: {selectedSpace}</div>
            </>
          ) : (
            "Select a plan, date, and space to continue"
          )}
        </div>

        <button
          className="workspace__btn"
          disabled={!canBook}
          onClick={completeBooking}
        >
          Complete Booking
        </button>
      </div>
    </section>
  );
}

export default Workspaces_Section;
