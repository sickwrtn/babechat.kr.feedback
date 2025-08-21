import { Button } from "react-bootstrap"
import { useTranslation } from "react-i18next"
import { sillo } from "../../sdk";
import { IModalData } from "../../interfaces";

/**
 * Modal 추천/비추천
 */
export function Recommend({modalData}:{modalData:IModalData}) {

    const api = new sillo(localStorage.getItem("auth_token") as string);
    
    const { t } = useTranslation();

    const dislikeEvent = (id:number) => {
        api.get.dislike(id)
            .then(data=>{
                if (data.result == "FAIL" && data.data == "already"){
                    return alert(t("alert.dislikeEvent.once"));
                }
                alert(t("alert.dislikeEvent.success"));
                window.location.reload()
            })
    }

    const likeEvent = (id: number) => {
        api.get.like(id)
            .then(data=>{
                if (data.result == "FAIL" && data.data == "already"){
                    return alert(t("alert.likeEvent.once"));
                } 
                alert(t("alert.likeEvent.success"));
                window.location.reload()
            })
    }

    return (<>
        <Button className="me-1" variant="outline-danger" onClick={()=>dislikeEvent(modalData.id)}>
            {t("modal.not_recommend")} : {modalData.dislikeCount}
        </Button>
        <Button className="ms-1" variant="outline-success" onClick={()=>likeEvent(modalData.id)}>
            {t("modal.recommend")} : {modalData.likeCount}
        </Button>
    </>)
}