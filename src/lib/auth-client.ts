import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
	baseURL: "http://localhost:3000" // La URL base de tu servidor auth
})

export const {signIn, signUp, signOut, useSession} = authClient;