import './main.css'
import { FormControl, Modal, Button, Form } from 'react-bootstrap';
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';

function Index() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);

    const handleShow = (id: number, title: string, content: string, likeCount: number, dislikeCount: number) => {
        setModalTitle(title);
        setModalContent(content);
        setModalId(id);
        setModalLikeCount(likeCount);
        setModalDislikeCount(dislikeCount);
        setShow(true)
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

    const [titleIsVaild,setTitleVaild] = useState(false);

    const [contentIsVaild,setContentVaild] = useState(false);

    const [passwordIsVaild,setPasswordVaild] = useState(false);

    useEffect(()=>{
        fetch("https://babe-api.fastwrtn.com/feedback")
            .then(res => res.json())
            .then(data => setFeedback(data.data))
    },[])

    function formOnClick(title:string,content:string,password:string){
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

        fetch("https://babe-api.fastwrtn.com/feedback",{method:"POST",headers:{"Content-Type" : "application/json"},body:JSON.stringify({
            title:title,
            content:content,
            password:password
        })})
        alert("건의사항 제출 성공!");
        window.location.reload();
    }

    function accordionItem(id: number, title: string, content: string, likeCount: number, dislikeCount: number){
        return (<>
            <li className="list-group-item d-flex justify-content-between align-items-start" onClick={()=>handleShow(id,title,content,likeCount,dislikeCount)}>
                <img id="icon" alt="logo" src="https://www.babechat.ai/assets/svgs/babechat.svg" />
                <div className="ms-2 me-auto overflow-hidden">
                    <div className="fw-bold">{title}</div>
                    {content}
                    </div>
                <div className="badge border">{likeCount - dislikeCount}</div>
            </li>
        </>)
    }

    function Feed(){
        return (<>
            <h4>진행중</h4>
        <ul className="list-group mt-3">
            {feedback.sort((a: any,b: any) => (b.likeCount - b.dislikeCount) - (a.likeCount - a.dislikeCount)).map((data: any)=>{
                if (data.isProgress){
                    return (accordionItem(data.id,data.title,data.content,data.likeCount,data.dislikeCount))
                }
            })}
        </ul>
        <h4 className="mt-4">대기중</h4>
        <ul className="list-group mt-3">
            {feedback.sort((a: any,b: any) => (b.likeCount - b.dislikeCount) - (a.likeCount - a.dislikeCount)).map((data: any)=>(
                accordionItem(data.id,data.title,data.content,data.likeCount,data.dislikeCount)
            ))}
        </ul>
        </>)
    }

    return (<>
        <div id="sumbit" className='border rounded'>
            <Form.Group className="m-4">
                <Form.Label>제목</Form.Label>
                <FormControl type="text" className='mb-3' placeholder="제목은 직관적이게 써주세요." value={title} onChange={titleOnChange} isInvalid={titleIsVaild}/>
                <Form.Label>내용</Form.Label>
                <FormControl type="text" className='mb-2' placeholder="건의사항을 구체적으로 적어주세요." as="textarea" rows={3} value={content} onChange={contentOnChange} isInvalid={contentIsVaild}/> {/* 기본 3줄 높이 */}
                <Form.Label>비밀번호 </Form.Label>
                <FormControl type="text" className='mb-3' placeholder="비밀번호는 수정 및 삭제에 사용됩니다." value={password} onChange={passwordOnChange} isInvalid={passwordIsVaild}/>
                <Button className="sumbit-btn" variant="outline-success" id="button-addon1" onClick={()=>formOnClick(title,content,password)}>제출</Button>
            </Form.Group>
        </div>
        <div id="feed">
            <Feed />
        </div>
        <div id="footer"></div>
        <Modal show={show} onHide={handleClose} size='lg' contentClassName="b-modal">
            {/* Modal.Header: 모달의 상단 (제목 및 닫기 버튼) */}
            <Modal.Header closeButton>
            <Modal.Title>{modalTitle}</Modal.Title>
            </Modal.Header>

            {/* Modal.Body: 모달의 본문 내용 */}
            <Modal.Body className='modalBody'>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {modalContent.replace(/\n/gi,"\n\n")}
            </ReactMarkdown>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                <Form.Label>댓글</Form.Label>
                <Form.Control as="textarea" rows={3} /> {/* 기본 3줄 높이 */}
            </Form.Group>
            </Modal.Body>
            {/* Modal.Footer: 모달의 하단 (액션 버튼) */}
            <Modal.Footer>
                <div className='b-footer'>
                    <Button className="me-1" variant="danger" onClick={()=>{
                        fetch(`https://babe-api.fastwrtn.com/dislike?id=${modalId}`);
                        alert("비추천되었습니다.");
                    }}>
                        비추천 : {modalDislikeCount}
                    </Button>
                    <Button className="ms-1" variant="success" onClick={()=>{
                        fetch(`https://babe-api.fastwrtn.com/like?id=${modalId}`);
                        alert("추천되었습니다.");
                    }}>
                        추천 : {modalLikeCount}
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    </>)
}

export default Index