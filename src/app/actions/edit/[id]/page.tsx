import FormConfirm from '@/components/CreateFormConfirm'
import { prisma } from "@/lib/prisma";
import { redirect } from 'next/navigation';
import { ApiDraft } from '@/interfaces/gemini.interface';

export default async function EditApiPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {

  const {id} = await params;

  const data = await prisma.api.findUnique({
    where: { id: Number(id) },
    include: { provider: true }
  });
  
  if (!data) {
    redirect("/");
  }

  const apiDraft: ApiDraft = {
    name: data.name,
    key: data.key || "",
    description: data.description,
    deprecated: data.deprecated,
    provider: data.provider.name,
    website: data.provider.website,
    docsUrl: data.provider.docsUrl || "",
    supportLevel: data.provider.supportLevel,
    notes: data.provider.notes,
    apiType: "Unknown",
    authMethods: [],
    hasOfficialSdk: [],
    pricingModel: "UNKNOWN",
    confidence: 0,
  };

  return (
    <div className="p-6">
      <FormConfirm IA={false} data={apiDraft} update={id} />
    </div>
  );
}