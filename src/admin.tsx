import './main.css'
import { FormControl, Button, Form, Badge, Tab, Tabs, Table, InputGroup} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import Sumbit from './sumbit';
import FeedbackModal from './modal';
import { setStrict } from './strict';
import {IFeedback,IResponse,IFilter,ICategory, IBan} from './interfaces'
import { IModalData } from './interfaces';
import { useLocation, useNavigate } from 'react-router-dom';
import MyPaginationComponent from './page';
import { sillo } from './sdk';
import { useTranslation } from 'react-i18next';

function compressIPv6(ipv6Address:string):string {
   return ipv6Address.split(":").slice(3,7).join(":");
}

function isIPv6(ipString: string): boolean {
    // 1. 빈 문자열 또는 너무 길거나 짧은 경우 (최소 "::1", 최대 39자)
    if (!ipString || ipString.length < 2 || ipString.length > 39) {
        return false;
    }

    // 2. 더블 콜론(::) 개수 확인
    const doubleColonCount = (ipString.match(/::/g) || []).length;
    if (doubleColonCount > 1) {
        return false; // ::는 한 번만 사용 가능
    }

    // 3. 콜론으로 시작하거나 끝나는 경우 (특수 케이스 :: 제외)
    // "::1"은 유효, "1::"도 유효. 하지만 ":1"이나 "1:"은 유효하지 않음.
    if (ipString.startsWith(':') && !ipString.startsWith('::')) {
        return false;
    }
    if (ipString.endsWith(':') && !ipString.endsWith('::')) {
        return false;
    }

    // 4. IPv4-mapped IPv6 주소 처리 (예: ::ffff:192.168.1.1)
    // 마지막 블록이 IPv4 주소 형태인지 확인
    const lastColonIndex = ipString.lastIndexOf(':');
    if (lastColonIndex !== -1 && ipString.substring(lastColonIndex + 1).includes('.')) {
        // IPv4 주소 유효성 검사는 별도로 필요할 수 있으나, 여기서는 단순 IPv6 형식만 검사
        // 이 경우, 마지막 콜론 이후 부분을 IPv4로 간주하고 앞부분만 IPv6 헥스텟으로 검사
        const parts = ipString.split(':');
        // ::ffff:192.168.1.1 형태라면, 마지막 2개의 헥스텟(ffff, c0a8) 대신 IPv4 주소가 오는 것
        // 따라서 IPv6 블록 개수는 6개여야 함. (예: `a:b:c:d:e:f:192.168.1.1`이면 7개 파트)
        if (parts.length < 2 || parts.length > 8) { // 최소 2개 (::192.168.1.1) 최대 7개 (a:b:c:d:e:f:192.168.1.1)
             // 여기서 8개를 넘는 경우를 방지
             return false;
        }

        // 마지막 부분을 IPv4 주소로 간주하고 유효성 검사 (아주 기본적인)
        const ipv4Part = parts[parts.length - 1];
        const ipv4Segments = ipv4Part.split('.');
        if (ipv4Segments.length !== 4) {
            return false;
        }
        for (const segment of ipv4Segments) {
            const num = parseInt(segment, 10);
            if (isNaN(num) || num < 0 || num > 255 || segment.length === 0 || (segment.length > 1 && segment.startsWith('0'))) {
                return false; // 유효하지 않은 숫자 또는 선행 0
            }
        }

        // IPv4 부분이 유효하다면, 나머지 앞부분의 IPv6 헥스텟을 검사
        const ipv6HexParts = parts.slice(0, parts.length - 1);
        // ::가 사용된 경우 빈 문자열이 생길 수 있으므로, 실제 헥스텟만 필터링
        const actualHexParts = ipv6HexParts.filter(part => part !== '');

        if (doubleColonCount === 1) { // ::가 사용된 경우
            // ::ffff:192.168.1.1 -> parts = ["", "", "ffff", "192.168.1.1"]
            // ipv6HexParts = ["", "", "ffff"] -> actualHexParts = ["ffff"]
            // 헥스텟 개수는 1개 (ffff) + IPv4가 대체하는 2개 헥스텟 (총 3개)
            // 원래 8개 헥스텟 중 IPv4가 2개 헥스텟 대체, ::가 나머지 0 헥스텟 대체
            // 따라서 실제 보이는 헥스텟은 6개 미만이어야 함
            if (actualHexParts.length > 6) {
                return false;
            }
        } else { // ::가 사용되지 않은 경우
            // a:b:c:d:e:f:192.168.1.1 형태는 6개의 헥스텟이 존재해야 함
            if (actualHexParts.length !== 6) {
                return false;
            }
        }

        // 이제 각 헥스텟의 유효성만 검사
        for (const hexPart of actualHexParts) {
            if (!/^[0-9a-fA-F]{1,4}$/.test(hexPart)) {
                return false;
            }
        }
        return true;
    }


    // 5. 일반적인 IPv6 주소 처리 (IPv4-mapped 아님)
    let parts = ipString.split(':');
    let blockCount = parts.length;

    // 더블 콜론이 사용된 경우
    if (doubleColonCount === 1) {
        // "::"로 스플릿하면 "::" 양쪽에 빈 문자열이 생김
        // "2001::1" -> ["2001", "1"]
        // "::1" -> ["", "1"]
        // "1::" -> ["1", ""]
        // "::" -> ["", ""]
        const doubleColonParts = ipString.split('::');
        if (doubleColonParts.length !== 2) {
            // 이전에 doubleColonCount를 검사했으므로, 이 경우는 보통 발생하지 않음
            return false;
        }

        const leftBlocks = doubleColonParts[0].split(':').filter(b => b !== '');
        const rightBlocks = doubleColonParts[1].split(':').filter(b => b !== '');

        // 양쪽 블록의 합이 7개 이하여야 한다 (::가 최소 하나의 0 블록을 대체)
        if (leftBlocks.length + rightBlocks.length >= 8) {
            return false;
        }

        // 각 헥스텟의 유효성 검사
        for (const part of leftBlocks.concat(rightBlocks)) {
            if (!/^[0-9a-fA-F]{1,4}$/.test(part)) {
                return false;
            }
        }
    } else { // 더블 콜론이 사용되지 않은 경우
        if (blockCount !== 8) {
            return false; // 정확히 8개의 블록이 있어야 함
        }
        // 각 헥스텟의 유효성 검사
        for (const part of parts) {
            if (!/^[0-9a-fA-F]{1,4}$/.test(part)) {
                return false;
            }
        }
    }

    return true;
}

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

    const { t } = useTranslation();

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
            <Form.Label>{t("admin.password")}</Form.Label>
            <FormControl type="text" className='mb-3' style={{width:"40%"}} placeholder={t("admin.password_placeholder")} value={adminPassword} onChange={adminPasswordOnChange}/>
            <Button variant="success" id="button-addon1" onClick={()=>adminFormOnClick(adminPassword)}>{t("admin.sumbit")}</Button>
        </Form.Group>
        </>)
    }

    const api = new sillo(localStorage.getItem("auth_token") as string);

    const [show, setShow] = useState<boolean>(false);
    const navigate = useNavigate();
    const location = useLocation();
    const handleClose = () => {
        navigate('/sick/admin',{replace:false});
        setShow(false)
    };

    const [feedback, setFeedback] = useState<IFeedback[]>([]);

    const [feedbackCount, setFeedbackCount] = useState<number>(0);

    const [feedbackProgress,setFeedbackProgress] = useState<IFeedback[]>([]);

    const [feedbackCompleted,setFeedbackCompleted] = useState<IFeedback[]>([]);

    const [feedbackNotification,setFeedbackNotification] = useState<IFeedback[]>([]);

    const [feedbackRepresentative,setFeedbackRepresentative] = useState<IFeedback[]>([]);

    const [feedbackRepresentativeCount,setFeedbackRepresentativeCount] = useState<number>(0);

    const [feedbackDeleted,setFeedbackDeleted] = useState<IFeedback[]>([]);

    const [feedbackDeletedCount, setFeedbackDeletedCount] = useState<number>(0);

    const [feedbackTop,setFeedbackTop] = useState<IFeedback[]>([]);

    const [feedbackSearch, setFeedbackSearch] = useState<IFeedback[]>([]);

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

    const [isEdit,setIsEdit] = useState<boolean>(false);

    const [selectFilter, setSelectFilter] = useState<IFilter>("latest");

    const [deleteSelectFilter, setDeleteSelectFilter] = useState<IFilter>("latest");

    const [searchFilter, setSearchFilter] = useState<IFilter>("likeCount");

    const [representativeFilter, setRepresentativeFilter] = useState<IFilter>("likeCount");

    const selectFilterOnChange = (val: any) => setSelectFilter(val.target.value);

    const deleteSelectFilterOnChange = (val: any) => setDeleteSelectFilter(val.target.value);

    const representativeFilterOnChange = (val: any) => setRepresentativeFilter(val.target.value);

    const searchFilterOnChange = (val: any) => setSearchFilter(val.target.value);

    const [modalUserId, setModalUserId] = useState<string>("");

    const [modalIp, setModalIp] = useState<string>("");

    const [ban,setBan] = useState<IBan[]>([]);

    const [standCurrentPage,setStandCurrentPage] = useState<number>(1);

    const [representativeCurrentPage,setRepresentativeCurrentPage] = useState<number>(1);

    const [deleteCurrentPage,setDeleteCurrentPage] = useState<number>(1);

    const [searchPage,setSearchPage] = useState<number>(1);

    const searchPageOnChange = (e: number) => setSearchPage(e);

    const searchEvent = (keyword: string,filter: IFilter) => {
        api.getAdmin.searchFeedback("stand", filter, keyword, 0, 10)
        .then(data =>{ 
                if (data.result == "FAIL"){
                    return alert(`${t("alert.searchFeedback")} ${data.data}`);
                }
                setFeedbackSearch(data.data);
            })
        api.getAdmin.searchFeedbackCount("stand", keyword)
            .then(data => {
                if (data.result == "FAIL"){
                        return alert(`${t("alert.searchFeedbackCount")} ${data.data}`);
                    }
                setFeedbackSearchCount(data.data);
            })
    }

    const resetFeedback = () => {
        api.getAdmin.feedback("stand",selectFilter,(standCurrentPage - 1) * 10,10)
            .then(data=>setFeedback(data.data))
        api.getAdmin.feedback("representative",representativeFilter,(representativeCurrentPage - 1) * 10,10)
            .then(data=>setFeedbackRepresentative(data.data))
        api.getAdmin.feedback("deleted",deleteSelectFilter,(deleteCurrentPage - 1) * 10,10)
            .then(data=>setFeedbackDeleted(data.data))
        api.getAdmin.feedback("progress","likeCount",0,100)
            .then(data=>setFeedbackProgress(data.data))
        api.getAdmin.feedback("completed","likeCount",0,100)
            .then(data=>setFeedbackCompleted(data.data))
        api.getAdmin.feedback("notification","likeCount",0,100)
            .then(data=>setFeedbackNotification(data.data))
        api.getAdmin.FeedbackCount("stand")
            .then(data=>setFeedbackCount(data.data))
        api.getAdmin.FeedbackCount("representative")
            .then(data=>setFeedbackRepresentativeCount(data.data))
        api.getAdmin.FeedbackCount("deleted")
            .then(data=>setFeedbackDeletedCount(data.data))
    }

    const resetBan = () => {
        api.getAdmin.ban()
            .then(data=>setBan(data.data))
    }

    useEffect(()=>{
        api.getAdmin.feedback("stand","likeCount",0,10)
            .then(data=>setFeedbackTop(data.data))
        api.getAdmin.feedback("progress","likeCount",0,100)
            .then(data=>setFeedbackProgress(data.data))
        api.getAdmin.feedback("completed","likeCount",0,100)
            .then(data=>setFeedbackCompleted(data.data))
        api.getAdmin.feedback("notification","likeCount",0,100)
            .then(data=>setFeedbackNotification(data.data))
        api.getAdmin.ban()
            .then(data=>setBan(data.data))
        api.getAdmin.FeedbackCount("stand")
            .then(data=>setFeedbackCount(data.data))
        api.getAdmin.FeedbackCount("representative")
            .then(data=>setFeedbackRepresentativeCount(data.data))
        api.getAdmin.FeedbackCount("deleted")
            .then(data=>setFeedbackDeletedCount(data.data))
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
            api.getAdmin.feedbackItem(Number(id))
                .then(data=>{
                    if (data.result == "FAIL"){
                        setModalData(prev=>({
                            ...prev,
                            isLoading:false
                        }))
                        setShow(false);
                        return alert(t("alert.feedbackItem"));
                    }
                    if (data.data.absorption != null){
                        navigate(`/sick/admin?id=${data.data.absorption}&ext=${id}`,{replace:false});
                        return;
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
                    setModalUserId(data.data.userId as string);
                    setModalIp(data.data.ip as string);
                    setIsEdit(false);
                })
        }
        if (ext != null){
            api.getAdmin.feedbackItem(Number(ext))
                .then(data=>{
                    if (data.result == "FAIL"){
                        setExtraData(prev=>({
                            ...prev,
                            isLoading:false
                        }))
                        setShow(false);
                        return alert(t("alert.feedbackItemExtra"));
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
        api.getAdmin.feedback("stand",selectFilter,(standCurrentPage - 1) * 10,10)
            .then(data=>setFeedback(data.data))
    },[standCurrentPage,selectFilter])

    useEffect(()=>{
        api.getAdmin.feedback("representative",representativeFilter,(representativeCurrentPage - 1) * 10,10)
            .then(data=>setFeedbackRepresentative(data.data))
    },[representativeCurrentPage,representativeFilter])

    useEffect(()=>{
        api.getAdmin.feedback("deleted",deleteSelectFilter,(deleteCurrentPage - 1) * 10,10)
            .then(data=>setFeedbackDeleted(data.data))
    },[deleteCurrentPage,deleteSelectFilter])

    useEffect(()=>{
        api.getAdmin.searchFeedback("stand",searchFilter,search,(searchPage - 1) * 10,10)
            .then(data=>setFeedbackSearch(data.data))
    },[searchPage,searchFilter])

    function accordionItem(id: number, title: string, content: string, likeCount: number, dislikeCount: number, absorption: number | null, absorptionList: string[] | null, category: ICategory, badge: string[],isNotification: boolean,ip: string){
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
                    {absorption &&
                        <Badge className="ms-1" style={{cursor:"default"}} bg="secondary">⇄ #{absorption}{t("accordionItem.absorption")}</Badge>
                    }
                    {(absorptionList?.length != 0) &&
                        <Badge className="ms-1" style={{cursor:"default"}} bg="primary">#{id} {t("accordionItem.representative")}</Badge>
                    }
                    <Badge className="ms-1 badge" text="white" bg="info">IP : { isIPv6(ip) && compressIPv6(ip)}{!isIPv6(ip) && ip}</Badge>
                    <Badge className="ms-1 badge" text="white" bg="primary">ID : {id}</Badge>
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

    function accordionItemAdmin(id: number, title: string, content: string, likeCount: number, dislikeCount: number, absorption: number | null, absorptionList: string[] | null, category: ICategory, badge: string[],isProgress:boolean,isCompleted:boolean,isNotification:boolean,ip: string){
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
                    <Badge className="ms-1 badge" text="white" bg="danger" >{t("tab.deleted")}</Badge>
                    {isProgress && <Badge className="ms-1 badge" text="white" bg="secondary" >{t("accordionItem.tab.progress")}</Badge>}
                    {isCompleted && <Badge className="ms-1 badge" text="white" bg="secondary" >{t("accordionItem.tab.completed")}</Badge>}
                    {isNotification && <Badge className="ms-1 badge" text="white" bg="secondary" >{t("accordionItem.tab.notification")}</Badge>}
                    {(!isProgress && !isCompleted && !isNotification) && <Badge className="ms-1 badge" text="white" bg="secondary" >{t("accordionItem.tab.stand")}</Badge>}
                    {absorption &&
                        <Badge className="ms-1" style={{cursor:"default"}} bg="secondary">⇄ #{absorption}{t("accordionItem.absorption")}</Badge>
                    }
                    {(absorptionList?.length != 0) &&
                        <Badge className="ms-1" style={{cursor:"default"}} bg="primary">#{id} {t("accordionItem.representative")}</Badge>
                    }
                    <Badge className="ms-1 badge" text="white" bg="info">IP : {isIPv6(ip) && compressIPv6(ip)}{!isIPv6(ip) && ip}</Badge>
                    <Badge className="ms-1 badge" text="white" bg="primary" >ID : {id}</Badge>
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

    function Feedback({data,isAdmin}:{data:IFeedback[],isAdmin:boolean}) {
        return (
            <> 
                {(!isAdmin) &&
                    <>
                        {data.map(data =>{
                            if (!data.isDeleted) return (accordionItem(data.id,data.title,data.content,data.likeCount,data.dislikeCount,data.absorption,data.absorptionList,data.category,data.badge,data.isNotification,data.ip as string))
                        })}
                    </>
                }
                {isAdmin &&
                    <>
                        {data.map(data=>{
                            return accordionItemAdmin(data.id,data.title,data.content,data.likeCount,data.dislikeCount,data.absorption,data.absorptionList,data.category,data.badge,data.isProgress,data.isCompleted,data.isNotification,data.ip as string)
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
            <Tabs defaultActiveKey="main" id="uncontrolled-tab-example" className="mb-3">
                <Tab eventKey="main" title={t("tab.main")}>
                    <h3>{t("tab.notification")}</h3>
                    <ul className="list-group mt-3">
                        <Feedback data={feedbackNotification} isAdmin={false} />
                    </ul>
                    <h3 className="mt-4 d-inline-flex">{t("tab.progress")}</h3>
                    <ul className="list-group mt-3">
                        <Feedback data={feedbackProgress} isAdmin={false} />
                    </ul>
                    <h3 className="mt-4 d-inline-flex">{t("tab.completed")}</h3>
                    <ul className="list-group mt-3">
                        <Feedback data={feedbackCompleted} isAdmin={false} />
                    </ul>
                    <h3 className='mt-4'>{t("tab.stand")}</h3>
                    <ul className="list-group mt-3">
                        <Feedback data={feedbackTop} isAdmin={false} />
                    </ul>
                </Tab>
                <Tab eventKey="stand" title={t("tab.stand")}>
                    <div className='tab-container d-flex'>
                        <h3>{t("tab.stand")}</h3>
                        <Form.Select className="tab-select" defaultValue={"latest"} onChange={selectFilterOnChange}>
                            <option value="likeCount">{t("desc.likeCount")}</option>
                            <option value="latest">{t("desc.latest")}</option>
                            <option value="oldest">{t("desc.oldest")}</option>
                        </Form.Select>
                    </div>
                    <ul className="list-group mt-3">
                        <Feedback data={feedback} isAdmin={false} />
                    </ul>
                    <div className='mt-5'>
                        <MyPaginationComponent
                                totalPages={Math.ceil(feedbackCount / 10)}
                                currentPage={standCurrentPage}
                                onPageChange={(e:any)=>setStandCurrentPage(e)}
                            />
                    </div>
                </Tab>
                <Tab eventKey="representative" title={t("tab.representative")}>
                    <div className='tab-container d-flex'>
                        <h3>{t("tab.representative")}</h3>
                        <Form.Select className="tab-select" defaultValue={"likeCount"} onChange={representativeFilterOnChange}>
                            <option value="likeCount">{t("desc.likeCount")}</option>
                            <option value="latest">{t("desc.latest")}</option>
                            <option value="oldest">{t("desc.oldest")}</option>
                        </Form.Select>
                    </div>
                    <ul className="list-group mt-3">
                        <Feedback data={feedbackRepresentative} isAdmin={false} />
                    </ul>
                    <div className='mt-5'>
                        <MyPaginationComponent
                                totalPages={Math.ceil(feedbackRepresentativeCount / 10)}
                                currentPage={representativeCurrentPage}
                                onPageChange={(e:any)=>setRepresentativeCurrentPage(e)}
                            />
                    </div>
                </Tab>
                <Tab eventKey="deleted" title={t("tab.deleted")}>
                    <div className='tab-container d-flex'>
                        <h3>{t("tab.deleted")}</h3>
                        <Form.Select className="tab-select" defaultValue={"latest"} onChange={deleteSelectFilterOnChange}>
                            <option value="likeCount">{t("desc.likeCount")}</option>
                            <option value="latest">{t("desc.latest")}</option>
                            <option value="oldest">{t("desc.oldest")}</option>
                        </Form.Select>
                    </div>
                    <ul className="list-group mt-3">
                        <Feedback data={feedbackDeleted} isAdmin={true} />
                    </ul>
                    <div className='mt-5'>
                        <MyPaginationComponent
                            totalPages={Math.ceil(feedbackDeletedCount / 10)}
                            currentPage={deleteCurrentPage}
                            onPageChange={(e:any)=>setDeleteCurrentPage(e)}
                        />
                    </div>
                </Tab>
                <Tab eventKey="search" title={t("tab.search")}>
                    <div className='tab-container d-flex'>
                        <InputGroup className="search">
                            <Form.Control placeholder={t("search.search_placeholder")} onKeyDown={(e)=>{
                                if (e.key == "Enter"){
                                    searchEvent(search,searchFilter)
                                }
                            }} value={search} onChange={searchOnChange}/>
                            <Button variant="outline-secondary" id="button-addon2" onClick={()=>searchEvent(search,searchFilter)}>
                            {t("search.search")}
                            </Button>
                        </InputGroup>
                        <Form.Select className="tab-select" defaultValue={"likeCount"} onChange={searchFilterOnChange}>
                            <option value="likeCount">{t("desc.likeCount")}</option>
                            <option value="latest">{t("desc.latest")}</option>
                            <option value="oldest">{t("desc.oldest")}</option>
                        </Form.Select>
                    </div>
                    <ul className="list-group mt-3">
                        <Feedback data={feedbackSearch} isAdmin={false} />
                    </ul>
                    <div className='mt-5'>
                        <MyPaginationComponent
                            totalPages={Math.ceil(feedbackSearchCount / 10)}
                            currentPage={searchPage}
                            onPageChange={searchPageOnChange}
                        />
                    </div>
                </Tab>
                <Tab eventKey="banList" title={t("tab.ban")}>
                    <h3>{t("ban.banList")}</h3>
                    <Table className="mt-4" striped bordered>
                        <thead>
                            <tr>
                            <th>#</th>
                            <th>IP</th>
                            <th>{t("ban.reason")}</th>
                            <th>{t("ban.expiredAt")}</th>
                            <th>{t("ban.createdAt")}</th>
                            <th>{t("ban.do")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ban.map(data => (
                                <tr>
                                    <td>{String(data.id)}</td>
                                    <td>{data.ip}</td>
                                    <td>{data.reason}</td>
                                    <td>{data.expiredAt}</td>
                                    <td>{data.createdAt}</td>
                                    <td><Button size='sm' onClick={()=>{
                                        fetch(`https://babe-api.fastwrtn.com/admin/ban?id=${data.id}`,{method:"DELETE",headers:{"Authorization":localStorage.getItem("auth_token") as string}})
                                            .then(res => res.json())
                                            .then((data: IResponse<string>)=> {
                                                if (data.result == "SUCCESS"){
                                                    alert(t("alert.unBanEvent.success"));
                                                    resetBan();
                                                }
                                                else{
                                                    alert(t("alert.unBanEvent.auth"));
                                                }
                                            })
                                    }}>{t("ban.unBan")}</Button></td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Tab>
            </Tabs>
        </div>
        <div id="footer"></div>
        <FeedbackModal modalData={modalData} extraData={extraData} show={show} isEdit={isEdit} setIsEdit={setIsEdit} handleClose={handleClose} resetFeedback={resetFeedback} isAdmin={true} modalUserId={modalUserId} modalIp={modalIp}/>
    </>)
}

export default Admin