import { Comment_ } from "./Comment_"
import { CommentEdit_ } from "./CommentEdit_"

/**
 * Modal 댓글
 */
export function Comment({modalData,isAdmin,isEdit,refreshModal}:{modalData:any,isAdmin:any,isEdit:any,refreshModal:()=>void}){

    return (<>
        { (!isAdmin && !isEdit) &&
            <>
            { modalData.comment != null &&
                <Comment_ modalData={modalData} />
            }
            </>
        }
        { (isAdmin && !isEdit) &&
            <CommentEdit_ modalData={modalData} refreshModal={refreshModal}/>
        }
    </>)
}