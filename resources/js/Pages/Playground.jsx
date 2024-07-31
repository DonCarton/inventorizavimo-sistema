import React, {useState} from "react";
import {BiChevronDown} from "react-icons/bi";
import {__} from "@/Libs/Lang.jsx";

export default function Playground({data}) {
    function TableRow({object, index}) {
        let [isRowExpanded, setIsRowExpanded] = useState(false);
        return (
            <tr key={index + 'history-log'}>
                <td className="p-1 w-4 border-b-2 border-r-2 border-black">
                    <span>
                        <button onClick={() => setIsRowExpanded(!isRowExpanded)}>
                            <BiChevronDown/>
                        </button>
                    </span>
                </td>
                {isRowExpanded ?
                    <td colSpan={3} className="border-2 border-black">
                        <div key={index} className="grid grid-cols-3 gap-2">
                            <ul>
                                {Object.entries(object).map(
                                    ([key], index) => (
                                        <li key={key + '-attribute-data-' + index}>{key}</li>
                                    )
                                )}
                            </ul>
                            <ul>
                                {Object.entries(object).map(
                                    ([key, value], index) => (
                                        <li key={key + '-attribute-old-data-' + index}
                                            title={value !== undefined && value}>{value === null ? '-' : typeof value === "string" && value.length >= 40 ? value.slice(0, 39) : value}</li>
                                    )
                                )}
                            </ul>
                            <ul>
                                {Object.entries(object).map(
                                    ([key, value], index) => (
                                        <li key={key + '-attribute-new-data-' + index}
                                            title={value === null ? '-' : value}>{value === null ? '-' : typeof value === "string" && value.length >= 40 ? value.slice(0, 39) : value}</li>
                                    )
                                )}
                            </ul>
                        </div>
                    </td> :
                    <td colSpan={3} className="border-b-2 border-black"></td>
                }
            </tr>
        )
    }
    return (
        <div className="max-w-screen-3xl">
            <table className="w-full">
                <thead>
                <tr>
                    <th>Column 1</th>
                    <th>Column 2</th>
                    <th>Column 3</th>
                    <th>Column 4</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                </tbody>
            </table>
            <table className="w-full border-2 border-black">
                <thead>
                <tr>
                    <th className="border-2 border-black"></th>
                    <th className="pl-2 border-b-2 border-black w-96 text-left">{__("Field")}</th>
                    <th className="pl-2 border-b-2 border-black w-96 text-left">{__("Old value")}</th>
                    <th className="pl-2 border-b-2 border-black w-96 text-left">{__("New value")}</th>
                </tr>
                </thead>
                <tbody>
                {data.map(
                    (entry, index) => (
                        <TableRow object={entry} index={index}/>
                    )
                )}
                </tbody>
            </table>
        </div>
    )
}
