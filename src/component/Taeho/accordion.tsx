import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ICategory } from '../../interfaces';
import { Badge } from 'react-bootstrap';

export function AccordionItem({id,title,content,likeCount,dislikeCount,absorption,absorptionList,category,badge,isNotification}:{id: number, title: string, content: string, likeCount: number, dislikeCount: number,absorption: number | null, absorptionList: string[] | null, category: ICategory, badge: string[],isNotification: boolean}){
    const navigate = useNavigate();

    const { t } = useTranslation();
    
    return (<>
        <li className="list-group-item d-flex justify-content-between align-items-start" onClick={()=>navigate(`/?id=${id}`,{replace:false})}>
            {!isNotification && 
                <>
                    { category == 1 &&
                    <img src="https://raw.githubusercontent.com/sickwrtn/babechat.multi/refs/heads/main/2024-blurple-dev.png" />
                    }
                    { category == 2 &&
                        <img src="https://raw.githubusercontent.com/sickwrtn/babechat.multi/refs/heads/main/4156-blurple-flame.png" />
                    }
                    { category == 3 &&
                        <img src="https://raw.githubusercontent.com/sickwrtn/babechat.multi/refs/heads/main/7100-blurple-heart.png" />
                    }
                </>
            }
            {isNotification &&
                <img src="https://babechat.ai/assets/svgs/notices.svg" />
            }
            <div className="ms-2 me-auto overflow-hidden">
                <div className="fw-bold">{title} {badge.map((data)=>(
                    <Badge className="ms-1 badge" text="white" bg="secondary">{data}</Badge>
                ))}
                {absorption &&
                    <Badge className="ms-1" style={{cursor:"default"}} bg="secondary">⇄ #{absorption}{t("accordionItem.absorption")}</Badge>
                }
                {(absorptionList?.length != 0) &&
                    <Badge className="ms-1" style={{cursor:"default"}} bg="primary">#{id} {t("accordionItem.representative")}</Badge>
                }
                </div>
                <div className="text-muted form-text">
                {content}
                </div>
            </div>
            <div className="badge border">
                {(likeCount - dislikeCount) >= 0 && 
                <div style={{color:"green"}}>{likeCount - dislikeCount}</div>
                }
                {(likeCount - dislikeCount) < 0 && 
                <div style={{color:"red"}}>{likeCount - dislikeCount}</div>
                }
            </div>
        </li>
    </>)
}