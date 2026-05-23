"use client";
import { useQuery } from "@tanstack/react-query";
import { FileText, ExternalLink } from "lucide-react";

const PrivacyPage = () => {
  const { data: settings } = useQuery({
    queryKey: ["site_settings"],
    queryFn: async () => {
      const res = await fetch("/api/settings");
      if (!res.ok) return {};
      return res.json();
    },
  });

  const pdfUrl = settings?.privacy_policy_url || "";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner */}
      <section className="bg-[#001d3d] text-white py-20">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <FileText size={48} className="mx-auto mb-6 text-[#ffc300]" />
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-300">MeadowBridge Foundation</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 md:px-8">
          {pdfUrl ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="font-bold text-[#001d3d]">
                  Privacy Policy Document
                </h2>
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-[#001d3d] text-white text-sm font-bold rounded-full hover:bg-[#003566] transition-all"
                >
                  <ExternalLink size={14} /> Open in New Tab
                </a>
              </div>
              <div className="w-full" style={{ height: "80vh" }}>
                <iframe
                  src={`${pdfUrl}#toolbar=0`}
                  className="w-full h-full"
                  title="Privacy Policy"
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-24">
              <FileText size={64} className="mx-auto text-gray-200 mb-6" />
              <h3 className="text-2xl font-bold text-gray-400 mb-2">
                Privacy Policy Coming Soon
              </h3>
              <p className="text-gray-400 max-w-md mx-auto">
                Our privacy policy document is being prepared. Please check back
                soon or contact us at{" "}
                <a
                  href="mailto:info@meadowbridge.org"
                  className="text-[#ffc300] hover:underline"
                >
                  info@meadowbridge.org
                </a>
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default PrivacyPage;
