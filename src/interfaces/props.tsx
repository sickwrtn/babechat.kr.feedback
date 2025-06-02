import { ICategory } from "./api"

export interface IFeedbakModal{
    modalData: IModalData,
    extraData: IModalData,
    show: boolean,
    isEdit: boolean,
    setIsEdit: (e:boolean)=>void,
    handleClose: ()=>void,
    resetFeedback: ()=>void,
    isAdmin: boolean,
    modalUserId: string,
    modalIp: string
}

export interface IModalData{
    id: number,
    title: string,
    content: string,
    comment: string | null,
    category: ICategory,
    likeCount: number,
    dislikeCount: number,
    absorptionList: string[] | null,
    isDeleted: boolean,
    badge: string[],
    isLoading: boolean,
    createdAt: string
}