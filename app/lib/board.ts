import boards from "@/public/boards.json";

export function getAllBoardIds() {

    const allBoards = [];

    for (const category of boards) {

        for (const board of category.boards) {

            allBoards.push(board.id);

        }

    }

    return allBoards;

}

export function getAllBoards() {

    const allBoards = [];

    for (const category of boards) {

        for (const board of category.boards) {

            allBoards.push(board);

        }

    }

    return allBoards;

}

export function getBoardById(boardId: string) {

    return getAllBoards().find((board) => board.id === boardId);

}