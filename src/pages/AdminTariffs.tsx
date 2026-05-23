import { useEffect, useState } from "react";
import axios from "axios";

import toast from "react-hot-toast";

interface Tariff {
  tariff_id: number;
  plan_name: string;
  plan_type: string;
  price: number;
  icon: string;
  description: string;
}

const API = `${import.meta.env.VITE_API_URL}/api/admin/tariffs`;

function AdminTariffs() {
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTariffs();
  }, []);

  const fetchTariffs = async () => {
    try {
      const res = await axios.get(API, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTariffs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePriceChange = (tariff_id: number, value: string) => {
    setTariffs((prev) =>
      prev.map((t) =>
        t.tariff_id === tariff_id ? { ...t, price: Number(value) } : t,
      ),
    );
  };

  const handleSave = async (tariff_id: number, price: number) => {
    const loadingToast = toast.loading("Updating price...");

    try {
      await axios.put(
        `${API}/${tariff_id}`,
        { price },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Price updated successfully", {
        id: loadingToast,
      });

      await fetchTariffs();
    } catch (err) {
      console.error(err);

      toast.error("Failed to update price", {
        id: loadingToast,
      });
    }
  };

  return (
    <div className="admin-tariffs">
      <div className="admin-tariffs__header">
        <h1>Tariff Management</h1>
        <p>Manage pricing for all subscription plans</p>
      </div>

      <div className="admin-tariffs__grid">
        {tariffs.map((tariff) => (
          <div className="tariff-card" key={tariff.tariff_id}>
            <div className="tariff-card__icon">{tariff.icon}</div>

            <div className="tariff-card__content">
              <h2>{tariff.plan_name}</h2>

              <p className="tariff-card__type">{tariff.plan_type}</p>

              <p className="tariff-card__description">{tariff.description}</p>

              <div className="tariff-card__price">
                <span>$</span>

                <input
                  type="number"
                  value={tariff.price}
                  onChange={(e) =>
                    handlePriceChange(tariff.tariff_id, e.target.value)
                  }
                />
              </div>

              <button
                onClick={() => handleSave(tariff.tariff_id, tariff.price)}
                disabled={loading}
              >
                Save Changes
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminTariffs;
