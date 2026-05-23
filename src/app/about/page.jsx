import { motion } from "motion/react";
import { History, Target, Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import PartnersStrip from "@/components/PartnersStrip";

const AboutPage = () => {
  const { data: legacyRows } = useQuery({
    queryKey: ["page_content_about_legacy"],
    queryFn: async () => {
      const res = await fetch(
        "/api/page-content?page=about&section=legacy_items",
      );
      if (!res.ok) return [];
      return res.json();
    },
  });

  const legacyItems = Array.isArray(legacyRows?.[0]?.content)
    ? legacyRows[0].content
    : [
        {
          year: "2020",
          event:
            "Foundation started as Nkunzi Foundation with a focus on education and social innovation.",
        },
        {
          year: "2022",
          event:
            "Shifted focus towards environmental stewardship and migration governance.",
        },
        {
          year: "2024",
          event:
            "Rebranded to MeadowBridge Foundation and achieved UNEP Accreditation Status.",
        },
      ];

  return (
    <div className="overflow-hidden">
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
            About Us
          </motion.h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Harmonizing grassroots environmental and migration realities with
            global policy frameworks.
          </p>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-8">
              <h2 className="text-4xl font-black text-[#001d3d]">Who We Are</h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  MeadowBridge Foundation is a not for profit institution with
                  United Nations Environment Programme Accreditation Status
                  dedicated to advancing environmental resilience and
                  sustainable human mobility through inclusive multilateralism
                  and advocacy.
                </p>
                <p>
                  We operate at the critical intersection of regional interests
                  and global governance, serving as a catalyst for
                  evidence-based policy architecture that bridges the gap
                  between grassroots realities and international frameworks.
                </p>
                <p>
                  The Foundation convenes a high-level network of technical
                  experts, policymakers, and regional stakeholders to harmonize
                  grassroots environmental and migration realities with global
                  governance. We specialize in scaling local and regional
                  insights into international frameworks.
                </p>
              </div>
            </div>
            <div className="bg-gray-100 p-12 rounded-3xl space-y-8">
              <div className="flex gap-6 items-start">
                <div className="p-4 bg-[#ffc300] rounded-2xl text-[#001d3d] shrink-0">
                  <Eye size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-[#001d3d] mb-4">
                    The Vision
                  </h3>
                  <p className="text-gray-600">
                    A world where regional realities are the primary blueprint
                    for global environmental and migration governance. We strive
                    to be the definitive architect of inclusive multilateralism.
                  </p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="p-4 bg-[#4ecdc4] rounded-2xl text-[#001d3d] shrink-0">
                  <Target size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-[#001d3d] mb-4">
                    The Mission
                  </h3>
                  <p className="text-gray-600">
                    To harmonize regional environmental and migration realities
                    with global policy frameworks through strategic
                    multilateralism, evidence-based advocacy, and technical
                    governance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Legacy — dynamic from admin */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="inline-flex p-4 bg-[#001d3d]/5 text-[#001d3d] rounded-full mb-6">
              <History size={32} />
            </div>
            <h2 className="text-4xl font-black text-[#001d3d] mb-6">
              Our Legacy
            </h2>
            <p className="text-lg text-gray-600">
              MeadowBridge Foundation was formerly known as{" "}
              <span className="font-bold text-[#001d3d]">
                Nkunzi Foundation
              </span>
              . Founded on{" "}
              <span className="font-bold text-[#001d3d]">5th May 2020</span>,
              our journey began with a commitment to creating lasting positive
              change through rigorous research and practical implementation.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {legacyItems.map((step, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative pt-12"
              >
                <div className="absolute top-0 left-8 -translate-y-1/2 bg-[#ffc300] text-[#001d3d] px-6 py-2 rounded-full font-black">
                  {step.year}
                </div>
                <p className="text-gray-600 leading-relaxed">{step.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Strip */}
      <PartnersStrip />
    </div>
  );
};

export default AboutPage;
