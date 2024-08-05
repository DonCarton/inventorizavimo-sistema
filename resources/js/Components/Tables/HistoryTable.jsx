import StringHelper from "@/Libs/StringHelper";
import { useState } from "react";
import { BiChevronDown } from "react-icons/bi";

export default function HistoryTable({ data }) {
    function TableRow({ object, index }) {
        let [isRowExpanded, setIsRowExpanded] = useState(false);
        return (
            <>
                <tr className="text-center">
                    <td>
                        <span
                            className={`flex justify-center transform transition-transform duration-150 ${
                                isRowExpanded ? "rotate-180" : ""
                            }`}
                        >
                            <button
                                className="py-2"
                                onClick={() => setIsRowExpanded(!isRowExpanded)}
                            >
                                <BiChevronDown className="w-4 h-4" />
                            </button>
                        </span>
                    </td>
                    <td>{object.definitionOfChanges.created_at}</td>
                    <td>{object.definitionOfChanges.object}</td>
                    <td>{object.definitionOfChanges.action}</td>
                    <td>{object.definitionOfChanges.causeUser}</td>
                </tr>
                {isRowExpanded && (
                    <tr key={index + "history-log"}>
                        <td className="w-4">
                            <span className="flex justify-center rotate-180">
                                <button
                                    className="py-2"
                                    onClick={() => setIsRowExpanded(false)}
                                >
                                    <BiChevronDown className="w-4 h-4" />
                                </button>
                            </span>
                        </td>
                        <td colSpan={4}>
                            <div className="w-full">
                                <div>
                                    <table className="w-full">
                                        <thead>
                                            <tr>
                                                <th className="w-64 text-left">
                                                    {StringHelper.__("Field")}
                                                </th>
                                                <th className="w-64 text-left">
                                                    {StringHelper.__("Changed from")}
                                                </th>
                                                <th className="w-64 text-left">
                                                    {StringHelper.__("Changed to")}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="w-64"></td>
                                                <td className="w-64"></td>
                                                <td className="w-64"></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div>
                                    <table className="w-full">
                                        <tbody>
                                            {object.changesForObject.fields.map((field, indexField) => (
                                                <tr key={`${indexField}-${index}`}>
                                                    <td className="w-64">{field}</td>
                                                    <td className="w-64">{object.changesForObject.old_values[indexField]}</td>
                                                    <td className="w-64">{object.changesForObject.new_values[indexField]}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </td>
                    </tr>
                )}
            </>
        );
    }
    return (
        <div className="max-w-screen-3xl">
            <table className="min-w-full">
                <thead className="text-md text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                    <tr>
                        <th className="w-5"></th>
                        <th className="w-64">{StringHelper.__("When")}</th>
                        <th className="w-64">{StringHelper.__("Object")}</th>
                        <th className="w-64">{StringHelper.__("Action")}</th>
                        <th className="w-64">{StringHelper.__("Who")}</th>
                    </tr>
                </thead>
            </table>
            <table className="min-w-full">
                <thead>
                    <tr>
                        <th className="w-5"></th>
                        <th className="text-left w-64"></th>
                        <th className="text-left w-64"></th>
                        <th className="text-left w-64"></th>
                        <th className="text-left w-64"></th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((entry, index) => (
                        <TableRow key={index} object={entry} index={index} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
