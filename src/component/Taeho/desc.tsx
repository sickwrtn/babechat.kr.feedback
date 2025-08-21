import { Form } from "react-bootstrap"
import { useTranslation } from "react-i18next"

/**
 * 패드백 정렬 순서 SelectBox
 */
export function Desc({onChange}:{onChange:(v:any)=>void}) {
    const { t } = useTranslation()
    return <>
        <Form.Select className="tab-select" defaultValue={"latest"} onChange={onChange}>
            <option value="likeCount">{t("desc.likeCount")}</option>
            <option value="latest">{t("desc.latest")}</option>
            <option value="oldest">{t("desc.oldest")}</option>
        </Form.Select>
    </>
}