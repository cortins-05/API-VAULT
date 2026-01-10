"use client";

import { GalleryVerticalEnd } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { FormEvent, useState } from "react";
import { signUpUser } from "@/actions/auth/sign-up";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LoginProviders } from './logginSocialButtons';
import { Spinner } from "./ui/spinner";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const [cargando, setCargando] = useState<boolean>(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  async function submit(e:FormEvent){
    e.preventDefault();
    if(name==""||email==""||password==""||cargando) return;
    setCargando(true);
    const result = await signUpUser({ name, email, password });
    if (!result.ok) {
      toast.error(result.error);
      setCargando(false);
      return;
    }
    toast("Usuario creado con exito.");
    setCargando(false);
    router.push("/auth/login");
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={submit} >
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">Api Vault</span>
            </a>
            <h1 className="text-xl font-bold">Welcome to Api Vault</h1>
            <FieldDescription>
              Already have an account? <Link href="/auth/login">Sign in</Link>
            </FieldDescription>
          </div>
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              id="name"
              type="text"
              onChange={(e)=>{setName(e.target.value)}}
              value={name}
              placeholder="John Doe"
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              onChange={(e)=>{setEmail(e.target.value)}}
              value={email}
              placeholder="m@example.com"
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e)=>{setPassword(e.target.value)}}
              required
            />
          </Field>
          <Field>
            <Button type="submit">
              {
                cargando
                ?
                <Spinner/>
                :
                "Create Account"
              }
            </Button>
          </Field>
          <FieldSeparator>Or</FieldSeparator>
          <Field className="grid gap-4 sm:grid-cols-2">
            <LoginProviders/>
          </Field>
        </FieldGroup>
      </form>
    </div>
  )
}
