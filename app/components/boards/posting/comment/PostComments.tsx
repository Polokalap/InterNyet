import {
    getAllComments,
    getComments,
    getCommentsOnComment, Post
} from "@/app/lib/board";
import CommentPost from "@/app/components/boards/posting/comment/CommentPost";
import Link from "next/link";
import {PlainComment} from "@/app/lib/types";

type Props = {
    post?: Post;
    comment?: PlainComment;
    limit?: number;
    small?: boolean;
}

export default async function PostComments({ post, comment, limit = -1, small = false }: Props) {

    if (post) {

        const comments = getComments(post.id);
        const allComments = getAllComments(post.id);

        const shown = limit && limit > 0 ? comments.slice(0, limit) : comments;

        return (

            <>

                {shown.map(comment => (
                    <CommentPost small={small} comment={{...comment}} key={comment.id}/>
                ))}

                <br/>

                {limit !== -1 && limit < comments.length &&
                    <Link href={`/board/${post.board}/posts/${post.id}`}>
                        {allComments.length - limit} more...
                    </Link>
                }

            </>

        )

    }

    if (comment) {

        const comments = await getCommentsOnComment(comment.id);

        const shown = limit && limit > 0 ? comments.slice(0, limit) : comments;

        return (

            <>

                {shown.map(reply => (
                    <CommentPost small={small} comment={{...reply}} key={reply.id}/>
                ))}

            </>

        )

    }

    return null;

}