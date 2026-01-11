"use client";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Separator } from "@radix-ui/react-separator";
import { Mail, CheckCircle2, XCircle, CalendarDays, Upload } from "lucide-react";
import { BotonesFinales } from "./BotonesFinales";
import { Badge } from "@/components/ui/badge";
import { useRef, useState } from "react";
import { uploadPhotoAction } from "@/actions/auth/editUser";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import InputGhost from '../my-api/[id]/components/InputGhost';

interface User {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null | undefined;
}

interface Props {
    user: User;
}

export default function ProfileCard({user}:Props) {

    const router = useRouter();

    const createdDate = new Date(user.createdAt).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const updatedDate = new Date(user.updatedAt).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

        function uploadPhotoButton(){
            fileInputRef.current?.click();
        }

        function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
            const file = e.target.files?.[0];
            if (!file) return;

            // Validaciones básicas (recomendado)
            if (!file.type.startsWith("image/")) {
                console.warn("Archivo no válido");
                return;
            }
            if (file.size > 5 * 1024 * 1024) { // 5MB
                console.warn("Archivo demasiado grande");
                return;
            }

            handleUpload(file); // archivo en memoria
        }

        async function handleUpload(file: File) {
            setSpinner(true);
            const formData = new FormData();
            formData.append("photo", file);

            const result = await uploadPhotoAction(formData);

            await authClient.updateUser({
                image: result.url
            })

            router.refresh();
            setSpinner(false);
        }

        async function handleUploadName() {
            setSpinner(true);

            await authClient.updateUser({
                name: name
            })
            router.refresh();

            setSpinner(false);
        }

        const fileInputRef = useRef<HTMLInputElement | null>(null);
        const [uploadPhoto, setUploadPhoto] = useState(false);
        const [spinner, setSpinner] = useState(false);

        const [name, setName] = useState(user.name);
        
    return (
        <Card className="overflow-hidden relative">
            {
                spinner
                &&
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center rounded-lg">
                    <div className="flex flex-col items-center gap-3">
                        <Spinner scale={20} />
                        <p className="text-white font-medium">Modificando Usuario...</p>
                    </div>
                </div>
            }
            <CardHeader className="bg-linear-to-r from-blue-500 to-purple-600 text-white pb-24">
                <div className="flex justify-between items-start">
                <CardTitle className="text-3xl font-bold">Mi Perfil</CardTitle>
                </div>
            </CardHeader>
            
            <CardContent className="pt-0 px-6 pb-6">
                {/* Avatar Section */}
                <div className="flex flex-col items-center -mt-16 mb-6">
                <Avatar className="flex w-32 h-32 border-4 border-white dark:border-gray-800 shadow-lg relative overflow-hidden" onMouseEnter={()=>{setUploadPhoto(true)}} onMouseLeave={()=>{setUploadPhoto(false)}}>
                    <AvatarImage src={user.image || undefined} alt={user.name || "Usuario"} className="flex-1" />
                    <AvatarFallback className="flex-1 flex justify-center items-center text-3xl bg-linear-to-br from-blue-400 to-purple-500 text-white">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                    {
                        uploadPhoto
                        &&
                        <div className="bg-black opacity-70 w-32 h-32 absolute top-0 right-0 flex items-center justify-center">
                            <Upload className="ml-2" size={40} onClick={uploadPhotoButton}/>
                        </div>
                    }
            </Avatar>
            <InputGhost
                value={name}
                onChange={(e)=>{setName(e)}}
                className="mt-4 text-2xl font-bold text-center"
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleUploadName();
                    }
                }}
            />
            <div className="flex items-center gap-2 mt-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <p className="text-muted-foreground">{user.email}</p>
            </div>
            </div>

            <Separator className="my-6" />

            {/* User Information */}
            <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-4">Información de la cuenta</h3>
                <div className="grid gap-4">
                {/* Email Verification Status */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                    {user.emailVerified ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span className="font-medium">Estado del email</span>
                    </div>
                    <Badge variant={user.emailVerified ? "default" : "destructive"}>
                    {user.emailVerified ? "Verificado" : "No verificado"}
                    </Badge>
                </div>

                {/* Created Date */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                    <CalendarDays className="w-5 h-5 text-blue-500" />
                    <span className="font-medium">Cuenta creada</span>
                    </div>
                    <span className="text-muted-foreground">{createdDate}</span>
                </div>

                {/* Updated Date */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                    <CalendarDays className="w-5 h-5 text-purple-500" />
                    <span className="font-medium">Última actualización</span>
                    </div>
                    <span className="text-muted-foreground">{updatedDate}</span>
                </div>
                </div>
            </div>
            </div>
        </CardContent>
        <CardFooter>
            <BotonesFinales emailVerified={user.emailVerified} />
        </CardFooter>
        <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={onFileChange}
        hidden
        />
    </Card>
  );
}