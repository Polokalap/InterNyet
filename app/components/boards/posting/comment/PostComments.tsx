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

        const shown = limit && limit > 0 ? comments.slice(0, limit) : comments;

        return (

            <>

                <div className={"w-full"}>

                    {shown.map(comment => (
                        <CommentPost small={small} comment={{...comment}} key={comment.id}/>
                    ))}

                    <br />

                    {limit !== -1 && limit < comments.length &&
                        <Link href={`/board/${post.board}/posts/${post.id}`}>
                            {comments.length - limit} more...
                        </Link>
                    }

                </div>

            </>

        )

    }

    if (comment) {

        const comments = await getCommentsOnComment(comment.id);

        const shown = limit && limit > 0 ? comments.slice(0, limit) : comments;

        return (

            <>

                <div className={"w-full"}>

                    {shown.map(reply => (
                        <CommentPost small={small} comment={{...reply}} key={reply.id}/>
                    ))}

                </div>

            </>

        )

    }

    return null;

}