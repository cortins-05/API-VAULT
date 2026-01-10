"use client"

import { emptyApiDraft } from "@/interfaces/gemini.interface";
import FormConfirm from '@/components/CreateFormConfirm'
import { getProviders } from "@/actions/prisma/create-provider";
import { useState, useEffect } from "react";
import NoProvidersError from "@/components/NoProvidersError";
import { Provider } from "@/interfaces/prisma.interface";
import { useSession } from "@/lib/auth-client";
import ErrorAuthPage from "../../errorAuth/page";

export default function NewApiIAPage() {

  const [providers, setProviders] = useState<Provider[]>([]);
  const session = useSession();
    
  const getProv = async()=>{
    await getProviders().then(res=>{setProviders(res)});
  }
  
  useEffect(() => { getProv(); }, [])

  if(!session.data?.user) {
    return <ErrorAuthPage/>
  }

  return (
    <div className="p-6">
      
      {
        providers.length > 0
        ?
        <FormConfirm data={emptyApiDraft} />
        :
        <NoProvidersError/>
      }
      
    </div>
  );
}