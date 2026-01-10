import FormConfirm from '@/components/CreateFormConfirm'
import { prisma } from "@/lib/prisma";
import { redirect } from 'next/navigation';
import { ApiDraft } from '@/interfaces/gemini.interface';
import { getUserId } from "@/actions/auth/getUserId";
import ErrorAuthPage from "../../errorAuth/page";

export default async function EditApiPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {

  const userId = await getUserId();

  if(!userId){
    return(
      <ErrorAuthPage/>
    );
  }

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
    provider: String(data.providerId),
    website: data.provider.website,
    docsUrl: data.docsUrl || "",
    supportLevel: data.provider.supportLevel,
    notes: data.provider.notes,
  };

  return (
    <div className="p-6">
      <FormConfirm data={apiDraft} update={id} />
    </div>
  );
}