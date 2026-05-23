"use client";
import { useQuery } from "@tanstack/react-query";

const PartnersStrip = () => {
  const { data: partners } = useQuery({
    queryKey: ["partners_strip"],
    queryFn: async () => {
      const res = await fetch("/api/partners");
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 300000,
  });

  if (!partners || partners.length === 0) return null;

  // Duplicate for seamless loop
  const items = [...partners, ...partners];

  return (
    <div className="bg-gray-50 border-y border-gray-200 py-6 overflow-hidden">
      <div className="relative flex items-center">
        <div className="partners-track flex items-center gap-16 whitespace-nowrap">
          {items.map((partner, i) => (
            <a
              key={`${partner.id}-${i}`}
              href={partner.website_url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 min-w-[120px] group"
            >
              {partner.logo_url ? (
                <img
                  src={partner.logo_url}
                  alt={partner.name}
                  className="max-h-10 max-w-[100px] object-contain grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all"
                />
              ) : (
                <div className="w-16 h-10 flex items-center justify-center bg-gray-200 rounded text-gray-400 text-xs font-bold">
                  {partner.name?.slice(0, 2).toUpperCase()}
                </div>
              )}
              <span className="text-xs text-gray-400 font-semibold group-hover:text-gray-700 transition-colors text-center">
                {partner.name}
              </span>
            </a>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .partners-track {
          animation: partners-scroll 30s linear infinite;
          display: flex;
        }
        @keyframes partners-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .partners-track:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default PartnersStrip;
