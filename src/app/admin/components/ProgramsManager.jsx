import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Edit, X, MapPin, Globe } from "lucide-react";
import { toast } from "sonner";

const LOCATION_TYPES = [
  "International",
  "Africa",
  "Europe",
  "Asia",
  "Americas",
  "Regional",
  "National",
  "Other",
];
const BLANK = {
  name: "",
  description: "",
  location_type: "International",
  location_name: "",
  image_url: "",
  bullets: [],
};

const ProgramsManager = () => {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [editForm, setEditForm] = useState({});
  const [newBullet, setNewBullet] = useState("");

  const { data: programs } = useQuery({
    queryKey: ["admin_programs"],
    queryFn: async () => {
      const res = await fetch("/api/programs");
      return res.json();
    },
  });

  const createMut = useMutation({
    mutationFn: async (data) => {
      const res = await fetch("/api/programs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin_programs"]);
      setIsAdding(false);
      setForm(BLANK);
      toast.success("Program added!");
    },
  });

  const updateMut = useMutation({
    mutationFn: async (data) => {
      const bullets = Array.isArray(data.bullets) ? data.bullets : [];
      const res = await fetch("/api/programs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, bullets }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin_programs"]);
      setEditingId(null);
      toast.success("Program updated!");
    },
  });

  const deleteMut = useMutation({
    mutationFn: async (id) => {
      await fetch(`/api/programs?id=${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin_programs"]);
      toast.success("Deleted!");
    },
  });

  const uploadImage = async (e, setter) => {
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
        setter((p) => ({ ...p, image_url: url }));
        toast.success("Image uploaded!");
      } else toast.error("Upload failed");
    };
    reader.readAsDataURL(file);
  };

  const FormFields = ({ data, setData, onSave, onCancel, btnLabel }) => {
    const bullets = Array.isArray(data.bullets)
      ? data.bullets
      : typeof data.bullets === "string"
        ? JSON.parse(data.bullets || "[]")
        : [];
    const [bullet, setBullet] = useState("");

    return (
      <div className="p-8 bg-white rounded-2xl shadow-md border border-gray-100 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2 space-y-2">
            <label className="text-sm font-bold text-gray-700">
              Program Name *
            </label>
            <input
              className="w-full px-4 py-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#ffc300]"
              value={data.name}
              onChange={(e) => setData((p) => ({ ...p, name: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">
              Location Type
            </label>
            <select
              className="w-full px-4 py-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#ffc300]"
              value={data.location_type}
              onChange={(e) =>
                setData((p) => ({ ...p, location_type: e.target.value }))
              }
            >
              {LOCATION_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">
              Location Name (e.g. Pan-Africa)
            </label>
            <input
              className="w-full px-4 py-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#ffc300]"
              value={data.location_name}
              onChange={(e) =>
                setData((p) => ({ ...p, location_name: e.target.value }))
              }
            />
          </div>
          <div className="col-span-2 space-y-2">
            <label className="text-sm font-bold text-gray-700">
              Description
            </label>
            <textarea
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#ffc300] resize-none"
              value={data.description}
              onChange={(e) =>
                setData((p) => ({ ...p, description: e.target.value }))
              }
            />
          </div>
          <div className="col-span-2 space-y-2">
            <label className="text-sm font-bold text-gray-700">
              Program Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => uploadImage(e, setData)}
              className="text-sm text-gray-500"
            />
            {data.image_url && (
              <img
                src={data.image_url}
                className="h-20 rounded-xl object-cover mt-2"
              />
            )}
          </div>
          <div className="col-span-2 space-y-2">
            <label className="text-sm font-bold text-gray-700">
              Bullet Points
            </label>
            <div className="flex gap-2">
              <input
                className="flex-grow px-4 py-2 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#ffc300] text-sm"
                placeholder="Add a bullet point..."
                value={bullet}
                onChange={(e) => setBullet(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && bullet.trim()) {
                    setData((p) => ({
                      ...p,
                      bullets: [...bullets, bullet.trim()],
                    }));
                    setBullet("");
                  }
                }}
              />
              <button
                type="button"
                onClick={() => {
                  if (bullet.trim()) {
                    setData((p) => ({
                      ...p,
                      bullets: [...bullets, bullet.trim()],
                    }));
                    setBullet("");
                  }
                }}
                className="px-4 py-2 bg-[#001d3d] text-white rounded-xl text-sm font-bold"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {bullets.map((b, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-3 py-1 bg-[#ffc300]/10 text-[#001d3d] rounded-full text-sm font-bold"
                >
                  {b}
                  <button
                    onClick={() =>
                      setData((p) => ({
                        ...p,
                        bullets: bullets.filter((_, bi) => bi !== i),
                      }))
                    }
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
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
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-[#001d3d]">Programs</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#001d3d] text-white rounded-xl font-bold hover:bg-[#003566]"
        >
          <Plus size={20} /> Add Program
        </button>
      </div>

      {isAdding && (
        <FormFields
          data={form}
          setData={setForm}
          onSave={() =>
            createMut.mutate({
              ...form,
              bullets: Array.isArray(form.bullets) ? form.bullets : [],
            })
          }
          onCancel={() => setIsAdding(false)}
          btnLabel="Add Program"
        />
      )}

      <div className="space-y-6">
        {programs?.map((program) => {
          const bullets = Array.isArray(program.bullets)
            ? program.bullets
            : typeof program.bullets === "string"
              ? JSON.parse(program.bullets || "[]")
              : [];
          return editingId === program.id ? (
            <FormFields
              key={program.id}
              data={editForm}
              setData={setEditForm}
              onSave={() => updateMut.mutate(editForm)}
              onCancel={() => setEditingId(null)}
              btnLabel="Save Changes"
            />
          ) : (
            <div
              key={program.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex gap-6 items-start"
            >
              {program.image_url && (
                <img
                  src={program.image_url}
                  className="h-24 w-24 rounded-xl object-cover shrink-0"
                />
              )}
              <div className="flex-grow space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-xl font-black text-[#001d3d]">
                    {program.name}
                  </h3>
                  <span className="px-3 py-1 bg-[#ffc300]/10 text-[#001d3d] text-xs font-black rounded-full">
                    {program.location_type}
                  </span>
                  {program.location_name && (
                    <span className="text-sm text-gray-400 flex items-center gap-1">
                      <MapPin size={12} /> {program.location_name}
                    </span>
                  )}
                </div>
                {program.description && (
                  <p className="text-gray-600 text-sm">{program.description}</p>
                )}
                {bullets.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {bullets.map((b, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-gray-50 text-gray-600 text-xs rounded-full border border-gray-200"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => {
                    setEditingId(program.id);
                    setEditForm({ ...program, bullets });
                  }}
                  className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => deleteMut.mutate(program.id)}
                  className="p-2 hover:bg-red-50 text-red-600 rounded-lg"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          );
        })}
        {(!programs || programs.length === 0) && (
          <div className="py-16 text-center text-gray-400">
            No programs yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgramsManager;
