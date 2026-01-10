"use client";

import { GalleryVerticalEnd } from 'lucide-react';

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
import { useState, FormEvent } from "react"
import { signInUser } from "@/actions/auth/sign-in"
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LoginProviders } from './logginSocialButtons';
import { Spinner } from './ui/spinner';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const [cargando, setCargando] = useState<boolean>(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function submit(e:FormEvent){
    e.preventDefault();
    if(email==""||password==""||cargando) return;
    setCargando(true);
    const result = await signInUser({email,password});
    if (!result.ok) {
      toast.error(result.error);
      setCargando(false);
      return;
    }
    setCargando(false);
    router.push("/");
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={submit}>
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
              Don&apos;t have an account? <Link href="/auth/register">Sign up</Link>
            </FieldDescription>
          </div>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              onChange={(e)=>{setEmail(e.target.value)}}
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
                "Login"
              }
            </Button>
          </Field>
          <FieldSeparator>Or</FieldSeparator>
          <Field className="grid gap-4 sm:grid-cols-2">
            <LoginProviders />
          </Field>
        </FieldGroup>
      </form>
    </div>
  )
}
