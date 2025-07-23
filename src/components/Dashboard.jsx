import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

export default function Dashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", role: "" });
  const [editId, setEditId] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await axios.get(`${API}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to load users", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API}/users/${editId}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEditId(null);
      } else {
        await axios.post(`${API}/users`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setForm({ name: "", email: "", role: "" });
      loadUsers();
    } catch (err) {
      console.error("Error submitting form", err);
    }
  };

  const handleEdit = (user) => {
    setForm(user);
    setEditId(user.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      loadUsers();
    } catch (err) {
      console.error("Error deleting user", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-blue-700">User Dashboard</h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
          >
            Logout
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
        >
          <input
            placeholder="Name"
            className="p-2 border border-gray-300 rounded"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            placeholder="Email"
            className="p-2 border border-gray-300 rounded"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            placeholder="Role"
            className="p-2 border border-gray-300 rounded"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          />
          <button
            className="bg-green-500 hover:bg-green-600 text-white rounded px-4 py-2"
            type="submit"
          >
            {editId ? "Update" : "Add"}
          </button>
        </form>
        <ul className="space-y-3">
          {users.map((u) => (
            <li
              key={u.id}
              className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <strong className="text-lg">{u.name}</strong>{" "}
                <span className="text-gray-600">({u.email})</span> -{" "}
                <em className="text-purple-600">{u.role}</em>
              </div>
              <div className="space-x-2">
                <button
                  className="text-blue-700 hover:underline"
                  onClick={() => handleEdit(u)}
                >
                  Edit
                </button>
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => handleDelete(u.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}