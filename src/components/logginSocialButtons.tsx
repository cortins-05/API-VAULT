"use client";

import { authClient } from "@/lib/auth-client"
import { Button } from "./ui/button"
import { Github } from 'lucide-react';
import {FaGoogle} from "react-icons/fa"
import { useState } from "react";
import { Spinner } from "./ui/spinner";

export function LoginProviders() {

	const [loading, setLoading] = useState<boolean>(false);

	const signInGitHub = async () => {
		if(loading) return;
		setLoading(true);
		await authClient.signIn.social({
			provider: "github",
			callbackURL: "/profile"
		})
		setLoading(false);
	}
	
	const signInGoogle = async () => {
		if(loading) return;
		setLoading(true);
		await authClient.signIn.social({
			provider: "google",
			callbackURL: "/profile"
		})
		setLoading(false);
	}

	return (
		<>
			<Button onClick = { signInGitHub } variant="outline" type = "button" >
				{
					loading
					?
					<Spinner/>
					:
					<>
					<Github/>
					Continue With GitHub
					</>
				}
			</Button>
			<Button onClick={signInGoogle} variant="outline" type="button">
				{
					loading
					?
					<Spinner/>
					:
					<>
					<FaGoogle />
					Continue With Google
					</>
				}
			</Button>
		</>
	)
}