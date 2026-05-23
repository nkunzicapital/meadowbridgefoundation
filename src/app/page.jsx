import { motion } from "motion/react";
import {
  ArrowRight,
  Globe,
  Shield,
  Users,
  Award,
  BookOpen,
  CheckCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import PartnersStrip from "@/components/PartnersStrip";

const DEFAULT_OBJECTIVES = [
  {
    title: "Multilateralism",
    desc: "Bridging the divide between regional ecological realities and international governance.",
  },
  {
    title: "Environment-Migration Nexus",
    desc: "Advocating for the inclusion of climate-induced mobility into regional development policies.",
  },
  {
    title: "Mobilization",
    desc: "Facilitating high-level consultations with government bodies and CSOs.",
  },
  {
    title: "Strategic Partnerships",
    desc: "Cultivating collaborations with government agencies and private sector.",
  },
  {
    title: "Technical Accountability",
    desc: "Championing science-based resource management with technical excellence.",
  },
  {
    title: "Knowledge Sharing",
    desc: "Championing evidence-based policy advocacy and knowledge exchange.",
  },
];

const OBJ_ICONS = [
  <Globe className="w-12 h-12 text-[#ffc300]" />,
  <ArrowRight className="w-12 h-12 text-[#ffc300]" />,
  <Users className="w-12 h-12 text-[#ffc300]" />,
  <CheckCircle className="w-12 h-12 text-[#ffc300]" />,
  <Award className="w-12 h-12 text-[#ffc300]" />,
  <BookOpen className="w-12 h-12 text-[#ffc300]" />,
];

const HomePage = () => {
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  const { data: stats } = useQuery({
    queryKey: ["impact_stats"],
    queryFn: async () => {
      const res = await fetch("/api/stats");
      if (!res.ok) return [];
      return res.json();
    },
  });

  const { data: articles } = useQuery({
    queryKey: ["featured_articles"],
    queryFn: async () => {
      const res = await fetch("/api/articles?limit=3");
      if (!res.ok) return [];
      return res.json();
    },
  });

  const { data: heroRows } = useQuery({
    queryKey: ["page_content_home_hero"],
    queryFn: async () => {
      const res = await fetch("/api/page-content?page=home&section=hero");
      if (!res.ok) return [];
      return res.json();
    },
  });

  const { data: aboutImgRows } = useQuery({
    queryKey: ["page_content_home_about_images"],
    queryFn: async () => {
      const res = await fetch(
        "/api/page-content?page=home&section=about_images",
      );
      if (!res.ok) return [];
      return res.json();
    },
  });

  // NEW: load objectives from page_content
  const { data: objectivesRows } = useQuery({
    queryKey: ["page_content_home_objectives"],
    queryFn: async () => {
      const res = await fetch("/api/page-content?page=home&section=objectives");
      if (!res.ok) return [];
      return res.json();
    },
  });

  const heroContent = heroRows?.[0]?.content || {};
  const aboutImagesContent = aboutImgRows?.[0]?.content || {};
  const slideImages = aboutImagesContent.images?.length
    ? aboutImagesContent.images
    : [
        "https://dtvoeevhaseb5.cloudfront.net/user-uploads/51d7d8b4-2eec-4e38-855b-a8c27100e091.jpg",
      ];

  // Use objectives from DB or fall back to defaults
  const savedObjectives = Array.isArray(objectivesRows?.[0]?.content)
    ? objectivesRows[0].content
    : null;
  const objectives = savedObjectives || DEFAULT_OBJECTIVES;

  useEffect(() => {
    if (slideImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIdx((prev) => (prev + 1) % slideImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slideImages.length]);

  const heroType = heroContent.type || "animated";
  const heroBannerImage = heroContent.image_urls?.[0] || "";

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      {heroType === "banner" && heroBannerImage ? (
        <section
          className="relative h-[90vh] flex items-center text-white"
          style={{
            backgroundImage: `url(${heroBannerImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-[#001d3d]/70" />
          <div className="container mx-auto px-4 md:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl"
            >
              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                Environmental{" "}
                <span className="text-[#ffc300]">Stewardship.</span>
                <br />
                Proactive <span className="text-[#4ecdc4]">Migration.</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed max-w-2xl">
                Advancing environmental resilience and sustainable human
                mobility through inclusive multilateralism and advocacy.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="/about"
                  className="px-8 py-4 bg-[#ffc300] text-[#001d3d] font-bold rounded-lg hover:bg-[#ffd60a] transition-all flex items-center gap-2 group"
                >
                  Our Vision{" "}
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </a>
                <a
                  href="/our-work"
                  className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-lg hover:bg-white/20 transition-all"
                >
                  Explore Our Work
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      ) : (
        <section className="relative h-[90vh] flex items-center bg-[#001d3d] text-white">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#ffc300] rounded-full blur-[150px] -mr-64 -mt-64"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#4ecdc4] rounded-full blur-[120px] -ml-32 -mb-32"></div>
          </div>
          <div className="container mx-auto px-4 md:px-8 relative z-10">
            <div className="max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                  Environmental{" "}
                  <span className="text-[#ffc300]">Stewardship.</span>
                  <br />
                  Proactive <span className="text-[#4ecdc4]">Migration.</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed max-w-2xl">
                  Advancing environmental resilience and sustainable human
                  mobility through inclusive multilateralism and advocacy.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="/about"
                    className="px-8 py-4 bg-[#ffc300] text-[#001d3d] font-bold rounded-lg hover:bg-[#ffd60a] transition-all flex items-center gap-2 group"
                  >
                    Our Vision{" "}
                    <ArrowRight
                      size={20}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </a>
                  <a
                    href="/our-work"
                    className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-lg hover:bg-white/20 transition-all"
                  >
                    Explore Our Work
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      <PartnersStrip />

      {/* About Brief with auto-sliding images */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="inline-block px-4 py-1 bg-[#ffc300]/10 text-[#ffc300] rounded-full text-sm font-bold uppercase tracking-widest">
                About MeadowBridge
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-[#001d3d] leading-tight">
                Bridging the Gap Between Grassroots Realities and International
                Frameworks.
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                MeadowBridge Foundation is a not-for-profit institution with
                United Nations Environment Programme Accreditation Status
                dedicated to advancing environmental resilience and sustainable
                human mobility through inclusive multilateralism and advocacy.
              </p>
              <div className="grid grid-cols-3 gap-6">
                {[
                  {
                    label: "Multilateralism",
                    icon: <Globe className="text-[#ffc300]" />,
                  },
                  {
                    label: "Advocacy",
                    icon: <Shield className="text-[#ffc300]" />,
                  },
                  {
                    label: "Policy Negotiation",
                    icon: <Award className="text-[#ffc300]" />,
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center gap-3"
                  >
                    {item.icon}
                    <span className="font-bold text-[#001d3d] text-sm">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl relative">
                {slideImages.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`MeadowBridge ${idx + 1}`}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
                    style={{ opacity: idx === currentImageIdx ? 1 : 0 }}
                  />
                ))}
              </div>
              {slideImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {slideImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIdx(idx)}
                      className="w-2 h-2 rounded-full transition-all"
                      style={{
                        backgroundColor:
                          idx === currentImageIdx
                            ? "#ffc300"
                            : "rgba(255,255,255,0.5)",
                      }}
                    />
                  ))}
                </div>
              )}
              <div className="absolute -bottom-8 -right-8 bg-[#001d3d] p-10 rounded-2xl shadow-xl hidden md:block">
                <div className="text-[#ffc300] text-5xl font-black mb-2">
                  6+
                </div>
                <div className="text-white font-bold tracking-widest uppercase text-xs">
                  Years of Impact
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Objectives — now dynamic from admin */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-black text-[#001d3d] mb-6">
              Our Core Objectives
            </h2>
            <p className="text-gray-500">
              Focusing on the critical intersection of Global Migration and
              Environment
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {objectives.map((obj, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all"
              >
                <div className="mb-6">{OBJ_ICONS[idx % OBJ_ICONS.length]}</div>
                <h3 className="text-xl font-black text-[#001d3d] mb-4">
                  {obj.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{obj.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-24 bg-[#001d3d] text-white">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {stats?.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                <div className="text-5xl font-black text-[#ffc300] mb-4">
                  {stat.value}
                </div>
                <div className="text-gray-400 font-bold uppercase tracking-widest text-sm">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex justify-between items-end mb-16">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-black text-[#001d3d] mb-4">
                Latest Insights & Analysis
              </h2>
              <p className="text-gray-600">
                Explore our latest research and policy updates from the field.
              </p>
            </div>
            <a
              href="/resources"
              className="hidden md:flex items-center gap-2 font-bold text-[#001d3d] hover:text-[#ffc300] transition-colors"
            >
              View All Resources <ArrowRight size={20} />
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles?.map((article, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100"
              >
                <div className="h-48 bg-gray-200">
                  <img
                    src={
                      article.featured_image_url ||
                      "https://dtvoeevhaseb5.cloudfront.net/user-uploads/51d7d8b4-2eec-4e38-855b-a8c27100e091.jpg"
                    }
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-8">
                  <div className="text-[#ffc300] text-xs font-bold uppercase tracking-widest mb-3">
                    {article.category}
                  </div>
                  <h3 className="text-xl font-bold text-[#001d3d] mb-4 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <a
                    href="/resources"
                    className="text-[#001d3d] font-bold text-sm flex items-center gap-2 group"
                  >
                    Read More{" "}
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <PartnersStrip />
    </div>
  );
};

export default HomePage;
