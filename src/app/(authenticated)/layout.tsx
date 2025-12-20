import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation";

export default async function AuthenticatedLayout(
    { children }: { children: React.ReactNode }
) {

    "use server";
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session?.user) {
        redirect("/auth");
    }

    return (
        <div>
            <div>{children}</div>
        </div>
    );
}