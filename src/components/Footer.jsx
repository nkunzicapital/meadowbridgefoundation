import { Linkedin, Mail, MapPin, Phone, Facebook } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const SYMBOL_LOGO =
  "https://dtvoeevhaseb5.cloudfront.net/user-uploads/13d1de25-cb1e-472b-a5b4-ac253576489d.png";

// X (Twitter) icon SVG
const XIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// Instagram icon SVG
const InstagramIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const Footer = () => {
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
  const socialMedia = settings?.social_media || [
    { platform: "twitter", url: "#", icon: "X", visible: true },
    { platform: "linkedin", url: "#", icon: "Linkedin", visible: true },
    { platform: "facebook", url: "#", icon: "Facebook", visible: true },
    { platform: "instagram", url: "#", icon: "Instagram", visible: true },
  ];
  const privacyPolicyUrl = settings?.privacy_policy_url || "";
  const nkunziUrl =
    footerSettings?.nkunzi_url ||
    settings?.nkunzi_capital_url ||
    "https://nkunzicapital.com";
  const primaryColor = settings?.theme?.primary || "#001d3d";
  const accentColor = settings?.theme?.accent || "#ffc300";
  // Use admin-uploaded logo, or fall back to default
  const logoUrl = settings?.logo_url || SYMBOL_LOGO;

  const renderSocialIcon = (icon) => {
    if (icon === "X" || icon === "twitter") return <XIcon size={18} />;
    if (icon === "Instagram") return <InstagramIcon size={18} />;
    if (icon === "Linkedin") return <Linkedin size={18} />;
    if (icon === "Facebook") return <Facebook size={18} />;
    return null;
  };

  return (
    <footer
      className="text-white pt-20 pb-10"
      style={{ backgroundColor: primaryColor }}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 border-b border-white/10 pb-16">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img
                src={logoUrl}
                alt="MeadowBridge"
                className="h-12 w-12 object-contain"
              />
              <div className="flex flex-col leading-tight">
                <span className="font-black text-lg">MeadowBridge</span>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                  Foundation
                </span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Advancing environmental resilience and sustainable human mobility
              through inclusive multilateralism and advocacy.
            </p>
            {/* Social icons */}
            <div className="flex gap-3 flex-wrap">
              {socialMedia
                .filter((s) => s.visible)
                .map((s, i) => (
                  <a
                    key={i}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white/5 rounded-full hover:bg-white/20 transition-all"
                    style={{ "--hover-color": accentColor }}
                  >
                    {renderSocialIcon(s.icon)}
                  </a>
                ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4
              className="text-lg font-bold mb-6"
              style={{ color: accentColor }}
            >
              Navigation
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              {[
                { label: "About Us", path: "/about" },
                { label: "Our Work", path: "/our-work" },
                { label: "Engagements", path: "/engagements" },
                { label: "Resources", path: "/resources" },
                { label: "Leadership", path: "/leadership" },
                { label: "Careers", path: "/careers" },
                { label: "Connect", path: "/connect" },
              ].map((l) => (
                <li key={l.path}>
                  <a
                    href={l.path}
                    className="hover:text-white transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Impact Areas */}
          <div>
            <h4
              className="text-lg font-bold mb-6"
              style={{ color: accentColor }}
            >
              Impact Areas
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <a
                  href="/our-work"
                  className="hover:text-white transition-colors"
                >
                  Migration & Displacement
                </a>
              </li>
              <li>
                <a
                  href="/our-work"
                  className="hover:text-white transition-colors"
                >
                  Environmental Stewardship
                </a>
              </li>
              <li>
                <a
                  href="/our-work"
                  className="hover:text-white transition-colors"
                >
                  Multilateral Advocacy
                </a>
              </li>
              <li>
                <a
                  href="/our-work"
                  className="hover:text-white transition-colors"
                >
                  Policy Negotiation
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4
              className="text-lg font-bold mb-6"
              style={{ color: accentColor }}
            >
              Contact Info
            </h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin
                  size={18}
                  style={{ color: accentColor }}
                  className="shrink-0 mt-0.5"
                />
                <span>{footerSettings.address || "Nairobi, Kenya"}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail
                  size={18}
                  style={{ color: accentColor }}
                  className="shrink-0"
                />
                <span>{footerSettings.email || "info@meadowbridge.org"}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone
                  size={18}
                  style={{ color: accentColor }}
                  className="shrink-0"
                />
                <span>{footerSettings.phone || "+254 123 456 789"}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} MeadowBridge Foundation. All rights
            reserved.
          </p>
          <a
            href={nkunziUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-gray-400 italic hover:text-white transition-colors"
          >
            Member of {footerSettings.member_of || "Nkunzi Capital Inc."}
          </a>
          <div className="flex gap-6">
            {/* Privacy Policy — always visible; /privacy handles both uploaded PDF and placeholder */}
            <a href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
