import './main.css'
import { FormControl, Button, Form, Badge} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import Sumbit from './sumbit';
import FeedbackModal from './modal';
import { setStrict } from './strict';
import {IFeedback,IResponse,IFilter,ICategory} from './interfaces'
import { useLocation, useNavigate } from 'react-router-dom';

const parseJwt = (token: string) => {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

function Admin() {
    setStrict(()=>{})
    if (localStorage.getItem("auth_token") == null || !parseJwt(localStorage.getItem("auth_token") as string).admin){
        const [adminPassword,setAdminPassword] = useState<string>("");
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

    const [show, setShow] = useState<boolean>(false);
    const navigate = useNavigate();
    const location = useLocation();
    const handleClose = () => {
        navigate('/sick/admin',{replace:false});
        setShow(false)
    };

    const [feedback, setFeedback] = useState<IFeedback[]>([]);

    const [feedbackProgress,setFeedbackProgress] = useState<IFeedback[]>([]);

    const [feedbackCompleted,setFeedbackCompleted] = useState<IFeedback[]>([]);

    const [feedbackNotification,setFeedbackNotification] = useState<IFeedback[]>([]);

    const [feedbackDeleted,setFeedbackDeleted] = useState<IFeedback[]>([]);

    const [modalTitle, setModalTitle] = useState<string>("");

    const [modalContent,setModalContent] = useState<string>("");

    const [modalId, setModalId] = useState<number>(0);

    const [modalLikeCount, setModalLikeCount] = useState<number>(0);
    
    const [modalDislikeCount, setModalDislikeCount] = useState<number>(0);

    const [modalIsDeleted, setModalIsDeleted] = useState<boolean>(false);

    const [isEdit,setIsEdit] = useState<boolean>(false);

    const [selectFilter, setSelectFilter] = useState<IFilter>("likeCount");

    const selectFilterOnChange = (val: any) => setSelectFilter(val.target.value);

    const [modalBadge, setModalBadge] = useState<string[]>();

    const [modalUserId, setModalUserId] = useState<string>("");

    const [modalIsLoading, setModalIsLoading] = useState<boolean>(false);

    const [modalIp, setModalIp] = useState<string>("");

    const resetFeedback = () => {
        fetch("https://babe-api.fastwrtn.com/admin/feedback?tab=stand",{headers:{"Authorization":localStorage.getItem("auth_token") as string}})
            .then(res => res.json())
            .then((data: IResponse<IFeedback[]>) => setFeedback(data.data))
        fetch("https://babe-api.fastwrtn.com/admin/feedback?tab=progress",{headers:{"Authorization":localStorage.getItem("auth_token") as string}})
            .then(res => res.json())
            .then((data: IResponse<IFeedback[]>) => setFeedbackProgress(data.data))
        fetch("https://babe-api.fastwrtn.com/admin/feedback?tab=completed",{headers:{"Authorization":localStorage.getItem("auth_token") as string}})
            .then(res => res.json())
            .then((data: IResponse<IFeedback[]>) => setFeedbackCompleted(data.data))
        fetch("https://babe-api.fastwrtn.com/admin/feedback?tab=notification",{headers:{"Authorization":localStorage.getItem("auth_token") as string}})
            .then(res => res.json())
            .then((data: IResponse<IFeedback[]>) => setFeedbackNotification(data.data))
        fetch("https://babe-api.fastwrtn.com/admin/feedback?tab=deleted",{headers:{"Authorization":localStorage.getItem("auth_token") as string}})
            .then(res => res.json())
            .then((data: IResponse<IFeedback[]>) => setFeedbackDeleted(data.data))
    }

    useEffect(()=>{
        fetch("https://babe-api.fastwrtn.com/admin/feedback?tab=stand",{headers:{"Authorization":localStorage.getItem("auth_token") as string}})
            .then(res => res.json())
            .then((data: IResponse<IFeedback[]>) => setFeedback(data.data))
        fetch("https://babe-api.fastwrtn.com/admin/feedback?tab=progress",{headers:{"Authorization":localStorage.getItem("auth_token") as string}})
            .then(res => res.json())
            .then((data: IResponse<IFeedback[]>) => setFeedbackProgress(data.data))
        fetch("https://babe-api.fastwrtn.com/admin/feedback?tab=completed",{headers:{"Authorization":localStorage.getItem("auth_token") as string}})
            .then(res => res.json())
            .then((data: IResponse<IFeedback[]>) => setFeedbackCompleted(data.data))
        fetch("https://babe-api.fastwrtn.com/admin/feedback?tab=notification",{headers:{"Authorization":localStorage.getItem("auth_token") as string}})
            .then(res => res.json())
            .then((data: IResponse<IFeedback[]>) => setFeedbackNotification(data.data))
        fetch("https://babe-api.fastwrtn.com/admin/feedback?tab=deleted",{headers:{"Authorization":localStorage.getItem("auth_token") as string}})
            .then(res => res.json())
            .then((data: IResponse<IFeedback[]>) => setFeedbackDeleted(data.data))
    },[])

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const id = params.get('id');
        if (id != null){
            setModalIsLoading(true);
            setShow(true);
            fetch(`https://babe-api.fastwrtn.com/admin/feedbackitem?id=${id}`,{headers:{"Authorization":localStorage.getItem("auth_token") as string}})
                .then(res => res.json())
                .then((data: IResponse<IFeedback>) => {
                    if (data.result == "FAIL"){
                        return alert("잘못된 ID 입니다.");
                    }
                    setModalTitle(data.data.title);
                    setModalContent(data.data.content);
                    setModalId(data.data.id);
                    setModalLikeCount(data.data.likeCount);
                    setModalDislikeCount(data.data.dislikeCount);
                    setModalBadge(data.data.badge);
                    setModalIsDeleted(data.data.isDeleted);
                    setModalUserId(data.data.userId as string);
                    setModalIp(data.data.ip as string);
                    setIsEdit(false);
                    setModalIsLoading(false);
                })
        }
    }, [location]);

    function accordionItem(id: number, title: string, content: string, likeCount: number, dislikeCount: number, category: ICategory, badge: string[],isNotification: boolean,ip: string){
        return (<>
            <li className="list-group-item d-flex justify-content-between align-items-start" onClick={()=>navigate(`/sick/admin?id=${id}`,{replace:false})}>
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
                    <Badge className="ms-1 badge" text="white" bg="info">IP : {ip}</Badge>
                    <Badge className="ms-1 badge" text="white" bg="primary">ID : {id}</Badge>
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

    function accordionItemAdmin(id: number, title: string, content: string, likeCount: number, dislikeCount: number, category: ICategory, badge: string[],isProgress:boolean,isCompleted:boolean,isNotification:boolean,ip: string){
        return (<>
            <li className="list-group-item d-flex justify-content-between align-items-start" onClick={()=>navigate(`/sick/admin?id=${id}`,{replace:false})}>
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
                        <Badge className="ms-1 badge" text="white" bg="secondary" >{data}</Badge>
                    ))}
                    <Badge className="ms-1 badge" text="white" bg="danger" >삭제됨</Badge>
                    {isProgress && <Badge className="ms-1 badge" text="white" bg="secondary" >진행중 탭</Badge>}
                    {isCompleted && <Badge className="ms-1 badge" text="white" bg="secondary" >완료됨 탭</Badge>}
                    {isNotification && <Badge className="ms-1 badge" text="white" bg="secondary" >공지사항 탭</Badge>}
                    {(!isProgress && !isCompleted && !isNotification) && <Badge className="ms-1 badge" text="white" bg="secondary" >대기중 탭</Badge>}
                    <Badge className="ms-1 badge" text="white" bg="info">IP : {ip}</Badge>
                    <Badge className="ms-1 badge" text="white" bg="primary" >ID : {id}</Badge>
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

    function feedbackFilter(data:IFeedback[], standard:IFilter){
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

    function Feedback({data,filter,isAdmin}:{data:IFeedback[],filter:IFilter,isAdmin:boolean}) {
        return (
            <> 
                {(!isAdmin) &&
                    <>
                        {feedbackFilter(data,filter).map(data =>{
                            if (!data.isDeleted) return (accordionItem(data.id,data.title,data.content,data.likeCount,data.dislikeCount,data.category,data.badge,data.isNotification,data.ip as string))
                        })}
                    </>
                }
                {isAdmin &&
                    <>
                        {feedbackFilter(data,filter).map(data=>{
                            return accordionItemAdmin(data.id,data.title,data.content,data.likeCount,data.dislikeCount,data.category,data.badge,data.isProgress,data.isCompleted,data.isNotification,data.ip as string)
                        })}
                    </>
                }
            </>
        )
    }

    return (<>
        <div id="sumbit" className='border rounded'>
            <Sumbit resetFeedback={resetFeedback} isAdmin={true}/>
        </div>
        <div id="feed">
            <h3>공지사항</h3>
            <ul className="list-group mt-3">
                <Feedback data={feedbackNotification} filter='likeCount' isAdmin={false} />
            </ul>
            <h3 className="mt-4 d-inline-flex">진행중</h3>
            <ul className="list-group mt-3">
                <Feedback data={feedbackProgress} filter='likeCount' isAdmin={false} />
            </ul>
            <div className='tab-container mt-4 d-flex'>
                <h3 className='mt-1'>대기중</h3>
                <Form.Select className="tab-select" defaultValue={"likeCount"} onChange={selectFilterOnChange}>
                    <option value="likeCount">추천순</option>
                    <option value="latest">최신순</option>
                    <option value="oldest">오래된순</option>
                </Form.Select>
            </div>
            <ul className="list-group mt-3">
                <Feedback data={feedback} filter={selectFilter} isAdmin={false} />
            </ul>
            <h3 className="mt-4 d-inline-flex">완료됨</h3>
            <ul className="list-group mt-3">
                <Feedback data={feedbackCompleted} filter='likeCount' isAdmin={false} />
            </ul>
            <h3 className="mt-4 d-inline-flex">삭제됨</h3>
            <ul className="list-group mt-3">
                <Feedback data={feedbackDeleted} filter='likeCount' isAdmin={true} />
            </ul>
        </div>
        <div id="footer"></div>
        <FeedbackModal show={show} isEdit={isEdit} setIsEdit={setIsEdit} handleClose={handleClose} modalTitle={modalTitle} modalBadge={modalBadge} modalContent={modalContent} modalId={modalId} modalLikeCount={modalLikeCount} setModalLikeCount={setModalLikeCount} modalDislikeCount={modalDislikeCount} setModalDislikeCount={setModalDislikeCount} modalIsDeleted={modalIsDeleted} resetFeedback={resetFeedback} isAdmin={true} modalUserId={modalUserId} modalIsLoading={modalIsLoading} modalIp={modalIp}/>
    </>)
}

export default Admin