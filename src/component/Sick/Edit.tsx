import { Form, FormControl, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import { useTranslation } from "react-i18next"
import { event, ICategory } from "../../interfaces";

export function Edit({modalTitleEdit,categoryEdit,modalTitleEditOnChange,modalTitleEditIsVaild,modalContentEdit,modalContentEditOnChange,ModalContentEditIsVaild,categoryEditOnChange}:{modalTitleEdit: string,categoryEdit: ICategory,modalTitleEditOnChange: event,modalTitleEditIsVaild: boolean,modalContentEdit: string,modalContentEditOnChange: event,ModalContentEditIsVaild: boolean,categoryEditOnChange:event}) {

    const { t } = useTranslation();

    return (<>
        <Form.Group className="m-4">
            <Form.Label>{t("modal.editer.title")}</Form.Label>
            <FormControl type="text" placeholder={t("modal.editer.title_placeholder")} maxLength={20} value={modalTitleEdit} onChange={modalTitleEditOnChange} isInvalid={modalTitleEditIsVaild}/>
            <Form.Text className="text-muted text-end d-block">{modalTitleEdit.length}/20</Form.Text>
            <Form.Label>{t("modal.editer.content")}</Form.Label>
            <FormControl type="text" placeholder={t("modal.editer.content_placeholder")} maxLength={65000} as="textarea" rows={10} value={modalContentEdit} onChange={modalContentEditOnChange} isInvalid={ModalContentEditIsVaild}/>
            <Form.Text className="text-muted text-end d-block">{modalTitleEdit.length}/65000</Form.Text>
            <ToggleButtonGroup className="d-inline-flex" type="radio" name="options2" defaultValue={1} value={categoryEdit} onChange={categoryEditOnChange}>
                <ToggleButton id="tbg-btn2-1" variant='outline-secondary' value={1}>
                    {t("modal.editer.category.improvement")}
                </ToggleButton>
                <ToggleButton id="tbg-btn2-2" variant='outline-secondary' value={2}>
                    {t("modal.editer.category.bug")}
                </ToggleButton>
                <ToggleButton id="tbg-btn2-3" variant='outline-secondary' value={3}>
                    {t("modal.editer.category.extra")}
                </ToggleButton>
            </ToggleButtonGroup>
        </Form.Group>
    </>)
}