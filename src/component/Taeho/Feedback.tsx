
import { IFeedback } from '../../interfaces'
import { AccordionItem } from './accordion'

export function Feedback({data}:{data:IFeedback[]}) {
    return (
        <>
            {data.map(data =>{
                return <AccordionItem id={data.id} title={data.title} content={data.content} likeCount={data.likeCount} dislikeCount={data.dislikeCount} absorption={data.absorption} absorptionList={data.absorptionList} category={data.category} badge={data.badge} isNotification={data.isNotification} ></AccordionItem>
            })}
        </>
    )
}