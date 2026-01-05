"use client";

import { ApiIngestForm } from "@/components/ApiIngestionForm";
import { ApiDraft } from "@/interfaces/gemini.interface";
import { useEffect, useState } from "react";
import FormConfirm from '@/components/CreateFormConfirm'
import { getProviders } from "@/actions/prisma/create-provider";
import NoProvidersError from "@/components/NoProvidersError";
import { Provider } from "@/interfaces/prisma.interface";

export default function NewApiIAPage() {

  const [value, setValue] = useState<ApiDraft>();

  const [providers, setProviders] = useState<Provider[]>([]);
  
  const getProv = async()=>{
    await getProviders().then(res=>{setProviders(res)});
  }
  
  useEffect(() => { getProv(); }, [])

  const handleValue = (data: ApiDraft) => {
    setValue(data)
  }

  return (
    <div className="p-6 h-full">
      {
        providers.length > 0
        ?
        (
          value
          ? 
            <FormConfirm data={value} IA /> 
          : 
            <ApiIngestForm onSend={handleValue}/>
        )
        :
        <NoProvidersError/>
      }
      
    </div>
  );
}