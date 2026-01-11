"use client";

import { Button } from "@/components/ui/button";
import { deleteUser, sendVerificationEmail, useSession } from '@/lib/auth-client';
import { useRouter } from "next/navigation";

interface Props {
  emailVerified:boolean;
}

export function BotonesFinales({emailVerified}:Props){

  const router = useRouter();
  const session = useSession();

  const email = session.data?.user ? session.data.user.email : false ;

  async function borrarUsuario(){
    await deleteUser();
    router.refresh();
  }

  async function verificarEmail(){
    if(!email) return;
    await sendVerificationEmail({
      email: email,
      callbackURL: "/profile"
    });
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-5 md:justify-between md:flex-row w-full">
      {
        !emailVerified
        &&
        <Button size={"lg"} onClick={verificarEmail}>Verificate Email</Button>
      }
      <Button variant={"destructive"} size={"lg"} className="md:ml-auto" onClick={borrarUsuario}>Delete Account</Button>
    </div>
  )
}
