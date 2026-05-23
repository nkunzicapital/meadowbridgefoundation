import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import ThemeApplier from "@/components/ThemeApplier";
import DynamicFavicon from "@/components/DynamicFavicon";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeApplier />
      <DynamicFavicon />
      <div className="flex flex-col min-h-screen font-sans selection:bg-[#ffc300] selection:text-[#001d3d] bg-white">
        <Toaster position="top-right" expand={true} richColors />
        <Header />
        <main className="flex-grow pt-[72px]">{children}</main>
        <Footer />
      </div>
    </QueryClientProvider>
  );
}
