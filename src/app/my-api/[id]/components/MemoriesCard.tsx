'use client';

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Pencil, Check, X, BadgePlus, Trash } from 'lucide-react';
import { useState, useEffect } from "react";
import { ApiMemory } from "../../../../../generated/prisma/client";
import { updateMemoryCard } from "@/actions/prisma/update-api";
import { createMemoryCard } from "@/actions/prisma/create-api";
import { useRouter } from "next/navigation";
import { deleteMemoryAction } from "@/actions/prisma/delete-api";

interface MemoriesCardProps {
  memories: ApiMemory[];
  apiId: number
}

export function MemoriesCard({ memories,apiId }: MemoriesCardProps) {
  const [localMemories, setLocalMemories] = useState<ApiMemory[]>(memories);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editProject, setEditProject] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLocalMemories(memories);
  }, [memories]);

  const addMemory = () => {
    const newMemory: ApiMemory = {
      id: 280305,
      apiId: apiId,
      type: 'OTHER',
      content: "",
      project: "",
      occurredAt: null,
      createdAt: new Date(),
    };
    
    setLocalMemories([...localMemories, newMemory]);
    setEditingId(newMemory.id);
    setEditContent("");
    setEditProject("");
  }

  const handleEdit = (memory: ApiMemory) => {
    setEditingId(memory.id);
    setEditContent(memory.content);
    setEditProject(memory.project || "");
  };

  const deleteMemory = async (memory:ApiMemory) => {
    if(isLoading) return;
    setLocalMemories(prev => prev.filter(m => m.id !== memory.id));
    setIsLoading(true);
    try {
      await deleteMemoryAction(memory.id, memory.apiId);
      router.refresh();
    } catch (error) {
      setLocalMemories(memories);
      console.error('Error eliminando memoria:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function createCard() {
    setIsLoading(true);
    try {
      await createMemoryCard(apiId,editContent,editProject);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateCard() {
    setIsLoading(true);
    try {
      const exito = await updateMemoryCard(editingId!,editContent,editProject);
      if(exito){
        router.refresh();
        handleCancel();
      }
    } catch(err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleAction = async () => {
    if(isLoading) return;
    if(editingId==280305){
      await createCard();
    }else{
      await updateCard();
    }
    router.refresh();
    handleCancel();
  }

  const handleCancel = () => {
    if(editingId==280305){
      setLocalMemories(memories);
    }
    setEditingId(null);
  };

  return (
    <Card className="lg:col-span-2 relative">
      <CardHeader>
        <CardTitle>Memorias y Proyectos</CardTitle>
        <CardDescription>{localMemories.length} elemento(s)</CardDescription>
      </CardHeader>
      <CardContent>
        {localMemories.length > 0 ? (
          <div className="space-y-3">
            {localMemories.map((memory) => (
              <div
                key={memory.id}
                className="flex flex-col md:flex-row items-center gap-3 p-3 rounded-md bg-secondary/50"
              >
                {editingId === memory.id ? (
                  <>
                    <Input
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="flex-1"
                      placeholder="Contenido..."
                      disabled={isLoading}
                    />
                    <Input
                      value={editProject}
                      onChange={(e) => setEditProject(e.target.value)}
                      className="md:w-32"
                      placeholder="Proyecto..."
                      disabled={isLoading}
                    />
                    <div>
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
                  </>
                ) : (
                  <div className="flex items-center w-full">
                    <span className="font-medium text-sm flex-1 truncate">
                      {memory.content}
                    </span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                    <Badge variant="outline">{memory.project}</Badge>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => handleEdit(memory)}
                      disabled={isLoading}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={()=>deleteMemory(memory)}
                      disabled={isLoading}
                    >
                      <Trash />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              No hay memorias registradas
            </p>
            <p className="text-xs text-muted-foreground italic">
              Las memorias registran bugs, inconsistencias, cambios sin documentar o cualquier comportamiento importante que hayas encontrado usando esta API.
            </p>
          </div>
        )}
        <Button variant="ghost" className="absolute top-3 right-3" onClick={()=>addMemory()} disabled={isLoading}><BadgePlus/></Button>
      </CardContent>
    </Card>
  );
}