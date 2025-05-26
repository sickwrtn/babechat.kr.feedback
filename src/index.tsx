import './main.css'
import {Form, Badge, Tab, Tabs} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import Sumbit from './sumbit';
import FeedbackModal from './modal';
import { setStrict } from './strict';
import {IFeedback,IResponse,IFilter,ICategory} from './interfaces'
import { useLocation, useNavigate } from 'react-router-dom';

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
    const navigate = useNavigate();
    const location = useLocation();
    const handleClose = () => {
        navigate('/',{replace:false});
        setShow(false)
    };

    const [isEdit,setIsEdit] = useState(false);

    const [feedback, setFeedback] = useState<IFeedback[]>([]);

    const [feedbackProgress,setFeedbackProgress] = useState<IFeedback[]>([]);

    const [feedbackCompleted,setFeedbackCompleted] = useState<IFeedback[]>([]);

    const [feedbackNotification,setFeedbackNotification] = useState<IFeedback[]>([]);

    const [modalTitle, setModalTitle] = useState<string>("");

    const [modalContent,setModalContent] = useState<string>("");

    const [modalId, setModalId] = useState<number>(0);

    const [modalLikeCount, setModalLikeCount] = useState<number>(0);
    
    const [modalDislikeCount, setModalDislikeCount] = useState<number>(0);

    const [modalIsDeleted, setModalIsDeleted] = useState<boolean>(false);

    const [selectFilter, setSelectFilter] = useState<IFilter>("likeCount");

    const selectFilterOnChange = (val: any) => setSelectFilter(val.target.value);

    const [modalBadge, setModalBadge] = useState<string[]>([]);

    const [modalIsLoading, setModalIsLoading] = useState<boolean>(false);

    const resetFeedback = () => {
        fetch("https://babe-api.fastwrtn.com/feedback?tab=stand")
            .then(res => res.json())
            .then((data:IResponse<IFeedback[]>) => setFeedback(data.data))
        fetch("https://babe-api.fastwrtn.com/feedback?tab=progress")
            .then(res => res.json())
            .then((data:IResponse<IFeedback[]>) => setFeedbackProgress(data.data))
        fetch("https://babe-api.fastwrtn.com/feedback?tab=completed")
            .then(res => res.json())
            .then((data:IResponse<IFeedback[]>) => setFeedbackCompleted(data.data))
        fetch("https://babe-api.fastwrtn.com/feedback?tab=notification")
            .then(res => res.json())
            .then((data:IResponse<IFeedback[]>) => setFeedbackNotification(data.data))
    }
    useEffect(()=>{
        fetch("https://babe-api.fastwrtn.com/feedback?tab=stand")
            .then(res => res.json())
            .then((data:IResponse<IFeedback[]>) => setFeedback(data.data))
        fetch("https://babe-api.fastwrtn.com/feedback?tab=progress")
            .then(res => res.json())
            .then((data:IResponse<IFeedback[]>) => setFeedbackProgress(data.data))
        fetch("https://babe-api.fastwrtn.com/feedback?tab=completed")
            .then(res => res.json())
            .then((data:IResponse<IFeedback[]>) => setFeedbackCompleted(data.data))
        fetch("https://babe-api.fastwrtn.com/feedback?tab=notification")
            .then(res => res.json())
            .then((data:IResponse<IFeedback[]>) => setFeedbackNotification(data.data))
    },[])

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const id = params.get('id');
        if (id != null){
            setModalIsLoading(true);
            setShow(true);
            fetch(`https://babe-api.fastwrtn.com/feedbackitem?id=${id}`)
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
                    setIsEdit(false);
                    setModalIsLoading(false);
                })
        }
    }, [location]);

    function accordionItem(id: number, title: string, content: string, likeCount: number, dislikeCount: number, category: ICategory, badge: string[],isNotification: boolean){
        return (<>
            <li className="list-group-item d-flex justify-content-between align-items-start" onClick={()=>navigate(`/?id=${id}`,{replace:false})}>
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

    function feedbackFilter(data:IFeedback[], standard:IFilter):IFeedback[] {
        if(standard == "likeCount"){
            return data.sort((a,b) => (b.likeCount - b.dislikeCount) - (a.likeCount - a.dislikeCount));
        }
        else if (standard == "latest"){
            return data.sort((a,b) => Number(new Date(b.createdAt)) - Number(new Date(a.createdAt)));
        }
        else if (standard == "oldest"){
            return data.sort((a,b) => Number(new Date(a.createdAt)) - Number(new Date(b.createdAt)));
        }
        else{
            return data;
        }
    }

    function Feedback({data,filter}:{data:IFeedback[],filter:IFilter}) {
        return (
            <>
                {feedbackFilter(data,filter).map(data =>{
                    return (accordionItem(data.id,data.title,data.content,data.likeCount,data.dislikeCount,data.category,data.badge,data.isNotification))
                })}
            </>
        )
    }
    return (<>
        <div id="sumbit" className='border rounded'>
            <Sumbit resetFeedback={resetFeedback} isAdmin={false}/>
        </div>
        <div id="feed">
            <Tabs defaultActiveKey="main" id="uncontrolled-tab-example" className="mb-3">
                <Tab eventKey="main" title="메인">
                    <h3>공지사항</h3>
                    <ul className="list-group mt-3">
                        <Feedback data={feedbackNotification} filter='likeCount'/>
                    </ul>
                    <h3 className="mt-4 d-inline-flex">진행중</h3>
                    <ul className="list-group mt-3">
                        <Feedback data={feedbackProgress} filter='likeCount'/>
                    </ul>
                    <h3 className="mt-4 d-inline-flex">완료됨</h3>
                    <ul className="list-group mt-3">
                        <Feedback data={feedbackCompleted} filter='likeCount'/>
                    </ul>
                        <h3 className='mt-4'>대기중</h3>
                    <ul className="list-group mt-3">
                        <Feedback data={feedback} filter='likeCount'/>
                    </ul>
                </Tab>
                <Tab eventKey="stand" title="대기중">
                    <div className='tab-container mt-4 d-flex'>
                        <h3 className='mt-1'>대기중</h3>
                        <Form.Select className="tab-select" defaultValue={"likeCount"} onChange={selectFilterOnChange}>
                            <option value="likeCount">추천순</option>
                            <option value="latest">최신순</option>
                            <option value="oldest">오래된순</option>
                        </Form.Select>
                    </div>
                    <ul className="list-group mt-3">
                        <Feedback data={feedback} filter={selectFilter}/>
                    </ul>
                </Tab>
            </Tabs>
        </div>
        <div id="footer"></div>
        <FeedbackModal show={show} isEdit={isEdit} setIsEdit={setIsEdit} handleClose={handleClose} modalTitle={modalTitle} modalBadge={modalBadge} modalContent={modalContent} modalId={modalId} modalLikeCount={modalLikeCount} setModalLikeCount={setModalLikeCount} modalDislikeCount={modalDislikeCount} setModalDislikeCount={setModalDislikeCount} modalIsDeleted={modalIsDeleted} resetFeedback={resetFeedback} isAdmin={false} modalUserId='' modalIsLoading={modalIsLoading} modalIp=''/>
    </>)
}

export default Index