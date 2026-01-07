"use client"

import { ApiDraft, FormData } from "@/interfaces/gemini.interface";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { createApiAction } from "@/actions/prisma/create-api";
import { AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogHeader, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { redirect } from "next/navigation";
import { updateApi } from "@/actions/prisma/update-api";
import { toast } from "sonner";
import { getProviders } from "@/actions/prisma/create-provider";
import { Provider } from "@/interfaces/prisma.interface";
import { Star, Zap } from 'lucide-react';
import { ingestApiWithGemini } from "@/actions/ai/ingest-api";
import { Spinner } from "./ui/spinner";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Props {
  data: ApiDraft;
  update?: number;
}

export default function FormConfirm({ data, update }: Props) {

  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isIA, setIsIa] = useState<boolean>(false);

  const getProv = async()=>{
    await getProviders().then(res=>{setProviders(res)});
  }

  useEffect(() => { getProv(); }, [])

  const [form, setForm] = useState<FormData>({
    name: data.name || "",
    key: data.key || "",
    description: data.description || "",
    deprecated: data.deprecated || false,
    docsUrl: data.docsUrl || "",
    providerId: Number(data.provider) || null
  });

  async function geminiDescriptionInline() {
    if(form.name==""||form.docsUrl==""){
      toast("No es valida la informacion propuesta para la descripcion con IA.");
      return;
    }
    setIsIa(true);
    await ingestApiWithGemini(form.name,form.docsUrl)
    .then((result)=>{
      if(!result){
        toast("La descripcion en linea cayo en un error.");
        return;
      }
      setForm((prev)=>({
        ...prev,
        description: result
      }))
      setIsIa(false);
    });
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if(isSubmitting) return;

    if(form.providerId==null){
      toast("No se ha seleccionado ningun proveedor.");
      return;
    }

    if(form.name==""||form.description==""){
      toast("No puede haber campos vacios.")
      return;
    }
    
    setIsSubmitting(true);
    try {
      console.log(form);
      if(update){
        await updateApi(form,update).then(()=>{setOpen(true)});
      }else{
        await createApiAction(form).then(()=>{setOpen(true)});
      }
      setTimeout(() => {
        if(update){
          redirect(`/my-api/${update}`);
        }else{
          redirect("/gestor-apis");
        }
      }, 2000);
    } catch(error) {
      console.error(error);
      setIsSubmitting(false);
    }
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSelectChange = (e: string) => {
    console.log(e);
    setForm(prev => ({
      ...prev,
      providerId: Number(e),
    }));
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 p-6">
      <div className="text-center flex justify-center gap-4">
        <Star color="green" size={35}/>
        <h1 className="text-3xl font-bold tracking-tight"> Create New API </h1>
        <Star color="green" size={35}/>
      </div>

      <form className="space-y-6" onSubmit={submit}>
        <div className="flex flex-col lg:flex-row gap-6 lg:items-start">
          {/* API Fields Card */}
          <Card className="flex-2">
            <CardHeader>
              <CardTitle>API Fields</CardTitle>
              <CardDescription>Basic information about the API</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="API Name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="key">API Key (Optional)</Label>
                <Input
                  id="key"
                  name="key"
                  type="text"
                  value={form.key}
                  onChange={handleChange}
                  placeholder="Your API key"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="key">Docs URL</Label>
                <Input
                  id="docsUrl"
                  name="docsUrl"
                  type="text"
                  value={form.docsUrl}
                  onChange={handleChange}
                  placeholder="https://example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Description <span className="ml-auto" > <Button size="sm" type="button" onClick={geminiDescriptionInline}>
                    {
                      isIA
                      ?
                        <Spinner/>
                      :
                        <Zap/>
                    } 
                  </Button> </span> 
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="API description"
                  rows={4}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="deprecated"
                  name="deprecated"
                  type="checkbox"
                  checked={form.deprecated}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="deprecated" className="text-sm font-normal">
                  Deprecated
                </Label>
              </div>
            </CardContent>
          </Card>
          
          {/* Select Provider Card */}
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Provider</CardTitle>
              <CardDescription>Select the Provider (obligatory)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Select
                  value={form.providerId ? String(form.providerId) : undefined}
                  onValueChange={(e)=>{handleSelectChange(e)}}
                  name="providerId"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Provider(s)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>NAMEs</SelectLabel>
                      {
                        providers.map(provider=>(
                          <SelectItem key={provider.id} value={String(provider.id)}>{provider.name}</SelectItem>
                        ))
                      }
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-10 flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={()=>{redirect(`/my-api/${update}`)}} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Confirm & Save"}
          </Button>
        </div>
      </form>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>API {update ? 'actualizada' : 'creada'}</AlertDialogTitle>
            <AlertDialogDescription>
              Se guardó correctamente. Redirigiendo al gestor de APIs...
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => {
                if(update){
                  redirect(`/my-api/${update}`);
                }else{
                  redirect("/gestor-apis")
                }
            }}>Aceptar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}