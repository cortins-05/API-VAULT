"use client"

const supportLevelConfig = {
  GOOD: { label: "Buen soporte", color: "bg-green-100 text-green-800" },
  AVERAGE: { label: "Soporte medio", color: "bg-yellow-100 text-yellow-800" },
  BAD: { label: "Soporte limitado", color: "bg-red-100 text-red-800" },
};

import { Provider, ProviderSupportLevel } from "@/interfaces/prisma.interface";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { DeleteProviderButton } from "./DeleteProviderButton";
import InputGhost from '../../my-api/[id]/components/InputGhost';
import { useEffect, useState } from "react";
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { updateProvider } from "@/actions/prisma/update-provider";
import { useRouter } from "next/navigation";
import {toast} from "sonner";

interface Props {
    provider: Provider;
    id: number;
}

export default function InformationProvider({provider,id}:Props) {

    const router = useRouter();

    type ProviderFormState = {
        name: string;
        notes: string;
        supportLevel: ProviderSupportLevel;
    };

    const [form, setForm] = useState<ProviderFormState>({
        name: provider.name,
        notes: provider.notes ?? "",
        supportLevel: provider.supportLevel,
    });

    const isDirty =
    form.name !== provider.name ||
    form.notes !== (provider.notes ?? "") ||
    form.supportLevel !== provider.supportLevel;

    async function submit(){
        const data = {
            name: form.name,
            notes: form.notes,
            supportLevel: form.supportLevel
        }
        await updateProvider(data,id)
        .then(()=>{
            toast("Proveedor actualizado con exito.");
        })
        .catch(()=>{
            toast("Hubo un fallo al actualizar el proveedor.");
        })
        router.refresh();
    }

    useEffect(() => {
    if (isDirty) {
        console.log("CAMBIO DETECTADO");
    }
    }, [isDirty]);

    const supportLevelInfo = form.supportLevel ? supportLevelConfig[form.supportLevel] : null;

    return (

        <main>
            <div className="mb-8 flex items-start justify-between">
                <div className="flex-1">

                    <InputGhost
                        value={form.name}
                        className="text-4xl font-bold tracking-tight mb-2"
                        onChange={(value) =>
                            setForm((f) => ({ ...f, name: value }))
                        }
                        placeholder="Nombre del Provider"
                    />
                    <p className="text-sm text-muted-foreground">
                        Proveedor API registrado el {format(provider.createdAt!, "dd 'de' MMMM 'de' yyyy")}
                    </p>
                </div>
                <div className="flex gap-3 ms-4">
                        <DeleteProviderButton id={id} />
                </div>
            </div>
            <div className="border border-border rounded-lg bg-card p-8 space-y-8 relative">
                {
                   isDirty
                    &&
                    <Button className="absolute right-5 top-5" onClick={()=>submit()}>Edit Information</Button>
                }
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
                <div className="flex gap-10">
                    <Badge className={supportLevelInfo ? supportLevelInfo.color : "bg-black text-white" }>
                        {supportLevelInfo ? supportLevelInfo.label : "No hay nivel de soporte"}
                    </Badge>
                    <Select
                        value={form.supportLevel ?? undefined}
                        onValueChange={(value) =>
                            setForm((f) => ({
                            ...f,
                            supportLevel: value as ProviderSupportLevel,
                            }))
                        }
                        >
                        <SelectTrigger>
                            <SelectValue placeholder="Change" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectGroup>
                            <SelectItem value="GOOD">Good</SelectItem>
                            <SelectItem value="AVERAGE">Average</SelectItem>
                            <SelectItem value="BAD">Bad</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                </div>
                {/* Descripción / Notas */}
                <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Notas
                </h2>
                <InputGhost
                    value={form.notes??""}
                    onChange={(value) =>
                        setForm((f) => ({ ...f, name: value }))
                    }
                    placeholder="Sin notas"
                />
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
        </main>
    );
}