
import { useTranslation } from "react-i18next";
import { Comment_ } from "./Comment_";
import { Button, Form } from "react-bootstrap";
import { IModalData } from "../../interfaces";
import { sillo } from "../../sdk";
import { useState } from "react";

/**
 * Modal 댓글 수정
 */
export function CommentEdit_({modalData}:{modalData: IModalData}) {
    
    const api = new sillo(localStorage.getItem("auth_token") as string);

    const { t } = useTranslation();
    
    const [isCommentEditShow,setIsCommentEditShow] = useState<boolean>(false);

    const [modalCommentEdit,setModalCommentEdit] = useState<string>("");

    const modalCommentEditOnChange = (e: any) => setModalCommentEdit(e.target.value);

    const commentEvent = (id: number, comment: string) => {
        api.postAdmin.comment(id,comment)
            .then(data => {
                if (data.result == "FAIL"){
                    return alert(t("alert.commentEvent.auth"));
                }
                else if (data.result == "SUCCESS"){
                    alert(t("alert.commentEvent.success"));
                    window.location.reload();
                }
            })
    }
    
    return (
        <>
            { (modalData.comment != null && !isCommentEditShow) &&
                <>
                    <Comment_ modalData={modalData}/>
                    <Button variant='outline-info'className='float-end mt-2' onClick={()=>{setIsCommentEditShow(true); setModalCommentEdit(modalData.comment as string)}}>{t("modal.commentEdit")}</Button>
                </>
            }
            { (modalData.comment == null || isCommentEditShow) &&
                <Form.Group className="mb-3 mt-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label className="float-start h3">{t("modal._comment")}</Form.Label>
                    <Form.Control className='mt-2' as="textarea" rows={5} value={modalCommentEdit} onChange={modalCommentEditOnChange}/> 
                    <Button variant='outline-success'className='float-end mt-2' onClick={()=>commentEvent(modalData.id,modalCommentEdit)}>{t("modal.commentEdit_sumbit")}</Button>
                    { isCommentEditShow &&
                        <Button variant='outline-danger me-2'className='float-end mt-2' onClick={()=>setIsCommentEditShow(false)}>{t("modal.commentEdit_close")}</Button>
                    }
                </Form.Group>
            }
        </>
    )
}