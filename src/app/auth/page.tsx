"use client"

import { signIn, signUp, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthPage() {
  const session = useSession();
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session.data?.user) {
      router.push("/dashboard");
    }
  }, [session.data?.user, router]);

  // Don't render anything while checking session or redirecting
  if (session.data?.user) {
    return null;
  }


  const handleEmailAuth = async (e: React.FormEvent) => {
      e.preventDefault()
      setIsLoading(true)
      try {
        if (isSignUp) {
          await signUp.email({
            email,
            password,
            name,
          })
        } else {
          await signIn.email({
            email,
            password,
          })
        }
      } catch (error) {
        console.error("Auth error:", error)
        alert(`Authentication failed: ${error}`)
      } finally {
        setIsLoading(false)
      }
    }

  return (
      <div>
          {isSignUp ? (
              <div>
                  <h2>Sign Up Form</h2>
              </div>
          ) : (
              <div>
                  <h2>Log In Form</h2>
              </div>
          )}
          

          <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
              {isSignUp && (
              <div>
                  <label htmlFor="name" className="block text-sm font-medium text-neutral-600 mb-1">
                  Full Name
                  </label>
                  <input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full py-1 px-2 border border-neutral-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required={isSignUp}
                  disabled={isLoading}
                  />
              </div>
              )}
              <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-600 mb-1">
                  Email Address
              </label>
              <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full py-1 px-2 border border-neutral-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={isLoading}
              />
              </div>
              <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-600 mb-1">
                  Password
              </label>
              <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-1 px-2 border border-neutral-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={isLoading}
                  minLength={6}
              />
              {isSignUp && (
                  <p className="text-xs text-neutral-500 mt-1">Password must be at least 6 characters</p>
              )}
              </div>
              <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
              {isLoading ? "Please wait..." : (isSignUp ? "Create Account" : "Sign In")}
              </button>
          </form>



          {
              !isSignUp ? (
                      <button onClick={() => setIsSignUp(true)}>Don't have an account? Sign Up</button>
              ) : (
                  <button onClick={() => setIsSignUp(false)}>Already have an account? Log In</button>
              )}
          </div>
          
  )
}



