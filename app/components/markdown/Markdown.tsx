import Markdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import "./Markdown.css";
import remarkBreaks from "remark-breaks";

type Props = {
    text: string;
}

const BIDI_LABELS: Record<string, string> = {
    "\u202A": "[lre]", "\u202B": "[rle]", "\u202C": "[pdf]",
    "\u202D": "[lro]", "\u202E": "[rlo]",
    "\u2066": "[lri]", "\u2067": "[rli]", "\u2068": "[fsi]", "\u2069": "[pdi]",
    "\u200E": "[lrm]", "\u200F": "[rlm]", "\u061C": "[alm]",
};

export default function ToMarkdown({ text }: Props) {

    const content = text
        .replace(/[\u202A-\u202E\u2066-\u2069\u200E\u200F\u061C]/g,
            (c) => BIDI_LABELS[c]);

    return (

        <div className={"markdown"}>

            <Markdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                {
                    content
                }
            </Markdown>

        </div>

    )

}