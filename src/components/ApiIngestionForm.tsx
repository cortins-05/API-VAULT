"use client";

import { FormEvent, useState } from "react";
import { ingestApiWithGemini } from "@/actions/ai/ingest-api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function ApiIngestForm() {
  const [apiName, setApiName] = useState("");
  const [docsUrl, setDocsUrl] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    console.log({ apiName, docsUrl });
    // Aquí puedes llamar a ingestApiWithGemini con los datos
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="api-name">API Name</Label>
        <Input
          id="api-name"
          type="text"
          placeholder="Ingresa el nombre de la API"
          value={apiName}
          onChange={(e) => setApiName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="docs-url">Docs URL</Label>
        <Input
          id="docs-url"
          type="url"
          placeholder="https://ejemplo.com/docs"
          value={docsUrl}
          onChange={(e) => setDocsUrl(e.target.value)}
          required
        />
      </div>

      <Button type="submit" className="w-full">
        Ingresar API
      </Button>
    </form>
  );
}