import './main.css'
import { FormControl, Button, Form ,ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

export default function Sumbit({resetFeedback}:{resetFeedback: ()=>void}){
    
    const [title,setTitle] = useState("");

    const [content,setContent] = useState("");
    
    const [password,setPassword] = useState("");

    const titleOnChange = (e: any) => setTitle(e.target.value);

    const contentOnChange = (e: any) => setContent(e.target.value);

    const passwordOnChange = (e: any) => setPassword(e.target.value);
    
    const [titleIsVaild,setTitleVaild] = useState(false);
    
    const [contentIsVaild,setContentVaild] = useState(false);

    const [passwordIsVaild,setPasswordVaild] = useState(false);

    const [category, setCategory] = useState<1 | 2 | 3>(1);

    const categoryOnChange = (val: any) => setCategory(val);

    const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
    
    const recaptchaOnChange = (val: any) => setRecaptchaToken(val);

    const recaptchaRef = useRef(null as any);
    
    const [isDarkmode,setIsDarkmode] = useState<boolean>((():boolean =>{
            if (localStorage.getItem("them") == null){
                localStorage.setItem("them","light");
                return false
            }
            else if (localStorage.getItem("them") == "light"){
                return false;
            }
            else if (localStorage.getItem("them") == "dark"){
                return true;
            }
            return false
        })());
    
    const isDarkmodeOnChange = (e: any) => setIsDarkmode(e.target.checked);

    const resetRecaptcha = () => {
        if (recaptchaRef.current) {
        recaptchaRef.current.reset(); // reCAPTCHA 체크박스 초기화
        setRecaptchaToken(null); // 저장된 토큰도 초기화
        }
    };

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

        const res2 = await fetch("https://babe-api.fastwrtn.com/feedback",{method:"POST",headers:{"Content-Type" : "application/json"},body:JSON.stringify({
            title:title,
            content:content,
            category:category,
            password:password
        })})
        const data = await res2.json()
        if (data.result == "FAIL" && data.data == "ban"){
            return alert(`차단되었습니다. 사유 : ${data.reason} 해제시간 : ${data.reason}`);
        }
        else {
            return alert(`error ${data.data}`);
        }
        alert("건의사항 제출 성공!");
        resetRecaptcha();
        resetFeedback();
        setTitle("");
        setContent("");
    }

    useEffect(() => {
        if (isDarkmode){
            localStorage.setItem("them","dark");
            document.documentElement.setAttribute('data-bs-theme', "dark");
        }
        else {
            localStorage.setItem("them","light");
            document.documentElement.setAttribute('data-bs-theme', "light");
        }                              
    }, [isDarkmode]);

    return (
        <Form.Group className="m-4">
        <Form.Check // prettier-ignore
            type="switch"
            className='mb-3'
            label="다크 모드"
            checked={isDarkmode}
            onChange={isDarkmodeOnChange}
        />
        <Form.Label>제목</Form.Label>
        <FormControl type="text" className='mb-3' placeholder="제목은 직관적이게 써주세요." value={title} onChange={titleOnChange} isInvalid={titleIsVaild}/>
        <Form.Label>내용</Form.Label>
        <FormControl type="text" className='mb-3' placeholder="건의사항을 구체적으로 적어주세요. (마크다운 사용 가능)" as="textarea" rows={3} value={content} onChange={contentOnChange} isInvalid={contentIsVaild}/> {/* 기본 3줄 높이 */}
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
    )
} 