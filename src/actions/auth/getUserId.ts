import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getUserId() {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if(!session?.user) return false;

    return session.user.id.toString();
}

export async function getSession() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if(session) return true;
    return false;
}