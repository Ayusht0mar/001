import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL || "https://first-template-test.vercel.app",
})

export const {
  signIn,
  signOut,
  signUp,
  useSession,
} = authClient