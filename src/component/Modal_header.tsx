import { Modal } from "react-bootstrap";
import { IHeader } from "../interfaces";
import { useTranslation } from "react-i18next";

export function Header({modalData,isEdit,modalUserId,isAdmin}:IHeader){
    
    const { t } = useTranslation();
    
    return (
    <>
        <Modal.Title style={{overflow:"hidden"}}>
            <div className='d-flex fw-bold'>
            {!isEdit && 
                <>
                    {modalData.title}
                    <div className='text-muted'>
                        #{modalData.id}
                    </div>
                </>
            }
            {isEdit && t("modal.editer.editer")}
            </div>
            {<div style={{fontSize:"17px"}}>{t("modal.createdAt")} : {modalData.createdAt}</div>}
            {isAdmin && <div style={{fontSize:"17px"}}>UserId : {modalUserId}</div>}
        </Modal.Title>
    </>)
}