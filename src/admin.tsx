import './main.css'
import { FormControl, Modal, Button, Form ,ToggleButton, ToggleButtonGroup, Badge} from 'react-bootstrap';
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

const parseJwt = (token: string) => {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

function Admin() {
    if (localStorage.getItem("auth_token") == null){
        fetch("https://babe-api.fastwrtn.com/auth",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({})})
            .then(res=>res.json())
            .then(data => {
                localStorage.setItem("auth_token",data.data);
            })
    }
    if (!parseJwt(localStorage.getItem("auth_token") as string).admin){
        const [adminPassword,setAdminPassword] = useState("");
        const adminPasswordOnChange = (e: any) => setAdminPassword(e.target.value)
        const adminFormOnClick = (adminPassword: string) => {
            fetch("https://babe-api.fastwrtn.com/auth",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
                password:adminPassword
            })})
            .then(res=>res.json())
            .then(data => {
                localStorage.setItem("auth_token",data.data);
                window.location.reload();
            })
        }
        return(<>
        <Form.Group style={{marginLeft:"5%",marginTop:"1%"}}>
            <Form.Label>비밀번호</Form.Label>
            <FormControl type="text" className='mb-3' style={{width:"40%"}} placeholder="관리자 비밀키를 입력해주세요." value={adminPassword} onChange={adminPasswordOnChange}/>
            <Button variant="success" id="button-addon1" onClick={()=>adminFormOnClick(adminPassword)}>제출</Button>
        </Form.Group>
        </>)
    }

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);

    const handleShow = (id: number, title: string, content: string, likeCount: number, dislikeCount: number, isDeleted: boolean) => {
        setModalTitle(title);
        setModalContent(content);
        setModalId(id);
        setModalLikeCount(likeCount);
        setModalDislikeCount(dislikeCount);
        setModalIsDeleted(isDeleted);
        setShow(true);
        setIsEdit(false);
    };

    const [title,setTitle] = useState("");

    const [content,setContent] = useState("");
    
    const [password,setPassword] = useState("");

    const titleOnChange = (e: any) => setTitle(e.target.value);

    const contentOnChange = (e: any) => setContent(e.target.value);

    const passwordOnChange = (e: any) => setPassword(e.target.value);

    const [feedback, setFeedback] = useState([] as any[]);

    const [modalTitle, setModalTitle] = useState("");

    const [modalContent,setModalContent] = useState("");

    const [modalId, setModalId] = useState(0);

    const [modalLikeCount, setModalLikeCount] = useState(0);
    
    const [modalDislikeCount, setModalDislikeCount] = useState(0);

    const [modalIsDeleted, setModalIsDeleted] = useState(false);

    const [titleIsVaild,setTitleVaild] = useState(false);

    const [contentIsVaild,setContentVaild] = useState(false);

    const [passwordIsVaild,setPasswordVaild] = useState(false);

    const [isEdit,setIsEdit] = useState(false);

    const [modalTitleEdit, setModalTitleEdit] = useState("");

    const [modalContentEdit, setModalContentEdit] = useState("");

    const modalTitleEditOnChange = (e:any) => setModalTitleEdit(e.target.value);

    const modalContentEditOnChange = (e:any) => setModalContentEdit(e.target.value);

    const [modalTitleEditIsVaild, setModalTitleEditIsVaild] = useState(false);

    const [ModalContentEditIsVaild, setModalContentEditIsVaild] = useState(false);

    const [category, setCategory] = useState(1);

    const categoryOnChange = (val: any) => setCategory(val);

    const [categoryEdit, setCategoryEdit] = useState(1);

    const categoryEditOnChange = (val: any) => setCategoryEdit(val);

    const [selectFilter, setSelectFilter] = useState("likeCount");

    const selectFilterOnChange = (val: any) => setSelectFilter(val.target.value);

    const [recaptchaToken, setRecaptchaToken] = useState(null);

    const recaptchaOnChange = (val: any) => setRecaptchaToken(val);

    const recaptchaRef = useRef(null as any);

    const resetRecaptcha = () => {
        if (recaptchaRef.current) {
        recaptchaRef.current.reset(); // reCAPTCHA 체크박스 초기화
        setRecaptchaToken(null); // 저장된 토큰도 초기화
        }
    };

    useEffect(()=>{
        fetch("https://babe-api.fastwrtn.com/feedback")
            .then(res => res.json())
            .then(data => setFeedback(data.data))
    },[])

    async function formOnClick(title:string,content:string,category: number, password:string,recaptchaToken: string | null){
        const titleValid = title.trim().length > 0;
        const contentValid = content.trim().length > 0;
        const passwordValid = password.trim().length > 0;
    // 유효성 상태 업데이트
        setTitleVaild(!titleValid);
        setContentVaild(!contentValid);
        setPasswordVaild(!passwordValid);
        if (!titleValid || !contentValid || !passwordValid){
            return alert("잘못된 양식입니다.");
        }

        const res = await fetch("https://babe-api.fastwrtn.com/recaptcha",{method:"POST",headers:{"Content-Type" : "application/json"},body:JSON.stringify({
            recaptchaToken:recaptchaToken
        })})
        const res_json: any = await res.json();
        if (!(res_json.result == "SUCCESS")){
            resetRecaptcha();
            return alert("캡챠 인증 실패..");
        }

        await fetch("https://babe-api.fastwrtn.com/feedback",{method:"POST",headers:{"Content-Type" : "application/json"},body:JSON.stringify({
            title:title,
            content:content,
            category:category,
            password:password
        })})
        alert("건의사항 제출 성공!");
        resetRecaptcha();
        window.location.reload();
    }

    function accordionItem(id: number, title: string, content: string, likeCount: number, dislikeCount: number, category: number, badge: string[], isDeleted: boolean){
        return (<>
            <li className="list-group-item d-flex justify-content-between align-items-start" onClick={()=>handleShow(id,title,content,likeCount,dislikeCount,isDeleted)}>
                { category == 1 &&
                    <img src="https://raw.githubusercontent.com/sickwrtn/babechat.multi/refs/heads/main/2024-blurple-dev.png" />
                }
                { category == 2 &&
                    <img src="https://raw.githubusercontent.com/sickwrtn/babechat.multi/refs/heads/main/4156-blurple-flame.png" />
                }
                { category == 3 &&
                    <img src="https://raw.githubusercontent.com/sickwrtn/babechat.multi/refs/heads/main/7100-blurple-heart.png" />
                }
                <div className="ms-2 me-auto overflow-hidden">
                    <div className="fw-bold">{title} {badge.map((data)=>(
                        <Badge className="ms-1" text="white" bg="secondary">{data}</Badge>
                    ))}
                    <Badge className="ms-1" text="white" bg="primary" pill={true}>ID : {id}</Badge>
                    </div>
                    {content}
                </div>
                <div className="badge border">{likeCount - dislikeCount}</div>
            </li>
        </>)
    }

    function accordionItemAdmin(id: number, title: string, content: string, likeCount: number, dislikeCount: number, category: number, badge: string[],isDeleted: boolean){
        return (<>
            <li className="list-group-item d-flex justify-content-between align-items-start" onClick={()=>handleShow(id,title,content,likeCount,dislikeCount,isDeleted)}>
                { category == 1 &&
                    <img src="https://raw.githubusercontent.com/sickwrtn/babechat.multi/refs/heads/main/2024-blurple-dev.png" />
                }
                { category == 2 &&
                    <img src="https://raw.githubusercontent.com/sickwrtn/babechat.multi/refs/heads/main/4156-blurple-flame.png" />
                }
                { category == 3 &&
                    <img src="https://raw.githubusercontent.com/sickwrtn/babechat.multi/refs/heads/main/7100-blurple-heart.png" />
                }
                <div className="ms-2 me-auto overflow-hidden">
                    <div className="fw-bold">{title} {badge.map((data)=>(
                        <Badge className="ms-1" text="white" bg="secondary">{data}</Badge>
                    ))}
                    <Badge className="ms-1" text="white" bg="danger" pill={true}>삭제됨</Badge>
                    <Badge className="ms-1" text="white" bg="primary" pill={true}>ID : {id}</Badge>
                    </div>
                    {content}
                </div>
                <div className="badge border">{likeCount - dislikeCount}</div>
            </li>
        </>)
    }

    function feedbackFilter(data:any, standard:string){
        if(standard == "likeCount"){
            return data.sort((a: any,b: any) => (b.likeCount - b.dislikeCount) - (a.likeCount - a.dislikeCount));
        }
        else if (standard == "latest"){
            return data.sort((a: any,b: any) => Number(new Date(b.createdAt)) - Number(new Date(a.createdAt)));
        }
        else if (standard == "oldest"){
            return data.sort((a: any,b: any) => Number(new Date(a.createdAt)) - Number(new Date(b.createdAt)));
        }
        else{
            return data;
        }
    }

    return (<>
        <div id="sumbit" className='border rounded'>
            <Form.Group className="m-4">
                <Form.Label>제목</Form.Label>
                <FormControl type="text" className='mb-3' placeholder="제목은 직관적이게 써주세요." value={title} onChange={titleOnChange} isInvalid={titleIsVaild}/>
                <Form.Label>내용</Form.Label>
                <FormControl type="text" className='mb-3' placeholder="건의사항을 구체적으로 적어주세요." as="textarea" rows={3} value={content} onChange={contentOnChange} isInvalid={contentIsVaild}/> {/* 기본 3줄 높이 */}
                <Form.Label>비밀번호</Form.Label>
                <FormControl type="text" className='mb-3' placeholder="비밀번호는 수정 및 삭제에 사용됩니다." value={password} onChange={passwordOnChange} isInvalid={passwordIsVaild}/>
                <ReCAPTCHA
                    sitekey="6LcMp0QrAAAAAIlT_zQPHX3RAGEbrm6pDSOTycau"
                    onChange={recaptchaOnChange}
                    ref={recaptchaRef}
                    className='racaptcha'
                />
                <ToggleButtonGroup className="d-inline-flex mt-3" type="radio" name="options" defaultValue={1} value={category} onChange={categoryOnChange}>
                    <ToggleButton id="tbg-btn-1" variant='outline-secondary' value={1}>
                        개선
                    </ToggleButton>
                    <ToggleButton id="tbg-btn-2" variant='outline-secondary' value={2}>
                        버그
                    </ToggleButton>
                    <ToggleButton id="tbg-btn-3" variant='outline-secondary' value={3}>
                        기타
                    </ToggleButton>
                </ToggleButtonGroup>
                <Button disabled={!recaptchaToken} className="sumbit-btn mt-3" variant="success" id="button-addon1" onClick={()=>formOnClick(title,content,category,password,recaptchaToken)}>제출</Button>
            </Form.Group>
        </div>
        <div id="feed">
            <h3>진행중</h3>
            <ul className="list-group mt-3">
                {feedbackFilter(feedback,"likeCount").map((data: any)=>{
                    if (data.isProgress){
                        return (accordionItem(data.id,data.title,data.content,data.likeCount,data.dislikeCount,data.category,data.badge,data.isDeleted))
                    }
                })}
            </ul>
            <h3 className="mt-4 d-inline-flex">대기중</h3>
            <Form.Select className="asd" defaultValue={"likeCount"} onChange={selectFilterOnChange}>
                <option value="likeCount">추천순</option>
                <option value="latest">최신순</option>
                <option value="oldest">오래된순</option>
            </Form.Select>
            <ul className="list-group mt-3">
                {feedbackFilter(feedback,selectFilter).map((data: any)=>{
                    if (data.isProgress){
                        return
                    }
                    if (data.isDeleted){
                        return accordionItemAdmin(data.id,data.title,data.content,data.likeCount,data.dislikeCount,data.category,data.badge,data.isDeleted)
                    }
                    return accordionItem(data.id,data.title,data.content,data.likeCount,data.dislikeCount,data.category,data.badge,data.isDeleted)
                })}
            </ul>
        </div>
        <div id="footer"></div>
        <Modal show={show} onHide={handleClose} size='lg' contentClassName="b-modal">
            <Modal.Header closeButton>
            <Modal.Title>{!isEdit && modalTitle}{isEdit && "편집기"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
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
                                })
                            fetch("https://babe-api.fastwrtn.com/feedback")
                                .then(res => res.json())
                                .then(data =>setFeedback(data.data))
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
                                })
                            fetch("https://babe-api.fastwrtn.com/feedback")
                                .then(res => res.json())
                                .then(data =>setFeedback(data.data))
                        }}>
                            추천 : {modalLikeCount}
                        </Button>
                    </div>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label>댓글</Form.Label>
                        <Form.Control as="textarea" rows={3} /> 
                    </Form.Group>
                </>
                }
                { isEdit &&
                    <Form.Group className="m-4">
                        <Form.Label>제목</Form.Label>
                        <FormControl type="text" className='mb-3' placeholder="제목은 직관적이게 써주세요." value={modalTitleEdit} onChange={modalTitleEditOnChange} isInvalid={modalTitleEditIsVaild}/>
                        <Form.Label>내용</Form.Label>
                        <FormControl type="text" className='mb-2' placeholder="건의사항을 구체적으로 적어주세요." as="textarea" rows={5} value={modalContentEdit} onChange={modalContentEditOnChange} isInvalid={ModalContentEditIsVaild}/>
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
                { !isEdit &&
                <>
                    <Button className="me-1" variant="outline-primary" onClick={()=>{
                        fetch(`https://babe-api.fastwrtn.com/admin/progress?id=${modalId}`,{method:"PUT",headers:{"Content-Type" : "application/json","Authorization":localStorage.getItem("auth_token") as string},body:JSON.stringify({})})
                            .then(res => res.json())
                            .then((data:any) => {
                                if (data.result == "SUCCESS"){
                                    alert("진행중 탭으로 이동되었습니다.");
                                    window.location.reload();
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
                                    window.location.reload();
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
                                    window.location.reload();
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
                                        window.location.reload();
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
                                        window.location.reload();
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
                                window.location.reload();
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
                }
            </Modal.Footer>
        </Modal>
    </>)
}

export default Admin