"use client";

import { format } from "date-fns";
import { DeleteProviderButton } from "./DeleteProviderButton";
import { Provider } from "@/interfaces/prisma.interface";

interface Props {
    provider: Provider;
    id: number;
}

export default function HeaderProvider({provider, id}:Props) {

  return (
    <div className="mb-8 flex items-start justify-between">
      <div className="flex-1">
      <h1 className="text-4xl font-bold tracking-tight mb-2">{provider.name}</h1>
      <p className="text-sm text-muted-foreground">
          Proveedor API registrado el {format(provider.createdAt!, "dd 'de' MMMM 'de' yyyy")}
      </p>
      </div>
      <div className="flex gap-3 ms-4">
          <DeleteProviderButton id={id} />
      </div>
    </div>
  );
}