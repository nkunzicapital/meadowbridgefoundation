import { useState } from "react";
import { motion } from "motion/react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Toaster, toast } from "sonner";
import PartnersStrip from "@/components/PartnersStrip";

const ConnectPage = () => {
  const { data: settings } = useQuery({
    queryKey: ["site_settings"],
    queryFn: async () => {
      const res = await fetch("/api/settings");
      if (!res.ok) return {};
      return res.json();
    },
    staleTime: 60000,
  });

  const footerSettings = settings?.footer || {};
  const email = footerSettings.email || "info@meadowbridge.org";
  const phone = footerSettings.phone || "+254 123 456 789";
  const address = footerSettings.address || "Nairobi, Kenya";

  return (
    <div className="bg-white overflow-hidden pb-24">
      <Toaster position="top-right" />
      {/* Banner */}
      <section className="bg-[#001d3d] text-white py-24 relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#ffc300] rounded-full blur-[100px]"></div>
        </div>
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6">
            Connect with Us
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Join our high-level network of experts, policymakers, and regional
            stakeholders.
          </p>
        </div>
      </section>

      {/* Contact & Partnership */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div className="space-y-12">
              <h2 className="text-4xl font-black text-[#001d3d]">
                Get in Touch
              </h2>
              <div className="space-y-8">
                <div className="flex gap-6 items-start">
                  <div className="p-4 bg-gray-50 text-[#ffc300] rounded-2xl shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[#001d3d] mb-1">
                      Email Us
                    </h4>
                    <p className="text-gray-500">{email}</p>
                  </div>
                </div>
                <div className="flex gap-6 items-start">
                  <div className="p-4 bg-gray-50 text-[#ffc300] rounded-2xl shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[#001d3d] mb-1">
                      Call Us
                    </h4>
                    <p className="text-gray-500">{phone}</p>
                  </div>
                </div>
                <div className="flex gap-6 items-start">
                  <div className="p-4 bg-gray-50 text-[#ffc300] rounded-2xl shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[#001d3d] mb-1">
                      Headquarters
                    </h4>
                    <p className="text-gray-500">{address}</p>
                  </div>
                </div>
              </div>

              <div className="p-10 bg-[#001d3d] rounded-3xl text-white">
                <h3 className="text-2xl font-black mb-6">
                  Strategic Partnerships
                </h3>
                <p className="text-gray-400 mb-8 leading-relaxed">
                  We cultivate meaningful collaborations with government
                  agencies, private sector entities, and international
                  organizations to amplify impact.
                </p>
                <a
                  href="mailto:partners@meadowbridge.org"
                  className="inline-flex items-center gap-2 text-[#ffc300] font-bold hover:underline"
                >
                  Inquire about Partnership <Send size={18} />
                </a>
              </div>
            </div>

            <div className="bg-gray-50 p-10 rounded-[40px]">
              <h3 className="text-2xl font-black text-[#001d3d] mb-8">
                Send a Message
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  toast.success("Message sent! We will get back to you soon.");
                }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-6 py-4 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-[#ffc300] outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-6 py-4 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-[#ffc300] outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">
                    Organization
                  </label>
                  <input
                    type="text"
                    className="w-full px-6 py-4 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-[#ffc300] outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-6 py-4 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-[#ffc300] outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    required
                    className="w-full px-6 py-4 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-[#ffc300] outline-none resize-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full py-5 bg-[#ffc300] text-[#001d3d] font-black rounded-2xl hover:bg-[#ffd60a] transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#ffc300]/20"
                >
                  Send Message <Send size={20} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <PartnersStrip />
    </div>
  );
};

export default ConnectPage;
