import AccordionComponent from "@/Components/Forms/AccordionComponent.jsx";

export default function({inventoryItem}){
    return(
        <div>
            <AccordionComponent data={inventoryItem.data}/>
        </div>
    )
}
