"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Briefcase,
  Clock,
  X,
  Upload,
  Send,
  ChevronRight,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast, Toaster } from "sonner";
import PartnersStrip from "@/components/PartnersStrip";

// Countdown timer component
const Countdown = ({ deadline }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calc = () => {
      const diff = new Date(deadline) - new Date();
      if (diff <= 0)
        return setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  return (
    <div className="flex gap-3 items-center flex-wrap">
      {[
        { label: "Days", val: timeLeft.days },
        { label: "Hours", val: timeLeft.hours },
        { label: "Min", val: timeLeft.minutes },
        { label: "Sec", val: timeLeft.seconds },
      ].map((t) => (
        <div
          key={t.label}
          className="flex flex-col items-center bg-[#001d3d] text-white px-3 py-2 rounded-lg min-w-[50px]"
        >
          <span className="text-xl font-black text-[#ffc300]">
            {String(t.val).padStart(2, "0")}
          </span>
          <span className="text-[10px] uppercase tracking-widest opacity-60">
            {t.label}
          </span>
        </div>
      ))}
    </div>
  );
};

const ApplicationModal = ({ career, onClose }) => {
  const [formData, setFormData] = useState({});
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const requiredFields = Array.isArray(career.required_fields)
    ? career.required_fields
    : typeof career.required_fields === "string"
      ? JSON.parse(career.required_fields || "[]")
      : [];

  const handleFileChange = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;
    // Store file info for submission
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
          setUploadedDocs((prev) => [
            ...prev.filter((d) => d.field !== fieldName),
            { field: fieldName, name: file.name, url },
          ]);
          toast.success(`${file.name} uploaded`);
        } else {
          toast.error("Upload failed");
        }
      } catch {
        toast.error("Upload error");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/careers/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          career_id: career.id,
          applicant_data: formData,
          documents: uploadedDocs,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit");
      toast.success("Application submitted successfully!");
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const isDeadlinePassed =
    career.deadline && new Date(career.deadline) < new Date();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-8 border-b border-gray-100 flex items-start justify-between sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-2xl font-black text-[#001d3d]">
              Apply: {career.title}
            </h2>
            {career.deadline && (
              <div className="mt-3">
                {isDeadlinePassed ? (
                  <span className="text-red-500 font-bold text-sm flex items-center gap-2">
                    <AlertCircle size={16} /> Deadline passed
                  </span>
                ) : (
                  <div>
                    <p className="text-xs text-gray-500 mb-2 font-bold uppercase">
                      Application closes in:
                    </p>
                    <Countdown deadline={career.deadline} />
                  </div>
                )}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        {isDeadlinePassed ? (
          <div className="p-8 text-center">
            <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
            <p className="text-gray-600 font-bold">
              This position is no longer accepting applications. The deadline
              has passed.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {requiredFields.map((field, idx) => (
              <div key={idx} className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  {field.label}
                  {field.required && <span className="text-red-500">*</span>}
                </label>
                {field.type === "file" ? (
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-[#ffc300] transition-colors">
                    <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 mb-2">
                      Upload {field.label}
                    </p>
                    <input
                      type="file"
                      accept={field.accept || "*/*"}
                      onChange={(e) => handleFileChange(e, field.label)}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#ffc300] file:text-[#001d3d] file:font-bold cursor-pointer"
                    />
                    {uploadedDocs.find((d) => d.field === field.label) && (
                      <p className="text-green-600 text-xs mt-2 font-bold">
                        ✓{" "}
                        {uploadedDocs.find((d) => d.field === field.label).name}
                      </p>
                    )}
                  </div>
                ) : field.type === "textarea" ? (
                  <textarea
                    rows={4}
                    required={field.required}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-[#ffc300] resize-none"
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        [field.label]: e.target.value,
                      }))
                    }
                  />
                ) : (
                  <input
                    type={field.type || "text"}
                    required={field.required}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-[#ffc300]"
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        [field.label]: e.target.value,
                      }))
                    }
                  />
                )}
              </div>
            ))}

            {requiredFields.length === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "Full Name", type: "text" },
                  { label: "Email", type: "email" },
                  { label: "Phone", type: "tel" },
                  { label: "LinkedIn", type: "url" },
                ].map((f) => (
                  <div key={f.label} className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">
                      {f.label}
                    </label>
                    <input
                      type={f.type}
                      required={["Full Name", "Email"].includes(f.label)}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-[#ffc300]"
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          [f.label]: e.target.value,
                        }))
                      }
                    />
                  </div>
                ))}
                <div className="col-span-2 space-y-2">
                  <label className="text-sm font-bold text-gray-700">
                    Cover Letter
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-[#ffc300] resize-none"
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        "Cover Letter": e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-sm font-bold text-gray-700">
                    CV / Resume
                  </label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-[#ffc300] transition-colors">
                    <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileChange(e, "CV")}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#ffc300] file:text-[#001d3d] file:font-bold cursor-pointer"
                    />
                    {uploadedDocs.find((d) => d.field === "CV") && (
                      <p className="text-green-600 text-xs mt-2 font-bold">
                        ✓ {uploadedDocs.find((d) => d.field === "CV").name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-[#ffc300] text-[#001d3d] font-black rounded-xl hover:bg-[#ffd60a] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                "Submitting..."
              ) : (
                <>
                  <Send size={20} /> Submit Application
                </>
              )}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

const CareersPage = () => {
  const [selectedCareer, setSelectedCareer] = useState(null);

  const { data: careers, isLoading } = useQuery({
    queryKey: ["careers"],
    queryFn: async () => {
      const res = await fetch("/api/careers");
      if (!res.ok) return [];
      return res.json();
    },
  });

  const activePositions = careers?.filter((c) => {
    if (!c.is_active) return false;
    if (c.deadline && new Date(c.deadline) < new Date()) return false;
    return true;
  });

  return (
    <div className="overflow-hidden bg-white pb-24">
      <Toaster position="top-right" />

      {/* Banner */}
      <section className="bg-[#001d3d] text-white py-24 relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#ffc300] rounded-full blur-[100px]"></div>
        </div>
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black mb-6"
          >
            Careers
          </motion.h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join MeadowBridge Foundation and help shape the future of
            environmental resilience and migration governance.
          </p>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-[#001d3d] mb-4">
              Open Positions
            </h2>
            <p className="text-gray-500">
              We are looking for passionate individuals to join our mission.
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-20 text-gray-400">
              Loading positions...
            </div>
          ) : activePositions?.length === 0 ? (
            <div className="text-center py-20">
              <Briefcase size={64} className="mx-auto text-gray-200 mb-6" />
              <h3 className="text-2xl font-bold text-gray-400 mb-2">
                No Open Positions
              </h3>
              <p className="text-gray-400">
                There are currently no open positions. Please check back later.
              </p>
            </div>
          ) : (
            <div className="space-y-6 max-w-4xl mx-auto">
              {activePositions?.map((career) => {
                const isPastDeadline =
                  career.deadline && new Date(career.deadline) < new Date();
                return (
                  <motion.div
                    key={career.id}
                    whileHover={{ scale: 1.01 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-xl transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="text-2xl font-black text-[#001d3d]">
                            {career.title}
                          </h3>
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-black rounded-full uppercase">
                            Open
                          </span>
                        </div>
                        {career.description && (
                          <p className="text-gray-600 leading-relaxed">
                            {career.description}
                          </p>
                        )}
                        {career.deadline && !isPastDeadline && (
                          <div>
                            <p className="text-xs text-gray-400 font-bold uppercase mb-2 flex items-center gap-1">
                              <Clock size={12} /> Closes in:
                            </p>
                            <Countdown deadline={career.deadline} />
                          </div>
                        )}
                        {career.deadline && (
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            <Calendar size={12} /> Deadline:{" "}
                            {new Date(career.deadline).toLocaleDateString(
                              "en-GB",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              },
                            )}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => setSelectedCareer(career)}
                        className="flex items-center gap-2 px-8 py-4 bg-[#ffc300] text-[#001d3d] font-black rounded-xl hover:bg-[#ffd60a] transition-all shrink-0"
                      >
                        Apply Now <ChevronRight size={20} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Application Modal */}
      <AnimatePresence>
        {selectedCareer && (
          <ApplicationModal
            career={selectedCareer}
            onClose={() => setSelectedCareer(null)}
          />
        )}
      </AnimatePresence>

      <PartnersStrip />
    </div>
  );
};

export default CareersPage;
