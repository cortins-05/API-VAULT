"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Button } from '@/components/ui/button';
import { Check, Pen, X, BadgePlus, Trash } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { updateEvaluation } from "@/actions/prisma/update-api";
import { Eval } from "@/interfaces/prisma.interface";
import { createEvaluation } from "@/actions/prisma/create-api";
import { deleteEvaluationAction } from "@/actions/prisma/delete-api";

interface Props {
    evaluation: Eval|null;
    apiId: number;
}

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

export default function EvaluationCard({evaluation,apiId}:Props) {
    const router = useRouter();

    const [localEvaluation, setLocalEvaluation] = useState<Eval|null>(null);
    const [editingId, setEditingId] = useState<number|null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [notes, setNotes] = useState("");
    const [cost, setCost] = useState<number>(0);
    const [stability, setStability] = useState<number>(0);
    const [support, setSupport] = useState<number>(0);
    const [performance, setPerformance] = useState<number>(0);

    function createOne() {
        const newEvaluation: Eval = {
            id: 280305,
            apiId: apiId,
            costValue:0,
            stability:0,
            support:0,
            performance:0,
            notes:"",
            createdAt: new Date()
        };

        setLocalEvaluation(newEvaluation);
        handleEdit(newEvaluation);
        setNotes("");
        setCost(0);
        setStability(0);
        setPerformance(0);
        setSupport(0);
    }

    function handleEdit(eva:Eval){
        setEditingId(eva.id);
        setCost(eva.costValue);
        setPerformance(eva.performance);
        setSupport(eva.support);
        setStability(eva.stability);
        setNotes("");
    }

    function handleCancel(){
        if(editingId==280305){
            setLocalEvaluation(evaluation);
        }
        setEditingId(null);
    };

    async function deleteEvaluation(id:number){
        if(isLoading) return;
        setIsLoading(true);
        try {
            await deleteEvaluationAction(id);
            router.refresh();
        } finally {
            setIsLoading(false);
        }
    }

    async function handleAction(eva:Eval){
        if(isLoading) return;
        const evaluacion:Eval = {
            id: eva.id,
            costValue: cost,
            performance: performance,
            stability: stability,
            support: support,
            notes: notes,
            createdAt: eva.createdAt,
            apiId: Number(apiId)
        }
        setIsLoading(true);
        try {
            if(editingId==280305){
                await createEvaluation(evaluacion, apiId);
            }else{
                if(!editingId) return;
                await updateEvaluation(evaluacion);
            }
            router.refresh();
            handleCancel();
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(()=>{
        setLocalEvaluation(evaluation);
    },[evaluation]);

  return (
    <Card className="lg:col-span-2 relative">
    <CardHeader>
        <CardTitle>Evaluacion</CardTitle>
        <CardDescription>
        {
        localEvaluation
        ?
        ""
        :
        "No hay evaluaciones"
        }
        </CardDescription>
    </CardHeader>
    <CardContent>
        {localEvaluation ? (
            <div className="space-y-6">
            <div key={localEvaluation.id} className="space-y-4 pb-6 border-b last:pb-0 last:border-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {
                        editingId==localEvaluation.id
                        ?
                            <>
                                <p>Cost: <Input type="range" value={cost} onChange={(e)=>setCost(Number(e.target.value))} min={0} max={5} /></p>
                                <p>Rendimiento: <Input type="range" value={performance} onChange={(e)=>setPerformance(Number(e.target.value))} min={0} max={5} /></p>
                                <p>Estabilidad: <Input type="range" value={stability} onChange={(e)=>setStability(Number(e.target.value))} min={0} max={5} /></p>
                                <p>Soporte: <Input type="range" value={support}  onChange={(e)=>setSupport(Number(e.target.value))} min={0} max={5} /></p>
                            </>
                        :
                        <>
                            <RatingBar label="Costo" value={localEvaluation.costValue} />
                            <RatingBar label="Rendimiento" value={localEvaluation.performance} />
                            <RatingBar label="Estabilidad" value={localEvaluation.stability} />
                            <RatingBar label="Soporte" value={localEvaluation.support} />
                        </>
                    }
                    
                </div>
                
                <div className="flex mt-4 items-center w-full gap-5">
                    <div className="p-3 bg-secondary/50 rounded-md flex-1">
                        {
                            editingId==localEvaluation.id
                            ?
                            <Input type="text" placeholder="Nota..." onChange={(e)=>{setNotes(e.target.value)}} />
                            :
                            <p className="text-sm">
                                <span className="font-semibold">Notas:</span> {localEvaluation.notes}
                            </p>
                        }
                    </div>
                </div>
                <div className="flex w-full justify-center">
                    {
                        editingId == localEvaluation.id
                        ?
                        <>
                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={()=>handleAction(localEvaluation)} disabled={isLoading}>
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
                        </>
                        :
                        <div className="flex gap-3">
                            <Button variant="ghost" onClick={()=>{handleEdit(localEvaluation)}} disabled={isLoading}> <Pen/> </Button>
                            <Button variant="ghost" onClick={()=>deleteEvaluation(localEvaluation.id)} disabled={isLoading}> <Trash /> </Button>
                        </div>
                    }
                </div>
                
            </div>
            </div>
        ) : (
        <p className="text-sm text-muted-foreground">
            No hay evaluaciones registradas
        </p>
        )}
    </CardContent>
    {
        !localEvaluation 
        ? 
        <Button variant="ghost" className="absolute top-3 right-3" onClick={()=>{createOne()}} ><BadgePlus/></Button> 
        : 
        <></>
    }
    </Card>
  );
}