"use client";

import { FormEvent, useState } from "react";
import { ingestApiWithGemini } from "@/actions/ai/ingest-api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ApiDraft } from "@/interfaces/gemini.interface";
import { Loader2, Zap, BookOpen } from "lucide-react";

type Props = {
  onSend: (value: ApiDraft) => void
}

export function ApiIngestForm({onSend}:Props) {
  const [apiName, setApiName] = useState("");
  const [docsUrl, setDocsUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const resp = await ingestApiWithGemini(apiName, docsUrl);
      onSend(resp);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error al procesar la API");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="flex items-center justify-center gap-3">
            <Zap className="w-10 h-10 text-yellow-500" />
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent pb-2">
              API Ingestion
            </h1>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Extrae información de tu API automáticamente usando inteligencia artificial
          </p>
        </div>

        {/* Main Card */}
        <Card className="shadow-xl border-slate-200 dark:border-slate-800">
          <CardHeader className="space-y-1 pb-6">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <CardTitle>Información de la API</CardTitle>
            </div>
            <CardDescription>
              Proporciona el nombre y la URL de documentación de tu API
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={onSubmit} className="space-y-6">
              {/* API Name Input */}
              <div className="space-y-2">
                <Label htmlFor="api-name" className="text-sm font-semibold">
                  Nombre de la API
                </Label>
                <Input
                  id="api-name"
                  type="text"
                  placeholder="Ej: Stripe, OpenAI, GitHub"
                  value={apiName}
                  onChange={(e) => setApiName(e.target.value)}
                  disabled={isLoading}
                  required
                  className="h-11 placeholder:text-slate-400"
                />
              </div>

              {/* Docs URL Input */}
              <div className="space-y-2">
                <Label htmlFor="docs-url" className="text-sm font-semibold">
                  URL de Documentación
                </Label>
                <Input
                  id="docs-url"
                  type="url"
                  placeholder="https://docs.ejemplo.com"
                  value={docsUrl}
                  onChange={(e) => setDocsUrl(e.target.value)}
                  disabled={isLoading}
                  required
                  className="h-11 placeholder:text-slate-400"
                />
              </div>

              {/* Error Alert */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full h-11 font-semibold text-base"
                disabled={isLoading || !apiName || !docsUrl}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Extraer Información
                  </>
                )}
              </Button>

              {/* Info */}
              <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 p-4 text-sm text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                <p className="font-semibold mb-1">💡 Consejo</p>
                <p>
                  Proporciona la URL oficial de documentación de tu API para obtener los mejores resultados. Nuestro sistema analizará automáticamente toda la información disponible.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-slate-500 dark:text-slate-400">
          <p>Procesado por IA · Análisis automático de documentación</p>
        </div>
      </div>
    </div>
  );
}