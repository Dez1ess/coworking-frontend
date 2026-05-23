import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  const currentUserId = Number(localStorage.getItem("user_id"));

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await axios.get("/api/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setUsers(res.data);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((u) =>
      `${u.first_name} ${u.last_name} ${u.email}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [users, search]);

  const openDeleteModal = (user: User) => {
    if (user.role === "admin") {
      toast.error("You cannot delete an admin");
      return;
    }

    if (user.user_id === currentUserId) {
      toast.error("You cannot delete yourself");
      return;
    }

    setDeleteTarget(user);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await axios.delete(`/api/users/${deleteTarget.user_id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setUsers((prev) =>
        prev.filter((u) => u.user_id !== deleteTarget.user_id),
      );

      toast.success("User deleted");
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleteTarget(null);
    }
  };

  if (loading) {
    return <div className="adminLoading">Loading users...</div>;
  }

  return (
    <div className="adminUsers">
      <h1>Users Management</h1>

      {/* FILTER */}
      <div className="topBar">
        <input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* GRID */}
      <div className="usersGrid">
        {filteredUsers.map((u) => (
          <div className="userCard" key={u.user_id}>
            <div className="userHeader">
              <div>
                <div className="name">
                  {u.first_name} {u.last_name}
                </div>
                <div className="email">{u.email}</div>
              </div>

              <div className="badge">#{u.user_id}</div>
            </div>

            {/* ROLE (READ ONLY) */}
            <div className="roleRow">
              <span>Role</span>

              <div className={`roleBadge ${u.role}`}>{u.role}</div>
            </div>

            <div className="actions">
              {u.role === "admin" || u.user_id === currentUserId ? null : (
                <button onClick={() => openDeleteModal(u)}>Delete</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {deleteTarget && (
        <div className="modalOverlay" onClick={() => setDeleteTarget(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete user?</h3>

            <p>
              Are you sure you want to delete{" "}
              <b>
                {deleteTarget.first_name} {deleteTarget.last_name}
              </b>
              ?
            </p>

            <div className="modalActions">
              <button className="cancel" onClick={() => setDeleteTarget(null)}>
                Cancel
              </button>

              <button className="danger" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
