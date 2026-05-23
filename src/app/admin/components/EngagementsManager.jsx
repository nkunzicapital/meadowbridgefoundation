import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Edit, Save, X, Download, Tag } from "lucide-react";
import useUpload from "@/utils/useUpload";
import { toast } from "sonner";

const BLANK = {
  title: "",
  category: "",
  year: "",
  engagement_date: "",
  country: "",
  representative: "",
  report_url: "",
};

const EngagementsManager = () => {
  const queryClient = useQueryClient();
  const [upload] = useUpload();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [editForm, setEditForm] = useState({});
  const [newCategory, setNewCategory] = useState("");
  const [showCatManager, setShowCatManager] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ["engagement_categories"],
    queryFn: async () => {
      const res = await fetch("/api/engagement-categories");
      return res.json();
    },
  });

  const { data: engagements } = useQuery({
    queryKey: ["admin_engagements"],
    queryFn: async () => {
      const res = await fetch("/api/engagements");
      return res.json();
    },
  });

  const createMut = useMutation({
    mutationFn: async (data) => {
      const res = await fetch("/api/engagements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin_engagements"]);
      setIsAdding(false);
      setForm(BLANK);
      toast.success("Engagement added!");
    },
  });

  const updateMut = useMutation({
    mutationFn: async (data) => {
      const res = await fetch("/api/engagements", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin_engagements"]);
      setEditingId(null);
      toast.success("Engagement updated!");
    },
  });

  const deleteMut = useMutation({
    mutationFn: async (id) => {
      await fetch(`/api/engagements?id=${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin_engagements"]);
      toast.success("Deleted!");
    },
  });

  const addCatMut = useMutation({
    mutationFn: async (name) => {
      const res = await fetch("/api/engagement-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["engagement_categories"]);
      setNewCategory("");
      toast.success("Category added!");
    },
  });

  const deleteCatMut = useMutation({
    mutationFn: async (id) => {
      await fetch(`/api/engagement-categories?id=${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["engagement_categories"]);
      toast.success("Category deleted!");
    },
  });

  const uploadReport = async (e, setter) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ base64: reader.result }),
      });
      if (res.ok) {
        const { url } = await res.json();
        setter((p) => ({ ...p, report_url: url }));
        toast.success("Report uploaded!");
      } else toast.error("Upload failed");
    };
    reader.readAsDataURL(file);
  };

  const FormFields = ({ data, setData, onSave, onCancel, btnLabel }) => (
    <div className="p-8 bg-white rounded-2xl shadow-md border border-gray-100 space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-2 space-y-2">
          <label className="text-sm font-bold text-gray-700">Title *</label>
          <input
            className="w-full px-4 py-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#ffc300]"
            value={data.title}
            onChange={(e) => setData((p) => ({ ...p, title: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Category</label>
          <select
            className="w-full px-4 py-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#ffc300]"
            value={data.category}
            onChange={(e) =>
              setData((p) => ({ ...p, category: e.target.value }))
            }
          >
            <option value="">Select...</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Year</label>
          <input
            className="w-full px-4 py-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#ffc300]"
            value={data.year}
            onChange={(e) => setData((p) => ({ ...p, year: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Date</label>
          <input
            type="date"
            className="w-full px-4 py-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#ffc300]"
            value={data.engagement_date}
            onChange={(e) =>
              setData((p) => ({ ...p, engagement_date: e.target.value }))
            }
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Country</label>
          <input
            className="w-full px-4 py-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#ffc300]"
            value={data.country}
            onChange={(e) =>
              setData((p) => ({ ...p, country: e.target.value }))
            }
          />
        </div>
        <div className="col-span-2 space-y-2">
          <label className="text-sm font-bold text-gray-700">
            Representative(s)
          </label>
          <input
            className="w-full px-4 py-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#ffc300]"
            value={data.representative}
            onChange={(e) =>
              setData((p) => ({ ...p, representative: e.target.value }))
            }
          />
        </div>
        <div className="col-span-2 space-y-2">
          <label className="text-sm font-bold text-gray-700">Report PDF</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => uploadReport(e, setData)}
            className="text-sm text-gray-500"
          />
          {data.report_url && (
            <a
              href={data.report_url}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-[#ffc300] hover:underline flex items-center gap-1"
            >
              <Download size={12} /> Uploaded PDF
            </a>
          )}
        </div>
      </div>
      <div className="flex justify-end gap-4">
        <button
          onClick={onCancel}
          className="px-6 py-2 text-gray-500 font-bold hover:bg-gray-50 rounded-xl"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="px-8 py-2 bg-[#ffc300] text-[#001d3d] font-bold rounded-xl hover:bg-[#ffd60a]"
        >
          {btnLabel}
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl font-black text-[#001d3d]">Engagements</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setShowCatManager(!showCatManager)}
            className="flex items-center gap-2 px-5 py-3 border border-[#001d3d] text-[#001d3d] rounded-xl font-bold hover:bg-gray-50 transition-all"
          >
            <Tag size={18} /> Categories
          </button>
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#001d3d] text-white rounded-xl font-bold hover:bg-[#003566] transition-all"
          >
            <Plus size={20} /> Add Engagement
          </button>
        </div>
      </div>

      {/* Category Manager */}
      {showCatManager && (
        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
          <h3 className="font-bold text-[#001d3d]">Manage Categories</h3>
          <div className="flex gap-3">
            <input
              className="flex-grow px-4 py-2 rounded-xl bg-white border border-gray-200 outline-none focus:ring-2 focus:ring-[#ffc300] text-sm"
              placeholder="New category name..."
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <button
              onClick={() => newCategory && addCatMut.mutate(newCategory)}
              className="px-5 py-2 bg-[#001d3d] text-white rounded-xl font-bold text-sm"
            >
              Add
            </button>
          </div>
          <div className="flex gap-3 flex-wrap">
            {categories?.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-bold text-gray-700"
              >
                {c.name}
                <button
                  onClick={() => deleteCatMut.mutate(c.id)}
                  className="text-red-400 hover:text-red-600"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {isAdding && (
        <FormFields
          data={form}
          setData={setForm}
          onSave={() => createMut.mutate(form)}
          onCancel={() => setIsAdding(false)}
          btnLabel="Add Engagement"
        />
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-400 text-xs font-black uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Year</th>
              <th className="px-6 py-4">Country</th>
              <th className="px-6 py-4">Representative</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {engagements?.map((eng) =>
              editingId === eng.id ? (
                <tr key={eng.id}>
                  <td colSpan={6} className="p-4">
                    <FormFields
                      data={editForm}
                      setData={setEditForm}
                      onSave={() => updateMut.mutate(editForm)}
                      onCancel={() => setEditingId(null)}
                      btnLabel="Save Changes"
                    />
                  </td>
                </tr>
              ) : (
                <tr key={eng.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-[#001d3d]">
                    {eng.title}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600">
                      {eng.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#ffc300] font-black">
                    {eng.year}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {eng.country}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {eng.representative}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {eng.report_url && (
                        <a
                          href={eng.report_url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg"
                        >
                          <Download size={16} />
                        </a>
                      )}
                      <button
                        onClick={() => {
                          setEditingId(eng.id);
                          setEditForm(eng);
                        }}
                        className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => deleteMut.mutate(eng.id)}
                        className="p-2 hover:bg-red-50 text-red-600 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
        {(!engagements || engagements.length === 0) && (
          <div className="py-16 text-center text-gray-400">
            No engagements yet. Add your first one!
          </div>
        )}
      </div>
    </div>
  );
};

export default EngagementsManager;
