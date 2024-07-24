import AccordionComponent from "@/Components/Forms/AccordionComponent.jsx";
import {__} from "@/Libs/Lang.jsx";
import {router, useForm} from "@inertiajs/react";
import React from "react";

export default function Edit2({auth, inventoryItem, logsForItem, role, laboratories, itemTypes}){
    const handleConfirmMessage = __("Are you sure you want to delete this item") + '?';
    const {data, setData, put, errors, reset, processing} = useForm(
            {

                totalAmount: inventoryItem.data.accordionCategories[0].content.totalAmount || '',
                criticalAmount: inventoryItem.data.accordionCategories[0].content.criticalAmount || '',
                toOrderAmount: inventoryItem.data.accordionCategories[0].content.toOrderAmount || '',
                averageConsumption: inventoryItem.data.accordionCategories[0].content.averageConsumption || '',
                laboratory: inventoryItem.data.accordionCategories[1].content.laboratory || '',
                cupboard: inventoryItem.data.accordionCategories[1].content.cupboard || '',
                shelf: inventoryItem.data.accordionCategories[1].content.shelf || '',
                multipleLocations: inventoryItem.data.accordionCategories[1].content.multipleLocations,
                localName: inventoryItem.data.accordionCategories[2].content.localName || '',
                inventoryType: inventoryItem.data.accordionCategories[2].content.inventoryType || '',
                name: inventoryItem.data.accordionCategories[2].content.name || '',
                nameEng: inventoryItem.data.accordionCategories[2].content.nameEng || '',
                assetNumber: inventoryItem.data.accordionCategories[2].content.assetNumber || '',
                formula: inventoryItem.data.accordionCategories[2].content.formula || '',
                casNr: inventoryItem.data.accordionCategories[2].content.casNr || '',
                userGuide: inventoryItem.data.accordionCategories[2].content.userGuide || '',
                provider: inventoryItem.data.accordionCategories[3].content.provider || '',
                productCode: inventoryItem.data.accordionCategories[3].content.productCode || '',
                barcode: inventoryItem.data.accordionCategories[3].content.barcode || '',
                urlToProviderSite: inventoryItem.data.accordionCategories[3].content.urlToProviderSite,
                altUrlToProviderSite: inventoryItem.data.accordionCategories[3].content.altUrlToProviderSite,
                storageConditions: inventoryItem.data.accordionCategories[4].content.storageConditions || '',
                usedFor: inventoryItem.data.accordionCategories[4].content.usedFor || '',
                comments: inventoryItem.data.accordionCategories[4].content.comments || '',
                // id: inventoryItem.data.id || '',
                // accordionCategories: [
                //     {
                //         title: 'Amount',
                //         content: {
                //             totalAmount: inventoryItem.data.accordionCategories[0].content.totalAmount || '',
                //             criticalAmount: inventoryItem.data.accordionCategories[0].content.criticalAmount || '',
                //             toOrderAmount: inventoryItem.data.accordionCategories[0].content.toOrderAmount || '',
                //             averageConsumption: inventoryItem.data.accordionCategories[0].content.averageConsumption || '',
                //         }
                //     },
                //     {
                //         title: 'Location',
                //         content: {
                //             laboratory: inventoryItem.data.accordionCategories[1].content.laboratory || '',
                //             cupboard: inventoryItem.data.accordionCategories[1].content.cupboard || '',
                //             shelf: inventoryItem.data.accordionCategories[1].content.shelf || '',
                //             multipleLocations: inventoryItem.data.accordionCategories[1].content.multipleLocations,
                //         }
                //     },
                //     {
                //         title: 'General information',
                //         content: {
                //             localName: inventoryItem.data.accordionCategories[2].content.localName || '',
                //             inventoryType: inventoryItem.data.accordionCategories[2].content.inventoryType || '',
                //             name: inventoryItem.data.accordionCategories[2].content.name || '',
                //             nameEng: inventoryItem.data.accordionCategories[2].content.nameEng || '',
                //             assetNumber: inventoryItem.data.accordionCategories[2].content.assetNumber || '',
                //             formula: inventoryItem.data.accordionCategories[2].content.formula || '',
                //             casNr: inventoryItem.data.accordionCategories[2].content.casNr || '',
                //             userGuide: inventoryItem.data.accordionCategories[2].content.userGuide || '',
                //         }
                //     },
                //     {
                //         title: 'Order information',
                //         content: {
                //             provider: inventoryItem.data.accordionCategories[3].content.provider || '',
                //             productCode: inventoryItem.data.accordionCategories[3].content.productCode || '',
                //             barcode: inventoryItem.data.accordionCategories[3].content.barcode || '',
                //             urlToProviderSite: inventoryItem.data.accordionCategories[3].content.urlToProviderSite,
                //             altUrlToProviderSite: inventoryItem.data.accordionCategories[3].content.altUrlToProviderSite,
                //         }
                //     },
                //     {
                //         title: 'Additional information',
                //         content: {
                //             storageConditions: inventoryItem.data.accordionCategories[4].content.storageConditions || '',
                //             usedFor: inventoryItem.data.accordionCategories[4].content.usedFor || '',
                //             comments: inventoryItem.data.accordionCategories[4].content.comments || '',
                //         }
                //     }
                // ]
            }
    );
    const handleDestroy = (value) => {
        if (window.confirm(handleConfirmMessage)) {
            router.delete(route('inventoryItems.destroy', value), {
                preserveScroll: true
            })
        }
    }
    const handleChange = (key, value) => {
        setData(key, value);
    };
    const onSubmit = (e) => {
        e.preventDefault();
        put(route('inventoryItems.update', inventoryItem.data.id));
    }
    return(
        <form onSubmit={onSubmit}>
            <AccordionComponent data={inventoryItem.data} dataNest={data} onChange={handleChange}/>
            <button>Do it</button>
        </form>
    )
}
