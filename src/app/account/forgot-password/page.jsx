import { useState } from "react";
import { Toaster, toast } from "sonner";

function MainComponent() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("Failed to send reset link");

      setSuccess(true);
      toast.success("Reset link sent to your email!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#001d3d] p-4">
      <Toaster position="top-center" />
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <h1 className="mb-4 text-center text-3xl font-bold text-[#001d3d]">
          Reset Password
        </h1>

        {success ? (
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              If an account exists for {email}, you will receive a password
              reset link shortly.
            </p>
            <a
              href="/account/signin"
              className="block text-[#001d3d] font-bold"
            >
              Back to Login
            </a>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-6">
            <p className="text-gray-600 text-sm text-center">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white px-4 py-3 focus-within:border-[#ffc300] focus-within:ring-1 focus-within:ring-[#ffc300]">
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-transparent text-lg outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#001d3d] px-4 py-3 text-base font-medium text-white transition-colors hover:bg-[#003566] disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <div className="text-center">
              <a
                href="/account/signin"
                className="text-sm text-gray-500 hover:text-[#001d3d]"
              >
                Back to Sign In
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default MainComponent;
