export interface Eval {
  id: number;
  costValue: number;
  performance: number;
  stability: number;
  support: number;
  notes: string | null;
  createdAt: Date;
  apiId: number;
}

export type ContextType = "RECOMMENDED" | "AVOID";

export interface Contexts {
  id: number;
  apiId: number;
  type: ContextType;
  context: string;
}

export type FlagLevel = "BLACK" | "GRAY" | "WARNING";
export interface Flag {
  level: FlagLevel;
  id: number;
  createdAt: Date;
  apiId: number;
  reason: string;
}

export interface Provider {
  id?: number;
  name: string;
  website: string | null;
  supportLevel: "" | "GOOD" | "AVERAGE" | "BAD" | null;
  notes: string |null;
  apis?: number[];
  createdAt?: Date;
}