import { Api } from "../../generated/prisma/client";

interface Props{
    api: Api;
}

export default function ApiItem({api}:Props) {
  return (
    <div className="group relative flex flex-col w-96 overflow-hidden rounded-xl bg-white transition-all duration-300 hover:shadow-lg hover:shadow-black/10">
      {/* Línea decorativa superior */}
      <div className="h-1 w-full bg-slate-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Contenedor principal */}
      <div className="flex flex-col p-6 gap-4">
        {/* Header con título y badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-900 leading-tight group-hover:text-slate-700 transition-colors duration-200">
              {api.name}
            </h3>
          </div>
          
          {/* Badge deprecated */}
          {api.deprecated && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-300 whitespace-nowrap">
              Deprecated
            </span>
          )}
        </div>

        {/* Descripción */}
        {api.description && (
          <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 group-hover:text-slate-700 transition-colors duration-200">
            {api.description}
          </p>
        )}

        {/* Divider sutil */}
        <div className="h-px bg-gradient-to-r from-slate-200 via-slate-200/50 to-transparent"></div>

        {/* Footer con info adicional */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            API
          </span>
          <button className="text-sm font-medium text-slate-700 hover:text-slate-900 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:translate-x-0.5">
            Explorar →
          </button>
        </div>
      </div>

      {/* Borde sutil con gradiente */}
      <div className="absolute inset-0 rounded-xl border border-slate-200/50 group-hover:border-slate-300/80 pointer-events-none transition-colors duration-300"></div>
    </div>
  );
}