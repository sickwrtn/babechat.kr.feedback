import './main.css'
import {Form, Badge} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import Sumbit from './sumbit';
import FeedbackModal from './modal';
import { setStrict } from './strict';


function Index() {
    setStrict(()=>{})
    if (localStorage.getItem("auth_token") == null){
        fetch("https://babe-api.fastwrtn.com/auth",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({})})
            .then(res=>res.json())
            .then(data => {
                localStorage.setItem("auth_token",data.data);
            })
    }

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);

    const [isEdit,setIsEdit] = useState(false);

    const handleShow = (id: number, title: string, content: string, likeCount: number, dislikeCount: number, Badge: string[], isDeleted: boolean) => {
        setModalTitle(title);
        setModalContent(content);
        setModalId(id);
        setModalLikeCount(likeCount);
        setModalDislikeCount(dislikeCount);
        setModalBadge(Badge);
        setModalIsDeleted(isDeleted)
        setIsEdit(false);
        setShow(true);
    };

    const [feedback, setFeedback] = useState([] as any[]);

    const [modalTitle, setModalTitle] = useState("");

    const [modalContent,setModalContent] = useState("");

    const [modalId, setModalId] = useState(0);

    const [modalLikeCount, setModalLikeCount] = useState(0);
    
    const [modalDislikeCount, setModalDislikeCount] = useState(0);

    const [modalIsDeleted, setModalIsDeleted] = useState<boolean>(false);

    const [selectFilter, setSelectFilter] = useState("likeCount");

    const selectFilterOnChange = (val: any) => setSelectFilter(val.target.value);

    const [modalBadge, setModalBadge] = useState([] as string[]);

    const resetFeedback = () => {
        fetch("https://babe-api.fastwrtn.com/feedback")
            .then(res => res.json())
            .then(data => setFeedback(data.data))
    }

    useEffect(()=>{
        fetch("https://babe-api.fastwrtn.com/feedback")
            .then(res => res.json())
            .then(data => setFeedback(data.data))
    },[])

    function accordionItem(id: number, title: string, content: string, likeCount: number, dislikeCount: number, category: number, badge: string[], isDeleted: boolean,isNotification: boolean){
        return (<>
            <li className="list-group-item d-flex justify-content-between align-items-start" onClick={()=>handleShow(id,title,content,likeCount,dislikeCount,badge,isDeleted)}>
                {!isNotification && 
                    <>
                        { category == 1 &&
                        <img src="https://raw.githubusercontent.com/sickwrtn/babechat.multi/refs/heads/main/2024-blurple-dev.png" />
                        }
                        { category == 2 &&
                            <img src="https://raw.githubusercontent.com/sickwrtn/babechat.multi/refs/heads/main/4156-blurple-flame.png" />
                        }
                        { category == 3 &&
                            <img src="https://raw.githubusercontent.com/sickwrtn/babechat.multi/refs/heads/main/7100-blurple-heart.png" />
                        }
                    </>
                }
                {isNotification &&
                    <img src="https://babechat.ai/assets/svgs/notices.svg" />
                }
                <div className="ms-2 me-auto overflow-hidden">
                    <div className="fw-bold">{title} {badge.map((data)=>(
                        <Badge className="ms-1 badge" text="white" bg="secondary">{data}</Badge>
                    ))}
                    </div>
                    {content}
                </div>
                <div className="badge border">
                    {(likeCount - dislikeCount) >= 0 && 
                    <div style={{color:"green"}}>{likeCount - dislikeCount}</div>
                    }
                    {(likeCount - dislikeCount) < 0 && 
                    <div style={{color:"red"}}>{likeCount - dislikeCount}</div>
                    }
                </div>
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
            <Sumbit resetFeedback={resetFeedback} isAdmin={false}/>
        </div>
        <div id="feed">
            <h3>공지사항</h3>
            <ul className="list-group mt-3">
                {feedbackFilter(feedback,"likeCount").map((data: any)=>{
                    if (data.isNotification){
                        return (accordionItem(data.id,data.title,data.content,data.likeCount,data.dislikeCount,data.category,data.badge,data.isDeleted,data.isNotification))
                    }
                })}
            </ul>
            <h3 className="mt-4 d-inline-flex">진행중</h3>
            <ul className="list-group mt-3">
                {feedbackFilter(feedback,"likeCount").map((data: any)=>{
                    if (data.isProgress){
                        return (accordionItem(data.id,data.title,data.content,data.likeCount,data.dislikeCount,data.category,data.badge,data.isDeleted,data.isNotification))
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
                    if (data.isCompleted){
                        return
                    }
                    if (data.isNotification){
                        return
                    }
                    return accordionItem(data.id,data.title,data.content,data.likeCount,data.dislikeCount,data.category,data.badge,data.isDeleted,data.isNotification)
                })}
            </ul>
            <h3 className="mt-4 d-inline-flex">완료됨</h3>
            <ul className="list-group mt-3">
                {feedbackFilter(feedback,selectFilter).map((data: any)=>{
                    if (data.isCompleted){
                        return accordionItem(data.id,data.title,data.content,data.likeCount,data.dislikeCount,data.category,data.badge,data.isDeleted,data.isNotification)
                    }
                })}
            </ul>
        </div>
        <div id="footer"></div>
        <FeedbackModal show={show} isEdit={isEdit} setIsEdit={setIsEdit} handleClose={handleClose} modalTitle={modalTitle} modalBadge={modalBadge} modalContent={modalContent} modalId={modalId} modalLikeCount={modalLikeCount} setModalLikeCount={setModalLikeCount} modalDislikeCount={modalDislikeCount} setModalDislikeCount={setModalDislikeCount} modalIsDeleted={modalIsDeleted} resetFeedback={resetFeedback} isAdmin={false} modalUserId=''/>
    </>)
}

export default Index