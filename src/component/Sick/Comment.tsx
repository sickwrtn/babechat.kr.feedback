import { useState } from "react";
import { Comment_ } from "./Comment_"
import { CommentEdit_ } from "./CommentEdit_"

export function Comment({modalData,isAdmin,isEdit}:{modalData:any,isAdmin:any,isEdit:any}){

    return (<>
        { (!isAdmin && !isEdit) &&
            <>
            { modalData.comment != null &&
                <Comment_ modalData={modalData} />
            }
            </>
        }
        { (isAdmin && !isEdit) &&
            <CommentEdit_ modalData={modalData}/>
        }
    </>)
}