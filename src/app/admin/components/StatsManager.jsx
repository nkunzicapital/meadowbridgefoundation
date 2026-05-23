import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Edit, Save, X, Activity } from "lucide-react";
import { toast } from "sonner";

const StatsManager = () => {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [newStat, setNewStat] = useState({
    label: "",
    value: "",
    icon: "Activity",
  });

  const { data: stats } = useQuery({
    queryKey: ["admin_stats"],
    queryFn: async () => {
      const res = await fetch("/api/stats");
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (stat) => {
      const res = await fetch("/api/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stat),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin_stats"]);
      setIsAdding(false);
      setNewStat({ label: "", value: "", icon: "Activity" });
      toast.success("Stat added!");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (stat) => {
      const res = await fetch("/api/stats", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stat),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin_stats"]);
      setEditingId(null);
      toast.success("Stat updated!");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await fetch(`/api/stats?id=${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin_stats"]);
      toast.success("Stat deleted!");
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-[#001d3d]">Impact Stats</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#001d3d] text-white rounded-xl font-bold hover:bg-[#003566] transition-all"
        >
          <Plus size={20} /> Add Counter
        </button>
      </div>

      {isAdding && (
        <div className="p-8 bg-white rounded-2xl shadow-md border border-gray-100 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">
                Label (e.g., Global Partners)
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#ffc300]"
                value={newStat.label}
                onChange={(e) =>
                  setNewStat({ ...newStat, label: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">
                Value (e.g., 50+)
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#ffc300]"
                value={newStat.value}
                onChange={(e) =>
                  setNewStat({ ...newStat, value: e.target.value })
                }
              />
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
              onClick={() => createMutation.mutate(newStat)}
              className="px-8 py-2 bg-[#ffc300] text-[#001d3d] font-bold rounded-xl hover:bg-[#ffd60a]"
            >
              Add Stat
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats?.map((stat) => (
          <div
            key={stat.id}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center"
          >
            {editingId === stat.id ? (
              <div className="space-y-3">
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 outline-none text-center font-black text-2xl text-[#001d3d] focus:ring-2 focus:ring-[#ffc300]"
                  value={editForm.value}
                  onChange={(e) =>
                    setEditForm({ ...editForm, value: e.target.value })
                  }
                />
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 outline-none text-center text-xs font-bold text-gray-400 uppercase focus:ring-2 focus:ring-[#ffc300]"
                  value={editForm.label}
                  onChange={(e) =>
                    setEditForm({ ...editForm, label: e.target.value })
                  }
                />
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => updateMutation.mutate(editForm)}
                    className="p-2 bg-[#ffc300] text-[#001d3d] rounded-lg"
                  >
                    <Save size={16} />
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="p-2 bg-gray-100 text-gray-400 rounded-lg"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="text-3xl font-black text-[#001d3d] mb-2">
                  {stat.value}
                </div>
                <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
                  {stat.label}
                </div>
                <div className="flex justify-center gap-2 pt-4 border-t border-gray-50">
                  <button
                    onClick={() => {
                      setEditingId(stat.id);
                      setEditForm(stat);
                    }}
                    className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(stat.id)}
                    className="p-2 hover:bg-red-50 text-red-600 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsManager;
