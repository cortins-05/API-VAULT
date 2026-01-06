import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import HeaderProvider from './HeaderProvider';
import InformationProvider from './InformationProvider';
import ApisPerProvider from "./ApisPerProvider";
import NoApisPerProvider from "./NoApisPerProvider";

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

  const apisProviders = await prisma.api.findMany({where:{providerId:provider?.id}})

  if(!provider){
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col items-center gap-10">
      <div className="w-4/5">
        
        <HeaderProvider provider={provider} id={id} />

        {/* Card principal con la información */}
        <InformationProvider provider={provider} />

      </div>

      <div className="w-4/5 border border-border rounded-lg bg-card p-8 space-y-8">
        {
          apisProviders.length > 0
          ?
            <ApisPerProvider apis={apisProviders} />
          :
            <NoApisPerProvider />
        }
      </div>
    </div>
  );
}