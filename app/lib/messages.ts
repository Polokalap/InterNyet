import roles from "@/public/roles.json";
import codes from "@/public/codes.json";
import boards from "@/public/boards.json";

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

export function getBoardByName(board: string) {

    for (const category of boards) {

        for (const entry of category.boards) {

            if (entry.id === board) {

                return entry.name;

            }

        }

    }

    return "Unknown board";

}

export function getBoardDescription(board: string) {

    for (const category of boards) {

        for (const entry of category.boards) {

            if (entry.id === board && entry.description) {

                return entry.description;

            }

        }

    }

    return "No description";

}