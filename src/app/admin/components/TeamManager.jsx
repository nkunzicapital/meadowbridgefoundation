import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  Linkedin,
  Upload,
  Image,
} from "lucide-react";
import { toast } from "sonner";
import useUpload from "@/utils/useUpload";

const BLANK = {
  name: "",
  position: "",
  bio: "",
  photo_url: "",
  linkedin_url: "",
  group_name: "Executive Management",
  order_index: 0,
};

// ── Photo Upload Widget ──────────────────────────────────────────────────────
const PhotoUploadWidget = ({ currentUrl, onUploaded }) => {
  const [upload, { loading }] = useUpload();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const tid = toast.loading("Uploading photo…");
    const result = await upload({ file });
    toast.dismiss(tid);
    if (result?.url) {
      onUploaded(result.url);
      toast.success("Photo uploaded!");
    } else {
      toast.error("Upload failed – please try again");
    }
    // Reset input so same file can be re-selected
    e.target.value = "";
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-bold text-gray-700">Profile Photo</label>

      {/* Preview */}
      <div className="flex items-center gap-4">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-4 border-[#ffc300] shrink-0 flex items-center justify-center">
          {currentUrl ? (
            <img
              src={currentUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <Image size={28} className="text-gray-300" />
          )}
        </div>
        <div className="space-y-2">
          <label
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm cursor-pointer transition-all ${loading ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-[#001d3d] text-white hover:bg-[#003566]"}`}
          >
            <Upload size={16} />
            {loading
              ? "Uploading…"
              : currentUrl
                ? "Change Photo"
                : "Upload Photo"}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={loading}
            />
          </label>
          {currentUrl && (
            <button
              onClick={() => onUploaded("")}
              className="text-xs text-red-400 hover:text-red-600 font-bold"
            >
              Remove photo
            </button>
          )}
          <p className="text-xs text-gray-400">JPG, PNG, WebP — max 10 MB</p>
        </div>
      </div>

      {/* Direct URL input as fallback */}
      <div className="space-y-1">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Or paste image URL
        </label>
        <input
          type="url"
          placeholder="https://..."
          value={currentUrl}
          onChange={(e) => onUploaded(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 outline-none text-sm focus:ring-2 focus:ring-[#ffc300]"
        />
      </div>
    </div>
  );
};

// ── Member Form ──────────────────────────────────────────────────────────────
const MemberForm = ({ data, setData, onSave, onCancel, btnLabel }) => (
  <div className="p-8 bg-white rounded-2xl shadow-md border border-gray-100 space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700">Full Name</label>
        <input
          type="text"
          className="w-full px-4 py-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#ffc300]"
          value={data.name}
          onChange={(e) => setData((p) => ({ ...p, name: e.target.value }))}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700">
          Position / Title
        </label>
        <input
          type="text"
          className="w-full px-4 py-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#ffc300]"
          value={data.position}
          onChange={(e) => setData((p) => ({ ...p, position: e.target.value }))}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700">Group</label>
        <select
          className="w-full px-4 py-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#ffc300]"
          value={data.group_name}
          onChange={(e) =>
            setData((p) => ({ ...p, group_name: e.target.value }))
          }
        >
          <option value="Founding Team">Founding Team</option>
          <option value="Board of Directors">Board of Directors</option>
          <option value="Advisory Council">Advisory Council</option>
          <option value="Executive Management">Executive Management</option>
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700">LinkedIn URL</label>
        <input
          type="url"
          className="w-full px-4 py-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#ffc300]"
          value={data.linkedin_url}
          onChange={(e) =>
            setData((p) => ({ ...p, linkedin_url: e.target.value }))
          }
        />
      </div>
      <div className="md:col-span-2 space-y-2">
        <label className="text-sm font-bold text-gray-700">Bio</label>
        <textarea
          rows={3}
          className="w-full px-4 py-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#ffc300] resize-none"
          value={data.bio}
          onChange={(e) => setData((p) => ({ ...p, bio: e.target.value }))}
        />
      </div>

      {/* Photo upload widget */}
      <div className="md:col-span-2">
        <PhotoUploadWidget
          currentUrl={data.photo_url || ""}
          onUploaded={(url) => setData((p) => ({ ...p, photo_url: url }))}
        />
      </div>
    </div>

    <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
      <button
        onClick={onCancel}
        className="px-6 py-2 text-gray-500 font-bold hover:bg-gray-50 rounded-xl"
      >
        Cancel
      </button>
      <button
        onClick={onSave}
        className="px-8 py-3 bg-[#ffc300] text-[#001d3d] font-bold rounded-xl hover:bg-[#ffd60a]"
      >
        {btnLabel}
      </button>
    </div>
  </div>
);

// ── Main Component ───────────────────────────────────────────────────────────
const TeamManager = () => {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newMember, setNewMember] = useState(BLANK);
  const [editForm, setEditForm] = useState({});

  const { data: team, isLoading } = useQuery({
    queryKey: ["admin_team"],
    queryFn: async () => {
      const res = await fetch("/api/team");
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (member) => {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(member),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin_team"]);
      queryClient.invalidateQueries(["team"]);
      setIsAdding(false);
      setNewMember(BLANK);
      toast.success("Team member added!");
    },
    onError: () => toast.error("Failed to add member"),
  });

  const updateMutation = useMutation({
    mutationFn: async (member) => {
      const res = await fetch("/api/team", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(member),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin_team"]);
      queryClient.invalidateQueries(["team"]);
      setEditingId(null);
      toast.success("Team member updated!");
    },
    onError: () => toast.error("Failed to update member"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await fetch(`/api/team?id=${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin_team"]);
      queryClient.invalidateQueries(["team"]);
      toast.success("Deleted!");
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-[#001d3d]">Team Members</h2>
        <button
          onClick={() => {
            setIsAdding(true);
            setEditingId(null);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-[#001d3d] text-white rounded-xl font-bold hover:bg-[#003566] transition-all"
        >
          <Plus size={20} /> Add Team Member
        </button>
      </div>

      {isAdding && (
        <MemberForm
          data={newMember}
          setData={setNewMember}
          onSave={() => createMutation.mutate(newMember)}
          onCancel={() => {
            setIsAdding(false);
            setNewMember(BLANK);
          }}
          btnLabel="Add Member"
        />
      )}

      {isLoading && (
        <div className="text-gray-400 font-bold py-8 text-center">
          Loading team…
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {team?.map((member) =>
          editingId === member.id ? (
            <div key={member.id} className="col-span-full">
              <MemberForm
                data={editForm}
                setData={setEditForm}
                onSave={() => updateMutation.mutate(editForm)}
                onCancel={() => setEditingId(null)}
                btnLabel="Save Changes"
              />
            </div>
          ) : (
            <div
              key={member.id}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4"
            >
              {/* Photo */}
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 shrink-0 border-2 border-[#ffc300]/40">
                {member.photo_url ? (
                  <img
                    src={member.photo_url}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className={`w-full h-full bg-[#001d3d] items-center justify-center text-white font-black text-2xl ${member.photo_url ? "hidden" : "flex"}`}
                >
                  {member.name?.[0] || "?"}
                </div>
              </div>

              <div className="flex-grow min-w-0">
                <h4 className="font-bold text-[#001d3d] truncate">
                  {member.name}
                </h4>
                <p className="text-xs text-gray-400 font-semibold mb-1 truncate">
                  {member.position}
                </p>
                <p className="text-[10px] uppercase font-black text-[#ffc300] tracking-widest">
                  {member.group_name}
                </p>
                {member.photo_url && (
                  <p className="text-[10px] text-green-500 font-bold mt-1">
                    ✓ Photo uploaded
                  </p>
                )}
                {member.linkedin_url && (
                  <a
                    href={member.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-xs text-gray-400 hover:text-[#001d3d]"
                  >
                    <Linkedin size={12} /> LinkedIn
                  </a>
                )}
              </div>

              <div className="flex flex-col gap-2 shrink-0">
                <button
                  onClick={() => {
                    setEditingId(member.id);
                    setEditForm({ ...member });
                    setIsAdding(false);
                  }}
                  className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Delete ${member.name}?`))
                      deleteMutation.mutate(member.id);
                  }}
                  className="p-2 hover:bg-red-50 text-red-600 rounded-lg"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
};

export default TeamManager;
