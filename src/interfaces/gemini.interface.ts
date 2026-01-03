/**
 * Interfaz para la respuesta de Gemini al ingestar un API
 * Representa datos extractados de la documentación oficial de un API
 */
export interface ApiDraft {
  // API fields
  name: string;
  key?: string;
  description: string | null;
  deprecated: boolean;

  // Provider fields
  provider: string | null;
  website: string | null;
  docsUrl: string;
  supportLevel: "GOOD" | "AVERAGE" | "BAD" | null;
  notes: string | null;

  // Metadata fields
  apiType: "REST" | "GraphQL" | "gRPC" | "WebSocket" | "Unknown";
  authMethods: string[];
  hasOfficialSdk: string[];
  pricingModel: "FREE" | "FREEMIUM" | "PAY_PER_USE" | "SUBSCRIPTION" | "UNKNOWN";
  confidence: number;
}

export const emptyApiDraft: ApiDraft = { name: "", description: null, deprecated: false, provider: null, website: null, docsUrl: "", supportLevel: null, notes: null, apiType: "Unknown", authMethods: [], hasOfficialSdk: [], pricingModel: "UNKNOWN", confidence: 0 };

/**
 * Enum para los niveles de soporte del proveedor
 */
export enum SupportLevel {
  GOOD = "GOOD",
  AVERAGE = "AVERAGE",
  BAD = "BAD",
}

/**
 * Enum para los tipos de API
 */
export enum ApiType {
  REST = "REST",
  GRAPHQL = "GraphQL",
  GRPC = "gRPC",
  WEBSOCKET = "WebSocket",
  UNKNOWN = "Unknown",
}

/**
 * Enum para los modelos de precios
 */
export enum PricingModel {
  FREE = "FREE",
  FREEMIUM = "FREEMIUM",
  PAY_PER_USE = "PAY_PER_USE",
  SUBSCRIPTION = "SUBSCRIPTION",
  UNKNOWN = "UNKNOWN",
}

export interface FormData {
  /* API */
  name: string;
  key: string;
  description: string;
  deprecated: boolean;

  /* Provider */
  provider: string;
  website: string;
  docsUrl: string;
  supportLevel: "" | "GOOD" | "AVERAGE" | "BAD";
  notes: string;

  /* Metadata */
  apiType: "REST" | "GraphQL" | "gRPC" | "WebSocket" | "Unknown";
  authMethods: string[];
  hasOfficialSdk: string[];
  pricingModel: "FREE" | "FREEMIUM" | "PAY_PER_USE" | "SUBSCRIPTION" | "UNKNOWN";
  confidence: number;
}