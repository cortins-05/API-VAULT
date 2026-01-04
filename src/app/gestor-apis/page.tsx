import { prisma } from "@/lib/prisma";
import SearchApis from '../../components/SearchApis';

export default async function GestorApisPage() {
  
  const myApis = await prisma.api.findMany();
  
  return (
    <main className="h-full w-full flex flex-col gap-10 p-5">
      <SearchApis apis={myApis} />
    </main>
  );
}