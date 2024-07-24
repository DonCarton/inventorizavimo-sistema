import {Accordion, AccordionBody, AccordionHeader} from "@material-tailwind/react";
import {useEffect, useState} from "react";
import Icon from "@/Components/Icon.jsx";

export default function AccordionWithManualIndex({expandedByDefault, indexOfAcc, headerName, children}){
    const [open, setOpen] = useState(expandedByDefault ? indexOfAcc : 0);
    const handleOpen = (value) => setOpen(open === value ? 0 : value);
    useEffect(() => {
        setOpen(expandedByDefault ? indexOfAcc : 0);
    }, [expandedByDefault, indexOfAcc]);
    return(
        <Accordion open={open === indexOfAcc} icon={<Icon open={open} id={indexOfAcc}/>}>
            <AccordionHeader onClick={() => handleOpen(indexOfAcc)} children={headerName}/>
            <AccordionBody>
                {children}
            </AccordionBody>
        </Accordion>
    )
}
