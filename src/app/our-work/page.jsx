import { motion } from "motion/react";
import {
  Globe,
  Leaf,
  Users,
  Shield,
  Award,
  BookOpen,
  MapPin,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import PartnersStrip from "@/components/PartnersStrip";

const LOCATION_COLORS = {
  International: "bg-[#ffc300] text-[#001d3d]",
  Africa: "bg-[#4ecdc4] text-[#001d3d]",
  Europe: "bg-blue-100 text-blue-800",
  Regional: "bg-purple-100 text-purple-800",
  default: "bg-gray-100 text-gray-700",
};

const OurWorkPage = () => {
  const { data: programs, isLoading } = useQuery({
    queryKey: ["programs"],
    queryFn: async () => {
      const res = await fetch("/api/programs");
      if (!res.ok) return [];
      return res.json();
    },
  });

  const { data: bannerContent } = useQuery({
    queryKey: ["page_content_ourwork_banner"],
    queryFn: async () => {
      const res = await fetch("/api/page-content?page=our-work&section=banner");
      if (!res.ok) return [];
      const rows = await res.json();
      return (
        rows[0]?.content || {
          title: "Our Impact",
          subtitle:
            "Operating at the critical intersection of environmental stewardship and proactive migration.",
        }
      );
    },
  });

  const bannerTitle = bannerContent?.title || "Our Impact";
  const bannerSubtitle =
    bannerContent?.subtitle ||
    "Operating at the critical intersection of environmental stewardship and proactive migration.";

  return (
    <div className="overflow-hidden">
      {/* Banner */}
      <section className="bg-[#001d3d] text-white py-24 relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#4ecdc4] rounded-full blur-[100px]"></div>
        </div>
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black mb-6"
          >
            {bannerTitle}
          </motion.h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {bannerSubtitle}
          </p>
        </div>
      </section>

      {/* Thematic Areas */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
            <div
              id="migration"
              className="space-y-8 p-10 bg-gray-50 rounded-3xl border border-gray-100 hover:shadow-xl transition-all group"
            >
              <div className="p-5 bg-[#ffc300] text-[#001d3d] rounded-2xl w-fit group-hover:scale-110 transition-transform">
                <Globe size={40} />
              </div>
              <h2 className="text-3xl font-black text-[#001d3d]">
                Migration & Displacement
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Advocating for the inclusion of climate-induced mobility into
                regional development policies. We ensure that stewardship
                strategies address the root environmental causes of migration
                and displacement.
              </p>
              <ul className="space-y-4">
                {[
                  "Regional Mobility Frameworks",
                  "Refugee Rights Advocacy",
                  "Climate-induced Displacement Policy",
                ].map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-3 text-gray-700 font-semibold"
                  >
                    <div className="w-2 h-2 bg-[#ffc300] rounded-full"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div
              id="environment"
              className="space-y-8 p-10 bg-gray-50 rounded-3xl border border-gray-100 hover:shadow-xl transition-all group"
            >
              <div className="p-5 bg-[#4ecdc4] text-[#001d3d] rounded-2xl w-fit group-hover:scale-110 transition-transform">
                <Leaf size={40} />
              </div>
              <h2 className="text-3xl font-black text-[#001d3d]">
                Environmental Stewardship
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Dedicated to advancing environmental resilience through
                technical governance and inclusive multilateralism. We
                specialize in scaling local and regional insights into
                international frameworks.
              </p>
              <ul className="space-y-4">
                {[
                  "Science-based Resource Management",
                  "UNEP Accreditation Advocacy",
                  "Localized Expertise Scaling",
                ].map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-3 text-gray-700 font-semibold"
                  >
                    <div className="w-2 h-2 bg-[#4ecdc4] rounded-full"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Programs Section — dynamic from DB */}
          <div className="mb-8 text-center">
            <h2 className="text-4xl font-black text-[#001d3d] mb-4">
              Our Programs
            </h2>
            <p className="text-gray-500">
              Initiatives spanning multiple regions and international frameworks
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-20 text-gray-400 animate-pulse">
              Loading programs...
            </div>
          ) : (
            <div className="space-y-12">
              {programs?.map((program, idx) => {
                const bullets = Array.isArray(program.bullets)
                  ? program.bullets
                  : typeof program.bullets === "string"
                    ? JSON.parse(program.bullets || "[]")
                    : [];
                const locColor =
                  LOCATION_COLORS[program.location_type] ||
                  LOCATION_COLORS.default;
                return (
                  <div
                    key={program.id}
                    className="bg-[#001d3d] rounded-[40px] p-12 lg:p-16 text-white relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ffc300] rounded-full blur-[150px] opacity-10 -mr-32 -mt-32"></div>
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span
                            className={`px-4 py-1 rounded-full text-sm font-black uppercase ${locColor}`}
                          >
                            {program.location_type}
                          </span>
                          {program.location_name && (
                            <span className="flex items-center gap-1 text-gray-400 text-sm">
                              <MapPin size={14} />
                              {program.location_name}
                            </span>
                          )}
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black">
                          {program.name}
                        </h2>
                        <p className="text-xl text-gray-300 leading-relaxed">
                          {program.description}
                        </p>
                        {bullets.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {bullets.map((bullet, bi) => (
                              <div key={bi} className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-[#ffc300] rounded-full shrink-0"></div>
                                <span className="font-bold text-sm">
                                  {bullet}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="rounded-3xl overflow-hidden shadow-2xl min-h-[200px] bg-[#002d5a] flex items-center justify-center">
                        {program.image_url ? (
                          <img
                            src={program.image_url}
                            alt={program.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-gray-500 text-center p-8">
                            <Globe
                              size={48}
                              className="mx-auto mb-4 opacity-30"
                            />
                            <p className="text-sm opacity-40">Program image</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <PartnersStrip />
    </div>
  );
};

export default OurWorkPage;
