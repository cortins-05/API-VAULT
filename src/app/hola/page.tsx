import { ApiIngestForm } from "@/components/ApiIngestionForm";

export default function NewApiPage() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">
        Añadir API
      </h1>

      <ApiIngestForm />
    </div>
  );
}