import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
	baseURL: "/api/auth" // Usamos el proxy de Next.js para mantener el mismo origen
})

export const {signIn, signUp, signOut, useSession, deleteUser } = authClient;
