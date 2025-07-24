import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { event, IModalData, voidEvent } from "../../interfaces";
import { sillo } from "../../sdk";

export function FooterAdminNoEdit({modalData,setIsEdit,setModalTitleEdit,setModalContentEdit,resetFeedback,handleClose}:{modalData:IModalData,setIsEdit:event,setModalTitleEdit:event,setModalContentEdit:event,resetFeedback:voidEvent,handleClose:voidEvent}) {
    
    const api = new sillo(localStorage.getItem("auth_token") as string);

    const { t } = useTranslation();

    const progressEvent = (id: number) => {
        api.putAdmin.progress(id)
            .then(data=>{
                if (data.result == "SUCCESS"){
                    alert(t("alert.progressEvent.success"));
                    resetFeedback();
                    handleClose();
                }
                else if (data.result == "FAIL" && data.data == "auth"){
                    return alert(t("alert.progressEvent.auth"));
                }
                else {
                    return alert(`${t("alert.progressEvent.error")} ${data.data}`);
                }
            })
    }

    const completedEvent = (id: number) => {
        api.putAdmin.compeleted(id)
            .then(data => {
                if (data.result == "SUCCESS"){
                    alert(t("alert.completedEvent.success"));
                    resetFeedback();
                    handleClose();
                }
                else if (data.result == "FAIL" && data.data == "auth"){
                    return alert(t("alert.completedEvent.auth"));
                }
                else {
                    return alert(`${t("alert.completedEvent.error")} ${data.data}`);
                }
            })
    }  

    const recoverEvent = (id: number) => {
        api.putAdmin.recover(id)
            .then(data => {
                if (data.result == "SUCCESS"){
                    alert(t("alert.recoverEvent.success"));
                    resetFeedback();
                    handleClose();
                }
                else if (data.result == "FAIL" && data.data == "auth"){
                    return alert(t("alert.recoverEvent.auth"));
                }
                else {
                    return alert(`${t("alert.recoverEvent.error")} ${data.data}`);
                }
            })
    }

    const deleteAdminEvent = (id: number) => {
        api.deleteAdmin.feedback(id)
            .then(data => {
                if (data.result == "SUCCESS"){
                    alert(t("alert.deleteAdminEvent.success"));
                    resetFeedback();
                    handleClose();
                }
                else if (data.result == "FAIL" && data.data == "auth"){
                    return alert(t("alert.deleteAdminEvent.auth"));
                }
                else {
                    return alert(`${t("alert.deleteAdminEvent.error")} ${data.data}`);
                }
            })
    }

    const clearEvent = (id: number) => {
        api.putAdmin.clear(id)
            .then(data=>{
                if (data.result == "SUCCESS"){
                    alert(t("alert.clearEvent.success"));
                    resetFeedback();
                    handleClose();
                }
                else if (data.result == "FAIL" && data.data == "auth"){
                    return alert(t("alert.clearEvent.auth"));
                }
                else {
                    return alert(`${t("alert.clearEvent.error")} ${data.data}`);
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