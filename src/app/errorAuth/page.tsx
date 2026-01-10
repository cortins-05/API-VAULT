import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ErrorAuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-red-400/20 rounded-full blur-xl"></div>
              <div className="relative bg-red-100 dark:bg-red-900/30 p-4 rounded-full">
                <AlertCircle className="w-12 h-12 text-red-600" />
              </div>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-red-600 dark:text-red-400">
            Acceso Denegado
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-3 text-center">
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              No estás identificado
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Para acceder a esta sección, necesitas iniciar sesión o crear una cuenta. 
              Haz clic en el botón de abajo para registrarte.
            </p>
          </div>

          <div className="space-y-3">
            <Link href="/auth/register" className="block w-full">
              <Button className="w-full h-11 text-base font-semibold group bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-200">
                <span>Ir a Registro</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <Link href="/" className="block w-full">
              <Button 
                variant="outline" 
                className="w-full h-11 text-base font-semibold dark:border-gray-700 dark:hover:bg-gray-800"
              >
                Volver al Inicio
              </Button>
            </Link>
          </div>

          <div className="pt-4 text-center text-sm text-gray-500 dark:text-gray-400 border-t dark:border-gray-700">
            <p>¿Ya tienes cuenta? <Link href="/auth/login" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Inicia sesión aquí</Link></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
