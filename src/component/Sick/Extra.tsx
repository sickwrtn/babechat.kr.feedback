import { useTranslation } from "react-i18next";
import { IModalData } from "../../interfaces";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkBreaks from "remark-breaks";

export function Extra({extraData}:{extraData:IModalData}) {
    
    const { t } = useTranslation();

    return (<>
        <h2 className='mt-2'>#{extraData.id}{t("modal.absorption")}</h2>
        <div className='b-content mt-2 border p-2 rounded'>
            <div>{t("modal.title")} : {extraData.title}</div>
            <div className='mb-2'>{t("modal.createdAt")} : {extraData.createdAt}</div>
            <ReactMarkdown remarkPlugins={[remarkBreaks]}rehypePlugins={[rehypeHighlight,rehypeRaw]}>
                {extraData.content}
            </ReactMarkdown>
        </div>
    </>)
}