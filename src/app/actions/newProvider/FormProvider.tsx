"use client";

import { createProvider } from "@/actions/prisma/create-provider";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Provider } from "@/interfaces/prisma.interface";
import { Label } from "@radix-ui/react-label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {toast} from "sonner";

export default function FormProvider() {

    const router = useRouter();

    const emptyForm:Provider = {
        name: "",
        website: "",
        supportLevel: "",
        notes: "",
    }

    const [form, setForm] = useState<Provider>(emptyForm);

    function restartForm(){
        setForm(emptyForm);
    }

    async function saveProvider(){

        if(form.name==""||form.website==""||form.supportLevel==""){
            toast("No puede haber campos vacios");
            return;
        }

        await createProvider(form)
        .then(()=>{
            toast("Proveedor guardado con exito");
            router.push("/gestor-proveedores");
        })
        .catch(()=>{
            toast("No se ha podido crear el proveedor, intentelo de nuevo.")
        })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Provider Fields</CardTitle>
                <CardDescription>Information about the provider</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                <Label htmlFor="name">Provider</Label>
                <Input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                        setForm(prev => ({
                            ...prev,
                            [e.target.name]: e.target.value,
                        }))
                    }
                    placeholder="Provider name"
                />
                </div>

                <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                    id="website"
                    name="website"
                    type="url"
                    value={String(form.website)}
                    onChange={(e) =>
                        setForm(prev => ({
                            ...prev,
                            [e.target.name]: e.target.value,
                        }))
                    }
                    placeholder="https://example.com"
                />
                </div>

                <div className="space-y-2">
                <Label htmlFor="supportLevel">Support Level</Label>
                <select
                    id="supportLevel"
                    name="supportLevel"
                    value={String(form.supportLevel)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    onChange={(e) =>
                        setForm(prev => ({
                            ...prev,
                            [e.target.name]: e.target.value,
                        }))
                    }
                >
                    <option value="">Not specified</option>
                    <option value="GOOD">Good</option>
                    <option value="AVERAGE">Average</option>
                    <option value="BAD">Bad</option>
                </select>
                </div>

                <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                    id="notes"
                    name="notes"
                    value={String(form.notes)}
                    placeholder="Additional notes"
                    rows={3}
                    onChange={(e) =>
                        setForm(prev => ({
                            ...prev,
                            [e.target.name]: e.target.value,
                        }))
                    }
                />
                </div>
            </CardContent>
            <div className="flex justify-end gap-4 mr-4">
            <Button type="button" variant="destructive" onClick={restartForm}>
                Clear
            </Button>
            <Button type="submit" onClick={saveProvider}>
                Confirm & Save
            </Button>
            </div>
        </Card>
    );
}