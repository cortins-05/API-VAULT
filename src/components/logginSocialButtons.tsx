"use client";

import { authClient } from "@/lib/auth-client"
import { Button } from "./ui/button"
import { Github } from 'lucide-react';
import {FaGoogle} from "react-icons/fa"

export function LoginProviders() {
	const signInGitHub = async () => {
		await authClient.signIn.social({
			provider: "github",
			callbackURL: "/profile"
		})
	}
	
	const signInGoogle = async () => {
		await authClient.signIn.social({
			provider: "google",
			callbackURL: "/profile"
		})
	}

	return (
		<>
			<Button onClick = { signInGitHub } variant="outline" type = "button" >
				<Github/>
				Continue With GitHub
			</Button>
			<Button onClick={signInGoogle} variant="outline" type="button">
				<FaGoogle />
				Continue With Google
			</Button>
		</>
	)
}