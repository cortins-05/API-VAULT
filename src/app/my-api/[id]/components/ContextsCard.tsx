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
        await createContextCard(apiID,context,type);
    }

    async function updateCard() {
        if(!editId) return;
        if(!context) return;
        if(!type) return;

        await updateContextCard(editId,context,type)
        .then(
            (exito) => {
            if(exito){
                router.refresh();
                handleCancel();
            }
            }
        ).catch(
            err=>console.error(err)
        );
    }

    async function editContext(id:number) {
        setEditId(id);
    }

    const handleAction = async () => {
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
        await deleteContextAction(id);
        router.refresh();
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
                                <Select onValueChange={(e:ContextType)=>{setType(e)}} >
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
                                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={()=>handleAction()} >
                                    <Check className="h-4 w-4 text-green-600" />
                                </Button>
                                <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                                onClick={handleCancel}
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
                                        <Button variant="ghost" onClick={()=>{editContext(context.id)}}> <Pen/> </Button>
                                        <Button variant="ghost" onClick={()=>deleteContext(context.id)} > <Trash /> </Button>
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
        <Button variant="ghost" className="absolute top-3 right-3" onClick={()=>addContext()} ><BadgePlus/></Button>
    </Card>
  );
}