import './main.css'
import { FormControl, Modal, Button, Form ,ToggleButton, ToggleButtonGroup, Badge, Spinner} from 'react-bootstrap';
import ReactMarkdown from "react-markdown";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkBreaks from "remark-breaks";
import "highlight.js/styles/a11y-dark.css";
import { ICategory, IFeedbakModal } from './interfaces';
import { sillo } from './sdk';
import { useNavigate } from 'react-router-dom';

export default function FeedbackModal({modalData,extraData,show,isEdit,setIsEdit,handleClose,resetFeedback,isAdmin,modalUserId,modalIp}:IFeedbakModal){

    const api = new sillo(localStorage.getItem("auth_token") as string);

    const navigate = useNavigate();
    
    const [modalTitleEdit, setModalTitleEdit] = useState<string>("");

    const [modalContentEdit, setModalContentEdit] = useState<string>("");

    const modalTitleEditOnChange = (e:any) => setModalTitleEdit(e.target.value);

    const modalContentEditOnChange = (e:any) => setModalContentEdit(e.target.value);

    const [modalTitleEditIsVaild, setModalTitleEditIsVaild] = useState<boolean>(false);

    const [ModalContentEditIsVaild, setModalContentEditIsVaild] = useState<boolean>(false);

    const [categoryEdit, setCategoryEdit] = useState<ICategory>(1);

    useEffect(()=>setCategoryEdit(modalData.category),[modalData.category]);
    
    const categoryEditOnChange = (val: any) => setCategoryEdit(val);

    const [modalPassword,setModalPassword] = useState<string>("");

    const [modalCommentEdit,setModalCommentEdit] = useState<string>("");

    const modalCommentEditOnChange = (e: any) => setModalCommentEdit(e.target.value);

    const [modalPasswordIsVaild,setModalPasswordIsVaild] = useState<boolean>(false);

    const modalPasswordOnChange = (e: any) => setModalPassword(e.target.value);

    const [isBageEditShow, setIsBageEditShow] = useState<boolean>(false);

    const [bageEdit,setBageEdit] = useState<string>("");

    const bageEditOnChange = (e:any) => setBageEdit(e.target.value); 

    const [isAbsorptionEditShow, setIsAbsorptionEditShow] = useState<boolean>(false);

    const [absorptionEdit,setAbsorptionEdit] = useState<string>("");

    const absorptionEditOnChange = (e:any) => setAbsorptionEdit(e.target.value);

    const [ban,setban] = useState<string>("1Hour");

    const banOnChange = (e:any) =>setban(e.target.value);

    const [isCommentEditShow,setIsCommentEditShow] = useState<boolean>(false);

    const likeEvent = (id: number) => {
        api.get.like(id)
            .then(data=>{
                if (data.result == "FAIL" && data.data == "already"){
                    return alert("한번만 가능합니다.");
                } 
                alert("추천되었습니다.");
                window.location.reload()
            })
    }

    const dislikeEvent = (id:number) => {
        api.get.dislike(id)
            .then(data=>{
                if (data.result == "FAIL" && data.data == "already"){
                    return alert("한번만 가능합니다.");
                }
                alert("비추천되었습니다.");
                window.location.reload()
            })
    }

    const badgeEvent = (id: number, bage: string[]) => {
        api.putAdmin.badge(id,bage)
            .then(data=> {
                if (data.result == "SUCCESS"){
                    alert("수정되었습니다.");
                    resetFeedback();
                    handleClose();
                }
                else {
                    return alert(`오류 ${data.data}`);
                }
            })
        setIsBageEditShow(false)
    }

    const absorptionEvent = (id: number,absorptionEdit: number) => {
        api.postAdmin.absorption(id,absorptionEdit)
            .then(data => {
                if (data.result == "FAIL"){
                    return alert("실패 " + data.data);
                }
                alert("병합 되었습니다!");
                window.location.reload();
            })
    }

    const absorptionDeleteEvent = (id: number, data: number) => {
        api.deleteAdmin.absorption(id,data)
            .then(data => {
                if (data.result == "FAIL"){
                    return alert("실패 " + data.data);
                }
                alert("병합 해제되었습니다!");
                window.location.reload();
            })
    }

    const banEvent = (userId: string,ip: string,ban: string) => {
        const reason = prompt("차단 사유를 입력해주세요.");
        api.postAdmin.ban(userId,ip,reason,banTime(ban))
            .then(data=>{
                if (data.result == "SUCCESS"){
                    alert("차단 되었습니다.");
                }
                else if (data.result == "FAIL" && data.data == "auth"){
                    return alert("권한이 없습니다.");
                }
                else {
                    return alert(`오류 ${data.data}`);
                }
            })
    }

    const commentEvent = (id: number, comment: string) => {
        api.postAdmin.comment(id,comment)
            .then(data => {
                if (data.result == "FAIL"){
                    return alert("권한이 없습니다.");
                }
                else if (data.result == "SUCCESS"){
                    alert("댓글 등록 성공!");
                    window.location.reload();
                }
            })
    }

    const progressEvent = (id: number) => {
        api.putAdmin.progress(id)
            .then(data=>{
                if (data.result == "SUCCESS"){
                    alert("진행중 탭으로 이동되었습니다.");
                    resetFeedback();
                    handleClose();
                }
                else if (data.result == "FAIL" && data.data == "auth"){
                    return alert("권한이 없습니다.");
                }
                else {
                    return alert(`오류 ${data.data}`);
                }
            })
    }

    const completedEvent = (id: number) => {
        api.putAdmin.compeleted(id)
            .then(data => {
                if (data.result == "SUCCESS"){
                    alert("완료 탭으로 이동되었습니다.");
                    resetFeedback();
                    handleClose();
                }
                else if (data.result == "FAIL" && data.data == "auth"){
                    return alert("권한이 없습니다.");
                }
                else {
                    return alert(`오류 ${data.data}`);
                }
            })
    }  

    const clearEvent = (id: number) => {
        api.putAdmin.clear(id)
            .then(data=>{
                if (data.result == "SUCCESS"){
                    alert("대기중 탭으로 이동되었습니다.");
                    resetFeedback();
                    handleClose();
                }
                else if (data.result == "FAIL" && data.data == "auth"){
                    return alert("권한이 없습니다.");
                }
                else {
                    return alert(`오류 ${data.data}`);
                }
            })
    }

    const recoverEvent = (id: number) => {
        api.putAdmin.recover(id)
            .then(data => {
                if (data.result == "SUCCESS"){
                    alert("복구되었습니다.");
                    resetFeedback();
                    handleClose();
                }
                else if (data.result == "FAIL" && data.data == "auth"){
                    return alert("권한이 없습니다.");
                }
                else {
                    return alert(`오류 ${data.data}`);
                }
            })
    }

    const deleteAdminEvent = (id: number) => {
        api.deleteAdmin.feedback(id)
            .then(data => {
                if (data.result == "SUCCESS"){
                    alert("삭제되었습니다.");
                    resetFeedback();
                    handleClose();
                }
                else if (data.result == "FAIL" && data.data == "auth"){
                    return alert("권한이 없습니다.");
                }
                else {
                    return alert(`오류 ${data.data}`);
                }
            })
    }

    const editAdminEvent = (id: number,title: string, content: string, category: ICategory) => {
        const modalTitleEditValid = title.trim().length > 0;
        const modalContentEditValid = content.trim().length > 0;
        setModalTitleEditIsVaild(!modalTitleEditValid);
        setModalContentEditIsVaild(!modalContentEditValid);
        if (!modalTitleEditValid || !modalContentEditValid){
            return alert("잘못된 양식입니다.");
        }
        api.putAdmin.edit(id,title,content,category)
            .then(data => {
                if (data.result == "SUCCESS"){
                    alert("편집되었습니다.");
                    window.location.reload()
                }
                else if (data.result == "FAIL" && data.data == "auth"){
                    return alert("권한이 없습니다.");
                }
                else {
                    return alert(`오류 ${data.data}`);
                }
            })
    }

    const deleteEvent = (id: number,password: string) => {
        const modalPasswordValid = password.trim().length > 0;
        setModalPasswordIsVaild(!modalPasswordValid);
        if (!modalPasswordValid){
            return alert("잘못된 양식입니다.");
        }
        api.delete.feedback(id,password)
            .then(data => {
                if (data.result == "SUCCESS"){
                    alert("삭제되었습니다.");
                    resetFeedback();
                    handleClose();
                }
                else if (data.result == "FAIL" && data.data == "wrong password"){
                    return alert("잘못된 비밀번호 입니다.");
                }
                else {
                    return alert(`오류 ${data.data}`);
                }
            })
    }

    const editEvent = (id: number,title: string,content: string,category: ICategory,password: string) => {
        const modalPasswordValid = password.trim().length > 0;
        const modalTitleEditValid = title.trim().length > 0;
        const modalContentEditValid = content.trim().length > 0;
        setModalPasswordIsVaild(!modalPasswordValid);
        setModalTitleEditIsVaild(!modalTitleEditValid);
        setModalContentEditIsVaild(!modalContentEditValid);
        if (!modalPasswordValid || !modalTitleEditValid || !modalContentEditValid){
            return alert("잘못된 양식입니다.");
        }
        api.put.edit(id,title,content,category,password)
            .then(data => {
                if (data.result == "SUCCESS"){
                    alert("편집되었습니다.");
                    window.location.reload()
                }
                else if (data.result == "FAIL" && data.data == "wrong password"){
                    return alert("잘못된 비밀번호 입니다.");
                }
                else {
                    return alert(`오류 ${data.data}`);
                }
            })
    }

    function banTime(ban: string): [number,number,number]{
        let answord: [number,number,number] = [0,0,0];
        switch (ban){
            case "1Hour":
                answord = [0,0,1];
                break
            case "3Hour":
                answord = [0,0,3];
                break
            case "6Hour":
                answord = [0,0,6];
                break
            case "12Hour":
                answord = [0,0,12];
                break
            case "1Day":
                answord = [0,1,0];
                break
            case "3Day":
                answord = [0,3,0];
                break
            case "7Day":
                answord = [0,7,0];
                break
            case "14Day":
                answord = [0,14,0];
                break
            case "1Month":
                answord = [1,0,0];
                break
            case "3Month":
                answord = [3,0,0];
                break
            case "6Month":
                answord = [6,0,0];
                break
            case "1Year":
                answord = [12,0,0];
                break
        }
        return answord
    }

    return (
    <Modal show={show} onHide={handleClose} size='lg' contentClassName="b-modal">
        <Modal.Header closeButton>
        {!modalData.isLoading && 
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
                {isEdit && "편집기"}
                </div>
                {<div style={{fontSize:"17px"}}>작성 시간 : {modalData.createdAt}</div>}
                {isAdmin && <div style={{fontSize:"17px"}}>UserId : {modalUserId}</div>}
            </Modal.Title>
            }
        </Modal.Header>
        {modalData.isLoading &&
            <Modal.Body className='modal-loading'>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Modal.Body>
        }
        {!modalData.isLoading &&
            <>
                <Modal.Body>
                    {!isAdmin &&  modalData.badge?.map((data)=>(
                        <Badge className="badge me-1" style={{cursor:"default"}} text="white" bg="secondary">{data}</Badge>
                    ))}
                    {isAdmin &&
                        <>
                            {!isBageEditShow && 
                                <>
                                    <div className='badge-group'>
                                        {modalData.badge?.map((data)=>(
                                            <Badge className="badge me-1" style={{cursor:"default"}} text="white" bg="secondary">{data}</Badge>
                                        ))}
                                        <Badge className="badge" style={{cursor:"pointer"}} text="white" bg="primary" onClick={()=>{
                                                setIsBageEditShow(true);
                                                setBageEdit((modalData.badge as string[]).join(","));
                                            }}>배지 수정</Badge>
                                    </div>
                                </>
                            }
                            {isBageEditShow && 
                                <>
                                    <FormControl type="text" placeholder="수정" as="textarea" rows={1} value={bageEdit} onChange={bageEditOnChange}/>
                                    <Button className="mt-2" size='sm' variant="success" onClick={()=>badgeEvent(modalData.id,bageEdit.split(","))}>등록</Button>
                                </>
                            }
                        </>
                    }
                    { !isEdit &&
                    <>
                        <div className='b-content mt-2'>
                            <ReactMarkdown remarkPlugins={[remarkBreaks]}rehypePlugins={[rehypeHighlight,rehypeRaw]}>
                                {modalData.content}
                            </ReactMarkdown>
                        </div>
                        {(modalData.absorptionList?.length != 0) &&
                            <div>
                                {!isAbsorptionEditShow && modalData.absorptionList?.map(data => 
                                    <>
                                        { !isAdmin &&
                                            <>
                                                { data == String(extraData.id) &&
                                                    <Badge className="me-1" style={{cursor:"pointer"}} onClick={()=>navigate(`/?id=${modalData.id}`)} bg="success">⇄ #{data}과 병합됨</Badge>
                                                }
                                                { data != String(extraData.id) &&
                                                    <Badge className="me-1" style={{cursor:"pointer"}} onClick={()=>navigate(`/?id=${modalData.id}&ext=${data}`,{replace:false})} bg="primary">⇄ #{data}과 병합됨</Badge>
                                                }
                                            </>
                                        }
                                        { isAdmin &&
                                            <>
                                                { data == String(extraData.id) &&
                                                    <Badge className="me-1" style={{cursor:"pointer"}} onClick={()=>navigate(`/sick/admin?id=${modalData.id}`)} bg="success">⇄ #{data}과 병합됨</Badge>
                                                }
                                                { data != String(extraData.id) &&
                                                    <Badge className="me-1" style={{cursor:"pointer"}} onClick={()=>navigate(`/sick/admin?id=${modalData.id}&ext=${data}`,{replace:false})} bg="primary">⇄ #{data}과 병합됨</Badge>
                                                }
                                            </>
                                        }
                                    </>
                                )}
                                {isAdmin && 
                                    <>
                                        {isAbsorptionEditShow && 
                                            <>
                                                {modalData.absorptionList?.map(data => 
                                                    <Badge className="me-1" style={{cursor:"pointer"}} bg="danger" onClick={()=>absorptionDeleteEvent(modalData.id,Number(data))}>X #{data}과 병합됨</Badge>
                                                )}
                                                <Badge className="me-1" style={{cursor:"pointer"}} bg="danger" onClick={()=>setIsAbsorptionEditShow(false)}>닫기</Badge>
                                            </>
                                        }
                                        {!isAbsorptionEditShow &&
                                            <Badge style={{cursor:"pointer"}} bg="danger" onClick={()=>setIsAbsorptionEditShow(true)}>병합 수정</Badge>
                                        }
                                    </>
                                }
                            </div>
                        }
                        {extraData.id != 0 &&
                            <>
                                <h2 className='mt-2'>#{extraData.id}과 병합됨</h2>
                                <div className='b-content mt-2 border p-2 rounded'>
                                    <div className='mb-2'>제목 : {extraData.title}</div>
                                    <ReactMarkdown remarkPlugins={[remarkBreaks]}rehypePlugins={[rehypeHighlight,rehypeRaw]}>
                                        {extraData.content}
                                    </ReactMarkdown>
                                </div>
                            </>
                        }
                        <div className='b-footer mt-3'>
                            <Button className="me-1" variant="outline-danger" onClick={()=>dislikeEvent(modalData.id)}>
                                비추천 : {modalData.dislikeCount}
                            </Button>
                            <Button className="ms-1" variant="outline-success" onClick={()=>likeEvent(modalData.id)}>
                                추천 : {modalData.likeCount}
                            </Button>
                            {isAdmin && 
                                <>
                                        <div className='ban-container d-flex justify-content-center mt-3'>
                                            <Form.Select className="ban" defaultValue={"1Hour"} onChange={banOnChange}>
                                                <option value="1Hour">1시간</option>
                                                <option value="3Hour">2시간</option>
                                                <option value="6Hour">6시간</option>
                                                <option value="12Hour">12시간</option>
                                                <option value="1Day">1일</option>
                                                <option value="3Day">3일</option>
                                                <option value="7Day">7일</option>
                                                <option value="14Day">14일</option>
                                                <option value="1Month">1개월</option>
                                                <option value="3Month">3개월</option>
                                                <option value="6Month">6개월</option>
                                                <option value="1Year">1년</option>
                                            </Form.Select>
                                            <Button variant="outline-danger" className="ms-1" onClick={()=>banEvent(modalUserId,modalIp,ban)}>차단</Button>
                                        </div>
                                </>
                            }
                            {isAdmin &&
                            <div className='mt-3 d-flex justify-content-center'>
                                <FormControl className="AES me-2" type="text" placeholder="병합될 게시물 ID를 입력해주세요." value={absorptionEdit} onChange={absorptionEditOnChange}/>
                                <Button variant="outline-success" size='sm' onClick={()=>absorptionEvent(modalData.id,Number(absorptionEdit))}>병합</Button>
                            </div>
                            }
                        </div>
                    </>
                    }
                    { (!isAdmin && !isEdit) &&
                        <>
                        { modalData.comment != null &&
                            <>
                                <div className='d-flex'>
                                    <h3 className='me-2'>운영팀의 코멘트</h3>
                                    <img style={{height:"32px",marginTop:"3px"}} src="https://www.babechat.ai/assets/svgs/babechat.svg" />
                                </div>
                                <div className='border p-2 mt-2 rounded' style={{minHeight:"120px"}}>
                                    <div className='aptx'>
                                        <ReactMarkdown remarkPlugins={[remarkBreaks]} rehypePlugins={[rehypeHighlight,rehypeRaw]}>{modalData.comment}</ReactMarkdown>
                                    </div>
                                </div>
                            </>
                        }
                        </>
                    }
                    { (isAdmin && !isEdit) &&
                        <>
                            { (modalData.comment != null && !isCommentEditShow) &&
                                <>
                                    <div className='d-flex mt-3'>
                                        <h3 className='me-2'>운영팀의 코멘트</h3>
                                        <img style={{height:"32px",marginTop:"3px"}} src="https://www.babechat.ai/assets/svgs/babechat.svg" />
                                    </div>
                                    <div className='border p-2 mt-2 rounded' style={{minHeight:"120px"}}>
                                        <div className='aptx'>
                                            <ReactMarkdown remarkPlugins={[remarkBreaks]} rehypePlugins={[rehypeHighlight,rehypeRaw]}>{modalData.comment}</ReactMarkdown>
                                        </div>
                                    </div>
                                    <Button variant='outline-info'className='float-end mt-2' onClick={()=>{setIsCommentEditShow(true); setModalCommentEdit(modalData.comment as string)}}>수정</Button>
                                </>
                            }
                            { (modalData.comment == null || isCommentEditShow) &&
                                <Form.Group className="mb-3 mt-3" controlId="exampleForm.ControlTextarea1">
                                    <Form.Label className="float-start h3">댓글</Form.Label>
                                    <Form.Control className='mt-2' as="textarea" rows={5} value={modalCommentEdit} onChange={modalCommentEditOnChange}/> 
                                    <Button variant='outline-success'className='float-end mt-2' onClick={()=>commentEvent(modalData.id,modalCommentEdit)}>등록</Button>
                                    { isCommentEditShow &&
                                        <Button variant='outline-danger me-2'className='float-end mt-2' onClick={()=>setIsCommentEditShow(false)}>닫기</Button>
                                    }
                                </Form.Group>
                            }
                        </>
                    }
                    { isEdit &&
                        <Form.Group className="m-4">
                            <Form.Label>제목</Form.Label>
                            <FormControl type="text" placeholder="제목은 직관적이게 작성해주세요." maxLength={20} value={modalTitleEdit} onChange={modalTitleEditOnChange} isInvalid={modalTitleEditIsVaild}/>
                            <Form.Text className="text-muted text-end d-block">{modalTitleEdit.length}/20</Form.Text>
                            <Form.Label>내용</Form.Label>
                            <FormControl type="text" placeholder="건의사항을 구체적으로 적어주세요.&#10;마크다운을 지원합니다!&#10;![](이미지링크)" maxLength={65000} as="textarea" rows={10} value={modalContentEdit} onChange={modalContentEditOnChange} isInvalid={ModalContentEditIsVaild}/>
                            <Form.Text className="text-muted text-end d-block">{modalTitleEdit.length}/65000</Form.Text>
                            <ToggleButtonGroup className="d-inline-flex" type="radio" name="options2" defaultValue={1} value={categoryEdit} onChange={categoryEditOnChange}>
                                <ToggleButton id="tbg-btn2-1" variant='outline-secondary' value={1}>
                                    개선
                                </ToggleButton>
                                <ToggleButton id="tbg-btn2-2" variant='outline-secondary' value={2}>
                                    버그
                                </ToggleButton>
                                <ToggleButton id="tbg-btn2-3" variant='outline-secondary' value={3}>
                                    기타
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Form.Group>
                    }
                </Modal.Body>
                <Modal.Footer>
                    {!isAdmin &&
                        <Form.Control className="modalPassword" type="password" maxLength={12} placeholder="비밀번호" value={modalPassword} onChange={modalPasswordOnChange} isInvalid={modalPasswordIsVaild} />
                    }
                    {isAdmin && 
                        <>
                            { !isEdit &&
                                <>
                                    <Button className="me-1" variant="outline-primary" onClick={()=>progressEvent(modalData.id)}>진행중 탭으로 이동</Button>
                                    <Button className="me-1" variant="outline-primary" onClick={()=>completedEvent(modalData.id)}>완료 탭으로 이동</Button>
                                    <Button className="me-1" variant="outline-primary" onClick={()=>clearEvent(modalData.id)}>대기중 탭으로 이동</Button>
                                    <Button className="me-1" variant="outline-secondary" onClick={()=>{
                                            setIsEdit(true);
                                            setModalTitleEdit(modalData.title);
                                            setModalContentEdit(modalData.content);
                                        }}>
                                        편집
                                    </Button>
                                    {modalData.isDeleted &&
                                        <Button className="ms-1" variant="outline-danger" onClick={()=>recoverEvent(modalData.id)}>
                                            복구
                                        </Button> 
                                    }
                                    {!modalData.isDeleted &&
                                        <Button className="ms-1" variant="outline-danger" onClick={()=>deleteAdminEvent(modalData.id)}>
                                            삭제
                                        </Button> 
                                    }
                                </>
                            }
                            { isEdit &&
                                <>
                                    <Button className="me-1" variant="outline-danger" onClick={()=>setIsEdit(false)}>
                                        닫기
                                    </Button>
                                    <Button className="me-1" variant="outline-success" onClick={()=>editAdminEvent(modalData.id,modalTitleEdit,modalContentEdit,categoryEdit)}>
                                        제출
                                    </Button>
                                </>
                            }
                        </>
                    }
                    {!isAdmin &&
                        <>
                            { !isEdit &&
                            <Button className="me-1" variant="outline-secondary" onClick={()=>{
                                    setIsEdit(true);
                                    setModalTitleEdit(modalData.title);
                                    setModalContentEdit(modalData.content);
                                }}>
                                편집
                            </Button>
                            }
                            { isEdit &&
                                <>
                                    <Button className="me-1" variant="outline-danger" onClick={()=>setIsEdit(false)}>
                                        닫기
                                    </Button>
                                    <Button className="me-1" variant="outline-success" onClick={()=>editEvent(modalData.id,modalTitleEdit,modalContentEdit,categoryEdit,modalPassword)}>
                                        제출
                                    </Button>
                                </>
                            }
                            {!isEdit &&
                                <Button className="ms-1" variant="outline-danger" onClick={()=>deleteEvent(modalData.id,modalPassword)}>
                                    삭제
                                </Button> 
                            }
                        </>
                    }
                </Modal.Footer>
            </>
        }
    </Modal>
    )
}