export const dynamic = 'force-dynamic'

import { prisma } from "@/lib/prisma";
import SearchApis from '../../components/SearchApis';
import { getUserId } from "@/actions/auth/getUserId";
import ErrorAuthPage from "@/app/errorAuth/page";

export default async function GestorApisPage() {

  const userId = await getUserId();

  if(!userId){
    return(
      <ErrorAuthPage/>
    );
  }

  const myApis = await prisma.api.findMany({
    where: {
      provider: {
        userId,
      },
    },
  });
  
  return (
    <main className="h-full w-full flex flex-col gap-10 p-5">
      {myApis.length <= 0 ? (
        <div className="flex items-center justify-center h-full w-full">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
              No hay APIs agregadas
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Crea una para descubrir todo el poder de esta aplicación
            </p>
          </div>
        </div>
      ) : (
        <SearchApis apis={myApis} />
      )}
    </main>
  );
}