import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { event, IModalData, voidEvent } from "../../interfaces";
import { sillo } from "../../sdk";
import { _Alert } from "../../function";

/**
 * Modal Footer관리자 
 */
export function FooterAdminNoEdit({modalData,setIsEdit,setModalTitleEdit,setModalContentEdit,resetFeedback,handleClose}:{modalData:IModalData,setIsEdit:event,setModalTitleEdit:event,setModalContentEdit:event,resetFeedback:voidEvent,handleClose:voidEvent}) {
    
    const api = new sillo(localStorage.getItem("auth_token") as string);

    const { t } = useTranslation();

    const progressEvent = (id: number) => {
        api.putAdmin.progress(id)
            .then(data=>{
                if (data.result == "SUCCESS"){
                    _Alert(t("alert.progressEvent.success"),"success");
                    resetFeedback();
                    handleClose();
                }
                else if (data.result == "FAIL" && data.data == "auth"){
                    return _Alert(t("alert.progressEvent.auth"),"fail");
                }
                else {
                    return _Alert(`${t("alert.progressEvent.error")} ${data.data}`,"fail");
                }
            })
    }

    const completedEvent = (id: number) => {
        api.putAdmin.compeleted(id)
            .then(data => {
                if (data.result == "SUCCESS"){
                    _Alert(t("alert.completedEvent.success"),"success");
                    resetFeedback();
                    handleClose();
                }
                else if (data.result == "FAIL" && data.data == "auth"){
                    return _Alert(t("alert.completedEvent.auth"),"fail");
                }
                else {
                    return _Alert(`${t("alert.completedEvent.error")} ${data.data}`,"fail");
                }
            })
    }  

    const recoverEvent = (id: number) => {
        api.putAdmin.recover(id)
            .then(data => {
                if (data.result == "SUCCESS"){
                    _Alert(t("alert.recoverEvent.success"),"success");
                    resetFeedback();
                    handleClose();
                }
                else if (data.result == "FAIL" && data.data == "auth"){
                    return _Alert(t("alert.recoverEvent.auth"),"fail");
                }
                else {
                    return _Alert(`${t("alert.recoverEvent.error")} ${data.data}`,"fail");
                }
            })
    }

    const deleteAdminEvent = (id: number) => {
        api.deleteAdmin.feedback(id)
            .then(data => {
                if (data.result == "SUCCESS"){
                    _Alert(t("alert.deleteAdminEvent.success"),"success");
                    resetFeedback();
                    handleClose();
                }
                else if (data.result == "FAIL" && data.data == "auth"){
                    return _Alert(t("alert.deleteAdminEvent.auth"),"fail");
                }
                else {
                    return _Alert(`${t("alert.deleteAdminEvent.error")} ${data.data}`,"fail");
                }
            })
    }

    const clearEvent = (id: number) => {
        api.putAdmin.clear(id)
            .then(data=>{
                if (data.result == "SUCCESS"){
                    _Alert(t("alert.clearEvent.success"),"success");
                    resetFeedback();
                    handleClose();
                }
                else if (data.result == "FAIL" && data.data == "auth"){
                    return _Alert(t("alert.clearEvent.auth"),"fail");
                }
                else {
                    return _Alert(`${t("alert.clearEvent.error")} ${data.data}`,"fail");
                }
            })
    }

    return (<>
        <Button className="me-1" variant="outline-primary" onClick={()=>progressEvent(modalData.id)}>{t("modal.footer.toProgress")}</Button>
        <Button className="me-1" variant="outline-primary" onClick={()=>completedEvent(modalData.id)}>{t("modal.footer.toCompeleted")}</Button>
        <Button className="me-1" variant="outline-primary" onClick={()=>clearEvent(modalData.id)}>{t("modal.footer.toStand")}</Button>
        <Button className="me-1" variant="outline-secondary" onClick={()=>{
                setIsEdit(true);
                setModalTitleEdit(modalData.title);
                setModalContentEdit(modalData.content);
            }}>
            {t("modal.footer.edit")}
        </Button>
        {modalData.isDeleted &&
            <Button className="ms-1" variant="outline-danger" onClick={()=>recoverEvent(modalData.id)}>
                {t("modal.footer.recover")}
            </Button> 
        }
        {!modalData.isDeleted &&
            <Button className="ms-1" variant="outline-danger" onClick={()=>deleteAdminEvent(modalData.id)}>
                {t("modal.footer.delete")}
            </Button> 
        }
    </>)
}