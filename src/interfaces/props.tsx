import { ICategory } from "./api"

export interface IFeedbakModal{
    show: boolean,
    isEdit: boolean,
    setIsEdit: (e:boolean)=>void,
    handleClose: ()=>void,
    modalTitle: string,
    modalBadge: string[] | undefined,
    modalContent: string,
    modalComment: string | null,
    modalCategory: ICategory,
    modalId: number,
    modalLikeCount: number,
    setModalLikeCount: (e:number)=>void,
    modalDislikeCount: number,
    modalAbsorptionList: string[] | null,
    modalIsDeleted: boolean,
    setModalDislikeCount: (e:number)=>void,
    resetFeedback: ()=>void,
    isAdmin: boolean,
    modalUserId: string,
    modalIsLoading: boolean,
    modalIp: string
}