"use server";

import { GoogleGenAI } from "@google/genai";

/* =======================
   Inicialización Gemini
======================= */
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY!,
});

/* =======================
   PROMPT PERFECTO (FINAL)
======================= */
function buildPrompt(API_NAME: string, DOCS_URL: string) {
  return `
ROLE:
You are a senior technical writer and API analyst.

MISSION:
Write a factual, technical, and structured description of an API using ONLY its official documentation.

STRICT RULES:
- Use ONLY the provided official documentation URL as the source of truth.
- Do NOT guess, infer, assume, extrapolate, or use prior knowledge.
- If a detail is not explicitly documented, omit it.
- Do NOT mention the documentation, the analysis process, or yourself.
- Do NOT include examples unless they are explicitly described in the documentation.
- Do NOT include headings, bullet points, numbering, markdown, or formatting.
- The output MUST be plain text and contain ONLY the API description.

INPUT:
API name: ${API_NAME}
Official documentation URL: ${DOCS_URL}

STYLE AND CONTENT GUIDELINES:
Write in Spanish.
Use clear, technical, and neutral language.
Structure the description in short, well-defined paragraphs.
Keep the description concise and information-dense.
Avoid marketing language, filler phrases, and generic statements.

DESCRIPTION SCOPE:
When explicitly documented, include:
- The purpose and core functionality of the API
- The main endpoints or interaction model
- The types of models, services, or resources it exposes
- Typical use cases and intended users
- Authentication and high-level interaction flow
- Notable capabilities, limits, or constraints

FINAL OUTPUT CONSTRAINTS:
- Return a single plain-text string.
- Do NOT add introductions or conclusions.
- Do NOT add meta commentary of any kind.
- Do NOT explain what the API is “designed to do” unless stated in the documentation.
- Output ONLY the API description text.
`;
}

/* =======================
   ACTION PRINCIPAL
======================= */
export async function ingestApiWithGemini(
  API_NAME: string,
  DOCS_URL: string
) {
  if (!API_NAME || !DOCS_URL) {
    throw new Error("Missing required input");
  }

  new URL(DOCS_URL); // valida URL

  /* === Primera llamada === */
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [{ text: buildPrompt(API_NAME, DOCS_URL) }],
      },
    ],
  });

  return response.text; // DRAFT listo para revisión humana
}