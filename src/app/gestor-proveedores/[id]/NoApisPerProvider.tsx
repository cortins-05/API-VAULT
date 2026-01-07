
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Inbox } from "lucide-react";

export default function NoApisPerProvider() {
  return (
    <div className="w-full h-screen flex items-center justify-center dark:from-slate-950 dark:to-slate-900">
      <div className="text-center max-w-md mx-auto px-6 py-12">
        {/* Icono */}
        <div className="mb-6 flex justify-center">
          <div className="p-4 bg-blue-100 dark:bg-blue-950 rounded-full">
            <Inbox className="w-12 h-12 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        {/* Título */}
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-3">
          No hay APIs registradas
        </h2>

        {/* Descripción */}
        <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
          Este proveedor aún no tiene ninguna API asociada. Comienza agregando una para
          empezar a gestionar tus integraciones.
        </p>

        {/* Botón de acción */}
        <Link href="/actions/newApi">
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="w-5 h-5 mr-2" />
            Agregar nueva API
          </Button>
        </Link>

        {/* Sugerencia secundaria */}
        <p className="text-xs text-slate-500 dark:text-slate-500 mt-8">
          O ve al <Link href="/gestor-apis" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
            gestor de APIs
          </Link> para ver todas las disponibles
        </p>
      </div>
    </div>
  );
}