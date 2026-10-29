import roles from "@/public/roles.json";
import codes from "@/public/codes.json";

const messages: Record<string, string> = codes;
const ranks: Record<string, string> = roles;

export function getMessage(code: string | undefined): string {

    if (!code) return "";

    return messages[code] ?? "Unknown code";

}

export function getRole(id: string | undefined): string {

    if (!id) return "";

    return ranks[id] ?? "Unknown id";

}