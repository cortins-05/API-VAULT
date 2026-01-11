"use client";

import { Button } from "@/components/ui/button";
import { deleteUser } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface Props {
  emailVerified:boolean;
}

export function BotonesFinales({emailVerified}:Props){

  const router = useRouter();

  async function borrarUsuario(){
    await deleteUser();
    router.refresh();
  }

  return (
    <>
      {
        !emailVerified
        &&
        <Button size={"lg"}>Verificate Email</Button>
      }
      <Button variant={"destructive"} size={"lg"} className="ml-auto" onClick={borrarUsuario}>Delete Account</Button>
    </>
  )
}
