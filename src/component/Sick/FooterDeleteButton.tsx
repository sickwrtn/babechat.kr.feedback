import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { event, IModalData, voidEvent } from "../../interfaces";
import { sillo } from "../../sdk";
import { _Alert } from "../../function";

/**
 * Modal Footer 삭제
 */
export function FooterDeleteButton({modalData,modalPassword,setModalPasswordIsVaild,resetFeedback,handleClose}:{modalData:IModalData,modalPassword: string,setModalPasswordIsVaild:event,resetFeedback:voidEvent,handleClose:voidEvent}) {
    
    const api = new sillo(localStorage.getItem("auth_token") as string);

    const { t } = useTranslation();

    const deleteEvent = (id: number,password: string) => {
        const modalPasswordValid = password.trim().length > 0;
        setModalPasswordIsVaild(!modalPasswordValid);
        if (!modalPasswordValid){
            return _Alert(t("alert.deleteEvent.vaild"),"fail");
        }
        api.delete.feedback(id,password)
            .then(data => {
                if (data.result == "SUCCESS"){
                    _Alert(t("alert.deleteEvent.success"),"success");
                    resetFeedback();
                    handleClose();
                }
                else if (data.result == "FAIL" && data.data == "wrong password"){
                    return _Alert(t("alert.deleteEvent.wrongPassword"),"fail");
                }
                else {
                    return _Alert(`${t("alert.deleteEvent.error")} ${data.data}`,"fail");
                }
            })
    }

    return (<> 
        <Button className="ms-1" variant="outline-danger" onClick={()=>deleteEvent(modalData.id,modalPassword)}>
            {t("modal.footer.delete")}
        </Button> 
    </>)
}