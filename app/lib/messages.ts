import codes from "@/public/codes.json";

const messages: Record<string, string> = codes;

export function getMessage(code: string | undefined): string {

    if (!code) return "";

    return messages[code] ?? "Unknown code";

}