import { Button, Form } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { useState } from "react";
import { sillo } from "../../sdk";
import { _Alert } from "../../function";

function banTime(ban: string): [number,number,number]{
    let answord: [number,number,number] = [0,0,0];
    switch (ban){
        case "1Hour":
            answord = [0,0,1];
            break
        case "3Hour":
            answord = [0,0,3];
            break
        case "6Hour":
            answord = [0,0,6];
            break
        case "12Hour":
            answord = [0,0,12];
            break
        case "1Day":
            answord = [0,1,0];
            break
        case "3Day":
            answord = [0,3,0];
            break
        case "7Day":
            answord = [0,7,0];
            break
        case "14Day":
            answord = [0,14,0];
            break
        case "1Month":
            answord = [1,0,0];
            break
        case "3Month":
            answord = [3,0,0];
            break
        case "6Month":
            answord = [6,0,0];
            break
        case "1Year":
            answord = [12,0,0];
            break
    }
    return answord
}

/**
 * Modal 유저 차단
 */
export function Ban({modalUserId,modalIp}:{modalIp: string,modalUserId: string}) {

    const api = new sillo(localStorage.getItem("auth_token") as string);

    const { t } = useTranslation();

    const [ban,setban] = useState<string>("1Hour")
    
    const banOnChange = (e:any) => setban(e.target.value);

    const banEvent = (userId: string,ip: string,ban: string) => {
        const reason = prompt(t("alert.banEvent.reason"));
        api.postAdmin.ban(userId,ip,reason,banTime(ban))
            .then(data=>{
                if (data.result == "SUCCESS"){
                    _Alert(t("alert.banEvent.success"),"success");
                }
                else if (data.result == "FAIL" && data.data == "auth"){
                    return _Alert(t("alert.banEvent.auth"),"fail");
                }
                else {
                    return _Alert(`${t("alert.banEvent.error")} ${data.data}`,"fail");
                }
            })
    }

    return (<>
            <div className='ban-container d-flex justify-content-center mt-3'>
                <Form.Select className="ban" defaultValue={"1Hour"} onChange={banOnChange}>
                    <option value="1Hour">1{t("dateTime.hour")}</option>
                    <option value="3Hour">2{t("dateTime.hour")}</option>
                    <option value="6Hour">6{t("dateTime.hour")}</option>
                    <option value="12Hour">12{t("dateTime.hour")}</option>
                    <option value="1Day">1{t("dateTime.day")}</option>
                    <option value="3Day">3{t("dateTime.day")}</option>
                    <option value="7Day">7{t("dateTime.day")}</option>
                    <option value="14Day">14{t("dateTime.day")}</option>
                    <option value="1Month">1{t("dateTime.month")}</option>
                    <option value="3Month">3{t("dateTime.month")}</option>
                    <option value="6Month">6{t("dateTime.month")}</option>
                    <option value="1Year">1{t("dateTime.year")}</option>
                </Form.Select>
                <Button variant="outline-danger" className="ms-1" onClick={()=>banEvent(modalUserId,modalIp,ban)}>{t("modal.ban")}</Button>
            </div>
    </>)
}