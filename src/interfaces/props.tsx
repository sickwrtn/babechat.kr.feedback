import { ICategory } from "./api"

export type event = (e:any)=>void;

export type voidEvent = () => void;

export interface IFeedbakModal{
    modalData: IModalData,
    extraData: IModalData,
    show: boolean,
    isEdit: boolean,
    setIsEdit: (e:boolean)=>void,
    handleClose: voidEvent,
    resetFeedback: voidEvent,
    isAdmin: boolean,
    modalUserId: string,
    modalIp: string,
    refreshModal: ()=>void
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

export interface IHeader {
    modalData:IModalData,
    isEdit:boolean,
    modalUserId:string,
    isAdmin:boolean
}

