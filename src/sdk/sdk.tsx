import { IBan, IFeedback, IFilter, IResponse, ITab } from "../interfaces";

export class sillo{
    token: string
    constructor(token: string){
        this.token = token;
    }
    async getFeedback(tab: ITab,sort: IFilter,offset: number,limit: number): Promise<IResponse<IFeedback[]>>{
        const response = await fetch(`https://babe-api.fastwrtn.com/feedback?tab=${tab}&sort=${sort}&offset=${offset}&limit=${limit}`);
        const response_json: IResponse<IFeedback[]> = await response.json();
        return response_json;
    }
    async getFeedback_Item(id: number): Promise<IResponse<IFeedback>>{
        const response = await fetch(`https://babe-api.fastwrtn.com/feedbackitem?id=${id}`);
        const response_json: IResponse<IFeedback> = await response.json();
        return response_json;
    }
    async getFeedback_Count(tab: ITab): Promise<IResponse<number>>{
        const response = await fetch(`https://babe-api.fastwrtn.com/feedback/count?tab=${tab}`);
        const response_json: IResponse<number> = await response.json();
        return response_json;
    }
    async getFeedback_Admin(tab: ITab,sort: IFilter,offset: number,limit: number): Promise<IResponse<IFeedback[]>>{
        const response = await fetch(`https://babe-api.fastwrtn.com/admin/feedback?tab=${tab}&sort=${sort}&offset=${offset}&limit=${limit}`,{headers:{"Authorization":this.token}});
        const response_json: IResponse<IFeedback[]> = await response.json();
        return response_json;
    }
    async getFeedback_Admin_Item(id: number): Promise<IResponse<IFeedback>>{
        const response = await fetch(`https://babe-api.fastwrtn.com/admin/feedbackitem?id=${id}`,{headers:{"Authorization":this.token}});
        const response_json: IResponse<IFeedback> = await response.json();
        return response_json;
    }
    async getFeedback_Admin_Count(tab: ITab): Promise<IResponse<number>>{
        const response = await fetch(`https://babe-api.fastwrtn.com/admin/feedback/count?tab=${tab}`,{headers:{"Authorization":this.token}});
        const response_json: IResponse<number> = await response.json();
        return response_json;
    }
    async getBan(): Promise<IResponse<IBan[]>>{
        const response = await fetch("https://babe-api.fastwrtn.com/admin/ban",{headers:{"Authorization":this.token}});
        const response_json: IResponse<IBan[]> = await response.json()
        return response_json
    }
}