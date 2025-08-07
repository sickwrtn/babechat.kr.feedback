import './main.css'
import { FormControl, Button, Form ,ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useTranslation } from 'react-i18next';
import { sillo } from './sdk';
import { ICategory } from './interfaces';

export default function Sumbit({resetFeedback, isAdmin}:{resetFeedback: ()=>void,isAdmin:boolean}){
    
    const { t } = useTranslation();

    const api = new sillo(localStorage.getItem("auth_token") as string);

    const [title,setTitle] = useState("");

    const [content,setContent] = useState("");
    
    const [password,setPassword] = useState("");

    const titleOnChange = (e: any) => setTitle(e.target.value);

    const contentOnChange = (e: any) => setContent(e.target.value);

    const passwordOnChange = (e: any) => setPassword(e.target.value);
    
    const [titleIsVaild,setTitleVaild] = useState(false);
    
    const [contentIsVaild,setContentVaild] = useState(false);

    const [passwordIsVaild,setPasswordVaild] = useState(false);

    const [category, setCategory] = useState<ICategory>(1);

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

    async function formOnClick(title:string,content:string,category: ICategory, password:string,recaptchaToken: string | null){
        const titleValid = title.trim().length > 0;
        const contentValid = content.trim().length > 0;
        const passwordValid = password.trim().length > 0;
    // 유효성 상태 업데이트
        setTitleVaild(!titleValid);
        setContentVaild(!contentValid);
        setPasswordVaild(!passwordValid);
        if (!titleValid || !contentValid || !passwordValid){
            return alert(t("alert.formOnClick.vaild"));
        }

        const res = await fetch("https://babe-api.fastwrtn.com/recaptcha",{method:"POST",headers:{"Content-Type" : "application/json"},body:JSON.stringify({
            recaptchaToken:recaptchaToken
        })})
        const res_json: any = await res.json();
        if (!(res_json.result == "SUCCESS")){
            resetRecaptcha();
            return alert(t("alert.formOnClick.reCaptcha"));
        }
        if (isAdmin){
            var res2: any = await api.postAdmin.feedback(title,content,category,password);
        }
        else {
            var res2: any = await api.post.feedback(title,content,category,password);
        }
        if (res2.result == "FAIL" && res2.data == "ban"){
            return alert(`${t("alert.formOnClick.Banned.content")} ${t("alert.formOnClick.Banned.reason")} : ${res2.reason} ${t("alert.formOnClick.Banned.expiredAt")} : ${res2.expiredAt}`);
        }
        else if (res2.result == "FAIL") {
            return alert(`${t("alert.formOnClick.error")} : ${res2.data}`);
        }
        if (isAdmin) alert(t("alert.formOnClick.successAdmin"));
        else alert(t("alert.formOnClick.success"));
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

    //const [language,setLanguage] = useState(i18n.language);

    //const languageOnChange = (val: any) => setLanguage(val);

    /*
    useEffect(()=>{
        i18n.changeLanguage(language);
    },[language])
    */
    return (
        <Form.Group className="m-4">
        {
            /*
            <ToggleButtonGroup className="d-inline-flex mt-2 mb-3" type="radio" name="options2" defaultValue={i18n.language} value={language} onChange={languageOnChange}>
                <ToggleButton id="language-3" variant='outline-secondary' value={"ko"}>
                    {t("language.ko")}
                </ToggleButton>
                <ToggleButton id="language-1" variant='outline-secondary' value={"jp"}>
                    {t("language.jp")}
                </ToggleButton>
                <ToggleButton id="language-2" variant='outline-secondary' value={"en"}>
                    {t("language.en")}
                </ToggleButton>
            </ToggleButtonGroup>
            */
        }
        <Form.Check // prettier-ignore
            type="switch"
            className='mb-3'
            label={t("sumbit.darkMode")}
            checked={isDarkmode}
            onChange={isDarkmodeOnChange}
        />
        {isAdmin && <h2>{t("sumbit.notification")}</h2>}
        <Form.Label>{t("sumbit.title")}</Form.Label>
        <FormControl type="text" placeholder={t("sumbit.title_placeholder")}  maxLength={20} value={title} onChange={titleOnChange} isInvalid={titleIsVaild}/>
        <Form.Text className="text-muted text-end d-block">{title.length}/20</Form.Text>
        <Form.Label>{t("sumbit.content")}</Form.Label>
        <FormControl type="text" placeholder={t("sumbit.content_placeholder")} maxLength={65000} as="textarea" rows={3} value={content} onChange={contentOnChange} isInvalid={contentIsVaild}/> {/* 기본 3줄 높이 */}
        <Form.Text className="text-muted text-end d-block">{content.length}/65000</Form.Text>
        <Form.Label>{t("sumbit.password")}</Form.Label>
        <FormControl type="text" placeholder={t("sumbit.password_placeholder")} maxLength={12} value={password} onChange={passwordOnChange} isInvalid={passwordIsVaild}/>
        <Form.Text className="text-muted text-end d-block">{password.length}/12</Form.Text>
        <div className='recaptcha-container'>
            <ReCAPTCHA
                sitekey="6LcMp0QrAAAAAIlT_zQPHX3RAGEbrm6pDSOTycau"
                onChange={recaptchaOnChange}
                ref={recaptchaRef}
                className='racaptcha'
            />
        </div>
        <ToggleButtonGroup className="d-inline-flex mt-3" type="radio" name="options" defaultValue={1} value={category} onChange={categoryOnChange}>
            <ToggleButton id="tbg-btn-1" variant='outline-secondary' value={1}>
                {t("sumbit.category.improvement")}
            </ToggleButton>
            <ToggleButton id="tbg-btn-2" variant='outline-secondary' value={2}>
                {t("sumbit.category.bug")}
            </ToggleButton>
            <ToggleButton id="tbg-btn-3" variant='outline-secondary' value={3}>
                {t("sumbit.category.extra")}
            </ToggleButton>
        </ToggleButtonGroup>
        <Button disabled={!recaptchaToken} className="sumbit-btn mt-3" variant="success" id="button-addon1" onClick={()=>formOnClick(title,content,category,password,recaptchaToken)}>{t("sumbit.sumbit")}</Button>
    </Form.Group>
    )
} 