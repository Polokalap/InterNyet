import { getComments, Post } from "@/app/lib/board";
import CommentPost from "@/app/components/boards/posting/comment/CommentPost";
import Link from "next/link";

type Props = {
    post: Post;
    limit?: number;
}

export default async function PostComments({ post, limit = -1 }: Props) {

    const comments = await getComments(post.id)

    const shown = limit && limit > 0 ? comments.slice(0, limit) : comments

    return (

        <>

            { shown.map(comment => (
                <CommentPost comment={comment} key={comment.id} />
            )) }

            <br />

            {limit !== -1 && limit < comments.length &&
                <Link href={`/board/${post.board}/posts/${post.id}`}>
                    {comments.length - limit} more...
                </Link>
            }

        </>

    )

}