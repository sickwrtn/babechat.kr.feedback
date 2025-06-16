export type IFilter = "likeCount" | "latest" | "oldest";

export type ITab = "stand" | "progress" | "completed" | "notification" | "representative" | "deleted";

export type ICategory = 1 | 2 | 3;

export type IResult = "SUCCESS" | "FAIL";

export interface IResponse <T>{
    result: IResult,
    data:T
}

export interface IFeedback {
    id: number,
    category: ICategory,
    badge: string[],
    title: string,
    content: string,
    comment: string | null,
    likeCount: number,
    dislikeCount: number,
    absorption: number | null,
    absorptionList: string[] | null,
    isProgress: boolean,
    isNotification: boolean,
    isCompleted: boolean,
    isDeleted: boolean,
    createdAt: string,
    ip? : string,
    userId?: string
}

export interface IBan {
    id: Number,
    userId: string,
    reason: string,
    ip: string,
    expiredAt: string,
    createdAt: string
}