import { ApiComponent } from "@/components/ApiComponent";
import { prisma } from "@/lib/prisma";

export default async function GestorApisPage() {
  
  const myApis = await prisma.api.findMany();

  return (
    <main className="h-full w-full items-start grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-5">
      {
        myApis.map(api => (
          <ApiComponent key={api.id} api={api} />
        ))
      }
    </main>
  );
}