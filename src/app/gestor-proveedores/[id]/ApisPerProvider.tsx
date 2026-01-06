import { ApiComponent } from "@/components/ApiComponent";
import { Api } from "../../../../generated/prisma/client";

interface Props {
  apis: Api[];
}

export default function ApisPerProvider({apis}:Props) {
  return (
    <main className="flex flex-col items-center gap-6">
      <h1 className="text-3xl font-bold">Apis Per Provider:</h1>
      <div className="w-full grid grid-cols-1 md:grid-cols-3 justify-around justify-items-center gap-20">
        {
          apis.map(api=>(
            <ApiComponent api={api} key={api.id} />
          ))
        }
      </div>
    </main>
  );
}