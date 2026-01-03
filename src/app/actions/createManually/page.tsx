"use client";

import { emptyApiDraft } from "@/interfaces/gemini.interface";
import FormConfirm from '@/components/CreateFormConfirm'

export default function NewApiIAPage() {

  return (
    <div className="p-6">
      
      <FormConfirm IA={false} data={emptyApiDraft} />
      
    </div>
  );
}