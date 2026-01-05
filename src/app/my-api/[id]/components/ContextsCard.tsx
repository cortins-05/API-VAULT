"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Contexts, ContextType } from "@/interfaces/prisma.interface";
import { CheckCircle2, AlertCircle, BadgePlus, Check, X, Pen, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useRouter } from "next/navigation";
import { createContextCard } from "@/actions/prisma/create-api";
import { updateContextCard } from "@/actions/prisma/update-api";
import { deleteContextAction } from "@/actions/prisma/delete-api";
import { toast } from "sonner";

interface Props {
    contexts: Contexts[];
    apiID: number;
}

export default function ContextsCard({contexts,apiID}:Props) {

    const [localContextsCards, setLocalContextsCards] = useState<Contexts[]>([])
    const [editId, setEditId] = useState<number|null>();
    const [editIdHover, setEditIdHover] = useState<number|null>(null);
    const [context, setContext] = useState<string>();
    const [type, setType] = useState<ContextType>();
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const router = useRouter();

    useEffect(()=>{
        if(!contexts) return;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLocalContextsCards(contexts);
    },[contexts]);

    const getTypeConfig = (type: string) => {
        if (type === "RECOMMENDED") {
        return {
            badge: "bg-green-100 text-green-800 border-green-300",
            icon: <CheckCircle2 className="w-4 h-4" />,
            label: "Recomendado"
        };
        }
        return {
        badge: "bg-yellow-100 text-yellow-800 border-yellow-300",
        icon: <AlertCircle className="w-4 h-4" />,
        label: "Evitar"
        };
    };

    const addContext = () => {
        const newContext: Contexts = {
          id: 280305,
          apiId: apiID,
          context: "",
          type: "RECOMMENDED"     
        };
        
        setLocalContextsCards([...localContextsCards, newContext]);
        setEditId(newContext.id);
        setContext(newContext.context);
        setType(newContext.type);
    }

    async function createCard() {
        if(!context) return;
        if(!type) return;
        setIsLoading(true);
        try {
            await createContextCard(apiID,context,type);
        } finally {
            setIsLoading(false);
        }
    }

    async function updateCard() {
        if(!editId) return;
        if(!context) return;
        if(!type) return;
        if(isLoading) return;

        setIsLoading(true);
        try {
            const exito = await updateContextCard(editId,context,type);
            if(exito){
                setSuccessMessage("Componente actualizado con éxito");
            }
        } catch(err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    async function editContext(id:number) {
        setEditId(id);
    }

    const handleAction = async () => {
        if(isLoading) return;
        if(editId==280305){
            await createCard();
        }else{
            await updateCard();
        }
        router.refresh();
        handleCancel();
    }

    const handleCancel = () => {
        if(editId==280305){
        setLocalContextsCards(contexts);
        }
        setEditId(null);
    };

    async function deleteContext(id:number){
        if(isLoading) return;
        setIsLoading(true);
        try {
            await deleteContextAction(id);
            router.refresh();
        } finally {
            setIsLoading(false);
        }
    }

  return (
    <Card className="relative">
        <CardHeader>
            <CardTitle className="text-lg">Contextos</CardTitle>
            <CardDescription>{contexts.length} contexto(s)</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-3">
            {localContextsCards.length > 0 ? (
                localContextsCards.map((context) => {
                  if(editId==context.id){
                    return (
                        <div key={context.id} className="flex flex-col gap-5">
                            <div
                                className="flex items-center gap-3 p-3 rounded-md bg-secondary/50 text-sm"
                            >
                                <span className="w-2 h-2 bg-primary rounded-full shrink-0" />
                                <Input type="text" placeholder={context.context} onChange={(e)=>{setContext(e.target.value)}} />
                                <Select onValueChange={(e:ContextType)=>{setType(e)}} value={type??undefined} >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Type"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="RECOMMENDED">Recommended</SelectItem>
                                        <SelectItem value="AVOID">Avoid</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex justify-center"> 
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
                    )
                  }else{
                    const typeConfig = getTypeConfig(context.type);
                    return (
                        <div
                            key={context.id}
                            className="flex items-center gap-3 p-3 relative rounded-md bg-secondary/50 text-sm"
                            onMouseEnter={()=>{setEditIdHover(context.id)}} onMouseLeave={()=>{setEditIdHover(null)}}
                        >
                            <span className="w-2 h-2 bg-primary rounded-full shrink-0" />
                            <span className="flex-1 text-foreground">{context.context}</span>
                            {
                                editIdHover==context.id
                                &&
                                (
                                    <div className="flex gap-3 absolute right-35">
                                        <Button variant="ghost" onClick={()=>{editContext(context.id)}} disabled={isLoading}> <Pen/> </Button>
                                        <Button variant="ghost" onClick={()=>deleteContext(context.id)} disabled={isLoading}> <Trash /> </Button>
                                    </div>
                                )
                            }
                            <Badge variant="outline" className={typeConfig.badge}>
                            <span className="flex items-center gap-1">
                                {typeConfig.icon}
                                {typeConfig.label}
                            </span>
                            </Badge>
                        </div>
                    );
                  }
                })
            ) : (
                <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                        No hay contextos registrados
                    </p>
                    <p className="text-xs text-muted-foreground italic">
                        Los contextos son situaciones o casos en los que esta API es recomendada o debe evitarse.
                    </p>
                </div>
            )}
            </div>
        </CardContent>
        <Button variant="ghost" className="absolute top-3 right-3" onClick={()=>addContext()} disabled={isLoading}><BadgePlus/></Button>
    </Card>
  );
}