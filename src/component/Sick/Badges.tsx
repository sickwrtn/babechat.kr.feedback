import { Badge, Button, FormControl } from "react-bootstrap";
import { IModalData, voidEvent } from "../../interfaces";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { sillo } from "../../sdk";
import { _Alert } from "../../function";

/**
 * Modal Bage 리스트
 */
export function Badges({modalData,resetFeedback,handleClose}:{modalData:IModalData,resetFeedback:voidEvent,handleClose:voidEvent}){

    const api = new sillo(localStorage.getItem("auth_token") as string);

    const { t } = useTranslation();

    const [bageEdit,setBageEdit] = useState<string>("");

    const bageEditOnChange = (e:any) => setBageEdit(e.target.value);

    const [isBageEditShow, setIsBageEditShow] = useState<boolean>(false);

    const badgeEvent = (id: number, bage: string[]) => {
        api.putAdmin.badge(id,bage)
            .then(data=> {
                if (data.result == "SUCCESS"){
                    _Alert(t("alert.bageEvent.success"),"success");
                    resetFeedback();
                    handleClose();
                }
                else {
                    return _Alert(`${t("alert.bageEvent.error")} ${data.data}`,"fail");
                }
            })
        setIsBageEditShow(false)
    }
    
    return (<>
        {!isBageEditShow && 
            <>
                <div className='badge-group'>
                    {modalData.badge?.map((data)=>(
                        <Badge className="badge me-1" style={{cursor:"default"}} text="white" bg="secondary">{data}</Badge>
                    ))}
                    <Badge className="badge" style={{cursor:"pointer"}} text="white" bg="primary" onClick={()=>{
                            setIsBageEditShow(true);
                            setBageEdit((modalData.badge as string[]).join(","));
                        }}>{t("modal.bageEdit.bageEdit")}</Badge>
                </div>
            </>
        }
        {isBageEditShow && 
            <>
                <FormControl type="text" placeholder={t("modal.bageEdit.placeholder")} as="textarea" rows={1} value={bageEdit} onChange={bageEditOnChange}/>
                <Button className="mt-2" size='sm' variant="success" onClick={()=>badgeEvent(modalData.id,bageEdit.split(","))}>{t("modal.bageEdit.sumbit")}</Button>
            </>
        }
    </>)
}

export default Badges;