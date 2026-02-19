"use client";

import { signOut } from "@/lib/auth-client";

const SignOutButton = () => {
    const handleSignOut = async () => {
        await signOut();
    };

    return (
        <button onClick={handleSignOut} className="hover:underline underline-offset-2">
            Sign Out
        </button>
    );
};

export default SignOutButton;