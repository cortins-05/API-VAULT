import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Mail, CheckCircle2, XCircle } from "lucide-react";
import { getSessionUser } from "@/actions/auth/getUserId";
import { BotonesFinales } from "./BotonesFinales";

export default async function ProfilePage() {

  const user  = await getSessionUser();

  if(!user){
    redirect("/auth/login");
  }

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

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Card className="overflow-hidden">
        <CardHeader className="bg-linear-to-r from-blue-500 to-purple-600 text-white pb-24">
          <div className="flex justify-between items-start">
            <CardTitle className="text-3xl font-bold">Mi Perfil</CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0 px-6 pb-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center -mt-16 mb-6">
            <Avatar className="w-32 h-32 border-4 border-white dark:border-gray-800 shadow-lg">
              <AvatarImage src={user.image || undefined} alt={user.name || "Usuario"} />
              <AvatarFallback className="text-3xl bg-linear-to-br from-blue-400 to-purple-500 text-white">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <h2 className="mt-4 text-2xl font-bold text-center">{user.name}</h2>
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
      </Card>
    </div>
  );
}