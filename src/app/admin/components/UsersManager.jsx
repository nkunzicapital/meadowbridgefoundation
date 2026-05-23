import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserPlus, Shield, Trash2, Key, Edit, Save, X } from "lucide-react";
import { toast } from "sonner";

const UsersManager = () => {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "editor",
    password: "",
  });
  const [resetPasswordId, setResetPasswordId] = useState(null);
  const [newPassword, setNewPassword] = useState("");

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin_users"],
    queryFn: async () => {
      const res = await fetch("/api/admin/users");
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (user) => {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin_users"]);
      setIsAdding(false);
      setNewUser({ name: "", email: "", role: "editor", password: "" });
      toast.success("User added!");
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ id, role }) => {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, role }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin_users"]);
      setEditingId(null);
      toast.success("Role updated!");
    },
  });

  const resetPwMutation = useMutation({
    mutationFn: async ({ id, password }) => {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin_users"]);
      setResetPasswordId(null);
      setNewPassword("");
      toast.success("Password reset!");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin_users"]);
      toast.success("User deleted!");
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-[#001d3d]">User Management</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#001d3d] text-white rounded-xl font-bold hover:bg-[#003566] transition-all"
        >
          <UserPlus size={20} /> Add Staff User
        </button>
      </div>

      {isAdding && (
        <div className="p-8 bg-white rounded-2xl shadow-md border border-gray-100 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#ffc300]"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#ffc300]"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">
                Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#ffc300]"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Role</label>
              <select
                className="w-full px-4 py-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#ffc300]"
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({ ...newUser, role: e.target.value })
                }
              >
                <option value="editor">Editor (Articles only)</option>
                <option value="admin">Admin (Full Access)</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button
              onClick={() => setIsAdding(false)}
              className="px-6 py-2 text-gray-500 font-bold hover:bg-gray-50 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={() => createMutation.mutate(newUser)}
              className="px-8 py-2 bg-[#ffc300] text-[#001d3d] font-bold rounded-xl hover:bg-[#ffd60a]"
            >
              Create Account
            </button>
          </div>
        </div>
      )}

      {resetPasswordId && (
        <div className="p-6 bg-yellow-50 rounded-2xl border border-yellow-200 space-y-4">
          <h3 className="font-bold text-[#001d3d]">
            Reset Password for User #{resetPasswordId}
          </h3>
          <div className="flex gap-3">
            <input
              type="password"
              placeholder="New password..."
              className="flex-grow px-4 py-3 rounded-xl bg-white border border-yellow-200 outline-none focus:ring-2 focus:ring-[#ffc300]"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              onClick={() =>
                newPassword &&
                resetPwMutation.mutate({
                  id: resetPasswordId,
                  password: newPassword,
                })
              }
              className="px-5 py-3 bg-[#001d3d] text-white font-bold rounded-xl"
            >
              Reset
            </button>
            <button
              onClick={() => {
                setResetPasswordId(null);
                setNewPassword("");
              }}
              className="p-3 bg-gray-100 text-gray-400 rounded-xl"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-400 text-xs font-black uppercase tracking-widest">
            <tr>
              <th className="px-8 py-4">Staff Member</th>
              <th className="px-8 py-4">Role</th>
              <th className="px-8 py-4">Joined</th>
              <th className="px-8 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users?.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-8 py-4">
                  <div className="font-bold text-[#001d3d]">{u.name}</div>
                  <div className="text-xs text-gray-400">{u.email}</div>
                </td>
                <td className="px-8 py-4">
                  {editingId === u.id ? (
                    <div className="flex gap-2 items-center">
                      <select
                        defaultValue={u.role}
                        onChange={(e) =>
                          updateRoleMutation.mutate({
                            id: u.id,
                            role: e.target.value,
                          })
                        }
                        className="px-3 py-1 rounded-lg bg-gray-50 border border-gray-200 text-xs font-bold outline-none"
                      >
                        <option value="editor">Editor</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${u.role === "admin" ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"}`}
                    >
                      {u.role}
                    </span>
                  )}
                </td>
                <td className="px-8 py-4 text-sm text-gray-400">
                  {new Date(u.created_at).toLocaleDateString()}
                </td>
                <td className="px-8 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditingId(u.id)}
                      title="Change Role"
                      className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => setResetPasswordId(u.id)}
                      title="Reset Password"
                      className="p-2 hover:bg-yellow-50 text-yellow-600 rounded-lg"
                    >
                      <Key size={18} />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm("Delete this user?"))
                          deleteMutation.mutate(u.id);
                      }}
                      title="Delete User"
                      className="p-2 hover:bg-red-50 text-red-600 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!users || users.length === 0) && !isLoading && (
          <div className="py-16 text-center text-gray-400">No users yet.</div>
        )}
      </div>
    </div>
  );
};

export default UsersManager;
