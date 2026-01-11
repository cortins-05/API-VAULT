"use client";

import { Button } from "@/components/ui/button";
import { deleteUser } from '@/lib/auth-client';
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Props {
  emailVerified:boolean;
}

export function BotonesFinales({emailVerified}:Props){

  const router = useRouter();

  async function borrarUsuario(){
    await deleteUser();
    router.refresh();
  }

  function verificarEmail(){
    toast("Esta funcion no esta disponible en la version DEMO.")  
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
