import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Edit, X, Globe } from "lucide-react";
import { toast } from "sonner";

const BLANK = {
  name: "",
  logo_url: "",
  partner_type: "Partner",
  website_url: "",
  category: "Partner",
};
const DEFAULT_TYPES = ["Partner", "Donor", "Sponsor", "Collaborator"];

const uploadLogo = async (file) => {
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

const PartnersManager = () => {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [editForm, setEditForm] = useState({});
  const [uploading, setUploading] = useState(false);
  const [customTypes, setCustomTypes] = useState([]);
  const [newType, setNewType] = useState("");

  const { data: partners, isLoading } = useQuery({
    queryKey: ["admin_partners"],
    queryFn: async () => {
      const res = await fetch("/api/partners");
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (partner) => {
      const res = await fetch("/api/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(partner),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin_partners"]);
      queryClient.invalidateQueries(["partners_strip"]);
      setIsAdding(false);
      setForm(BLANK);
      toast.success("Partner added!");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (partner) => {
      const res = await fetch("/api/partners", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(partner),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin_partners"]);
      queryClient.invalidateQueries(["partners_strip"]);
      setEditingId(null);
      toast.success("Updated!");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await fetch(`/api/partners?id=${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin_partners"]);
      queryClient.invalidateQueries(["partners_strip"]);
      toast.success("Deleted!");
    },
  });

  const handleLogoUpload = async (e, setter) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    toast.loading("Uploading logo...");
    const url = await uploadLogo(file);
    toast.dismiss();
    setUploading(false);
    if (url) {
      setter((p) => ({ ...p, logo_url: url }));
      toast.success("Logo uploaded!");
    } else toast.error("Upload failed");
  };

  const allTypes = [
    ...DEFAULT_TYPES,
    ...customTypes,
    ...Array.from(
      new Set(
        partners
          ?.map((p) => p.partner_type)
          .filter(
            (t) => t && !DEFAULT_TYPES.includes(t) && !customTypes.includes(t),
          ) || [],
      ),
    ),
  ];

  const PartnerForm = ({ data, setData, onSave, onCancel, btnLabel }) => (
    <div className="p-8 bg-white rounded-2xl shadow-md border border-gray-100 space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">
            Organization Name *
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#ffc300]"
            value={data.name}
            onChange={(e) => setData((p) => ({ ...p, name: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">
            Type / Category
          </label>
          <div className="flex gap-2">
            <select
              className="flex-grow px-4 py-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#ffc300]"
              value={data.partner_type}
              onChange={(e) =>
                setData((p) => ({
                  ...p,
                  partner_type: e.target.value,
                  category: e.target.value,
                }))
              }
            >
              {allTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-span-2 space-y-2">
          <label className="text-sm font-bold text-gray-700">
            Add Custom Type
          </label>
          <div className="flex gap-2">
            <input
              className="flex-grow px-3 py-2 rounded-xl bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-[#ffc300]"
              placeholder="e.g. Government Agency"
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
            />
            <button
              onClick={() => {
                if (newType.trim()) {
                  setCustomTypes((p) => [...p, newType.trim()]);
                  setData((d) => ({
                    ...d,
                    partner_type: newType.trim(),
                    category: newType.trim(),
                  }));
                  setNewType("");
                }
              }}
              className="px-4 py-2 bg-[#001d3d] text-white text-sm font-bold rounded-xl"
            >
              Add
            </button>
          </div>
        </div>
        <div className="col-span-2 space-y-2">
          <label className="text-sm font-bold text-gray-700">Website URL</label>
          <input
            type="url"
            className="w-full px-4 py-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#ffc300]"
            value={data.website_url}
            onChange={(e) =>
              setData((p) => ({ ...p, website_url: e.target.value }))
            }
          />
        </div>
        <div className="col-span-2 space-y-2">
          <label className="text-sm font-bold text-gray-700">Logo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleLogoUpload(e, setData)}
            className="text-sm text-gray-500"
            disabled={uploading}
          />
          {data.logo_url && (
            <img
              src={data.logo_url}
              alt="Logo"
              className="h-16 max-w-[120px] object-contain mt-2 bg-gray-50 p-2 rounded-xl"
            />
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
          Partners & Donors
        </h2>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#001d3d] text-white rounded-xl font-bold hover:bg-[#003566] transition-all"
        >
          <Plus size={20} /> Add Partner/Donor
        </button>
      </div>

      {isAdding && (
        <PartnerForm
          data={form}
          setData={setForm}
          onSave={() => createMutation.mutate(form)}
          onCancel={() => setIsAdding(false)}
          btnLabel="Add Organization"
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {partners?.map((partner) =>
          editingId === partner.id ? (
            <div key={partner.id} className="col-span-full">
              <PartnerForm
                data={editForm}
                setData={setEditForm}
                onSave={() => updateMutation.mutate(editForm)}
                onCancel={() => setEditingId(null)}
                btnLabel="Save Changes"
              />
            </div>
          ) : (
            <div
              key={partner.id}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center"
            >
              <div className="h-16 w-full flex items-center justify-center mb-4 bg-gray-50 rounded-xl p-2">
                {partner.logo_url ? (
                  <img
                    src={partner.logo_url}
                    alt={partner.name}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <Globe size={32} className="text-gray-300" />
                )}
              </div>
              <h4 className="font-bold text-[#001d3d] mb-1 text-sm">
                {partner.name}
              </h4>
              <span className="text-xs font-black text-[#ffc300] uppercase tracking-widest">
                {partner.partner_type}
              </span>
              {partner.website_url && (
                <a
                  href={partner.website_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 text-xs text-gray-400 hover:text-[#001d3d] truncate max-w-full"
                >
                  {partner.website_url
                    .replace("https://", "")
                    .replace("http://", "")}
                </a>
              )}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => {
                    setEditingId(partner.id);
                    setEditForm(partner);
                  }}
                  className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => deleteMutation.mutate(partner.id)}
                  className="p-2 hover:bg-red-50 text-red-600 rounded-lg"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ),
        )}
      </div>
      {(!partners || partners.length === 0) && (
        <div className="py-16 text-center text-gray-400">No partners yet.</div>
      )}
    </div>
  );
};

export default PartnersManager;
