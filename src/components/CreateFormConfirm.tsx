"use client"

import { ApiDraft, FormData } from "@/interfaces/gemini.interface";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { createApiAction } from "@/actions/prisma/create-api";
import { ReloadGuard } from "@/helpers/BeforeUnload";
import { AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogHeader, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { redirect } from "next/navigation";
import { updateApi } from "@/actions/prisma/update-api";
import { toast } from "sonner";
import { getProviders } from "@/actions/prisma/create-provider";
import { Provider } from "@/interfaces/prisma.interface";

interface Props {
  data: ApiDraft;
  IA: boolean;
  update?: number;
}

export default function FormConfirm({ data, IA, update }: Props) {

  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [providers, setProviders] = useState<Provider[]>([]);

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

  async function submit(e: FormEvent) {
    e.preventDefault();
    if(isSubmitting) return;

    if(form.providerId==null||form.providerId==""){
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

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value === "" ? null : Number(value),
    }));
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 p-6">
      <ReloadGuard enabled={IA} />
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight"> { IA ?'Confirm API Information' : 'Create New Api'}</h1>
        <p className="text-muted-foreground">
          {IA ?? 'Review the extracted data and make any necessary corrections'}
        </p>
      </div>

      <form className="space-y-6" onSubmit={submit}>
        <div className="flex flex-col md:flex-row gap-6">
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
                <Label htmlFor="description">Description</Label>
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
                <Label htmlFor="apiType">Provider(s)</Label>
                <select
                  id="providerId"
                  name="providerId"
                  value={form.providerId ?? ""}
                  onChange={handleSelectChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select a provider</option>
                  {
                    providers.map(provider=>(
                      <option key={provider.id} value={provider.id}>{provider.name}</option>
                    ))
                  }
                </select>
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