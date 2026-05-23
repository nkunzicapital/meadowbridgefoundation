import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Mic, Edit, X, Upload, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const BLANK = { title: "", description: "", audio_url: "", is_active: true };

const uploadAudio = async (file) => {
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

const PodcastsManager = () => {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [editForm, setEditForm] = useState({});
  const [uploading, setUploading] = useState(false);

  const { data: podcasts } = useQuery({
    queryKey: ["admin_podcasts"],
    queryFn: async () => {
      const res = await fetch("/api/podcasts?all=true");
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (podcast) => {
      const res = await fetch("/api/podcasts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(podcast),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin_podcasts"]);
      setIsAdding(false);
      setForm(BLANK);
      toast.success("Podcast published!");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (podcast) => {
      const res = await fetch("/api/podcasts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(podcast),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin_podcasts"]);
      queryClient.invalidateQueries(["podcasts"]);
      setEditingId(null);
      toast.success("Updated!");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await fetch(`/api/podcasts?id=${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin_podcasts"]);
      queryClient.invalidateQueries(["podcasts"]);
      toast.success("Deleted!");
    },
  });

  const handleAudioUpload = async (e, setter) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    toast.loading("Uploading audio...");
    const url = await uploadAudio(file);
    toast.dismiss();
    setUploading(false);
    if (url) {
      setter((p) => ({ ...p, audio_url: url }));
      toast.success("Audio uploaded!");
    } else toast.error("Upload failed");
  };

  const PodcastForm = ({ data, setData, onSave, onCancel, btnLabel }) => (
    <div className="p-8 bg-white rounded-2xl shadow-md border border-gray-100 space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">
            Episode Title *
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#ffc300]"
            value={data.title}
            onChange={(e) => setData((p) => ({ ...p, title: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Description</label>
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
            Audio URL (Spotify, SoundCloud, direct .mp3, etc.)
          </label>
          <input
            type="url"
            className="w-full px-4 py-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#ffc300]"
            value={data.audio_url}
            onChange={(e) =>
              setData((p) => ({ ...p, audio_url: e.target.value }))
            }
            placeholder="https://..."
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">
            — OR Upload Audio File (.mp3, .wav, .ogg)
          </label>
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => handleAudioUpload(e, setData)}
            className="text-sm text-gray-500"
            disabled={uploading}
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
            <option value="true">Active (visible on site)</option>
            <option value="false">Inactive (hidden)</option>
          </select>
        </div>
        {data.audio_url && (
          <audio controls className="w-full" style={{ height: 40 }}>
            <source src={data.audio_url} />
            Browser does not support audio.
          </audio>
        )}
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
        <h2 className="text-2xl font-black text-[#001d3d]">Podcasts</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#001d3d] text-white rounded-xl font-bold hover:bg-[#003566] transition-all"
        >
          <Plus size={20} /> Add Episode
        </button>
      </div>

      {isAdding && (
        <PodcastForm
          data={form}
          setData={setForm}
          onSave={() => createMutation.mutate(form)}
          onCancel={() => setIsAdding(false)}
          btnLabel="Publish Episode"
        />
      )}

      <div className="space-y-4">
        {podcasts?.map((podcast) =>
          editingId === podcast.id ? (
            <div key={podcast.id}>
              <PodcastForm
                data={editForm}
                setData={setEditForm}
                onSave={() => updateMutation.mutate(editForm)}
                onCancel={() => setEditingId(null)}
                btnLabel="Save Changes"
              />
            </div>
          ) : (
            <div
              key={podcast.id}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-50 text-[#ffc300] rounded-xl">
                    <Mic size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#001d3d]">
                      {podcast.title}
                    </h4>
                    <p className="text-xs text-gray-400">
                      {new Date(podcast.published_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 items-center">
                  <button
                    onClick={() =>
                      updateMutation.mutate({
                        ...podcast,
                        is_active: !podcast.is_active,
                      })
                    }
                    className={`px-4 py-1 rounded-full text-xs font-black uppercase cursor-pointer ${podcast.is_active ? "bg-green-100 text-green-600 hover:bg-green-200" : "bg-gray-100 text-gray-400 hover:bg-gray-200"}`}
                  >
                    {podcast.is_active ? "Active" : "Inactive"}
                  </button>
                  {podcast.audio_url && (
                    <a
                      href={podcast.audio_url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 hover:bg-gray-100 text-gray-400 rounded-lg"
                    >
                      <ExternalLink size={18} />
                    </a>
                  )}
                  <button
                    onClick={() => {
                      setEditingId(podcast.id);
                      setEditForm(podcast);
                    }}
                    className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(podcast.id)}
                    className="p-2 hover:bg-red-50 text-red-600 rounded-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              {podcast.description && (
                <p className="text-sm text-gray-500 mb-3 ml-16">
                  {podcast.description}
                </p>
              )}
              {podcast.audio_url && (
                <div className="ml-16">
                  <audio controls className="w-full" style={{ height: 40 }}>
                    <source src={podcast.audio_url} />
                    Browser does not support audio.
                  </audio>
                </div>
              )}
            </div>
          ),
        )}
        {(!podcasts || podcasts.length === 0) && (
          <div className="py-16 text-center text-gray-400">
            <Mic size={48} className="mx-auto text-gray-200 mb-4" />
            <p>No podcast episodes yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PodcastsManager;
