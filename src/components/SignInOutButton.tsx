"use client";

import { signOut, useSession } from '@/lib/auth-client'
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';



const SignInOutButton = () => {

  const router = useRouter();

  async function cerrarSesion(){
    await signOut();
    router.refresh();
  }

  if(!useSession().data?.user){
    return (
      <Link href={"/auth/register"} className="justify-self-end mb-5 self-center w-3/4"><Button variant={"link"} className='text-xl font-bold'>Register</Button></Link>
    )
  }


  return (
    <Button className="justify-self-end mb-5 self-center w-3/4" variant="destructive" onClick={cerrarSesion}>Logout</Button>
  )
}

export default SignInOutButton
