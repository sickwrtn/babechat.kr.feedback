import { Button } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { event, ICategory, IModalData } from "../../interfaces";

/**
 * Modal Footer 관리자 편집
 */
export function FooterAdminEdit({modalData,setIsEdit,editAdminEvent,modalTitleEdit,modalContentEdit,categoryEdit}:{modalData: IModalData,setIsEdit:event,editAdminEvent: (id: number, title: string, content: string, category: ICategory) => void,modalTitleEdit:string,modalContentEdit:string,categoryEdit:ICategory}) {

    const { t } = useTranslation(); 

    return (<>
        <Button className="me-1" variant="outline-danger" onClick={()=>setIsEdit(false)}>
            {t("modal.footer.close")}
        </Button>
        <Button className="me-1" variant="outline-success" onClick={()=>editAdminEvent(modalData.id,modalTitleEdit,modalContentEdit,categoryEdit)}>
            {t("modal.footer.sumbit")}
        </Button>
    </>)
}