import { useEffect, useState } from "react";
import axios from "axios";

interface Workspace {
  workspace_id: number;
  workspace_number: string;
  type: string;
  status: string;
}

const API = `${import.meta.env.VITE_API_URL}/api/admin/workspaces`;

function AdminWorkspaces() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    workspace_number: "",
    type: "standard",
    status: "available",
  });

  const getToken = () => localStorage.getItem("token");

  // ================= FETCH =================
  const fetchWorkspaces = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setWorkspaces(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  // ================= OPEN MODAL =================
  const openCreate = () => {
    setEditingId(null);
    setFormData({
      workspace_number: "",
      type: "standard",
      status: "available",
    });
    setModalOpen(true);
  };

  const handleEdit = (w: Workspace) => {
    setEditingId(w.workspace_id);
    setFormData({
      workspace_number: w.workspace_number,
      type: w.type,
      status: w.status,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  // ================= SAVE =================
  const handleSubmit = async () => {
    if (!formData.workspace_number.trim()) return;

    setSaving(true);
    try {
      const token = getToken();

      if (editingId) {
        await axios.put(`${API}/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(API, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setModalOpen(false);
      fetchWorkspaces();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id: number) => {
    const ok = confirm("Delete workspace?");
    if (!ok) return;

    await axios.delete(`${API}/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    setWorkspaces((prev) => prev.filter((w) => w.workspace_id !== id));
  };

  return (
    <section className="admin-workspaces">
      <div className="admin-workspaces__top">
        <h1 className="admin-workspaces__title">Workspace Management</h1>

        <button
          className="admin-workspaces__btn admin-workspaces__btn--primary"
          onClick={openCreate}
        >
          + Create Workspace
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="admin-workspaces__table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Workspace</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {workspaces.map((w) => (
              <tr key={w.workspace_id}>
                <td>{w.workspace_id}</td>
                <td>{w.workspace_number}</td>
                <td>{w.type}</td>
                <td>
                  <span
                    className={`admin-workspaces__status admin-workspaces__status--${w.status}`}
                  >
                    {w.status}
                  </span>
                </td>
                <td>
                  <div className="admin-workspaces__actions">
                    <button
                      onClick={() => handleEdit(w)}
                      className="admin-workspaces__btn admin-workspaces__btn--edit"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(w.workspace_id)}
                      className="admin-workspaces__btn admin-workspaces__btn--delete"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ================= MODAL ================= */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingId ? "Edit Workspace" : "Create Workspace"}</h2>

            <input
              type="text"
              placeholder="Workspace Number"
              value={formData.workspace_number}
              onChange={(e) =>
                setFormData({ ...formData, workspace_number: e.target.value })
              }
            />

            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
            >
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
              <option value="meeting_room">Meeting Room</option>
            </select>

            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <option value="available">Available</option>
              <option value="booked">Booked</option>
              <option value="maintenance">Maintenance</option>
            </select>

            <div className="modal__actions">
              <button onClick={closeModal} className="admin-workspaces__btn">
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={saving}
                className="admin-workspaces__btn admin-workspaces__btn--primary"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default AdminWorkspaces;
