import { useState } from "react";
import { Badge } from "react-bootstrap"
import { useTranslation } from "react-i18next";
import { sillo } from "../../sdk";
import { IModalData } from "../../interfaces";
import { useNavigate } from "react-router-dom";
import { _Alert } from "../../function";

/**
 * Modal 병합 리스트
 */
export function AbsorptionList({modalData,extraData,isAdmin}:{modalData:IModalData,extraData:IModalData,isAdmin:boolean}){
    
    const api = new sillo(localStorage.getItem("auth_token") as string);

    const { t } = useTranslation();

    const navigate = useNavigate();

    const [isAbsorptionEditShow, setIsAbsorptionEditShow] = useState<boolean>(false);
    
    const absorptionDeleteEvent = (id: number, data: number) => {
        api.deleteAdmin.absorption(id,data)
            .then(data => {
                if (data.result == "FAIL"){
                    return _Alert(`${t("alert.absorptionDeleteEvent.error")} + data.data`,"fail");
                }
                _Alert(t("alert.absorptionDeleteEvent.success"),"success");
                window.location.reload();
            })
    }

    return (<>
        <div>
            {!isAbsorptionEditShow && modalData.absorptionList?.map(data => 
                <>
                    { !isAdmin &&
                        <>
                            { data == String(extraData.id) &&
                                <Badge className="me-1" style={{cursor:"pointer"}} onClick={()=>navigate(`/?id=${modalData.id}`)} bg="success">⇄ #{data}{t("modal.absorption")}</Badge>
                            }
                            { data != String(extraData.id) &&
                                <Badge className="me-1" style={{cursor:"pointer"}} onClick={()=>navigate(`/?id=${modalData.id}&ext=${data}`,{replace:false})} bg="primary">⇄ #{data}{t("modal.absorption")}</Badge>
                            }
                        </>
                    }
                    { isAdmin &&
                        <>
                            { data == String(extraData.id) &&
                                <Badge className="me-1" style={{cursor:"pointer"}} onClick={()=>navigate(`/sick/admin?id=${modalData.id}`)} bg="success">⇄ #{data}{t("modal.absorption")}</Badge>
                            }
                            { data != String(extraData.id) &&
                                <Badge className="me-1" style={{cursor:"pointer"}} onClick={()=>navigate(`/sick/admin?id=${modalData.id}&ext=${data}`,{replace:false})} bg="primary">⇄ #{data}{t("modal.absorption")}</Badge>
                            }
                        </>
                    }
                </>
            )}
            {isAdmin && 
                <>
                    {isAbsorptionEditShow && 
                        <>
                            {modalData.absorptionList?.map(data => 
                                <Badge className="me-1" style={{cursor:"pointer"}} bg="danger" onClick={()=>absorptionDeleteEvent(modalData.id,Number(data))}>X #{data}{t("modal.absorption")}</Badge>
                            )}
                            <Badge className="me-1" style={{cursor:"pointer"}} bg="danger" onClick={()=>setIsAbsorptionEditShow(false)}>{t("modal.absorptionEdit_close")}</Badge>
                        </>
                    }
                    {!isAbsorptionEditShow &&
                        <Badge style={{cursor:"pointer"}} bg="danger" onClick={()=>setIsAbsorptionEditShow(true)}>{t("modal.absorptionEdit")}</Badge>
                    }
                </>
            }
        </div>
    </>)
}