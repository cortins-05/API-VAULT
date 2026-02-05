import { auth } from "@/lib/auth";
import { getSessionCookie } from "better-auth/cookies";
import { headers } from "next/headers";

export async function getUserId() {
    try {
        const headersList = await headers();
        if (!getSessionCookie(headersList)) {
            return null;
        }
        
        const session = await auth.api.getSession({
            headers: headersList,
        });

        if (!session?.user) return null;
        return session.user.id.toString();
    } catch (error) {
        console.error("Error al obtener userId:", error);
        return null;
    }
}

export async function getSession() {
    try {
        const headersList = await headers();
        if (!getSessionCookie(headersList)) {
            return false;
        }

        const session = await auth.api.getSession({
            headers: headersList,
        });

        return session !== null && session !== undefined;
    } catch (error) {
        console.error("Error al obtener sesión:", error);
        return false;
    }
}

export async function getSessionUser() {
    try {
        const headersList = await headers();
        if (!getSessionCookie(headersList)) {
            return null;
        }

        const session = await auth.api.getSession({
            headers: headersList,
        });

        return session?.user || null;
    } catch (error) {
        console.error("Error al obtener usuario de sesión:", error);
        return null;
    }
}
