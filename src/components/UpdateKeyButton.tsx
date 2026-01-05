'use client';

import { useState } from "react";
import { InputButton, InputButtonAction, InputButtonInput, InputButtonProvider, InputButtonSubmit } from "./shadcn/input-button";
import {updateApiKey} from "@/actions/prisma/update-api";
import { useRouter } from "next/navigation";

interface Props {
    apiId: number;
}

export const UpdateKeyButton = ({apiId}:Props) => {
  const router = useRouter();
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function submit() {
      if(isLoading) return;
      if(!apiKey) return;
      
      setIsLoading(true);
      try {
          const res = await updateApiKey({id:apiId,key:apiKey});
          if(res){
              alert("Key actualizada");
              router.refresh();
          }
      } catch(error) {
          alert("Error al actualizar la key");
          console.error(error);
      } finally {
          setIsLoading(false);
      }
  }

  return (
    <InputButtonProvider>
      <InputButton>
        <InputButtonAction>Update API Key</InputButtonAction>
        <InputButtonSubmit onClick={submit} disabled={isLoading}>
          {isLoading ? "Actualizando..." : "Update"}
        </InputButtonSubmit>
      </InputButton>
      <InputButtonInput 
        type="text" 
        placeholder="Your API key here..." 
        onChange={(e) => setApiKey(e.target.value)}
        disabled={isLoading}
      />
    </InputButtonProvider>
  );
};