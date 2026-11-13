"use server"

import {runAction, verifyTurnstile} from "@/app/lib/security";
import { redirect } from "next/navigation";
import { requireUser } from "@/app/lib/auth";
import {
    createBoardPost, deletePost, getPostById, Post, removePostMedia, updateBoardPost, createBoardComment,
    getCommentById, PostComment, deleteComment, deleteCommentMedia, hasLikedPost, removeLike, likePost, hasLikedComment
} from "@/app/lib/board";
import {revalidatePath} from "next/cache";
import BoardPost from "@/app/components/boards/posting/BoardPost";

export async function createPost(formData: FormData) {

    if (!(await verifyTurnstile(formData, "createBoardPost"))) {

        redirect("?error=true&code=16");

    }

    const action = await runAction("post");

    if (!action.allowed) {

        redirect("?error=true&code=34")

    }

    const user = await requireUser();

    const title = String(formData.get("title") ?? "");
    const board = String(formData.get("board") ?? "");
    const content = String(formData.get("content") ?? "");
    const media = formData.get("media");
    const spoiler = formData.get("spoiler") !== null;
    const anon = formData.get("anonymous") !== null;

    if (title.length > 100) {

        redirect("?error=true&code=32");

    }

    if (content.length > 10000) {

        redirect("?error=true&code=31");

    }

    if (media != null && media instanceof File && media.size > 0) {

        if (media.size > 10 * 1024 * 1024) {

            redirect("?error=true&code=12");

        }

    } else {

        redirect("?error=true&code=29");

    }

    const result = await createBoardPost(user, board, title, content, media, spoiler || false, anon);

    if ("success" in result && !result.success || !(result instanceof Post)) {

        redirect(`?error=true&code=${result.code}`);

    }

    redirect(`/board/${encodeURIComponent(board)}/posts/${result.id}`)

}

export async function removeMedia(id: number) {

    const user = await requireUser();

    if (!Number.isInteger(id)) redirect("?error=true&code=26");

    const post = await getPostById(id);

    if (!(post instanceof Post)) redirect("?error=true&code=7");

    if (user.role <= 0) redirect("?error=true&code=30");

    await removePostMedia(post.id);

}

export async function removePost(id: number) {

    const user = await requireUser();

    if (!Number.isInteger(id)) redirect("?error=true&code=26");

    const post = await getPostById(id);

    if (!(post instanceof Post)) redirect("?error=true&code=26");

    if (post.account !== user.id && user.role <= 0) redirect("?error=true&code=7");

    await deletePost(post.id);

}

export async function updatePost(formData: FormData) {

    if (!(await verifyTurnstile(formData, "editBoardPost"))) {

        redirect("?error=true&code=16");

    }

    const user = await requireUser();

    const id = Number(formData.get("postId"));
    const board = String(formData.get("board") ?? "");
    const title = String(formData.get("title") ?? "");
    const content = String(formData.get("content") ?? "");
    const media = formData.get("media");
    const spoiler = formData.get("spoiler") !== null;

    if (title.length > 100) {

        redirect("?error=true&code=32");

    }

    if (content.length > 10000) {

        redirect("?error=true&code=31");

    }

    const post = await getPostById(id);

    if (!(post instanceof Post)) redirect(`/board/${board}`);

    if (post.account != user.id) {

        redirect(`/board/${board}`);

    }

    if (!Number.isInteger(id)) {

        redirect("?error=true&code=26");

    }

    if (media != null && media instanceof File && media.size > 10 * 1024 * 1024) {

        redirect("?error=true&code=12");

    }

    const result = await updateBoardPost(user, id, title, content, media instanceof File && media.size > 0 ? media : null, spoiler);

    if (!(result instanceof Post)) {

        redirect(`?error=true&code=${result.code}`);

    }

    redirect(`/board/${encodeURIComponent(board)}/posts/${result.id}`);

}

export async function createPostComment(formData: FormData) {

    if (!(await verifyTurnstile(formData, "createComment"))) {

        redirect("?error=true&code=16");

    }

    const action = await runAction("comment");

    if (!action.allowed) {

        redirect("?error=true&code=34")

    }

    const user = await requireUser();

    const board = String(formData.get("board") ?? "");
    const postId = Number(formData.get("postId"));
    const content = String(formData.get("content") ?? "");
    const media = formData.get("media");
    const spoiler = formData.get("spoiler") !== null;

    if (!Number.isInteger(postId) || postId <= 0 || !board) {

        redirect("?error=true&code=26");

    }

    if (content.length > 1000) {

        redirect("?error=true&code=31");

    }

    const result = await createBoardComment(user, postId, 0, content, media instanceof File && media.size > 0 ? media : null, spoiler); // 0 = post

    if (!(result instanceof PostComment)) {

        redirect(`?error=true&code=${result.code}`);

    }

    redirect(`/board/${encodeURIComponent(board)}/posts/${postId}`);

}

export async function removeCommentMedia(id: number) {

    const user = await requireUser();

    if (!Number.isInteger(id)) redirect("?error=true&code=26");

    const comment = await getCommentById(id);

    if (!(comment instanceof PostComment)) redirect("?error=true&code=7");

    if (user.role <= 0) redirect("?error=true&code=30");

    await deleteCommentMedia(comment.id);

}

export async function removeComment(id: number) {

    const user = await requireUser();

    if (!Number.isInteger(id)) redirect("?error=true&code=26");

    const comment = await getCommentById(id);

    if (!(comment instanceof PostComment)) redirect("?error=true&code=26");

    if (comment.account !== user.id && user.role <= 0) redirect("?error=true&code=7");

    await deleteComment(comment.id);

}

export async function toggleLike(postId: number) {

    const user = await requireUser();

    if (!Number.isInteger(postId)) redirect("?error=true&code=26");

    const post = await getPostById(postId);

    if (!(post instanceof Post)) redirect("?error=true&code=26");

    if (hasLikedPost(post.id, user.id)) {

        await removeLike(user, post.id, 0); // 0 = post

    } else {

        await likePost(user, post.id, 0);

    }

    revalidatePath(`/board/${post.board}/posts/${post.id}`);

}

export async function toggleLikeComment(commentId: number) {

    const user = await requireUser();

    if (!Number.isInteger(commentId)) redirect("?error=true&code=26");

    const comment = await getCommentById(commentId);

    if (!(comment instanceof PostComment)) redirect("?error=true&code=26");

    if (hasLikedComment(comment.id, user.id)) {

        await removeLike(user, comment.id, 1); // 1 = comment

    } else {

        await likePost(user, comment.id, 1);

    }

    revalidatePath(`?`);

}

export async function commentOnComment(formData: FormData) {

    if (!(await verifyTurnstile(formData, "createComment"))) {

        redirect("?error=true&code=16");

    }

    const action = await runAction("comment");

    if (!action.allowed) {

        redirect("?error=true&code=34")

    }

    const user = await requireUser();

    const commentId = Number(formData.get("id"));
    const content = String(formData.get("content") ?? "");
    const media = formData.get("media");
    const spoiler = formData.get("spoiler") !== null;

    if (!Number.isInteger(commentId) || commentId <= 0) {

        redirect("?error=true&code=26");

    }

    if (content.length > 1000) {

        redirect("?error=true&code=31");

    }

    const result = await createBoardComment(user, commentId, 1, content, media instanceof File && media.size > 0 ? media : null, spoiler); // 1 = comment

    if (!(result instanceof PostComment)) {

        redirect(`?error=true&code=${result.code}`);

    }

    revalidatePath(`?`);

}
