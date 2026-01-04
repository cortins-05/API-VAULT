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