"use client"


import { signIn, signUp, useSession } from "@/lib/auth-client";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { EyeOff } from "lucide-react";

export default function AuthPage() {
  const session = useSession();
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (session.data?.user) {
      router.push("/dashboard");
    }
  }, [session.data?.user, router]);

  if (session.data?.user) {
    return null;
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isSignUp) {
        await signUp.email({ email, password, name });
      } else {
        await signIn.email({ email, password });
      }
    } catch (error) {
      console.error("Auth error:", error);
      alert(`Authentication failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="hidden md:flex md:flex-col ">
        <div className="p-8 flex flex-col h-full">
            <div className="flex flex-col justify-center items-center mt-auto">
              <div className="flex items-center gap-2 ">
                <div className="border-3 rounded border-blue-700 size-6 "></div>
                <p className="font-medium text-lg leading-none text-neutral-400">BuiltStack</p>
              </div>
              <div className="mt-4 text-center">
                <h3>Join BuiltStack - Simplify Your Workflow</h3>
                <p className="text-neutral-500">Streamline your workflow and enhance team collaboration effortlessly.</p>
              </div>
            </div>
            <div className="aspect-video border max-w-sm border-neutral-900 rounded-lg m-auto mt-8 w-full bg-linear-to-r from-blue-800 to-indigo-900"></div>
        </div>
      </div>
      <div className="border m-2 rounded-lg border-neutral-900 bg-neutral-950/70 flex flex-col items-center justify-center p-8">
          <div className="my-4 text-center">
              <h3 className="text-lg font-semibold">{isSignUp ? "Sign up Account" : "Sign in to Account"}</h3>
              <p className="text-neutral-500">{isSignUp ? "Enter your personal data to create your account" : "Enter your credentials to sign in"}</p>
          </div>
          <div className="max-w-md w-full mx-auto">
            <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
              {isSignUp && (
                <div>
                  <input
                    id="name"
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border border-neutral-900 bg-neutral-900/70 w-full p-2 rounded-md"
                    required={isSignUp}
                    disabled={isLoading}
                  />
                </div>
              )}
              <input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-neutral-900 bg-neutral-900/70 w-full p-2 rounded-md autofill:bg-transparent"
                required
                disabled={isLoading}
              />
              <div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border border-neutral-900 bg-neutral-900/70 w-full p-2 rounded-md autofill-transparent"
                    required
                    disabled={isLoading}
                    minLength={8}
                  />
                  <span
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                    onClick={() => setShowPassword((prev) => !prev)}
                    tabIndex={0}
                    role="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") setShowPassword((prev) => !prev);
                    }}
                  >
                    {showPassword ? (
                      <EyeOff size={16} color="#525252" />
                    ) : (
                      <Eye size={16} color="#525252" />
                    )}
                  </span>
                </div>
                {isSignUp && (
                  <p className="leading-none text-xs text-neutral-500 ml-2 mt-2 mb-4">Must be at least 8 characters</p>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full p-2 rounded bg-white text-black font-medium hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Please wait..." : (isSignUp ? "Sign up" : "Sign in")}
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-neutral-400">
              {isSignUp ? (
                <>
                  Already have an account?{' '}
                  <button type="button" className="text-blue-500 hover:underline" onClick={() => setIsSignUp(false)}>
                    Login
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{' '}
                  <button type="button" className="text-violet-400 hover:underline" onClick={() => setIsSignUp(true)}>
                    Sign Up
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
    </div>
  );
}



