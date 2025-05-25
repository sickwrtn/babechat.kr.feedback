import './main.css'
import { FormControl, Modal, Button, Form ,ToggleButton, ToggleButtonGroup, Badge, Spinner} from 'react-bootstrap';
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
interface IFeedbakModal{
    show: boolean,
    isEdit: boolean,
    setIsEdit: (e:boolean)=>void,
    handleClose: ()=>void,
    modalTitle: string,
    modalBadge: string[] | undefined,
    modalContent: string,
    modalId: number,
    modalLikeCount: number,
    setModalLikeCount: (e:number)=>void,
    modalDislikeCount: number,
    modalIsDeleted: boolean,
    setModalDislikeCount: (e:number)=>void,
    resetFeedback: ()=>void,
    isAdmin: boolean,
    modalUserId: string,
    modalIsLoading: boolean,
    modalIp: string
}

export default function FeedbackModal({show,isEdit,setIsEdit,handleClose,modalTitle,modalBadge,modalContent,modalId,modalLikeCount,setModalLikeCount,modalDislikeCount,setModalDislikeCount,modalIsDeleted,resetFeedback,isAdmin,modalUserId,modalIsLoading,modalIp}:IFeedbakModal){

    const [modalTitleEdit, setModalTitleEdit] = useState<string>("");

    const [modalContentEdit, setModalContentEdit] = useState<string>("");

    const modalTitleEditOnChange = (e:any) => setModalTitleEdit(e.target.value);

    const modalContentEditOnChange = (e:any) => setModalContentEdit(e.target.value);

    const [modalTitleEditIsVaild, setModalTitleEditIsVaild] = useState<boolean>(false);

    const [ModalContentEditIsVaild, setModalContentEditIsVaild] = useState<boolean>(false);

    const [categoryEdit, setCategoryEdit] = useState<1 | 2 | 3>(1);
    
    const categoryEditOnChange = (val: any) => setCategoryEdit(val);

    const [modalPassword,setModalPassword] = useState<string>("");

    const [modalPasswordIsVaild,setModalPasswordIsVaild] = useState<boolean>(false);

    const modalPasswordOnChange = (e: any) => setModalPassword(e.target.value);

    const [isBageEditShow, setIsBageEditShow] = useState<boolean>(false);

    const [bageEdit,setBageEdit] = useState<string>("");
    
    const bageEditOnChange = (e:any) => setBageEdit(e.target.value); 

    const [ban,setban] = useState<string>("1Hour");

    const banOnChange = (e:any) =>setban(e.target.value);

    function banTime(ban: string){
        let answord = [0,0,0];
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
        {!modalIsLoading && <Modal.Title className='fw-bold' style={{overflow:"hidden"}}>{!isEdit && modalTitle}{isEdit && "편집기"}{isAdmin && <p style={{fontSize:"17px"}}>UserId : {modalUserId}</p>}</Modal.Title>}
        </Modal.Header>
        {modalIsLoading &&
            <Modal.Body className='modal-loading'>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Modal.Body>
        }
        {!modalIsLoading &&
            <>
                <Modal.Body>
                    {!isAdmin &&  modalBadge?.map((data)=>(
                        <Badge className="badge me-1" style={{cursor:"default"}} text="white" bg="secondary">{data}</Badge>
                    ))}
                    {isAdmin &&
                        <>
                            {!isBageEditShow && 
                            <>
                                <div className='badge-group'>
                                    {modalBadge?.map((data)=>(
                                        <Badge className="badge me-1" style={{cursor:"default"}} text="white" bg="secondary">{data}</Badge>
                                    ))}
                                    <Badge className="badge" style={{cursor:"pointer"}} text="white" bg="primary" onClick={()=>{
                                            setIsBageEditShow(true);
                                            setBageEdit((modalBadge as string[]).join(","));
                                        }}>배지 수정</Badge>
                                </div>
                            </>
                            }
                            {isBageEditShow && 
                                <>
                                    <FormControl type="text" placeholder="수정" as="textarea" rows={1} value={bageEdit} onChange={bageEditOnChange}/>
                                    <Button className="mt-2" size='sm' variant="success" onClick={()=>{
                                        fetch(`https://babe-api.fastwrtn.com/admin/badge?id=${modalId}`,{method:"PUT",headers:{"Content-Type" : "application/json","Authorization":localStorage.getItem("auth_token") as string},body:JSON.stringify({
                                            badge:bageEdit.split(",")
                                        })})
                                            .then(res => res.json())
                                            .then((data:any) => {
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
                                    }}>등록</Button>
                                </>
                            }
                        </>
                    }
                    { !isEdit &&
                    <>
                        <div className='b-content mt-2'>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {modalContent.replace(/\n/gi,"\n\n")}
                            </ReactMarkdown>
                        </div>
                        <div className='b-footer'>
                            <Button className="me-1" variant="outline-danger" onClick={()=>{
                                fetch(`https://babe-api.fastwrtn.com/dislike?id=${modalId}`,{headers:{"Authorization":localStorage.getItem("auth_token") as string}})
                                    .then(res => res.json())
                                    .then(data => {
                                        if (data.result == "FAIL" && data.data == "already"){
                                            return alert("한번만 가능합니다.");
                                        } 
                                        setModalDislikeCount(modalDislikeCount+1);
                                        alert("비추천되었습니다.");
                                        resetFeedback();
                                    })
                                resetFeedback();
                            }}>
                                비추천 : {modalDislikeCount}
                            </Button>
                            <Button className="ms-1" variant="outline-success" onClick={()=>{
                                fetch(`https://babe-api.fastwrtn.com/like?id=${modalId}`,{headers:{"Authorization":localStorage.getItem("auth_token") as string}})
                                    .then(res => res.json())
                                    .then(data => {
                                        if (data.result == "FAIL" && data.data == "already"){
                                            return alert("한번만 가능합니다.");
                                        } 
                                        setModalLikeCount(modalLikeCount+1);
                                        alert("추천되었습니다.");
                                        resetFeedback();
                                    })
                            }}>
                                추천 : {modalLikeCount}
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
                                            <Button variant="outline-danger" className="ms-1" onClick={()=>{
                                                const reason = prompt("차단 사유를 입력해주세요.");
                                                fetch(`https://babe-api.fastwrtn.com/admin/ban`,{method:"POST",headers:{"Content-Type" : "application/json","Authorization":localStorage.getItem("auth_token") as string},body:JSON.stringify({
                                                    userId:modalUserId,
                                                    ip:modalIp,
                                                    reason:reason,
                                                    month:banTime(ban)[0],
                                                    day:banTime(ban)[1],
                                                    hour:banTime(ban)[2]
                                                })})
                                                    .then(res => res.json())
                                                    .then((data:any) => {
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
                                            }}>차단</Button>
                                        </div>
                                        <Form.Group className="mb-3 mt-3" controlId="exampleForm.ControlTextarea1">
                                            <Form.Label className="float-start">댓글</Form.Label>
                                            <Form.Control as="textarea" rows={3} /> 
                                        </Form.Group>
                                </>
                            }
                        </div>
                    </>
                    }
                    { isEdit &&
                        <Form.Group className="m-4">
                            <Form.Label>제목</Form.Label>
                            <FormControl type="text" className='mb-3' placeholder="제목은 직관적이게 써주세요." value={modalTitleEdit} onChange={modalTitleEditOnChange} isInvalid={modalTitleEditIsVaild}/>
                            <Form.Label>내용</Form.Label>
                            <FormControl type="text" className='mb-2' placeholder="건의사항을 구체적으로 적어주세요. (마크다운 사용 가능)" as="textarea" rows={5} value={modalContentEdit} onChange={modalContentEditOnChange} isInvalid={ModalContentEditIsVaild}/>
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
                        <Form.Control className="modalPassword" type="password" placeholder="비밀번호" value={modalPassword} onChange={modalPasswordOnChange} isInvalid={modalPasswordIsVaild} />
                    }
                    {isAdmin && 
                        <>
                            { !isEdit &&
                                <>
                                    <Button className="me-1" variant="outline-primary" onClick={()=>{
                                        fetch(`https://babe-api.fastwrtn.com/admin/progress?id=${modalId}`,{method:"PUT",headers:{"Content-Type" : "application/json","Authorization":localStorage.getItem("auth_token") as string},body:JSON.stringify({})})
                                            .then(res => res.json())
                                            .then((data:any) => {
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
                                    }}>진행중 탭으로 이동</Button>
                                    <Button className="me-1" variant="outline-primary" onClick={()=>{
                                        fetch(`https://babe-api.fastwrtn.com/admin/compeleted?id=${modalId}`,{method:"PUT",headers:{"Content-Type" : "application/json","Authorization":localStorage.getItem("auth_token") as string},body:JSON.stringify({})})
                                            .then(res => res.json())
                                            .then((data:any) => {
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
                                    }}>완료 탭으로 이동</Button>
                                    <Button className="me-1" variant="outline-primary" onClick={()=>{
                                        fetch(`https://babe-api.fastwrtn.com/admin/clear?id=${modalId}`,{method:"PUT",headers:{"Content-Type" : "application/json","Authorization":localStorage.getItem("auth_token") as string},body:JSON.stringify({})})
                                            .then(res => res.json())
                                            .then((data:any) => {
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
                                    }}>대기중 탭으로 이동</Button>
                                    <Button className="me-1" variant="outline-secondary" onClick={()=>{
                                            setIsEdit(true);
                                            setModalTitleEdit(modalTitle);
                                            setModalContentEdit(modalContent);
                                        }}>
                                        편집
                                    </Button>
                                    {modalIsDeleted &&
                                        <Button className="ms-1" variant="outline-danger" onClick={()=>{
                                            fetch(`https://babe-api.fastwrtn.com/admin/undeleted?id=${modalId}`,{method:"PUT",headers:{"Content-Type" : "application/json","Authorization":localStorage.getItem("auth_token") as string},body:JSON.stringify({})})
                                                .then(res => res.json())
                                                .then((data:any) => {
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
                                        }}>
                                            복구
                                        </Button> 
                                    }
                                    {!modalIsDeleted &&
                                        <Button className="ms-1" variant="outline-danger" onClick={()=>{
                                            fetch(`https://babe-api.fastwrtn.com/admin/feedback?id=${modalId}`,{method:"DELETE",headers:{"Content-Type" : "application/json","Authorization":localStorage.getItem("auth_token") as string},body:JSON.stringify({})})
                                                .then(res => res.json())
                                                .then((data:any) => {
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
                                        }}>
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
                                    <Button className="me-1" variant="outline-success" onClick={()=>{
                                        const modalTitleEditValid = modalTitleEdit.trim().length > 0;
                                        const modalContentEditValid = modalContentEdit.trim().length > 0;
                                        setModalTitleEditIsVaild(!modalTitleEditValid);
                                        setModalContentEditIsVaild(!modalContentEditValid);
                                        fetch(`https://babe-api.fastwrtn.com/admin/feedback?id=${modalId}`,{method:"PUT",headers:{"Content-Type" : "application/json","Authorization":localStorage.getItem("auth_token") as string},body:JSON.stringify({
                                            title:modalTitleEdit,
                                            content:modalContentEdit,
                                            category:categoryEdit
                                        })})
                                            .then(res => res.json())
                                            .then((data:any) => {
                                                if (data.result == "SUCCESS"){
                                                    alert("편집되었습니다.");
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
                                    }}>
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
                                    setModalTitleEdit(modalTitle);
                                    setModalContentEdit(modalContent);
                                }}>
                                편집
                            </Button>
                            }
                            { isEdit &&
                                <>
                                    <Button className="me-1" variant="outline-danger" onClick={()=>setIsEdit(false)}>
                                        닫기
                                    </Button>
                                    <Button className="me-1" variant="outline-success" onClick={()=>{
                                        const modalPasswordValid = modalPassword.trim().length > 0;
                                        const modalTitleEditValid = modalTitleEdit.trim().length > 0;
                                        const modalContentEditValid = modalContentEdit.trim().length > 0;
                                        setModalPasswordIsVaild(!modalPasswordValid);
                                        setModalTitleEditIsVaild(!modalTitleEditValid);
                                        setModalContentEditIsVaild(!modalContentEditValid);
                                        if (!modalPasswordValid){
                                            return alert("잘못된 양식입니다.");
                                        }
                                        fetch(`https://babe-api.fastwrtn.com/feedback?id=${modalId}`,{method:"PUT",headers:{"Content-Type" : "application/json"},body:JSON.stringify({
                                            title:modalTitleEdit,
                                            content:modalContentEdit,
                                            category:categoryEdit,
                                            password:modalPassword
                                        })})
                                            .then(res => res.json())
                                            .then((data:any) => {
                                                if (data.result == "SUCCESS"){
                                                    alert("편집되었습니다.");
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
                                    }}>
                                        제출
                                    </Button>
                                </>
                            }
                            {!isEdit &&
                                <Button className="ms-1" variant="outline-danger" onClick={()=>{
                                    const modalPasswordValid = modalPassword.trim().length > 0;
                                    setModalPasswordIsVaild(!modalPasswordValid);
                                    if (!modalPasswordValid){
                                        return alert("잘못된 양식입니다.");
                                    }
                                    fetch(`https://babe-api.fastwrtn.com/feedback?id=${modalId}`,{method:"DELETE",headers:{"Content-Type" : "application/json"},body:JSON.stringify({
                                        password:modalPassword
                                    })})
                                        .then(res => res.json())
                                        .then((data:any) => {
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
                                }}>
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