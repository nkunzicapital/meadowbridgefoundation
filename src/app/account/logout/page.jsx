import useAuth from "@/utils/useAuth";
import { useEffect } from "react";

function MainComponent() {
  const { signOut } = useAuth();

  useEffect(() => {
    signOut({ callbackUrl: "/", redirect: true });
  }, [signOut]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#001d3d]">
      <div className="text-white text-xl animate-pulse">Signing you out...</div>
    </div>
  );
}

export default MainComponent;
