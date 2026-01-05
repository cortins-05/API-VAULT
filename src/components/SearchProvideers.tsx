"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Provider } from '@/interfaces/prisma.interface';
import { ProviderComponent } from "./ProviderComponent";
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Props {
  providers: Provider[];
}

export default function SearchProviders({ providers }: Props) {
  const [query, setQuery] = useState("");

  const filteredApis = providers.filter(api =>
    api.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="h-full w-full flex flex-col gap-10 p-5">

      <Button variant={"link"} className="absolute right-7"><Link href={"/actions/newProvider"}>Add One</Link></Button>

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

      <div className="flex gap-20 flex-wrap">
        {filteredApis.map(provider => (
          <ProviderComponent key={provider.id} provider={provider} />
        ))}
      </div>
    </main>
  );
}