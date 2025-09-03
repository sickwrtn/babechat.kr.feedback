import {Form, Tab, Tabs, InputGroup, Button} from 'react-bootstrap';
import { useEffect, useState } from 'react';
import Sumbit from './sumbit';
import FeedbackModal from './modal';
import { setStrict } from './strict';
import {IFeedback,IFilter} from './interfaces'
import { IModalData } from './interfaces';
import { useLocation, useNavigate } from 'react-router-dom';
import { Auth, sillo, Vaild } from './sdk';
import { useTranslation } from 'react-i18next';
import { Taeho } from './component';
import channelTalk from './channelTalk';
import { getCookie } from './cookie';
import { _Alert } from './function';

/**
 * 메인페이지
 * [작성자의 말]
 * 클린코드 ㅈ까 ㅋㅋ
 */

function Index() {
    
    //채널톡 부트
    useEffect(()=>{
        if (getCookie("bc__session_refresh") != undefined){
            const jwt = (getCookie("bc__session_refresh") as string).split(".")[1];
            const userId = JSON.parse(atob(jwt)).userId;
            channelTalk.boot({
                "memberId": userId,
            })
        }
        else {
            channelTalk.boot({})
        }
    },[])
    //i18n 선언
    const { t, i18n } = useTranslation();

    setStrict(()=>{})
    // auth_token 이 localStorage에 없을시 발급
    useEffect(()=>{
        if (localStorage.getItem("auth_token") == null){
            Auth().then(data => {
                localStorage.setItem("auth_token",data.data);
            })
        }
        else {
            Vaild().then(data => {
                if (data.result == "FAIL"){
                        localStorage.removeItem("auth_token");
                        window.location.reload();
                    }
            })
        }
    },[])
    // sdk 선언
    const api = new sillo(localStorage.getItem("auth_token") as string);

    // modal 이 열려있는지
    const [show, setShow] = useState(false);
    
    //navigate 선언
    const navigate = useNavigate();

    //location 선언
    const location = useLocation();

    /**
     * modal 닫을시 이벤트
     */
    const handleClose = () => {
        navigate(location.pathname,{replace:false});
        setShow(false)
    };

    /**
     * 피드백 편집기가 열려있는지
     */
    const [isEdit,setIsEdit] = useState(false);

    /**
     * 피드백 리스트 (대기중/stand)
     */
    const [feedback, setFeedback] = useState<IFeedback[]>([]);

    /**
     * 대기중 피드백 개수 (페이지네이션)
     */
    const [feedbackCount,setFeedbackCount] = useState<number>(0);

    /**
     * 피드백 리스트 (진행중/progress)
     */
    const [feedbackProgress,setFeedbackProgress] = useState<IFeedback[]>([]);

    /**
     * 피드백 리스트 (완료됨/completed)
     */
    const [feedbackCompleted,setFeedbackCompleted] = useState<IFeedback[]>([]);

    /**
     * 피드백 리스트 (공지사항/notification)
     */
    const [feedbackNotification,setFeedbackNotification] = useState<IFeedback[]>([]);

    /**
     * 피드백 리스트 (통합의견/representative)
     */
    const [feedbackRepresentative,setFeedbackRepresentative] = useState<IFeedback[]>([]);

    /**
     * 피드백 리스트 (대기중/stand) (추천순/likeCount)
     */
    const [feedbackTop, setFeedbackTop] = useState<IFeedback[]>([])

    /**
     * 검색된 피드백 리스트 
     */
    const [feedbackSearch, setFeedbackSearch] = useState<IFeedback[]>([]);

    /**
     * 통합의견 피드백 개수 (페이지 네이션)
     */
    const [feedbackRepresentativeCount,setFeedbackRepresentativeCount] = useState<number>(0);

    /**
     * 검색된 피드백 개수 (페이지 네이션)
     */
    const [feedbackSearchCount, setFeedbackSearchCount] =useState<number>(0);
    
    /**
     * 검색 쿼리
     */
    const [search, setSearch] = useState<string>("");

    /**
     * 검색 쿼리 onChange
     */
    const searchOnChange = (e: any) => setSearch(e.target.value);

    /**
     * modal에 들어갈 내용 
     */
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

    /**
     * modal중 Extra에 표시될 내용
     */
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

    /**
     * modal 중 Extra 내용 초기화
     */
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

    /**
     * 피드백 리스트 필터 (대기중/stand)
     */
    const [selectFilter, setSelectFilter] = useState<IFilter>("latest");

    /**
     * 피드백 리스트 필터 (대기중/stand) onChange
     */
    const selectFilterOnChange = (val: any) => setSelectFilter(val.target.value);

    /**
     * 피드백 리스트 필터 (통합의견/representative)
     */
    const [representativeFilter, setRepresentativeFilter] = useState<IFilter>("likeCount");

    /**
     * 피드백 리스트 필터 (통합의견/representative) onChange
     */
    const representativeFilterOnChange = (val: any) => setRepresentativeFilter(val.target.value);

    /**
     * 검색된 피드백 리스트 필터
     */
    const [searchFilter, setSearchFilter] = useState<IFilter>("likeCount");

    /**
     * 검색된 피드백 리스트 필터 onChange
     */
    const searchFilterOnChange = (val: any) => setSearchFilter(val.target.value);

    /**
     * 대기중 탭의 현재 페이지 (페이지네이션)
     */
    const [currentPage,setCurrentPage] = useState<number>(1);

    /**
     * 대기중 탭의 현재 페이지 (페이지네이션) onChange
     */
    const currentPageOnChange = (e:number) => setCurrentPage(e); 

    /**
     * 통합의견 탭의 현재 페이지 (페이지네이션)
     */
    const [representativeCurrentPage,setRepresentativeCurrentPage] = useState<number>(1);

    /**
     * 통합의견 탭의 현재 페이지 (페이지네이션) onChange
     */
    const representativeCurrentPageOnChange = (e:number) => setRepresentativeCurrentPage(e);

    /**
     * 검색 탭의 현재 페이지 (페이지네이션)
     */
    const [searchPage,setSearchPage] = useState<number>(1);

    /**
     * 검색 이벤트 
     * @param keyword 검색할 키워드
     * @param filter 필터
     */
    const searchEvent = (keyword: string,filter: IFilter) => {
        api.get.searchFeedback("stand", filter, keyword, 0, 10)
            .then(data =>{ 
                    if (data.result == "FAIL"){
                        return alert(`${t("alert.searchFeedback")}  ${data.data}`);
                    }
                    setFeedbackSearch(data.data);
                })
        api.get.searchFeedbackCount("stand", keyword)
            .then(data => {
                if (data.result == "FAIL"){
                        return alert(`${t("alert.searchFeedbackCount")}  ${data.data}`);
                    }
                setFeedbackSearchCount(data.data);
            })
    }

    /**
     * 검색 탭의 현재 페이지 (페이지네이션) onChange 
     */
    const searchPageOnChange = (e: number) => setSearchPage(e);

    /**
     * 모든 피드백 리스트 새로 고침
     */
    const resetFeedback = () => {
        api.get.feedback("stand",selectFilter,(currentPage - 1) * 10,10)
            .then(data=>setFeedback(data.data))
        api.get.feedback("representative",representativeFilter,(representativeCurrentPage - 1) * 10,10)
            .then(data=>setFeedbackRepresentative(data.data))
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


    // 모든 피드백 리스트 초기화
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

    /*
    설명하기가 좀 힘든데
    일단 get 파라미터 상에서 id ext를 정하고 그에 따라 피드백 내용을 표시하기위한?
    그런 기능
    */
    useEffect(() => {
        // 현재 url 상에서 파라미터 얻기
        const params = new URLSearchParams(location.search);
        /**
         * 현재 보여지는 피드백 id
         */
        const id = params.get('id');
        /**
         * 현재 보여지는 extra 피드백 id
         */
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
                        return _Alert(t("alert.feedbackItem"),"fail");
                    }
                    if (data.data.absorption != null){
                        navigate(location.pathname + `?id=${data.data.absorption}&ext=${id}`,{replace:false});
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
                        return _Alert(t("alert.feedbackItemExtra"),"fail");
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

    // 필터 혹은 페이지가 바뀌었을 경우 피드백 리스트 조회 범위 변경 n ~ n + 10
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
    return (
    <div lang={i18n.language}>
        <div id="sumbit" className='border rounded'>
            <Sumbit resetFeedback={resetFeedback} isAdmin={false}/>
        </div>
        <div id="feed">
            <Tabs defaultActiveKey="main" id="uncontrolled-tab-example" className="mb-3">
                <Tab eventKey="main" title={t("tab.main")}>
                    <h3>{t("tab.notification")}</h3>
                    <ul className="list-group mt-3">
                        <Taeho.Feedback data={feedbackNotification}/>
                    </ul>
                    <h3 className="mt-4 d-inline-flex">{t("tab.progress")}</h3>
                    <ul className="list-group mt-3">
                        <Taeho.Feedback data={feedbackProgress}/>
                    </ul>
                    <h3 className="mt-4 d-inline-flex">{t("tab.completed")}</h3>
                    <ul className="list-group mt-3">
                        <Taeho.Feedback data={feedbackCompleted}/>
                    </ul>
                        <h3 className='mt-4'>{t("tab.stand")}</h3>
                    <ul className="list-group mt-3">
                        <Taeho.Feedback data={feedbackTop}/>
                    </ul>
                </Tab>
                <Tab eventKey="stand" title={t("tab.stand")}>
                    <div className='tab-container d-flex'>
                        <h3>{t("tab.stand")}</h3>
                        <Taeho.Desc onChange={selectFilterOnChange}/>
                    </div>
                    <ul className="list-group mt-3">
                        <Taeho.Feedback data={feedback}/>
                    </ul>
                    <div className='mt-5'>
                        <Taeho._Pagination
                            totalPages={Math.ceil(feedbackCount / 10)}
                            currentPage={currentPage}
                            onPageChange={currentPageOnChange}
                        />
                    </div>
                </Tab>
                <Tab eventKey="representative" title={t("tab.representative")}>
                    <div className='tab-container d-flex'>
                        <h3>{t("tab.representative")}</h3>
                        <Taeho.Desc onChange={representativeFilterOnChange}/>
                    </div>
                    <ul className="list-group mt-3">
                        <Taeho.Feedback data={feedbackRepresentative}/>
                    </ul>
                    <div className='mt-5'>
                        <Taeho._Pagination
                            totalPages={Math.ceil(feedbackRepresentativeCount / 10)}
                            currentPage={representativeCurrentPage}
                            onPageChange={representativeCurrentPageOnChange}
                        />
                    </div>
                </Tab>
                <Tab eventKey="search" title={t("tab.search")}>
                    <div className='tab-container d-flex'>
                        <InputGroup className="search">
                            <Form.Control placeholder={t("search.search_placeholder")} onKeyDown={(e)=>{
                                if (e.key == "Enter"){
                                    searchEvent(search,searchFilter);
                                }
                            }} value={search} onChange={searchOnChange}/>
                            <Button variant="outline-secondary" id="button-addon2" onClick={()=>searchEvent(search,searchFilter)}>
                            {t("search.search")}
                            </Button>
                        </InputGroup>
                        <Taeho.Desc onChange={searchFilterOnChange}/>
                    </div>
                    <ul className="list-group mt-3">
                        <Taeho.Feedback data={feedbackSearch}/>
                    </ul>
                    <div className='mt-5'>
                        <Taeho._Pagination
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
    </div>
    )
}

export default Index