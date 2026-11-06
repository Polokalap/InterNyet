import { Fingerprint } from "@/app/lib/security";

export type ClientRecord = {
    ip: string;
    userAgent?: string | null;
    lastSeen: number;
    [k: string]: unknown;
};

const g = globalThis as unknown as { clients?: Map<string, ClientRecord>; fingerprints?: Map<string, Fingerprint> };
export const clients = (g.clients ??= new Map<string, ClientRecord>());
export const fingerprints = (g.fingerprints ??= new Map<string, Fingerprint>());

export const getClientByIp = (ip: string) => clients.get(ip);
export const getFingerprintByIp = (ip: string) => fingerprints.get(ip);