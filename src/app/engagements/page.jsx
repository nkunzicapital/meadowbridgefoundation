"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { Download, Calendar, MapPin, Users, ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import PartnersStrip from "@/components/PartnersStrip";

const EngagementsPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const { data: categories } = useQuery({
    queryKey: ["engagement_categories"],
    queryFn: async () => {
      const res = await fetch("/api/engagement-categories");
      if (!res.ok) return [];
      return res.json();
    },
  });

  const { data: engagements, isLoading } = useQuery({
    queryKey: ["engagements", activeCategory],
    queryFn: async () => {
      const url =
        activeCategory === "All"
          ? "/api/engagements"
          : `/api/engagements?category=${encodeURIComponent(activeCategory)}`;
      const res = await fetch(url);
      if (!res.ok) return [];
      return res.json();
    },
  });

  const allCats = ["All", ...(categories?.map((c) => c.name) || [])];

  const filtered = engagements?.filter(
    (e) =>
      !search ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      (e.country || "").toLowerCase().includes(search.toLowerCase()) ||
      (e.representative || "").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="overflow-hidden bg-white pb-24">
      {/* Banner */}
      <section className="bg-[#001d3d] text-white py-24 relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#4ecdc4] rounded-full blur-[100px]"></div>
        </div>
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black mb-6"
          >
            Engagements
          </motion.h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our participation across global consultations, conferences, summits,
            and assemblies.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-12 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="flex gap-3 flex-wrap">
              {allCats.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${activeCategory === cat ? "bg-[#001d3d] text-white" : "bg-white text-gray-500 border border-gray-200 hover:border-[#ffc300]"}`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Search engagements..."
              className="px-5 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#ffc300] w-full md:w-72 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Engagements Table */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-8">
          {isLoading ? (
            <div className="text-center py-20 text-gray-400">
              Loading engagements...
            </div>
          ) : filtered?.length === 0 ? (
            <div className="text-center py-20">
              <Users size={48} className="mx-auto text-gray-200 mb-4" />
              <p className="text-gray-400">No engagements found.</p>
            </div>
          ) : (
            <>
              {/* Mobile cards */}
              <div className="md:hidden space-y-6">
                {filtered?.map((eng) => (
                  <motion.div
                    key={eng.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="px-3 py-1 bg-[#ffc300]/10 text-[#001d3d] text-xs font-black rounded-full uppercase tracking-widest">
                          {eng.category}
                        </span>
                        <h3 className="text-lg font-bold text-[#001d3d] mt-2">
                          {eng.title}
                        </h3>
                      </div>
                      <span className="text-[#ffc300] font-black text-2xl">
                        {eng.year}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      {eng.engagement_date && (
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />{" "}
                          {new Date(eng.engagement_date).toLocaleDateString()}
                        </span>
                      )}
                      {eng.country && (
                        <span className="flex items-center gap-1">
                          <MapPin size={14} /> {eng.country}
                        </span>
                      )}
                      {eng.representative && (
                        <span className="flex items-center gap-1">
                          <Users size={14} /> {eng.representative}
                        </span>
                      )}
                    </div>
                    {eng.report_url && (
                      <a
                        href={eng.report_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#001d3d] text-white text-xs font-bold rounded-full hover:bg-[#003566] transition-all"
                      >
                        <Download size={14} /> Download Report
                      </a>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Desktop table */}
              <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-[#001d3d] text-white text-xs font-black uppercase tracking-widest">
                    <tr>
                      <th className="px-6 py-4">Engagement</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Year / Date</th>
                      <th className="px-6 py-4">Country</th>
                      <th className="px-6 py-4">Representative</th>
                      <th className="px-6 py-4">Report</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filtered?.map((eng) => (
                      <tr
                        key={eng.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="font-bold text-[#001d3d]">
                            {eng.title}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-[#ffc300]/10 text-[#001d3d] text-xs font-black rounded-full uppercase">
                            {eng.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <div className="font-bold text-[#ffc300]">
                            {eng.year}
                          </div>
                          {eng.engagement_date && (
                            <div className="text-xs">
                              {new Date(
                                eng.engagement_date,
                              ).toLocaleDateString()}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {eng.country}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {eng.representative}
                        </td>
                        <td className="px-6 py-4">
                          {eng.report_url ? (
                            <a
                              href={eng.report_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 bg-[#001d3d] text-white text-xs font-bold rounded-full hover:bg-[#003566] transition-all"
                            >
                              <Download size={14} /> Report
                            </a>
                          ) : (
                            <span className="text-gray-300 text-xs">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </section>

      <PartnersStrip />
    </div>
  );
};

export default EngagementsPage;
