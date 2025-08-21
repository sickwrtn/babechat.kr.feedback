import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkBreaks from "remark-breaks";
import { IModalData } from "../../interfaces";
import { useTranslation } from "react-i18next";

/**
 * Modal 댓글
 */
export function Comment_({modalData}:{modalData:IModalData}) {

    const { t } = useTranslation();

    return (<>
        <div className='d-flex'>
            <h3 className='me-2'>{t("modal.comment")}</h3>
            <img style={{height:"32px",marginTop:"3px"}} src="https://www.babechat.ai/assets/svgs/babechat.svg" />
        </div>
        <div className='border p-2 mt-2 rounded' style={{minHeight:"120px"}}>
            <div className='aptx'>
                <ReactMarkdown remarkPlugins={[remarkBreaks]} rehypePlugins={[rehypeHighlight,rehypeRaw]}>{modalData.comment}</ReactMarkdown>
            </div>
        </div>
    </>)
}