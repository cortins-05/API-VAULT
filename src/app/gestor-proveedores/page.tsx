import { prisma } from "@/lib/prisma";
import SearchProviders from "@/components/SearchProvideers";

export default async function GestorApisPage() {
  
  const providers = await prisma.provider.findMany();
  
  return (
    <main className="h-full w-full flex flex-col gap-10 p-5">
      {providers.length <= 0 ? (
        <div className="flex items-center justify-center h-full w-full">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
              No hay Proveedores agregados
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Crea uno para descubrir todo el poder de esta aplicación.
            </p>
          </div>
        </div>
      ) : (
        <SearchProviders providers={providers} />
      )}
    </main>
  );
}