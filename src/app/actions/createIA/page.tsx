"use client";

import { ApiIngestForm } from "@/components/ApiIngestionForm";
import { ApiDraft } from "@/interfaces/gemini.interface";
import { useState } from "react";
import FormConfirm from '@/components/CreateFormConfirm'

export default function NewApiIAPage() {

  const [value, setValue] = useState<ApiDraft>();

  const handleValue = (data: ApiDraft) => {
    setValue(data)
  }

  return (
    <div className="p-6">
      {
        value 
        ? 
          <FormConfirm data={value} IA /> 
        : 
          <ApiIngestForm onSend={handleValue}/>
      }
      
    </div>
  );
}