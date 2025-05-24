import './main.css'
import { FormControl, Button, Form, Badge} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import Sumbit from './sumbit';
import FeedbackModal from './modal';

const parseJwt = (token: string) => {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

function Admin() {
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

    const handleClose = () => setShow(false);

    const handleShow = (id: number, title: string, content: string, likeCount: number, dislikeCount: number, Badge: string[], isDeleted: boolean, ip:string) => {
        setModalTitle(title);
        setModalContent(content);
        setModalId(id);
        setModalLikeCount(likeCount);
        setModalDislikeCount(dislikeCount);
        setModalIsDeleted(isDeleted);
        setModalBadge(Badge);
        setModalIp(ip);
        setShow(true);
        setIsEdit(false);
    };

    const [feedback, setFeedback] = useState<any[]>([]);

    const [modalTitle, setModalTitle] = useState<string>("");

    const [modalContent,setModalContent] = useState<string>("");

    const [modalId, setModalId] = useState<number>(0);

    const [modalLikeCount, setModalLikeCount] = useState<number>(0);
    
    const [modalDislikeCount, setModalDislikeCount] = useState<number>(0);

    const [modalIsDeleted, setModalIsDeleted] = useState<boolean>(false);

    const [isEdit,setIsEdit] = useState<boolean>(false);

    const [selectFilter, setSelectFilter] = useState<string>("likeCount");

    const selectFilterOnChange = (val: any) => setSelectFilter(val.target.value);

    const [modalBadge, setModalBadge] = useState<string[]>();

    const [modalIp, setModalIp] = useState<string>("");

    const resetFeedback = () => {
        fetch("https://babe-api.fastwrtn.com/admin/feedback",{headers:{"Authorization":localStorage.getItem("auth_token") as string}})
            .then(res => res.json())
            .then(data => setFeedback(data.data))
    }

    useEffect(()=>{
        fetch("https://babe-api.fastwrtn.com/admin/feedback",{headers:{"Authorization":localStorage.getItem("auth_token") as string}})
            .then(res => res.json())
            .then(data => setFeedback(data.data))
    },[])

    function accordionItem(id: number, title: string, content: string, likeCount: number, dislikeCount: number, category: number, badge: string[], isDeleted: boolean, ip: string){
        return (<>
            <li className="list-group-item d-flex justify-content-between align-items-start" onClick={()=>handleShow(id,title,content,likeCount,dislikeCount,badge,isDeleted,ip)}>
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
                        <Badge className="ms-1 badge" text="white" bg="secondary">{data}</Badge>
                    ))}
                    <Badge className="ms-1 badge" text="white" bg="secondary">{ip}</Badge>
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

    function accordionItemAdmin(id: number, title: string, content: string, likeCount: number, dislikeCount: number, category: number, badge: string[],isProgress:boolean,isCompleted:boolean, isDeleted: boolean, ip: string){
        return (<>
            <li className="list-group-item d-flex justify-content-between align-items-start" onClick={()=>handleShow(id,title,content,likeCount,dislikeCount,badge,isDeleted,ip)}>
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
                        <Badge className="ms-1 badge" text="white" bg="secondary" >{data}</Badge>
                    ))}
                    <Badge className="ms-1 badge" text="white" bg="danger" >삭제됨</Badge>
                    {isProgress && <Badge className="ms-1 badge" text="white" bg="secondary" >진행중 탭</Badge>}
                    {isCompleted && <Badge className="ms-1 badge" text="white" bg="secondary" >완료됨 탭</Badge>}
                    {(!isProgress && !isCompleted) && <Badge className="ms-1 badge" text="white" bg="secondary" >대기중 탭</Badge>}
                    <Badge className="ms-1 badge" text="white" bg="secondary">{ip}</Badge>
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
            <Sumbit resetFeedback={resetFeedback} />
        </div>
        <div id="feed">
            <h3>진행중</h3>
            <ul className="list-group mt-3">
                {feedbackFilter(feedback,"likeCount").map((data: any)=>{
                    if (data.isDeleted){
                        return
                    }
                    if (data.isProgress){
                        return (accordionItem(data.id,data.title,data.content,data.likeCount,data.dislikeCount,data.category,data.badge,data.isDeleted,data.ip))
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
                    if (data.isDeleted){
                        return
                    }
                    return accordionItem(data.id,data.title,data.content,data.likeCount,data.dislikeCount,data.category,data.badge,data.isDeleted,data.ip)
                })}
            </ul>
            <h3 className="mt-4 d-inline-flex">완료됨</h3>
            <ul className="list-group mt-3">
                {feedbackFilter(feedback,selectFilter).map((data: any)=>{
                    if (data.isDeleted){
                        return
                    }
                    if (data.isCompleted){
                        return accordionItem(data.id,data.title,data.content,data.likeCount,data.dislikeCount,data.category,data.badge,data.isDeleted,data.ip)
                    }
                })}
            </ul>
            <h3 className="mt-4 d-inline-flex">삭제됨</h3>
            <ul className="list-group mt-3">
                {feedbackFilter(feedback,selectFilter).map((data: any)=>{
                    if (data.isDeleted){
                        return accordionItemAdmin(data.id,data.title,data.content,data.likeCount,data.dislikeCount,data.category,data.badge,data.isProgress,data.isCompleted,data.isDeleted,data.ip)
                    }
                })}
            </ul>
        </div>
        <div id="footer"></div>
        <FeedbackModal show={show} isEdit={isEdit} setIsEdit={setIsEdit} handleClose={handleClose} modalTitle={modalTitle} modalBadge={modalBadge} modalContent={modalContent} modalId={modalId} modalLikeCount={modalLikeCount} setModalLikeCount={setModalLikeCount} modalDislikeCount={modalDislikeCount} setModalDislikeCount={setModalDislikeCount} modalIsDeleted={modalIsDeleted} resetFeedback={resetFeedback} isAdmin={true} modalIp={modalIp}/>
    </>)
}

export default Admin