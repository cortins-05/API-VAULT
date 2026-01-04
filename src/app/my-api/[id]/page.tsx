import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

interface RatingProps {
  label: string;
  value: number;
}

function RatingBar({ label, value }: RatingProps) {
  const percentage = (value / 5) * 100;
  const color = value <= 2 ? "bg-red-500" : value <= 3 ? "bg-yellow-500" : "bg-green-500";

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}/5</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

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
  
  const contexts = await prisma.apiContext.findMany({
    where: { apiId: Number(id) },
  });
  const evaluation = await prisma.apiEvaluation.findMany({
    where: { apiId: Number(id) },
  });

  const flags = await prisma.apiFlag.findMany({ where: { apiId: Number(id) } });
  const warnings = flags.filter((flag) => flag.level === "WARNING");
  const black = flags.filter((flag) => flag.level === "BLACK");
  const gray = flags.filter((flag) => flag.level === "GRAY");

  const memories = await prisma.apiMemory.findMany({
    where: { apiId: Number(id) },
  });
  
  const provider = await prisma.provider.findUnique({
    where: { id: (api?.providerId) },
  });

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
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contextos</CardTitle>
              <CardDescription>{contexts.length} contexto(s)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {contexts.length > 0 ? (
                  contexts.map((context) => (
                    <div
                      key={context.id}
                      className="flex items-center p-2 rounded-md bg-secondary/50 text-sm"
                    >
                      <span className="w-2 h-2 bg-primary rounded-full mr-3" />
                      {context.context}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No hay contextos registrados
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

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
                  {provider.docsUrl && (
                    <a
                      href={provider.docsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm inline-flex items-center gap-2"
                    >
                      Documentación
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Sin información del proveedor
                </p>
              )}
            </CardContent>
          </Card>

          {/* Evaluations Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Evaluaciones</CardTitle>
              <CardDescription>
                {evaluation.length} evaluación(es)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {evaluation.length > 0 ? (
                <div className="space-y-6">
                  {evaluation.map((eva) => (
                    <div key={eva.id} className="space-y-4 pb-6 border-b last:pb-0 last:border-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <RatingBar label="Costo" value={eva.costValue} />
                        <RatingBar label="Rendimiento" value={eva.performance} />
                        <RatingBar label="Estabilidad" value={eva.stability} />
                        <RatingBar label="Soporte" value={eva.support} />
                      </div>
                      {eva.notes && (
                        <div className="mt-4 p-3 bg-secondary/50 rounded-md">
                          <p className="text-sm">
                            <span className="font-semibold">Notas:</span> {eva.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No hay evaluaciones registradas
                </p>
              )}
            </CardContent>
          </Card>

          {/* Flags Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Alertas y Flags</CardTitle>
              <CardDescription>
                {warnings.length + black.length + gray.length} alerta(s) en total
              </CardDescription>
            </CardHeader>
            <CardContent>
              {warnings.length + black.length + gray.length > 0 ? (
                <div className="space-y-4">
                  {warnings.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-amber-600 mb-2 flex items-center gap-2">
                        <span className="w-3 h-3 bg-amber-400 rounded-full" />
                        Advertencias ({warnings.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {warnings.map((warning) => (
                          <Badge key={warning.id} variant="outline" className="bg-amber-50 text-black">
                            {warning.reason}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {black.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-destructive mb-2 flex items-center gap-2">
                        <span className="w-3 h-3 bg-destructive rounded-full" />
                        Críticas ({black.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {black.map((bl) => (
                          <Badge key={bl.id} variant="destructive">
                            {bl.reason}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {gray.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                        <span className="w-3 h-3 bg-muted-foreground rounded-full" />
                        Información ({gray.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {gray.map((gr) => (
                          <Badge key={gr.id} variant="secondary">
                            {gr.reason}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Sin alertas o flags registrados
                </p>
              )}
            </CardContent>
          </Card>

          <MemoriesCard memories={memories} apiId={id} />
        </div>
      </div>
    </div>
  );
}