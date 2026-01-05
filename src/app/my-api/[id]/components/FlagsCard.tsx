"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Flag } from "@/interfaces/prisma.interface";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { FlagLevel } from "../../../../../generated/prisma/enums";
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
        // eslint-disable-next-line react-hooks/set-state-in-effect
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
            <CardHeader>
                <CardTitle>Alertas y Flags</CardTitle>
                <CardDescription>
                {warnings.length + black.length + gray.length} alerta(s) en total
                </CardDescription>
            </CardHeader>
            <CardContent>
                {editId !== null && (
                    <div className="mb-6 p-4 border rounded-lg bg-muted/30">
                        <h4 className="font-semibold mb-4">Editando Flag</h4>
                        <div className="flex flex-col md:flex-row gap-4 my-5">
                            <div className="space-y-2 flex-1 flex flex-col gap-2">
                                <label className="text-sm font-medium">Razón</label>
                                <Input 
                                    type="text" 
                                    placeholder="Describe el problema o información..." 
                                    value={reason || ""} 
                                    className="text-xs md:text-sm"
                                    onChange={(e) => setReason(e.target.value)} 
                                />
                            </div>
                            <div className="space-y-2 flex flex-col gap-2">
                                <label className="text-sm font-medium">Nivel</label>
                                <Select onValueChange={(e: FlagLevel) => setLevel(e)} value={level || ""}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona el nivel"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="BLACK">Crítica</SelectItem>
                                        <SelectItem value="WARNING">Advertencia</SelectItem>
                                        <SelectItem value="GRAY">Información</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="flex gap-2 justify-center md:justify-start">
                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={()=>handleAction()} disabled={isLoading}>
                                <Check className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={handleCancel}
                            disabled={isLoading}
                            >
                                <X className="h-4 w-4 text-red-600" />
                            </Button>
                        </div>
                    </div>
                )}
                {warnings.length + black.length + gray.length > 0 ? (
                <div className="space-y-4 grid grid-cols-1 md:grid-cols-3">
                    {warnings.length > 0 && (
                    <div>
                        <h4 className="font-semibold text-amber-600 mb-2 flex items-center gap-2">
                        <span className="w-3 h-3 bg-amber-400 rounded-full" />
                        Advertencias ({warnings.length})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                        {warnings.map((warning) => (
                            <Badge key={warning.id} variant="outline" className="bg-amber-50 text-black cursor-pointer" onDoubleClick={()=>deleteFlag(warning.id)}>
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
                            <Badge key={bl.id} variant="destructive" className="cursor-pointer" onClick={()=>deleteFlag(bl.id)}>
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
                            <Badge key={gr.id} variant="secondary" className="cursor-pointer" onClick={()=>deleteFlag(gr.id)}>
                                {gr.reason}
                            </Badge>
                        ))}
                        </div>
                    </div>
                    )}
                </div>
                ) : (
                <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                        Sin alertas o flags registrados
                    </p>
                    <p className="text-xs text-muted-foreground italic">
                        Los flags son alertas que clasifican problemas, advertencias o información importante sobre la API. Críticas indica problemas severos, Advertencias para precauciones, e Información para datos relevantes.
                    </p>
                </div>
                )}
            </CardContent>
            <Button variant="ghost" className="absolute top-3 right-3" onClick={()=>addFlag()} disabled={isLoading}><BadgePlus/></Button>
        </Card>
    );
}