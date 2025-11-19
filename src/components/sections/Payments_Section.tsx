import { useState, useEffect } from "react";
import axios from "axios";

interface Payment {
  payment_id: number;
  booking_id: number;
  payment_date: string;
  amount: number;
  payment_method: "card" | "cash" | "transfer";
}

function Payments_Section() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    fetchPayments();
  }, []);

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

  const getMethodIcon = (method: string): string => {
    switch (method) {
      case "card":
        return "💳";
      case "cash":
        return "💵";
      case "transfer":
        return "🏦";
      default:
        return "💳";
    }
  };

  const getMethodLabel = (method: string): string => {
    switch (method) {
      case "card":
        return "Credit Card";
      case "cash":
        return "Cash";
      case "transfer":
        return "Bank Transfer";
      default:
        return "Unknown";
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <section className="payments">
        <div className="payments__title">
          <h1>Payments</h1>
        </div>
        <div className="payments__descr">
          <p>View and manage all your transactions</p>
        </div>
        <div className="payments__cards">
          <div className="payments-card">
            <div className="payments-card__title">💳 Total Spent</div>
            <div className="payments-card__value">${totalSpent.toFixed(2)}</div>
            <div className="payments-card__descr">All time transactions</div>
          </div>
        </div>
        <div className="payments-table">
          <div className="payments-table-head">
            <div className="payments-table-head__col">Date</div>
            <div className="payments-table-head__col">Amount</div>
            <div className="payments-table-head__col">Method</div>
          </div>
          {payments.length > 0 ? (
            payments.map((payment) => (
              <div key={payment.payment_id} className="payments-table-row">
                <div className="payments-table-row__col date">
                  {formatDate(payment.payment_date)}
                </div>
                <div className="payments-table-row__col price">
                  +${Number(payment.amount).toFixed(2)}
                </div>
                <div className="payments-table-row__col method">
                  {getMethodIcon(payment.payment_method)}{" "}
                  {getMethodLabel(payment.payment_method)}
                </div>
              </div>
            ))
          ) : (
            <div className="payments-table-row">
              <div className="payments-table-row__col">No payments yet</div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default Payments_Section;
