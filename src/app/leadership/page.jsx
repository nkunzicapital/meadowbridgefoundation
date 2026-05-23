"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { Linkedin, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import PartnersStrip from "@/components/PartnersStrip";

const GROUPS = [
  "Founding Team",
  "Board of Directors",
  "Advisory Council",
  "Executive Management",
];

const LeadershipPage = () => {
  const { data: team, isLoading } = useQuery({
    queryKey: ["team"],
    queryFn: async () => {
      const res = await fetch("/api/team");
      if (!res.ok) return [];
      return res.json();
    },
  });

  const groupedTeam = GROUPS.reduce((acc, group) => {
    acc[group] = team?.filter((m) => m.group_name === group) || [];
    return acc;
  }, {});

  return (
    <div className="overflow-hidden bg-white pb-24">
      {/* Banner */}
      <section className="bg-[#001d3d] text-white py-24 relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#ffc300] rounded-full blur-[100px]"></div>
        </div>
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black mb-6"
          >
            Our Leadership
          </motion.h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Uniting expertise across disciplines for a sustainable global
            future.
          </p>
        </div>
      </section>

      {/* Team by Group */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-8">
          {isLoading ? (
            <div className="text-center py-20 text-gray-400">
              Loading leadership...
            </div>
          ) : (
            <div className="space-y-24">
              {GROUPS.map(
                (group) =>
                  groupedTeam[group]?.length > 0 && (
                    <div key={group}>
                      <div className="flex items-center gap-4 mb-12">
                        <div className="p-3 bg-[#ffc300]/10 rounded-xl text-[#ffc300]">
                          <Users size={24} />
                        </div>
                        <h2 className="text-3xl font-black text-[#001d3d] border-b-4 border-[#ffc300] pb-2">
                          {group}
                        </h2>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {groupedTeam[group].map((member) => (
                          <motion.div
                            key={member.id}
                            whileHover={{ y: -8 }}
                            className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all"
                          >
                            <div className="h-56 bg-gray-100 overflow-hidden">
                              <img
                                src={
                                  member.photo_url ||
                                  "https://dtvoeevhaseb5.cloudfront.net/user-uploads/13d1de25-cb1e-472b-a5b4-ac253576489d.png"
                                }
                                alt={member.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src =
                                    "https://dtvoeevhaseb5.cloudfront.net/user-uploads/13d1de25-cb1e-472b-a5b4-ac253576489d.png";
                                }}
                              />
                            </div>
                            <div className="p-6 text-center">
                              <h3 className="text-lg font-black text-[#001d3d] mb-1">
                                {member.name}
                              </h3>
                              <p className="text-[#ffc300] text-sm font-bold mb-2">
                                {member.position}
                              </p>
                              {member.bio && (
                                <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-3">
                                  {member.bio}
                                </p>
                              )}
                              {member.linkedin_url && (
                                <a
                                  href={member.linkedin_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-[#001d3d] transition-colors"
                                >
                                  <Linkedin size={16} /> LinkedIn
                                </a>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ),
              )}

              {(!team || team.length === 0) && !isLoading && (
                <div className="text-center py-20">
                  <Users size={48} className="mx-auto text-gray-200 mb-4" />
                  <p className="text-gray-400">
                    Leadership profiles will appear here once added by the
                    admin.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <PartnersStrip />
    </div>
  );
};

export default LeadershipPage;
