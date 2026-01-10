"use client";

import { authClient } from "@/lib/auth-client"
import { Button } from "./ui/button"

export function LoginWithGitHub() {
	const signInGitHub = async () => {
		await authClient.signIn.social({
			provider: "github"
		})
	}

	return (
		<Button onClick = { signInGitHub } type = "button" >
		    Continue With GitHub
		</Button>
	)
}