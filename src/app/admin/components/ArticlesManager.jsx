import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Edit, X, FileText, Download } from "lucide-react";
import { toast } from "sonner";

const BLANK = {
  title: "",
  content: "",
  excerpt: "",
  featured_image_url: "",
  pdf_url: "",
  category: "Migration",
};
const DEFAULT_CATS = [
  "Migration",
  "Environment",
  "MeadowBridge Forum",
  "Policy",
  "Research",
  "Advocacy",
];

const uploadFile = async (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ base64: reader.result }),
        });
        if (res.ok) {
          const { url } = await res.json();
          resolve(url);
        } else resolve(null);
      } catch {
        resolve(null);
      }
    };
    reader.readAsDataURL(file);
  });
};

const ArticlesManager = () => {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [editForm, setEditForm] = useState({});
  const [uploading, setUploading] = useState(false);
  const [customCats, setCustomCats] = useState([]);
  const [newCat, setNewCat] = useState("");

  const { data: articles, isLoading } = useQuery({
    queryKey: ["admin_articles"],
    queryFn: async () => {
      const res = await fetch("/api/articles?limit=100");
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (article) => {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(article),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin_articles"]);
      setIsAdding(false);
      setForm(BLANK);
      toast.success("Article published!");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (article) => {
      const res = await fetch("/api/articles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(article),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin_articles"]);
      setEditingId(null);
      toast.success("Article updated!");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await fetch(`/api/articles?id=${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin_articles"]);
      toast.success("Article deleted!");
    },
  });

  const handleFileUpload = async (e, field, setter) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    toast.loading("Uploading...");
    const url = await uploadFile(file);
    toast.dismiss();
    setUploading(false);
    if (url) {
      setter((p) => ({ ...p, [field]: url }));
      toast.success("Uploaded!");
    } else toast.error("Upload failed");
  };

  const allCats = [
    ...DEFAULT_CATS,
    ...customCats,
    ...Array.from(
      new Set(
        articles
          ?.map((a) => a.category)
          .filter(
            (c) => c && !DEFAULT_CATS.includes(c) && !customCats.includes(c),
          ) || [],
      ),
    ),
  ];

  const ArticleForm = ({ data, setData, onSave, onCancel, btnLabel }) => (
    <div className="p-8 bg-white rounded-2xl shadow-md border border-gray-100 space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-2 space-y-2">
          <label className="text-sm font-bold text-gray-700">Title *</label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#ffc300]"
            value={data.title}
            onChange={(e) => setData((p) => ({ ...p, title: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Category</label>
          <div className="flex gap-2">
            <select
              className="flex-grow px-4 py-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#ffc300]"
              value={data.category}
              onChange={(e) =>
                setData((p) => ({ ...p, category: e.target.value }))
              }
            >
              {allCats.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">
            Add Custom Category
          </label>
          <div className="flex gap-2">
            <input
              className="flex-grow px-3 py-2 rounded-xl bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-[#ffc300]"
              placeholder="New category..."
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
            />
            <button
              onClick={() => {
                if (newCat.trim()) {
                  setCustomCats((p) => [...p, newCat.trim()]);
                  setData((d) => ({ ...d, category: newCat.trim() }));
                  setNewCat("");
                }
              }}
              className="px-3 py-2 bg-[#001d3d] text-white text-sm font-bold rounded-xl"
            >
              Add
            </button>
          </div>
        </div>
        <div className="col-span-2 space-y-2">
          <label className="text-sm font-bold text-gray-700">Excerpt</label>
          <textarea
            rows={2}
            className="w-full px-4 py-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#ffc300] resize-none"
            value={data.excerpt}
            onChange={(e) =>
              setData((p) => ({ ...p, excerpt: e.target.value }))
            }
          />
        </div>
        <div className="col-span-2 space-y-2">
          <label className="text-sm font-bold text-gray-700">Content</label>
          <textarea
            rows={8}
            className="w-full px-4 py-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#ffc300] resize-none"
            value={data.content}
            onChange={(e) =>
              setData((p) => ({ ...p, content: e.target.value }))
            }
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">
            Featured Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload(e, "featured_image_url", setData)}
            className="text-sm text-gray-500"
            disabled={uploading}
          />
          {data.featured_image_url && (
            <img
              src={data.featured_image_url}
              className="h-20 rounded-xl object-cover mt-2"
            />
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">
            PDF Document (downloadable)
          </label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => handleFileUpload(e, "pdf_url", setData)}
            className="text-sm text-gray-500"
            disabled={uploading}
          />
          {data.pdf_url && (
            <a
              href={data.pdf_url}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-[#ffc300] hover:underline flex items-center gap-1 mt-1"
            >
              <Download size={12} /> Uploaded PDF
            </a>
          )}
        </div>
      </div>
      <div className="flex justify-end gap-4 pt-4">
        <button
          onClick={onCancel}
          className="px-6 py-2 text-gray-500 font-bold hover:bg-gray-50 rounded-xl"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          disabled={uploading}
          className="px-8 py-2 bg-[#ffc300] text-[#001d3d] font-bold rounded-xl hover:bg-[#ffd60a] disabled:opacity-50"
        >
          {btnLabel}
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-[#001d3d]">
          Articles & Analysis
        </h2>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#001d3d] text-white rounded-xl font-bold hover:bg-[#003566] transition-all"
        >
          <Plus size={20} /> Add New Article
        </button>
      </div>

      {isAdding && (
        <ArticleForm
          data={form}
          setData={setForm}
          onSave={() => createMutation.mutate(form)}
          onCancel={() => setIsAdding(false)}
          btnLabel="Publish Article"
        />
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-400 text-xs font-black uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">Image</th>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">PDF</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {articles?.map((article) =>
              editingId === article.id ? (
                <tr key={article.id}>
                  <td colSpan={6} className="p-4">
                    <ArticleForm
                      data={editForm}
                      setData={setEditForm}
                      onSave={() => updateMutation.mutate(editForm)}
                      onCancel={() => setEditingId(null)}
                      btnLabel="Save Changes"
                    />
                  </td>
                </tr>
              ) : (
                <tr
                  key={article.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    {article.featured_image_url ? (
                      <img
                        src={article.featured_image_url}
                        className="h-12 w-16 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="h-12 w-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <FileText size={16} className="text-gray-300" />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-[#001d3d] max-w-xs truncate">
                      {article.title}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600">
                      {article.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {new Date(article.published_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    {article.pdf_url && (
                      <a
                        href={article.pdf_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#ffc300] hover:underline"
                      >
                        <Download size={16} />
                      </a>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingId(article.id);
                          setEditForm(article);
                        }}
                        className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate(article.id)}
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
        {(!articles || articles.length === 0) && (
          <div className="py-16 text-center text-gray-400">
            No articles yet. Publish your first one!
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticlesManager;
