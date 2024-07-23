import {Accordion, AccordionBody, AccordionHeader, Typography} from "@material-tailwind/react";
import {useState} from "react";
import Icon from "@/Components/Icon.jsx";

const renderContent = (content) => {
    if (typeof content === 'object' && content !== null){
        return(
            <div>
                {Object.entries(content).map(([key, value], index) => (
                    <div key={index} className="accordion-detail mb-2">
                        <strong>{key}</strong>
                        {value}
                    </div>
                ))}
            </div>
        )
    }
}
const AccordionComponent = ({data}) => {
    const [openAccordions, setOpenAccordions] = useState([]);
    const handleOpen = (index) => {
        setOpenAccordions((prev) =>
            prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
        );
    };
    return (
        <div className="accordion">
            {data.accordionCategories.map((category, index) => (
                <Accordion key={index} open={openAccordions.includes(index)} icon={ <Icon id={index} open={openAccordions.includes(index) ? index : null}/> } className="accordion-item">
                    <AccordionHeader onClick={() => handleOpen(index)} children={category.title}/>
                        <AccordionBody children={renderContent(category.content)}/>
                </Accordion>
            ))}
        </div>
    )
}
export default AccordionComponent;
