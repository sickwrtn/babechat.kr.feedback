import { env } from "../env";
import { IBan, ICategory, IFeedback, IFilter, IResponse, ITab } from "../interfaces";

export class sillo{
    token: string
    constructor(token: string){
        this.token = token;
    }
    get = {
            feedback: async (tab: ITab,sort: IFilter,offset: number,limit: number): Promise<IResponse<IFeedback[]>> => {
                const response = await fetch(env.api_url + `/feedback?tab=${tab}&sort=${sort}&offset=${offset}&limit=${limit}`);
                const response_json: IResponse<IFeedback[]> = await response.json();
                return response_json;
            },
            searchFeedback: async (tab: ITab,sort: IFilter,keyword:string,offset: number,limit: number): Promise<IResponse<IFeedback[]>> => {
                const response = await fetch(env.api_url + `/feedback?tab=${tab}&sort=${sort}&keyword=${keyword}&offset=${offset}&limit=${limit}`);
                const response_json: IResponse<IFeedback[]> = await response.json();
                return response_json;
            },
            feedbackItem: async (id: number): Promise<IResponse<IFeedback>> => {
                const response = await fetch(env.api_url + `/feedbackitem?id=${id}`);
                const response_json: IResponse<IFeedback> = await response.json();
                return response_json;
            },
            feedbackCount: async (tab: ITab): Promise<IResponse<number>> => {
                const response = await fetch(env.api_url + `/feedback/count?tab=${tab}`);
                const response_json: IResponse<number> = await response.json();
                return response_json;
            },
            searchFeedbackCount: async (tab: ITab, keyword: string): Promise<IResponse<number>> => {
                const response = await fetch(env.api_url + `/feedback/count?tab=${tab}&keyword=${keyword}`);
                const response_json: IResponse<number> = await response.json();
                return response_json;
            },
            like: async (id: number): Promise<IResponse<string>> => {
                const response = await fetch(env.api_url + `/like?id=${id}`,{headers:{"Authorization":this.token}})
                const response_json: IResponse<string> = await response.json();
                return response_json;
            },
            dislike: async (id: number): Promise<IResponse<string>> => {
                const response = await fetch(env.api_url + `/dislike?id=${id}`,{headers:{"Authorization":this.token}})
                const response_json: IResponse<string> = await response.json();
                return response_json;
            }
    }
    getAdmin = {
        feedback: async (tab: ITab,sort: IFilter,offset: number,limit: number): Promise<IResponse<IFeedback[]>> => {
            const response = await fetch(env.api_url + `/admin/feedback?tab=${tab}&sort=${sort}&offset=${offset}&limit=${limit}`,{headers:{"Authorization":this.token}});
            const response_json: IResponse<IFeedback[]> = await response.json();
            return response_json;
        },
        searchFeedback: async (tab: ITab,sort: IFilter,keyword: string,offset: number,limit: number): Promise<IResponse<IFeedback[]>> => {
            const response = await fetch(env.api_url + `/admin/feedback?tab=${tab}&sort=${sort}&keyword=${keyword}&offset=${offset}&limit=${limit}`,{headers:{"Authorization":this.token}});
            const response_json: IResponse<IFeedback[]> = await response.json();
            return response_json;
        },
        feedbackItem: async (id: number): Promise<IResponse<IFeedback>> => {
            const response = await fetch(env.api_url + `/admin/feedbackitem?id=${id}`,{headers:{"Authorization":this.token}});
            const response_json: IResponse<IFeedback> = await response.json();
            return response_json;
        },
        FeedbackCount: async (tab: ITab): Promise<IResponse<number>> => {
            const response = await fetch(env.api_url + `/admin/feedback/count?tab=${tab}`,{headers:{"Authorization":this.token}});
            const response_json: IResponse<number> = await response.json();
            return response_json;
        },
        searchFeedbackCount: async (tab: ITab,keyword: string): Promise<IResponse<number>> => {
            const response = await fetch(env.api_url + `/admin/feedback/count?tab=${tab}&keyword=${keyword}`,{headers:{"Authorization":this.token}});
            const response_json: IResponse<number> = await response.json();
            return response_json;
        },
        ban: async (): Promise<IResponse<IBan[]>> => {
            const response = await fetch(env.api_url + "/admin/ban",{headers:{"Authorization":this.token}});
            const response_json: IResponse<IBan[]> = await response.json()
            return response_json
        }
    }
    post = {
        feedback: async (title: string,content: string,category: ICategory,password: string) => {
            const response = await fetch(env.api_url + "/feedback",{method:"POST",headers:{"Content-Type" : "application/json","Authorization":this.token},body:JSON.stringify({
                title:title,
                content:content,
                category:category,
                password:password
            })})
            const response_json: IResponse<string> = await response.json();
            return response_json;
        }
    }
    postAdmin = {
        comment: async (id: number,content: string) => {
            const response = await fetch(env.api_url + `/admin/comment?id=${id}`,{method:"POST",headers:{"Content-Type" : "application/json","Authorization":this.token},body:JSON.stringify({content:content})})
            const response_json: IResponse<string> = await response.json();
            return response_json
        },
        deleteComment: async (id: number) => {
            const response = await fetch(env.api_url + `/admin/comment?id=${id}`,{method:"DELETE",headers:{"Content-Type" : "application/json","Authorization":this.token},body:JSON.stringify({})})
            const response_json: IResponse<string> = await response.json();
            return response_json
        },
        ban: async (userId: string,ip: string,reason: string | null,time: [number,number,number]): Promise<IResponse<string>> => {
            const response = await fetch(env.api_url + `/admin/ban`,{method:"POST",headers:{"Content-Type" : "application/json","Authorization":this.token},body:JSON.stringify({userId:userId,ip:ip,reason:reason,month:time[0],day:time[1],hour:time[2]})})
            const response_json: IResponse<string> = await response.json();
            return response_json
        },
        absorption: async (id: number, to: number): Promise<IResponse<string>> => {
            const response = await fetch(env.api_url + `/admin/absorption?id=${id}&to=${to}`,{method:"POST",headers:{"Content-Type" : "application/json","Authorization":this.token},body:JSON.stringify({})})
            const response_json: IResponse<string> = await response.json()
            return response_json
        },
        feedback: async (title: string,content: string,category: ICategory,password: string) => {
            const response = await fetch(env.api_url + "/admin/notification",{method:"POST",headers:{"Content-Type" : "application/json","Authorization": this.token},body:JSON.stringify({
                title:title,
                content:content,
                category:category,
                password:password
            })})
            const response_json: IResponse<string> = await response.json();
            return response_json;
        }
    }
    put = {
        edit: async (id: number, title: string, content: string, category: ICategory, password: string) => {
            const response = await fetch(env.api_url + `/feedback?id=${id}`,{method:"PUT",headers:{"Content-Type" : "application/json"},body:JSON.stringify({title:title,content:content,category:category,password:password})})
            const response_json: IResponse<string> = await response.json();
            return response_json;
        }
    }
    putAdmin = {
        edit: async (id: number, title: string, content: string, category: ICategory) => {
            const response = await fetch(env.api_url + `/admin/feedback?id=${id}`,{method:"PUT",headers:{"Content-Type" : "application/json","Authorization":this.token},body:JSON.stringify({title:title,content:content,category:category})})
            const response_json: IResponse<string> = await response.json();
            return response_json
        },
        progress: async (id: number) => {
            const response = await fetch(env.api_url + `/admin/progress?id=${id}`,{method:"PUT",headers:{"Content-Type" : "application/json","Authorization":this.token},body:JSON.stringify({})})
            const response_json: IResponse<string> = await response.json();
            return response_json;
        },
        compeleted: async (id: number) => {
            const response = await fetch(env.api_url + `/admin/compeleted?id=${id}`,{method:"PUT",headers:{"Content-Type" : "application/json","Authorization":this.token},body:JSON.stringify({})})
            const response_json: IResponse<string> = await response.json();
            return response_json;
        },
        clear: async (id: number) => {
            const response = await fetch(env.api_url + `/admin/clear?id=${id}`,{method:"PUT",headers:{"Content-Type" : "application/json","Authorization":this.token},body:JSON.stringify({})})
            const response_json: IResponse<string> = await response.json();
            return response_json;
        },
        recover: async (id: number) => {
            const response = await fetch(env.api_url + `/admin/undeleted?id=${id}`,{method:"PUT",headers:{"Content-Type" : "application/json","Authorization":this.token},body:JSON.stringify({})})
            const response_json: IResponse<string> = await response.json()
            return response_json;
        },
        badge: async (id: number,bage: string[]): Promise<IResponse<string>> => {
            const response = await fetch(env.api_url + `/admin/badge?id=${id}`,{method:"PUT",headers:{"Content-Type" : "application/json","Authorization":this.token},body:JSON.stringify({badge:bage})})
            const response_json: IResponse<string> = await response.json()
            return response_json
        }
    }
    delete = {
        feedback: async (id: number, password: string) => {
            const response = await fetch(env.api_url + `/feedback?id=${id}`,{method:"DELETE",headers:{"Content-Type" : "application/json"},body:JSON.stringify({password:password})})
            const response_json: IResponse<string> = await response.json()
            return response_json;
        }
    }
    deleteAdmin = {
        feedback: async (id: number) => {
            const response = await fetch(env.api_url + `/admin/feedback?id=${id}`,{method:"DELETE",headers:{"Content-Type" : "application/json","Authorization":this.token},body:JSON.stringify({})})
            const response_json: IResponse<string> = await response.json()
            return response_json;
        },
        absorption: async (id: number, target: number): Promise<IResponse<string>> => {
            const response = await fetch(env.api_url + `/admin/absorption?id=${id}&target=${target}`,{method:"DELETE",headers:{"Content-Type" : "application/json","Authorization":this.token},body:JSON.stringify({})})
            const response_json: IResponse<string> = await response.json()
            return response_json
        },
        ban: async (id: number) => {
            const response = await fetch(env.api_url + `/admin/ban?id=${id}`,{method:"DELETE",headers:{"Authorization": this.token}});
            const response_json: IResponse<null> = await response.json();
            return response_json;
        }
    }
}