"use server";

import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

/* =======================
   Inicialización Gemini
======================= */
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY!,
});

/* =======================
   Schema FINAL
======================= */
export const ApiDraftSchema = z.object({
  name: z.string(),
  provider: z.string().nullable(),
  website: z.string().url().nullable(),
  docsUrl: z.string().url(),
  apiType: z.enum(["REST", "GraphQL", "gRPC", "WebSocket", "Unknown"]),
  authMethods: z.array(z.string()),
  hasOfficialSdk: z.array(z.string()),
  pricingModel: z.enum([
    "FREE",
    "FREEMIUM",
    "PAY_PER_USE",
    "SUBSCRIPTION",
    "UNKNOWN",
  ]),
  shortTechnicalSummary: z.string(),
  confidence: z.number().min(0).max(1),
});

/* =======================
   Utilidades críticas
======================= */
function extractJson(text: string): string {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON object found");
  return match[0];
}

async function parseGeminiOutput(text: string) {
  try {
    return JSON.parse(extractJson(text));
  } catch {
    return null;
  }
}

/* =======================
   PROMPT PERFECTO (FINAL)
======================= */
function buildPrompt(name: string, docsUrl: string) {
  return `
ROLE:
You are a senior API analyst and software architect.

MISSION:
Extract factual, verifiable technical metadata from an official API documentation.

STRICT RULES:
- Use ONLY the provided documentation URL as the source of truth.
- Do NOT guess, infer, assume or extrapolate.
- If a value cannot be explicitly verified, return null.
- Do NOT use prior knowledge.
- Do NOT include explanations, comments or markdown.
- The output MUST be valid JSON.
- The output MUST start with '{' and end with '}'.

INPUT:
API name: ${name}
Official documentation URL: ${docsUrl}

FIELDS DEFINITION:
- apiType: choose ONLY if explicitly stated (REST, GraphQL, gRPC, WebSocket)
- authMethods: only authentication methods clearly documented
- hasOfficialSdk: list ONLY officially supported SDK languages
- pricingModel: choose UNKNOWN unless pricing is clearly documented
- confidence: number between 0 and 1 representing certainty of correctness

OUTPUT:
Return EXACTLY this JSON schema and nothing else:

{
  "name": string,
  "provider": string | null,
  "website": string | null,
  "docsUrl": string,
  "apiType": "REST" | "GraphQL" | "gRPC" | "WebSocket" | "Unknown",
  "authMethods": string[],
  "hasOfficialSdk": string[],
  "pricingModel": "FREE" | "FREEMIUM" | "PAY_PER_USE" | "SUBSCRIPTION" | "UNKNOWN",
  "shortTechnicalSummary": string,
  "confidence": number
}
`;
}

/* =======================
   ACTION PRINCIPAL
======================= */
export async function ingestApiWithGemini(
  name: string,
  docsUrl: string
) {
  if (!name || !docsUrl) {
    throw new Error("Missing required input");
  }

  new URL(docsUrl); // valida URL

  /* === Primera llamada === */
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [{ text: buildPrompt(name, docsUrl) }],
      },
    ],
  });

  let parsed = await parseGeminiOutput(response.text!);

  /* === Reintento automático (repair) === */
  if (!parsed) {
    const repair = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
Fix the following output so it becomes VALID JSON ONLY.
Do NOT change the data.
Do NOT add or remove fields.
Return ONLY the corrected JSON.

BROKEN OUTPUT:
${response.text}
`,
            },
          ],
        },
      ],
    });

    parsed = await parseGeminiOutput(repair.text!);
  }

  if (!parsed) {
    throw new Error("Gemini failed to return valid JSON");
  }

  /* === Validación final === */
  const validated = ApiDraftSchema.safeParse(parsed);
  if (!validated.success) {
    throw new Error("Schema validation failed");
  }

  return validated.data; // DRAFT listo para revisión humana
}