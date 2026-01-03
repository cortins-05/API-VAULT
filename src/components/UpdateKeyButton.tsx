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

    async function submit() {
        await updateApiKey({id:apiId,key:apiKey})
        .then((res)=>{
            if(res){
                alert("Key actualizada");
                router.refresh();
            }
        })
    }

  return (
    <InputButtonProvider>
      <InputButton>
        <InputButtonAction>Update API Key</InputButtonAction>
        <InputButtonSubmit onClick={submit}>Update</InputButtonSubmit>
      </InputButton>
      <InputButtonInput 
        type="text" 
        placeholder="Your API key here..." 
        onChange={(e) => setApiKey(e.target.value)}
      />
    </InputButtonProvider>
  );
};