import Markdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import "./Markdown.css";

type Props = {
    text: string;
}

export default function ToMarkdown({ text }: Props) {

    return (

        <div className={"markdown"}>

            <Markdown remarkPlugins={[remarkGfm]}>{ text }</Markdown>

        </div>

    )

}