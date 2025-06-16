import './main.css'
import {Form, Badge, Tab, Tabs, InputGroup, Button} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import Sumbit from './sumbit';
import FeedbackModal from './modal';
import { setStrict } from './strict';
import {IFeedback,IFilter,ICategory} from './interfaces'
import { IModalData } from './interfaces';
import { useLocation, useNavigate } from 'react-router-dom';
import MyPaginationComponent from './page';
import { sillo } from './sdk';

function Index() {
    setStrict(()=>{})
    if (localStorage.getItem("auth_token") == null){
        fetch("https://babe-api.fastwrtn.com/auth",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({})})
            .then(res=>res.json())
            .then(data => {
                localStorage.setItem("auth_token",data.data);
            })
    }

    const api = new sillo(localStorage.getItem("auth_token") as string);

    const [show, setShow] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const handleClose = () => {
        navigate('/',{replace:false});
        setShow(false)
    };

    const [isEdit,setIsEdit] = useState(false);

    const [feedback, setFeedback] = useState<IFeedback[]>([]);

    const [feedbackCount,setFeedbackCount] = useState<number>(0);

    const [feedbackProgress,setFeedbackProgress] = useState<IFeedback[]>([]);

    const [feedbackCompleted,setFeedbackCompleted] = useState<IFeedback[]>([]);

    const [feedbackNotification,setFeedbackNotification] = useState<IFeedback[]>([]);

    const [feedbackRepresentative,setFeedbackRepresentative] = useState<IFeedback[]>([]);

    const [feedbackTop, setFeedbackTop] = useState<IFeedback[]>([])

    const [feedbackSearch, setFeedbackSearch] = useState<IFeedback[]>([]);

    const [feedbackRepresentativeCount,setFeedbackRepresentativeCount] = useState<number>(0);

    const [feedbackSearchCount, setFeedbackSearchCount] =useState<number>(0);
    
    const [search, setSearch] = useState<string>("");

    const searchOnChange = (e: any) => setSearch(e.target.value);

    const [modalData, setModalData] = useState<IModalData>({
        id: 0,
        title: "",
        content: "",
        comment: "",
        category: 1,
        likeCount: 0,
        dislikeCount: 0,
        absorptionList: null,
        isDeleted: false,
        badge: [],
        isLoading: false,
        createdAt: ""
    });

    const [extraData, setExtraData] = useState<IModalData>({
        id: 0,
        title: "",
        content: "",
        comment: "",
        category: 1,
        likeCount: 0,
        dislikeCount: 0,
        absorptionList: null,
        isDeleted: false,
        badge: [],
        isLoading: false,
        createdAt: ""
    });

    const initalExtra = ()=>{
        setExtraData(prev=>({
            ...prev,
            id: 0,
            title: "",
            content: "",
            comment: "",
            category: 1,
            likeCount: 0,
            dislikeCount: 0,
            absorptionList: null,
            isDeleted: false,
            badge: [],
            isLoading: false
        }))
    }

    const [selectFilter, setSelectFilter] = useState<IFilter>("latest");

    const selectFilterOnChange = (val: any) => setSelectFilter(val.target.value);

    const [representativeFilter, setRepresentativeFilter] = useState<IFilter>("likeCount");

    const representativeFilterOnChange = (val: any) => setRepresentativeFilter(val.target.value);

    const [searchFilter, setSearchFilter] = useState<IFilter>("likeCount");

    const searchFilterOnChange = (val: any) => setSearchFilter(val.target.value);

    const [currentPage,setCurrentPage] = useState<number>(1);

    const currentPageOnChange = (e:number) => setCurrentPage(e); 

    const [representativeCurrentPage,setRepresentativeCurrentPage] = useState<number>(1);

    const representativeCurrentPageOnChange = (e:number) => setRepresentativeCurrentPage(e);

    const [searchPage,setSearchPage] = useState<number>(1);

    const searchEvent = (keyword: string,filter: IFilter) => {
        api.get.searchFeedback("stand", filter, keyword, 0, 10)
            .then(data =>{ 
                    if (data.result == "FAIL"){
                        return alert("실패 " + data.data);
                    }
                    setFeedbackSearch(data.data);
                })
        api.get.searchFeedbackCount("stand", keyword)
            .then(data => {
                if (data.result == "FAIL"){
                        return alert("실패 " + data.data);
                    }
                setFeedbackSearchCount(data.data);
            })
    }

    const searchPageOnChange = (e: number) => setSearchPage(e);

    const resetFeedback = () => {
        api.get.feedback("stand",selectFilter,(currentPage - 1) * 10,10)
            .then(data=>setFeedback(data.data))
        api.get.feedback("representative",representativeFilter,(representativeCurrentPage - 1) * 10,10)
            .then(data=>setFeedback(data.data))
        api.get.feedback("stand","likeCount",0,10)
            .then(data=>setFeedbackTop(data.data))
        api.get.feedback("progress","likeCount",0,100)
            .then(data=>setFeedbackProgress(data.data))
        api.get.feedback("completed","likeCount",0,100)
            .then(data=>setFeedbackCompleted(data.data))
        api.get.feedback("notification","likeCount",0,100)
            .then(data=>setFeedbackNotification(data.data))
        api.get.feedbackCount("stand")
            .then(data=>setFeedbackCount(data.data))
        api.get.feedbackCount("representative")
            .then(data=>setFeedbackRepresentativeCount(data.data))
    }

    useEffect(()=>{
        api.get.feedback("stand","likeCount",0,10)
            .then(data=>setFeedbackTop(data.data))
        api.get.feedback("progress","likeCount",0,100)
            .then(data=>setFeedbackProgress(data.data))
        api.get.feedback("completed","likeCount",0,100)
            .then(data=>setFeedbackCompleted(data.data))
        api.get.feedback("notification","likeCount",0,100)
            .then(data=>setFeedbackNotification(data.data))
        api.get.feedbackCount("stand")
            .then(data=>setFeedbackCount(data.data))
        api.get.feedbackCount("representative")
            .then(data=>setFeedbackRepresentativeCount(data.data))
    },[])

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const id = params.get('id');
        const ext = params.get('ext');
        if (id != null){
            setModalData(prev=>({
                ...prev,
                isLoading:true
            }))
            setShow(true);
            api.get.feedbackItem(Number(id))
                .then(data => {
                    if (data.result == "FAIL"){
                        setModalData(prev=>({
                            ...prev,
                            isLoading:false
                        }))
                        setShow(false);
                        return alert("잘못된 ID 입니다.");
                    }
                    if (data.data.absorption != null){
                        navigate(`/?id=${data.data.absorption}&ext=${id}`,{replace:false});
                        return
                    }
                    setModalData(prev=>({
                        ...prev,
                        id:data.data.id,
                        title:data.data.title,
                        content:data.data.content,
                        comment:data.data.comment,
                        likeCount:data.data.likeCount,
                        dislikeCount:data.data.dislikeCount,
                        absorptionList:data.data.absorptionList,
                        badge:data.data.badge,
                        isDeleted:data.data.isDeleted,
                        category:data.data.category,
                        createdAt:data.data.createdAt,
                        isLoading:false
                    }))
                    setIsEdit(false);
                })
        }
        if (ext != null){
            api.get.feedbackItem(Number(ext))
                .then(data=>{
                    if (data.result == "FAIL"){
                        setExtraData(prev=>({
                            ...prev,
                            isLoading:false
                        }))
                        setShow(false);
                        return alert("잘못된 EXTRA ID 입니다.");
                    }
                    setExtraData(prev=>({
                        ...prev,
                        id:data.data.id,
                        title:data.data.title,
                        content:data.data.content,
                        comment:data.data.comment,
                        likeCount:data.data.likeCount,
                        dislikeCount:data.data.dislikeCount,
                        absorptionList:data.data.absorptionList,
                        badge:data.data.badge,
                        isDeleted:data.data.isDeleted,
                        category:data.data.category,
                        createdAt:data.data.createdAt,
                        isLoading:false
                    }))
                })
        }
        else {
            initalExtra();
        }
    }, [location]);

    useEffect(()=>{
        api.get.feedback("stand",selectFilter,(currentPage - 1) * 10,10)
            .then(data=>setFeedback(data.data))
    },[currentPage,selectFilter])

    useEffect(()=>{
        api.get.feedback("representative",representativeFilter,(representativeCurrentPage - 1) * 10,10)
            .then(data=>setFeedbackRepresentative(data.data))
    },[representativeCurrentPage,representativeFilter])

    useEffect(()=>{
        api.get.searchFeedback("stand",searchFilter,search,(searchPage - 1) * 10,10)
            .then(data=>setFeedbackSearch(data.data))
    },[searchPage,searchFilter])

    function accordionItem(id: number, title: string, content: string, likeCount: number, dislikeCount: number,absorption: number | null, absorptionList: string[] | null, category: ICategory, badge: string[],isNotification: boolean){
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
                    {absorption &&
                        <Badge className="ms-1" style={{cursor:"default"}} bg="secondary">⇄ #{absorption}로 병합됨</Badge>
                    }
                    {(absorptionList?.length != 0) &&
                        <Badge className="ms-1" style={{cursor:"default"}} bg="primary">#{id} 통합의견</Badge>
                    }
                    </div>
                    <div className="text-muted form-text">
                    {content}
                    </div>
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

    function Feedback({data}:{data:IFeedback[]}) {
        return (
            <>
                {data.map(data =>{
                    return (accordionItem(data.id,data.title,data.content,data.likeCount,data.dislikeCount,data.absorption,data.absorptionList,data.category,data.badge,data.isNotification))
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
                        <Feedback data={feedbackNotification}/>
                    </ul>
                    <h3 className="mt-4 d-inline-flex">진행중</h3>
                    <ul className="list-group mt-3">
                        <Feedback data={feedbackProgress}/>
                    </ul>
                    <h3 className="mt-4 d-inline-flex">완료됨</h3>
                    <ul className="list-group mt-3">
                        <Feedback data={feedbackCompleted}/>
                    </ul>
                        <h3 className='mt-4'>대기중</h3>
                    <ul className="list-group mt-3">
                        <Feedback data={feedbackTop}/>
                    </ul>
                </Tab>
                <Tab eventKey="stand" title="대기중">
                    <div className='tab-container d-flex'>
                        <h3>대기중</h3>
                        <Form.Select className="tab-select" defaultValue={"latest"} onChange={selectFilterOnChange}>
                            <option value="likeCount">추천순</option>
                            <option value="latest">최신순</option>
                            <option value="oldest">오래된순</option>
                        </Form.Select>
                    </div>
                    <ul className="list-group mt-3">
                        <Feedback data={feedback}/>
                    </ul>
                    <div className='mt-5'>
                        <MyPaginationComponent
                            totalPages={Math.ceil(feedbackCount / 10)}
                            currentPage={currentPage}
                            onPageChange={currentPageOnChange}
                        />
                    </div>
                </Tab>
                <Tab eventKey="representative" title="통합의견">
                    <div className='tab-container d-flex'>
                        <h3>통합의견</h3>
                        <Form.Select className="tab-select" defaultValue={"likecount"} onChange={representativeFilterOnChange}>
                            <option value="likeCount">추천순</option>
                            <option value="latest">최신순</option>
                            <option value="oldest">오래된순</option>
                        </Form.Select>
                    </div>
                    <ul className="list-group mt-3">
                        <Feedback data={feedbackRepresentative}/>
                    </ul>
                    <div className='mt-5'>
                        <MyPaginationComponent
                            totalPages={Math.ceil(feedbackRepresentativeCount / 10)}
                            currentPage={representativeCurrentPage}
                            onPageChange={representativeCurrentPageOnChange}
                        />
                    </div>
                </Tab>
                <Tab eventKey="search" title="검색">
                    <div className='tab-container d-flex'>
                        <InputGroup className="search">
                            <Form.Control placeholder="검색할 내용을 입력해주세요." onKeyDown={(e)=>{
                                if (e.key == "Enter"){
                                    searchEvent(search,searchFilter);
                                }
                            }} value={search} onChange={searchOnChange}/>
                            <Button variant="outline-secondary" id="button-addon2" onClick={()=>searchEvent(search,searchFilter)}>
                            검색
                            </Button>
                        </InputGroup>
                        <Form.Select className="tab-select" defaultValue={"likeCount"} onChange={searchFilterOnChange}>
                            <option value="likeCount">추천순</option>
                            <option value="latest">최신순</option>
                            <option value="oldest">오래된순</option>
                        </Form.Select>
                    </div>
                    <ul className="list-group mt-3">
                        <Feedback data={feedbackSearch}/>
                    </ul>
                    <div className='mt-5'>
                        <MyPaginationComponent
                            totalPages={Math.ceil(feedbackSearchCount / 10)}
                            currentPage={searchPage}
                            onPageChange={searchPageOnChange}
                        />
                    </div>
                </Tab>
            </Tabs>
        </div>
        <div id="footer"></div>
        <FeedbackModal modalData={modalData} extraData={extraData} show={show} isEdit={isEdit} setIsEdit={setIsEdit} handleClose={handleClose} resetFeedback={resetFeedback} isAdmin={false} modalUserId='' modalIp=''/>
    </>)
}

export default Index