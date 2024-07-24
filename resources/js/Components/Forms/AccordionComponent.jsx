import {Accordion, AccordionBody, AccordionHeader, Typography} from "@material-tailwind/react";
import React, {useState} from "react";
import Icon from "@/Components/Icon.jsx";
import TextInput from "@/Components/TextInput.jsx";
import InputLabel from "@/Components/Forms/InputLabel.jsx";

const renderContent = (content, dataNest, onChange) => {
    if (typeof content === 'object' && content !== null) {
        return (
            <div>
                {Object.entries(content).map(([key, value], index) => (
                    <div key={index}>
                        <InputLabel htmlFor={key} value={key}/>
                        {/*<TextInput id={key} className="w-full" value={value ?? ''} onChange={(e) => onChange(key, e.target.value)} />*/}
                        <TextInput id={key} className="w-full" value={dataNest[key]} onChange={(e) => onChange(key, e.target.value)} />
                    </div>
                ))}
            </div>
        );
    }
    return null;
};
const AccordionComponent = ({data, dataNest, onChange}) => {
    const [openAccordions, setOpenAccordions] = useState([]);
    const handleOpen = (index) => {
        setOpenAccordions((prev) =>
            prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
        );
    };

    return (
        <div className="accordion">
            {data.accordionCategories.map((category, index) => (
                <Accordion key={index} open={openAccordions.includes(index)} icon={<Icon id={index} open={openAccordions.includes(index) ? index : null} />} className="accordion-item">
                    <AccordionHeader onClick={() => handleOpen(index)}>{category.title}</AccordionHeader>
                    <AccordionBody>{renderContent(category.content, dataNest, onChange)}</AccordionBody>
                </Accordion>
            ))}
        </div>
    );
};
export default AccordionComponent;
