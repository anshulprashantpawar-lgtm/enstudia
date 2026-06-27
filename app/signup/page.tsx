"use client";
import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Already signed in — route away from signup
  useEffect(() => {
    if (status === "authenticated") {
      router.replace(session?.user?.onboardingComplete ? "/dashboard" : "/onboarding");
    }
  }, [status, session, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); setLoading(false); return; }

      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) { setError("Account created but sign-in failed. Try logging in."); setLoading(false); return; }
      router.push("/onboarding");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-ink tracking-tight mb-1.5">Create your account</h1>
          <p className="text-sm text-ink-2">
            Already have one?{" "}
            <Link href="/login" className="text-accent underline underline-offset-2 hover:text-accent-hover transition-colors">
              Log in
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-ink-2 mb-1.5" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@school.edu"
              className="input"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-2 mb-1.5" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="input"
            />
          </div>

          {error && (
            <p className="text-sm text-accent bg-accent/5 border border-accent/20 rounded-lg px-3.5 py-2.5">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="w-full btn-primary py-2.5 disabled:opacity-50">
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-xs text-ink-3 text-center leading-relaxed">
          By signing up you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
