import Markdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import "./Markdown.css";
import remarkBreaks from "remark-breaks";

type Props = {
    text: string;
}

export default function ToMarkdown({ text }: Props) {

    return (

        <div className={"markdown"}>

            <Markdown remarkPlugins={[remarkGfm, remarkBreaks]}>{ text }</Markdown>

        </div>

    )

}