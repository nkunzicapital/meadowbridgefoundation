import { useState } from "react";
import { motion } from "motion/react";
import {
  Download,
  Play,
  Pause,
  FileText,
  Search,
  Calendar,
  Mic,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import PartnersStrip from "@/components/PartnersStrip";

const ResourcesPage = () => {
  const [activeTab, setActiveTab] = useState("articles");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [playingPodcastId, setPlayingPodcastId] = useState(null);

  const { data: articles, isLoading: articlesLoading } = useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      const res = await fetch("/api/articles?limit=100");
      if (!res.ok) throw new Error("Failed to fetch articles");
      return res.json();
    },
  });

  const { data: podcasts, isLoading: podcastsLoading } = useQuery({
    queryKey: ["podcasts"],
    queryFn: async () => {
      const res = await fetch("/api/podcasts");
      if (!res.ok) throw new Error("Failed to fetch podcasts");
      return res.json();
    },
  });

  const categories = [
    "All",
    ...Array.from(
      new Set(articles?.map((a) => a.category).filter(Boolean) || []),
    ),
  ];

  const filteredArticles = articles?.filter((a) => {
    const matchSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      (a.excerpt || "").toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "All" || a.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Header */}
      <section className="bg-[#001d3d] text-white py-24">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h1 className="text-5xl font-black mb-6">Knowledge Hub</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            Access our latest research, policy architecture, and expert insights
            on migration and environment.
          </p>

          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search research, articles, podcasts..."
              className="w-full pl-12 pr-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:bg-white focus:text-[#001d3d] transition-all outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="container mx-auto px-4 md:px-8 -mt-8 relative z-10">
        <div className="flex justify-center gap-4">
          {[
            {
              id: "articles",
              label: "Articles & Analysis",
              icon: <FileText size={20} />,
            },
            { id: "podcasts", label: "Podcasts", icon: <Mic size={20} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-8 py-4 rounded-2xl font-bold transition-all shadow-lg flex items-center gap-2 ${activeTab === tab.id ? "bg-[#ffc300] text-[#001d3d]" : "bg-white text-gray-600 hover:bg-gray-50"}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 mt-10">
        {activeTab === "articles" ? (
          <>
            {/* Category filters */}
            <div className="flex gap-3 flex-wrap mb-8 justify-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${activeCategory === cat ? "bg-[#001d3d] text-white" : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-200"}`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {articlesLoading ? (
                <div className="col-span-full py-20 text-center text-gray-500 animate-pulse">
                  Loading resources...
                </div>
              ) : filteredArticles?.length === 0 ? (
                <div className="col-span-full py-20 text-center text-gray-400">
                  No articles found.
                </div>
              ) : (
                filteredArticles?.map((article) => (
                  <motion.div
                    key={article.id}
                    id={article.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col"
                  >
                    <div className="h-56 bg-gray-200">
                      <img
                        src={
                          article.featured_image_url ||
                          "https://dtvoeevhaseb5.cloudfront.net/user-uploads/51d7d8b4-2eec-4e38-855b-a8c27100e091.jpg"
                        }
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-8 flex-grow space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-[#ffc300] uppercase tracking-widest">
                          {article.category}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Calendar size={12} />{" "}
                          {new Date(article.published_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-[#001d3d] line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                        {article.excerpt}
                      </p>

                      <div className="pt-6 flex items-center justify-between border-t border-gray-100">
                        <button className="text-[#001d3d] font-bold text-sm hover:text-[#ffc300]">
                          Read Online
                        </button>
                        {article.pdf_url && (
                          <a
                            href={article.pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-xs font-bold text-gray-600 hover:bg-[#001d3d] hover:text-white transition-all"
                          >
                            <Download size={14} /> Download PDF
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {podcastsLoading ? (
              <div className="py-20 text-center text-gray-500 animate-pulse">
                Loading podcasts...
              </div>
            ) : podcasts?.length === 0 ? (
              <div className="py-20 text-center text-gray-400">
                No podcasts published yet.
              </div>
            ) : (
              podcasts?.map((podcast) => (
                <motion.div
                  key={podcast.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-6 mb-4">
                    <div className="p-4 bg-[#ffc300] rounded-2xl text-[#001d3d] shrink-0">
                      <Mic size={24} />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-bold text-[#001d3d] mb-1">
                        {podcast.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {podcast.description}
                      </p>
                    </div>
                    <div className="text-xs text-gray-400 font-semibold shrink-0">
                      {new Date(podcast.published_at).toLocaleDateString()}
                    </div>
                  </div>
                  {/* Inline audio player */}
                  {podcast.audio_url && (
                    <audio
                      controls
                      className="w-full mt-2 rounded-lg"
                      style={{ height: 40 }}
                    >
                      <source src={podcast.audio_url} />
                      Your browser does not support the audio element.
                    </audio>
                  )}
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="mt-16">
        <PartnersStrip />
      </div>
    </div>
  );
};

export default ResourcesPage;
