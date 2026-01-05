import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Plus } from 'lucide-react';
import Link from 'next/link';

export default function NoProvidersError() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md border-0 shadow-lg">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-amber-600" />
            <CardTitle className="text-2xl">Sin proveedores configurados</CardTitle>
          </div>
          <CardDescription className="text-base">
            No hay proveedores de API disponibles en tu cuenta
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-lg p-4">
            <p className="text-sm text-amber-900 dark:text-amber-200">
              Para gestionar y utilizar APIs, necesitas crear al menos un proveedor. Los proveedores te permiten organizar y controlar diferentes fuentes de datos.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-foreground">¿Qué es un proveedor?</h3>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• Fuente centralizada de tus APIs</li>
              <li>• Gestión de autenticación y credenciales</li>
              <li>• Control de acceso y permisos</li>
            </ul>
          </div>

          <Link href="/actions/newProvider" className="block">
            <Button className="w-full gap-2" size="lg">
              <Plus className="w-4 h-4" />
              Crear nuevo proveedor
            </Button>
          </Link>

          <Button 
            variant="outline" 
            className="w-full"
            asChild
          >
            <Link href="/gestor-apis">Ir a gestión de APIs</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}