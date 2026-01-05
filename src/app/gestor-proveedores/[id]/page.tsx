import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import HeaderProvider from './HeaderProvider';
import InformationProvider from './InformationProvider';

export default async function ProviderDetailsPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;

  if (isNaN(id)) {
    throw new Error("El id no es válido.");
  }

  const provider = await prisma.provider.findUnique({ where: { id: Number(id) } });

  if(!provider){
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        
        <HeaderProvider provider={provider} id={id} />

        {/* Card principal con la información */}
        <InformationProvider provider={provider} />

      </div>
    </div>
  );
}