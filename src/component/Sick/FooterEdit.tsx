import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next"
import { event, ICategory, IModalData } from "../../interfaces";

export function FooterEdit({modalData,setIsEdit,editEvent,modalTitleEdit,modalContentEdit,categoryEdit,modalPassword}:{modalData:IModalData,setIsEdit:event,editEvent:(id: number, title: string, content: string, category: ICategory, password: string) => void,modalTitleEdit:string,modalContentEdit:string,categoryEdit:ICategory,modalPassword:string}) {
    const { t } = useTranslation();
    return (<>
        <Button className="me-1" variant="outline-danger" onClick={()=>setIsEdit(false)}>
            {t("modal.footer.close")}
        </Button>
        <Button className="me-1" variant="outline-success" onClick={()=>editEvent(modalData.id,modalTitleEdit,modalContentEdit,categoryEdit,modalPassword)}>
            {t("modal.footer.sumbit")}
        </Button>
    </>)
}