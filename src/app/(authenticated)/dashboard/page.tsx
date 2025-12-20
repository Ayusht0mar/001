"use client"
import { signOut } from "@/lib/auth-client";
import { redirect } from "next/navigation";

export default function DashboardPage() {


     const handleSignOut = async () => {
        try {
          await signOut();
        } catch (error) {
          console.error("Sign out error:", error);
          alert(`Sign out failed: ${error}`);
        }
        redirect("/");
      }

    return (
        <div>
            <h1>Dashboard</h1>  
            <p>This page is only accessible to authenticated users.</p>


            <button onClick={handleSignOut}>SignOut</button>
        </div>
    );
}