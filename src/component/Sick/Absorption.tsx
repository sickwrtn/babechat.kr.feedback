import { useState } from "react";
import { Button, FormControl } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { IModalData } from "../../interfaces";
import { sillo } from "../../sdk";

export function Absorption({modalData}:{modalData:IModalData}) {
    
    const api = new sillo(localStorage.getItem("auth_token") as string);

    const { t } = useTranslation();
    
    const [absorptionEdit,setAbsorptionEdit] = useState<string>("");

    const absorptionEditOnChange = (e:any) => setAbsorptionEdit(e.target.value);

    const absorptionEvent = (id: number,absorptionEdit: number) => {
        api.postAdmin.absorption(id,absorptionEdit)
            .then(data => {
                if (data.result == "FAIL"){
                    return alert(`${t("alert.absorptionEvent.error")} ${data.data}`);
                }
                alert(t("alert.absorptionEvent.success"));
                window.location.reload();
            })
    }

    return (<> 
        <div className='mt-3 d-flex justify-content-center'>
            <FormControl className="AES me-2" type="text" placeholder={t("modal.absorptionTo_placeholder")} value={absorptionEdit} onChange={absorptionEditOnChange}/>
            <Button variant="outline-success" size='sm' onClick={()=>absorptionEvent(modalData.id,Number(absorptionEdit))}>{t("modal._absorption")}</Button>
        </div>
    </>)
}