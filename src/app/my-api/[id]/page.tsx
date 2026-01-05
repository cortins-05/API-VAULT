import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { prisma } from "@/lib/prisma";
import { ExternalLink, Key } from "lucide-react";
import Link from "next/link";
import { Button } from '@/components/ui/button';
import { DeleteApiButton } from './components/DeleteButton';
import { redirect } from "next/navigation";
import { ApiKeyDisplay } from "./components/ApiKeyDisplay";
import { UpdateKeyButton } from '../../../components/UpdateKeyButton';
import { MemoriesCard } from "./components/MemoriesCard";
import EvaluationCard from './components/EvaluationsCard';
import ContextsCard from './components/ContextsCard';
import FlagsCard from './components/FlagsCard';

export default async function MyApiPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;

  if (isNaN(id)) {
    throw new Error("El id no es válido.");
  }

  const api = await prisma.api.findUnique({ where: { id: Number(id) } });

  if(!api){
    redirect("/");
  }
  
  const [contexts, evaluation, flags, memories, provider] = await Promise.all([
    prisma.apiContext.findMany({ where: { apiId: Number(id) } }),
    prisma.apiEvaluation.findUnique({where:{apiId:Number(id)}}),
    prisma.apiFlag.findMany({ where: { apiId: Number(id) } }),
    prisma.apiMemory.findMany({where: { apiId: Number(id) }}),
    prisma.provider.findUnique({where: { id: (api?.providerId) }})
  ])

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">{api?.name}</h1>
          <p className="text-lg text-muted-foreground">{api?.description}</p>
          <p className="text-sm text-muted-foreground">
            Creado: {format(api!.createdAt, "dd MMMM yyyy")}
          </p>

          <div className="flex gap-5 my-7">
            <Link href={`/actions/edit/${id}`} className="top-0 right-0">
              <Button variant={"outline"} >
                Editar
              </Button>
            </Link>
            
            <DeleteApiButton id={id} />

          </div>

          <UpdateKeyButton apiId={id} />

        </div>

        <Separator />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* API Overview Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Resumen de la API</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{api?.description}</p>
              <Button variant={"link"} className="text-muted-foreground text-sm italic"><a href={api.docsUrl ?? ""} className="flex items-center gap-2">Documentation<ExternalLink/></a></Button>
              {/* API Key Section */}
              {api?.key && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <Key className="w-4 h-4" />
                      <span>API Key</span>
                    </div>
                    <ApiKeyDisplay apiKey={api.key} />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Contexts Card */}
          <ContextsCard contexts={contexts} apiID={api.id} />

          {/* Provider Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información del Proveedor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {provider ? (
                <>
                  <div>
                    <h4 className="font-semibold mb-2">{provider.name}</h4>
                    {provider.website && (
                      <a
                        href={provider.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-sm inline-flex items-center gap-2"
                      >
                        Visitar sitio web
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <Separator />
                  <p className="text-sm text-muted-foreground">{provider.notes}</p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Sin información del proveedor
                </p>
              )}
            </CardContent>
          </Card>

          {/* Evaluations Card */}
          <EvaluationCard evaluation={evaluation} apiId={id} />

          {/* Flags Card */}
          <FlagsCard flags={flags} apiId={api.id} />

          <MemoriesCard memories={memories} apiId={id} />
        </div>
      </div>
    </div>
  );
}