import { toast } from "react-toastify";

export function _Alert(message:string,type:"success" | "fail") {
    switch (type){
        case "success":
            toast.success(message, {
                position: "top-right",
                autoClose: 3000, // 3초 후에 자동으로 닫힙니다.
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            break;
        case "fail":
            toast.error(message,{
                position: "top-right",
                autoClose: 5000, // 3초 후에 자동으로 닫힙니다.
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
            break;
    }
}