import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Edit, X, Briefcase, Eye, Clock } from "lucide-react";
import { toast } from "sonner";

const FIELD_TYPES = ["text", "email", "tel", "url", "textarea", "file"];
const BLANK = {
  title: "",
  description: "",
  deadline: "",
  is_active: true,
  required_fields: [],
};

const CareersManager = () => {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [editForm, setEditForm] = useState({});
  const [viewApplicationsId, setViewApplicationsId] = useState(null);
  const [newField, setNewField] = useState({
    label: "",
    type: "text",
    required: true,
    accept: "",
  });

  const { data: careers } = useQuery({
    queryKey: ["admin_careers"],
    queryFn: async () => {
      const res = await fetch("/api/careers");
      return res.json();
    },
  });

  const { data: applications } = useQuery({
    queryKey: ["career_applications", viewApplicationsId],
    enabled: !!viewApplicationsId,
    queryFn: async () => {
      const res = await fetch(
        `/api/careers/apply?career_id=${viewApplicationsId}`,
      );
      return res.json();
    },
  });

  const createMut = useMutation({
    mutationFn: async (data) => {
      const res = await fetch("/api/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin_careers"]);
      setIsAdding(false);
      setForm(BLANK);
      toast.success("Position posted!");
    },
  });

  const updateMut = useMutation({
    mutationFn: async (data) => {
      const res = await fetch("/api/careers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin_careers"]);
      setEditingId(null);
      toast.success("Position updated!");
    },
  });

  const deleteMut = useMutation({
    mutationFn: async (id) => {
      await fetch(`/api/careers?id=${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin_careers"]);
      toast.success("Deleted!");
    },
  });

  const addField = (dataObj, setter) => {
    if (!newField.label) return;
    const currentFields = Array.isArray(dataObj.required_fields)
      ? dataObj.required_fields
      : typeof dataObj.required_fields === "string"
        ? JSON.parse(dataObj.required_fields || "[]")
        : [];
    setter((p) => ({
      ...p,
      required_fields: [...currentFields, { ...newField }],
    }));
    setNewField({ label: "", type: "text", required: true, accept: "" });
  };

  const removeField = (dataObj, setter, idx) => {
    const fields = Array.isArray(dataObj.required_fields)
      ? dataObj.required_fields
      : JSON.parse(dataObj.required_fields || "[]");
    setter((p) => ({
      ...p,
      required_fields: fields.filter((_, i) => i !== idx),
    }));
  };

  const FormFields = ({ data, setData, onSave, onCancel, btnLabel }) => {
    const fields = Array.isArray(data.required_fields)
      ? data.required_fields
      : typeof data.required_fields === "string"
        ? JSON.parse(data.required_fields || "[]")
        : [];
    return (
      <div className="p-8 bg-white rounded-2xl shadow-md border border-gray-100 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2 space-y-2">
            <label className="text-sm font-bold text-gray-700">
              Position Title *
            </label>
            <input
              className="w-full px-4 py-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#ffc300]"
              value={data.title}
              onChange={(e) =>
                setData((p) => ({ ...p, title: e.target.value }))
              }
            />
          </div>
          <div className="col-span-2 space-y-2">
            <label className="text-sm font-bold text-gray-700">
              Description
            </label>
            <textarea
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#ffc300] resize-none"
              value={data.description}
              onChange={(e) =>
                setData((p) => ({ ...p, description: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">
              Application Deadline
            </label>
            <input
              type="datetime-local"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#ffc300]"
              value={data.deadline}
              onChange={(e) =>
                setData((p) => ({ ...p, deadline: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Status</label>
            <select
              className="w-full px-4 py-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#ffc300]"
              value={data.is_active ? "true" : "false"}
              onChange={(e) =>
                setData((p) => ({ ...p, is_active: e.target.value === "true" }))
              }
            >
              <option value="true">Active (accepting applications)</option>
              <option value="false">Inactive (hidden)</option>
            </select>
          </div>

          {/* Application Fields Builder */}
          <div className="col-span-2 space-y-4">
            <label className="text-sm font-bold text-gray-700 block">
              Application Form Fields
            </label>
            {fields.length > 0 && (
              <div className="space-y-2">
                {fields.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl text-sm"
                  >
                    <span className="font-bold text-[#001d3d] flex-grow">
                      {f.label}
                    </span>
                    <span className="text-gray-400">{f.type}</span>
                    {f.required && (
                      <span className="text-red-400 text-xs font-bold">
                        Required
                      </span>
                    )}
                    <button
                      onClick={() => removeField(data, setData, i)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="grid grid-cols-4 gap-3 p-4 bg-blue-50 rounded-xl">
              <input
                className="col-span-2 px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm outline-none"
                placeholder="Field label (e.g. Cover Letter)"
                value={newField.label}
                onChange={(e) =>
                  setNewField((p) => ({ ...p, label: e.target.value }))
                }
              />
              <select
                className="px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm outline-none"
                value={newField.type}
                onChange={(e) =>
                  setNewField((p) => ({ ...p, type: e.target.value }))
                }
              >
                {FIELD_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-gray-600">
                  <input
                    type="checkbox"
                    checked={newField.required}
                    onChange={(e) =>
                      setNewField((p) => ({ ...p, required: e.target.checked }))
                    }
                    className="mr-1"
                  />
                  Required
                </label>
                <button
                  onClick={() => addField(data, setData)}
                  className="px-3 py-2 bg-[#001d3d] text-white rounded-lg text-xs font-bold"
                >
                  Add
                </button>
              </div>
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
        <h2 className="text-2xl font-black text-[#001d3d]">
          Careers & Vacancies
        </h2>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#001d3d] text-white rounded-xl font-bold hover:bg-[#003566]"
        >
          <Plus size={20} /> Post Position
        </button>
      </div>

      {isAdding && (
        <FormFields
          data={form}
          setData={setForm}
          onSave={() => createMut.mutate(form)}
          onCancel={() => setIsAdding(false)}
          btnLabel="Post Position"
        />
      )}

      {/* Applications Viewer */}
      {viewApplicationsId && (
        <div className="p-8 bg-white rounded-2xl shadow-md border border-gray-100 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-[#001d3d]">
              Applications ({applications?.length || 0})
            </h3>
            <button
              onClick={() => setViewApplicationsId(null)}
              className="p-2 hover:bg-gray-100 rounded-xl"
            >
              <X size={20} />
            </button>
          </div>
          {applications?.length === 0 ? (
            <p className="text-gray-400">No applications yet.</p>
          ) : (
            <div className="space-y-4">
              {applications?.map((app) => {
                const data =
                  typeof app.applicant_data === "string"
                    ? JSON.parse(app.applicant_data)
                    : app.applicant_data;
                const docs =
                  typeof app.documents === "string"
                    ? JSON.parse(app.documents)
                    : app.documents;
                return (
                  <div
                    key={app.id}
                    className="p-6 bg-gray-50 rounded-xl space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#001d3d]">
                        Application #{app.id}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(app.submitted_at).toLocaleString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(data || {}).map(([k, v]) => (
                        <div key={k}>
                          <span className="text-xs font-bold text-gray-400 uppercase">
                            {k}
                          </span>
                          <p className="text-sm text-[#001d3d]">{v}</p>
                        </div>
                      ))}
                    </div>
                    {docs?.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {docs.map((d, i) => (
                          <a
                            key={i}
                            href={d.url}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1 bg-[#001d3d] text-white text-xs rounded-full font-bold hover:bg-[#003566]"
                          >
                            {d.field}: {d.name}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div className="space-y-4">
        {careers?.map((career) => {
          const isPast =
            career.deadline && new Date(career.deadline) < new Date();
          return editingId === career.id ? (
            <div key={career.id}>
              <FormFields
                data={editForm}
                setData={setEditForm}
                onSave={() => updateMut.mutate(editForm)}
                onCancel={() => setEditingId(null)}
                btnLabel="Save Changes"
              />
            </div>
          ) : (
            <div
              key={career.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex gap-6 items-start"
            >
              <div className="p-3 bg-gray-50 rounded-xl shrink-0">
                <Briefcase size={24} className="text-[#ffc300]" />
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-3 flex-wrap mb-2">
                  <h3 className="text-lg font-black text-[#001d3d]">
                    {career.title}
                  </h3>
                  <span
                    className={`px-3 py-1 text-xs font-black rounded-full uppercase ${career.is_active && !isPast ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}
                  >
                    {career.is_active && !isPast
                      ? "Active"
                      : isPast
                        ? "Expired"
                        : "Inactive"}
                  </span>
                </div>
                {career.description && (
                  <p className="text-sm text-gray-600 mb-2">
                    {career.description}
                  </p>
                )}
                {career.deadline && (
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock size={12} /> Deadline:{" "}
                    {new Date(career.deadline).toLocaleString()}
                  </p>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => setViewApplicationsId(career.id)}
                  title="View Applications"
                  className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg"
                >
                  <Eye size={18} />
                </button>
                <button
                  onClick={() => {
                    setEditingId(career.id);
                    setEditForm({
                      ...career,
                      required_fields: Array.isArray(career.required_fields)
                        ? career.required_fields
                        : JSON.parse(career.required_fields || "[]"),
                    });
                  }}
                  className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => deleteMut.mutate(career.id)}
                  className="p-2 hover:bg-red-50 text-red-600 rounded-lg"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          );
        })}
        {(!careers || careers.length === 0) && (
          <div className="py-16 text-center text-gray-400">
            <Briefcase size={48} className="mx-auto text-gray-200 mb-4" />
            <p>No positions posted yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareersManager;
