"use client"

const supportLevelConfig = {
  GOOD: { label: "Buen soporte", color: "bg-green-100 text-green-800" },
  AVERAGE: { label: "Soporte medio", color: "bg-yellow-100 text-yellow-800" },
  BAD: { label: "Soporte limitado", color: "bg-red-100 text-red-800" },
};

import { Provider } from "@/interfaces/prisma.interface";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface Props {
    provider: Provider;
}

export default function InformationProvider({provider}:Props) {

    const supportLevelInfo = provider.supportLevel ? supportLevelConfig[provider.supportLevel] : null;

  return (
    <div className="border border-border rounded-lg bg-card p-8 space-y-8">
        {/* Website */}
        <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Sitio web
        </h2>
        {provider.website ? (
            <a
            href={provider.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg text-primary hover:underline break-all"
            >
            {provider.website}
            </a>
        ) : (
            <p className="text-muted-foreground">No especificado</p>
        )}
        </div>

        {/* Support Level */}
        <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Nivel de soporte
        </h2>
        {supportLevelInfo ? (
            <Badge className={supportLevelInfo.color}>
            {supportLevelInfo.label}
            </Badge>
        ) : (
            <p className="text-muted-foreground">No especificado</p>
        )}
        </div>

        {/* Descripción / Notas */}
        <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Notas
        </h2>
        {provider.notes ? (
            <p className="text-base leading-relaxed text-foreground">{provider.notes}</p>
        ) : (
            <p className="text-muted-foreground">Sin notas</p>
        )}
        </div>

        {/* Metadatos */}
        <div className="pt-4 border-t border-border">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Información técnica
        </h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
            <span className="text-muted-foreground">ID del proveedor:</span>
            <p className="font-mono text-foreground mt-1">{provider.id}</p>
            </div>
            <div>
            <span className="text-muted-foreground">Fecha de creación:</span>
            <p className="text-foreground mt-1">{format(provider.createdAt!, "dd/MM/yyyy 'a las' HH:mm")}</p>
            </div>
        </div>
        </div>
    </div>
  );
}