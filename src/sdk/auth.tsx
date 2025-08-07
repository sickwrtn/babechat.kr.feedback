import { env } from "../env";
import { IResponse } from "../interfaces";

export async function Auth () {
    const response = await fetch(env.api_url + "/auth",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({})});
    const response_json: IResponse<string> = await response.json();
    return response_json;
}

export async function Vaild() {
    const response = await fetch(env.api_url + "/valid",{headers:{"Authorization":localStorage.getItem("auth_token") as string}});
    const response_json: IResponse<null> = await response.json();
    return response_json;
}

export async function AdminAuth() {
    const response = await fetch(env.api_url + "/adminAuth",{method:"GET",headers :{"Content-Type" : "application/json","Authorization":localStorage.getItem("auth_token") as string}}); 
    const response_json: IResponse<null> = await response.json();
    return response_json;
}

export async function AdminLogin(adminPassword: string) {
    const response = await fetch(env.api_url + "/auth",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
            password:adminPassword
        })});
    const response_json: IResponse<string> = await response.json();
    return response_json;
}