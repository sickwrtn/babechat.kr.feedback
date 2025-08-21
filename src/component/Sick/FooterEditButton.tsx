import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { event, IModalData } from "../../interfaces";

/**
 * Modal Footer 편집
 */
export function FooterEditButton({modalData,setIsEdit,setModalTitleEdit,setModalContentEdit}:{modalData:IModalData,setIsEdit:event,setModalTitleEdit:event,setModalContentEdit:event}) {
    
    const { t } = useTranslation();

    return (<> 
        <Button className="me-1" variant="outline-secondary" onClick={()=>{
                setIsEdit(true);
                setModalTitleEdit(modalData.title);
                setModalContentEdit(modalData.content);
            }}>
            {t("modal.footer.edit")}
        </Button>
    </>)
}