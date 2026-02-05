"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Flag } from "@/interfaces/prisma.interface";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { FlagLevel } from "@/generated/prisma/enums";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BadgePlus, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createFlagAction } from "@/actions/prisma/create-api";
import { deleteFlagAction } from "@/actions/prisma/delete-api";

interface Props {
    flags: Flag[],
    apiId: number;
}

export default function FlagsCard({flags, apiId}:Props) {

    const [localFlags, setLocalFlags] = useState<Flag[]>([])
    const [editId, setEditId] = useState<number|null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [level, setLevel] = useState<FlagLevel>();
    const [reason, setReason] = useState<string>();
    const router = useRouter();
    
    const [warnings, setWarnings] = useState<Flag[]>([]);
    const [black, setBlack] = useState<Flag[]>([]);
    const [gray, setGray] = useState<Flag[]>([]);

    useEffect(()=>{
        if(!flags) return;
        setLocalFlags(flags);
        setWarnings(flags.filter((flag) => flag.level === "WARNING"));
        setBlack(flags.filter((flag) => flag.level === "BLACK"));
        setGray(flags.filter((flag) => flag.level === "GRAY"));
    },[flags]);

    const addFlag = () => {

        const newFlag: Flag = {
          id: 280305,
          level: "BLACK",
          reason: "",
          apiId: apiId,
          createdAt: new Date()
        };
        
        setLocalFlags([...localFlags, newFlag]);
        setEditId(newFlag.id);
        setLevel(newFlag.level);
        setReason(newFlag.reason);
    }

    async function createFlag() {
        if(!reason) return;
        if(!level) return;
        setIsLoading(true);
        try {
            await createFlagAction(apiId,reason,level);
        } finally {
            setIsLoading(false);
        }
    }

    const handleAction = async () => {
        if(isLoading) return;
        await createFlag();
        router.refresh();
        handleCancel();
    }

    const handleCancel = () => {
        if(editId==280305){
        setLocalFlags(flags);
        }
        setEditId(null);
    };

    async function deleteFlag(id:number){
        if(isLoading) return;
        setIsLoading(true);
        try {
            await deleteFlagAction(id);
            router.refresh();
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <Card className="lg:col-span-2 relative">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Alertas y Flags</CardTitle>
                        <CardDescription className="mt-1">
                            {warnings.length + black.length + gray.length} alerta(s) en total
                        </CardDescription>
                    </div>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={()=>addFlag()} 
                        disabled={isLoading || editId !== null}
                        className="shrink-0"
                    >
                        <BadgePlus className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Agregar</span>
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Formulario de nuevo flag */}
                {editId !== null && (
                    <div className="p-4 border-2 border-dashed border-primary/30 rounded-lg bg-primary/5">
                        <h4 className="font-semibold mb-4 text-sm">Nuevo Flag</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                                <label className="text-sm font-medium">Razón</label>
                                <Input 
                                    type="text" 
                                    placeholder="Describe el problema o información..." 
                                    value={reason || ""} 
                                    className="text-sm"
                                    onChange={(e) => setReason(e.target.value)} 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nivel</label>
                                <Select onValueChange={(e: FlagLevel) => setLevel(e)} value={level || ""}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecciona el nivel"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="BLACK">
                                            <span className="flex items-center gap-2">
                                                <span className="w-2 h-2 bg-destructive rounded-full" />
                                                Crítica
                                            </span>
                                        </SelectItem>
                                        <SelectItem value="WARNING">
                                            <span className="flex items-center gap-2">
                                                <span className="w-2 h-2 bg-amber-400 rounded-full" />
                                                Advertencia
                                            </span>
                                        </SelectItem>
                                        <SelectItem value="GRAY">
                                            <span className="flex items-center gap-2">
                                                <span className="w-2 h-2 bg-muted-foreground rounded-full" />
                                                Información
                                            </span>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="flex gap-2 justify-end mt-4">
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleCancel}
                                disabled={isLoading}
                            >
                                <X className="h-4 w-4 mr-1" />
                                Cancelar
                            </Button>
                            <Button 
                                size="sm" 
                                onClick={()=>handleAction()} 
                                disabled={isLoading || !reason || !level}
                            >
                                <Check className="h-4 w-4 mr-1" />
                                Guardar
                            </Button>
                        </div>
                    </div>
                )}

                {/* Lista de flags */}
                {warnings.length + black.length + gray.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {/* Críticas */}
                        {black.length > 0 && (
                            <div className="space-y-3 p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                                <h4 className="font-semibold text-destructive flex items-center gap-2 text-sm">
                                    <span className="w-3 h-3 bg-destructive rounded-full shrink-0" />
                                    Críticas ({black.length})
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {black.map((bl) => (
                                        <Badge 
                                            key={bl.id} 
                                            variant="destructive" 
                                            className="cursor-pointer hover:bg-destructive/80 transition-colors max-w-full"
                                            onClick={()=>deleteFlag(bl.id)}
                                            title="Click para eliminar"
                                        >
                                            <span className="truncate">{bl.reason}</span>
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Advertencias */}
                        {warnings.length > 0 && (
                            <div className="space-y-3 p-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
                                <h4 className="font-semibold text-amber-600 dark:text-amber-500 flex items-center gap-2 text-sm">
                                    <span className="w-3 h-3 bg-amber-400 rounded-full shrink-0" />
                                    Advertencias ({warnings.length})
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {warnings.map((warning) => (
                                        <Badge 
                                            key={warning.id} 
                                            variant="outline" 
                                            className="bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-700 cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-950/50 transition-colors max-w-full" 
                                            onClick={()=>deleteFlag(warning.id)}
                                            title="Click para eliminar"
                                        >
                                            <span className="truncate">{warning.reason}</span>
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Información */}
                        {gray.length > 0 && (
                            <div className="space-y-3 p-4 rounded-lg bg-muted/30 border border-muted">
                                <h4 className="font-semibold text-muted-foreground flex items-center gap-2 text-sm">
                                    <span className="w-3 h-3 bg-muted-foreground rounded-full shrink-0" />
                                    Información ({gray.length})
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {gray.map((gr) => (
                                        <Badge 
                                            key={gr.id} 
                                            variant="secondary" 
                                            className="cursor-pointer hover:bg-secondary/80 transition-colors max-w-full"
                                            onClick={()=>deleteFlag(gr.id)}
                                            title="Click para eliminar"
                                        >
                                            <span className="truncate">{gr.reason}</span>
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-8 space-y-2">
                        <p className="text-sm text-muted-foreground">
                            Sin alertas o flags registrados
                        </p>
                        <p className="text-xs text-muted-foreground italic max-w-md mx-auto">
                            Los flags clasifican problemas (críticas), precauciones (advertencias) o datos relevantes (información) sobre esta API.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}