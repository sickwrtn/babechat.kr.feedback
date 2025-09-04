import './main.css'
import { Modal, Form, Badge, Button} from 'react-bootstrap';
import ReactMarkdown from "react-markdown";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkBreaks from "remark-breaks";
import "highlight.js/styles/a11y-dark.css";
import { ICategory, IFeedbakModal } from './interfaces';
import { sillo } from './sdk';
import { useTranslation } from 'react-i18next';
import { Header, Loading, Sick } from './component';
import { _Alert } from './function';

export default function FeedbackModal({modalData,extraData,show,isEdit,setIsEdit,handleClose,resetFeedback,isAdmin,modalUserId,modalIp,refreshModal}:IFeedbakModal){
    // i18n
    const { t } = useTranslation();

    // sdk 선언
    const api = new sillo(localStorage.getItem("auth_token") as string);
    
    /**
     * 피드백 제목 (편집)
     */
    const [modalTitleEdit, setModalTitleEdit] = useState<string>("");

    /**
     * 피드백 내용 (편집)
     */
    const [modalContentEdit, setModalContentEdit] = useState<string>("");

    /**
     * 피드백 제목 (편집) onChange
     */
    const modalTitleEditOnChange = (e:any) => setModalTitleEdit(e.target.value);

    /**
     * 피드백 내용 (편집) onChange
     */
    const modalContentEditOnChange = (e:any) => setModalContentEdit(e.target.value);

    /**
     * 피드백 제목 (편집) 유효성
     */
    const [modalTitleEditIsVaild, setModalTitleEditIsVaild] = useState<boolean>(false);

    /**
     * 피드백 내용 (편집) 유효성
     */
    const [ModalContentEditIsVaild, setModalContentEditIsVaild] = useState<boolean>(false);

    /**
     * 피드백 카테고리 (편집)
     */
    const [categoryEdit, setCategoryEdit] = useState<ICategory>(1);

    // 이게 뭐지?
    useEffect(()=>setCategoryEdit(modalData.category),[modalData.category]);
    
    /**
     * 피드백 카테고리 (편집) onChange
     */
    const categoryEditOnChange = (val: any) => setCategoryEdit(val);

    /**
     * 비밀번호
     */
    const [modalPassword,setModalPassword] = useState<string>("");

    /**
     * 비밀번호 유효성
     */
    const [modalPasswordIsVaild,setModalPasswordIsVaild] = useState<boolean>(false);

    /**
     * 비밀번호 onChange
     */
    const modalPasswordOnChange = (e: any) => setModalPassword(e.target.value);

    const editEvent = (id: number,title: string,content: string,category: ICategory,password: string) => {
        const modalPasswordValid = password.trim().length > 0;
        const modalTitleEditValid = title.trim().length > 0;
        const modalContentEditValid = content.trim().length > 0;
        setModalPasswordIsVaild(!modalPasswordValid);
        setModalTitleEditIsVaild(!modalTitleEditValid);
        setModalContentEditIsVaild(!modalContentEditValid);
        if (!modalPasswordValid || !modalTitleEditValid || !modalContentEditValid){
            return _Alert(t("alert.editEvent.vaild"),"fail");
        }
        api.put.edit(id,title,content,category,password)
            .then(data => {
                if (data.result == "SUCCESS"){
                    _Alert(t("alert.editEvent.success"),"success");
                    refreshModal()
                }
                else if (data.result == "FAIL" && data.data == "wrong password"){
                    return _Alert(t("alert.editEvent.wrongPassword"),"fail");
                }
                else {
                    return _Alert(`${t("alert.editEvent.error")} ${data.data}`,"fail");
                }
            })
    }

    const editAdminEvent = (id: number,title: string, content: string, category: ICategory) => {
        const modalTitleEditValid = title.trim().length > 0;
        const modalContentEditValid = content.trim().length > 0;
        setModalTitleEditIsVaild(!modalTitleEditValid);
        setModalContentEditIsVaild(!modalContentEditValid);
        if (!modalTitleEditValid || !modalContentEditValid){
            return _Alert(t("alert.editAdminEvent.vaild"),"fail");
        }
        api.putAdmin.edit(id,title,content,category)
            .then(data => {
                if (data.result == "SUCCESS"){
                    _Alert(t("alert.editAdminEvent.success"),"success");
                    refreshModal()
                }
                else if (data.result == "FAIL" && data.data == "auth"){
                    return _Alert(t("alert.editAdminEvent.auth"),"fail");
                }
                else {
                    return _Alert(`${t("alert.editAdminEvent.error")} ${data.data}`,"fail");
                }
            })
    }

    return (
    <Modal show={show} onHide={handleClose} size='lg' contentClassName="b-modal">
        <Modal.Header closeButton>
            {!modalData.isLoading && 
                <Header modalData={modalData} isEdit={isEdit} modalUserId={modalUserId} isAdmin={isAdmin} />
            }
        </Modal.Header>
        {modalData.isLoading &&
            <Loading />
        }
        {!modalData.isLoading &&
            <>
                <Modal.Body>
                    {!isAdmin &&  modalData.badge?.map((data)=>(
                        <Badge className="badge me-1" style={{cursor:"default"}} text="white" bg="secondary">{data}</Badge>
                    ))}
                    {isAdmin &&
                        <Sick.Badges modalData={modalData} resetFeedback={resetFeedback} handleClose={handleClose} />
                    }
                    { !isEdit &&
                    <>
                        <div className='b-content mt-2'>
                            <ReactMarkdown remarkPlugins={[remarkBreaks]}rehypePlugins={[rehypeHighlight,rehypeRaw]}>
                                {modalData.content}
                            </ReactMarkdown>
                        </div>
                        {(modalData.absorptionList?.length != 0) &&
                            <Sick.AbsorptionList modalData={modalData} extraData={extraData} isAdmin={isAdmin} refreshModal={refreshModal} />
                        }
                        {extraData.id != 0 &&
                            <Sick.Extra extraData={extraData}/>
                        }
                        <div className='b-footer mt-3'>
                            <Sick.Recommend modalData={modalData} refreshModal={refreshModal}/>
                            {isAdmin && 
                                <Sick.Ban modalUserId={modalUserId} modalIp={modalIp}/>
                            }
                            {isAdmin &&
                                <Sick.Absorption modalData={modalData} refreshModal={refreshModal}/>
                            }
                        </div>
                    </>
                    }
                    <Sick.Comment modalData={modalData} isAdmin={isAdmin} isEdit={isEdit} refreshModal={refreshModal}/>
                    { isEdit &&
                        <Sick.Edit modalTitleEdit={modalTitleEdit} categoryEdit={categoryEdit} modalTitleEditOnChange={modalTitleEditOnChange} modalTitleEditIsVaild={modalTitleEditIsVaild} modalContentEdit={modalContentEdit} modalContentEditOnChange={modalContentEditOnChange} ModalContentEditIsVaild={ModalContentEditIsVaild} categoryEditOnChange={categoryEditOnChange}/>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={()=>refreshModal()}>
                        refresh
                    </Button>
                    {!isAdmin &&
                        <Form.Control className="modalPassword" type="password" maxLength={12} placeholder={t("modal.password_placeholder")} value={modalPassword} onChange={modalPasswordOnChange} isInvalid={modalPasswordIsVaild} />
                    }
                    {isAdmin && 
                        <>
                            { !isEdit &&
                                <Sick.FooterAdminNoEdit modalData={modalData} setIsEdit={setIsEdit} setModalTitleEdit={setModalTitleEdit} setModalContentEdit={setModalContentEdit} resetFeedback={resetFeedback} handleClose={handleClose}/>
                            }
                            { isEdit &&
                                <Sick.FooterAdminEdit modalData={modalData} setIsEdit={setIsEdit} editAdminEvent={editAdminEvent} modalTitleEdit={modalTitleEdit} modalContentEdit={modalContentEdit} categoryEdit={categoryEdit} />
                            }
                        </>
                    }
                    {!isAdmin &&
                        <>
                            { !isEdit &&
                                <Sick.FooterEditButton modalData={modalData} setIsEdit={setIsEdit} setModalTitleEdit={setModalTitleEdit} setModalContentEdit={setModalContentEdit}/>
                            }
                            { isEdit &&
                                <Sick.FooterEdit modalData={modalData} setIsEdit={setIsEdit} editEvent={editEvent} modalTitleEdit={modalTitleEdit} modalContentEdit={modalContentEdit} categoryEdit={categoryEdit} modalPassword={modalPassword}/>
                            }
                            {!isEdit &&
                                <Sick.FooterDeleteButton modalData={modalData} modalPassword={modalPassword} setModalPasswordIsVaild={setModalPasswordIsVaild} resetFeedback={resetFeedback} handleClose={handleClose}/>
                            }
                        </>
                    }
                </Modal.Footer>
            </>
        }
    </Modal>
    )
}