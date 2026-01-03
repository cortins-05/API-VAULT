import { ApiDraft, FormData } from "@/interfaces/gemini.interface";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChangeEvent, FormEvent, useState } from "react";
import { createApiAction } from "@/actions/prisma/create-api";
import { ReloadGuard } from "@/helpers/BeforeUnload";
import { AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogHeader, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { redirect } from "next/navigation";

interface Props {
  data: ApiDraft;
  IA: boolean;
}

export default function FormConfirm({ data,IA }: Props) {

    const [open, setOpen] = useState(false);

  const [form, setForm] = useState<FormData>({
    name: data.name || "",
    key: data.key || "",
    description: data.description || "",
    deprecated: data.deprecated || false,

    provider: data.provider || "",
    website: data.website || "",
    docsUrl: data.docsUrl || "",
    supportLevel: data.supportLevel || "",
    notes: data.notes || "",

    apiType: data.apiType || "Unknown",
    authMethods: data.authMethods || [],
    hasOfficialSdk: data.hasOfficialSdk || [],
    pricingModel: data.pricingModel || "UNKNOWN",
    confidence: data.confidence ?? 0,
  });

  async function submit(e: FormEvent) {
    e.preventDefault();
    console.log(form);
    await createApiAction(form);
    setOpen(true);
    setTimeout(() => {
      redirect("/gestor-apis/all");
    }, 3000);
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numeric = value === "" ? 0 : Number(value);
    setForm((prev) => ({
      ...prev,
      [name]: numeric,
    }));
  };

  const handleCommaListChange = (name: "authMethods" | "hasOfficialSdk") =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const list = value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
      setForm((prev) => ({
        ...prev,
        [name]: list,
      }));
    };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 p-6">
      <ReloadGuard enabled={IA} />
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight"> { IA ?'Confirm API Information' : 'Create New Api'}</h1>
        <p className="text-muted-foreground">
          {IA ?? 'Review the extracted data and make any necessary corrections'}
        </p>
      </div>

      <form className="space-y-6" onSubmit={submit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* API Fields Card */}
          <Card>
            <CardHeader>
              <CardTitle>API Fields</CardTitle>
              <CardDescription>Basic information about the API</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="API Name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="key">API Key (Optional)</Label>
                <Input
                  id="key"
                  name="key"
                  type="text"
                  value={form.key}
                  onChange={handleChange}
                  placeholder="Your API key"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="API description"
                  rows={4}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="deprecated"
                  name="deprecated"
                  type="checkbox"
                  checked={form.deprecated}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="deprecated" className="text-sm font-normal">
                  Deprecated
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Provider Fields Card */}
          <Card>
            <CardHeader>
              <CardTitle>Provider Fields</CardTitle>
              <CardDescription>Information about the provider</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="provider">Provider</Label>
                <Input
                  id="provider"
                  name="provider"
                  type="text"
                  value={form.provider}
                  onChange={handleChange}
                  placeholder="Provider name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  value={form.website}
                  onChange={handleChange}
                  placeholder="https://example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="docsUrl">Documentation URL</Label>
                <Input
                  id="docsUrl"
                  name="docsUrl"
                  type="url"
                  value={form.docsUrl}
                  onChange={handleChange}
                  placeholder="https://docs.example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="supportLevel">Support Level</Label>
                <select
                  id="supportLevel"
                  name="supportLevel"
                  value={form.supportLevel}
                  onChange={handleSelectChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Not specified</option>
                  <option value="GOOD">Good</option>
                  <option value="AVERAGE">Average</option>
                  <option value="BAD">Bad</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Additional notes"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Metadata Fields Card */}
          <Card>
            <CardHeader>
              <CardTitle>Metadata Fields</CardTitle>
              <CardDescription>Technical specifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiType">API Type</Label>
                <select
                  id="apiType"
                  name="apiType"
                  value={form.apiType}
                  onChange={handleSelectChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="REST">REST</option>
                  <option value="GraphQL">GraphQL</option>
                  <option value="gRPC">gRPC</option>
                  <option value="WebSocket">WebSocket</option>
                  <option value="Unknown">Unknown</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="authMethods">Authentication Methods</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.authMethods.map((method, index) => (
                    <Badge key={index} variant="secondary">
                      {method}
                    </Badge>
                  ))}
                </div>
                <Input
                  id="authMethods"
                  name="authMethods"
                  type="text"
                  value={form.authMethods.join(", ")}
                  onChange={handleCommaListChange("authMethods")}
                  placeholder="API Key, OAuth 2.0, JWT"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hasOfficialSdk">Official SDKs</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.hasOfficialSdk.map((sdk, index) => (
                    <Badge key={index} variant="outline">
                      {sdk}
                    </Badge>
                  ))}
                </div>
                <Input
                  id="hasOfficialSdk"
                  name="hasOfficialSdk"
                  type="text"
                  value={form.hasOfficialSdk.join(", ")}
                  onChange={handleCommaListChange("hasOfficialSdk")}
                  placeholder="JavaScript, Python, Go"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pricingModel">Pricing Model</Label>
                <select
                  id="pricingModel"
                  name="pricingModel"
                  value={form.pricingModel}
                  onChange={handleSelectChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="FREE">Free</option>
                  <option value="FREEMIUM">Freemium</option>
                  <option value="PAY_PER_USE">Pay per use</option>
                  <option value="SUBSCRIPTION">Subscription</option>
                  <option value="UNKNOWN">Unknown</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confidence">Confidence Score</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="confidence"
                    name="confidence"
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={form.confidence}
                    onChange={handleNumberChange}
                    className="w-20"
                  />
                    <span className="text-sm text-muted-foreground">
                      {Math.round(form.confidence * 100)}%
                    </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit">
            Confirm & Save
          </Button>
        </div>
      </form>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>API creada</AlertDialogTitle>
            <AlertDialogDescription>
              Se guardó correctamente. Redirigiendo al gestor de APIs...
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => {redirect("/gestor-apis/all")}}>Aceptar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}