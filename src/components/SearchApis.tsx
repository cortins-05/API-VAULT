"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ApiComponent } from "@/components/ApiComponent";
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Api {
  id: number;
  name: string;
  key: string | null;
  providerId: number;
  description: string | null;
  deprecated: boolean;
  docsUrl: string | null;
  createdAt: Date;
}

interface Props {
  apis: Api[];
}

export default function SearchApis({ apis }: Props) {
  const [query, setQuery] = useState("");

  const filteredApis = apis.filter(api =>
    api.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="h-full w-full flex flex-col gap-10 p-5">
      <Button variant={"link"} className="absolute right-7"><Link href={"/actions/createManually"}>Add One</Link></Button>
      <div className="relative w-full max-w-md">
        {/* Icono dentro del input */}
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>

        {/* Input */}
        <Input
          type="text"
          placeholder="Buscar..."
          className="pl-10 flex-1"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 justify-center justify-items-center">
        {filteredApis.map(api => (
          <ApiComponent key={api.id} api={api} />
        ))}
      </div>
    </main>
  );
}