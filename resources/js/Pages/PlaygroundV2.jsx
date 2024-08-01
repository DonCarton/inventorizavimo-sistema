import { useState } from "react";
import { BiChevronDown } from "react-icons/bi";

export default function PlaygroundV2({ inventoryItem, data }) {
    function TableRow({ object, index }) {
        let [isRowExpanded, setIsRowExpanded] = useState(false);
        return (
            <>
                <tr>
                    <td className="border-2 border-black">
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
                    <td className="border-2 border-black">Date</td>
                    <td className="border-2 border-black">Object</td>
                    <td className="border-2 border-black">Action</td>
                    <td className="border-2 border-black">Who</td>
                </tr>
                {isRowExpanded && (
                    <tr key={index + "history-log"}>
                        <td className="w-4 border-b-2 border-r-2 border-black">
                            <span className="flex justify-center rotate-180">
                                <button
                                    className="py-2"
                                    onClick={() => setIsRowExpanded(false)}
                                >
                                    <BiChevronDown className="w-4 h-4" />
                                </button>
                            </span>
                        </td>
                        <td colSpan={4} className="border-2 border-black">
                            <div className="w-full">
                                <div>
                                    <table className="w-full">
                                        <thead>
                                            <tr>
                                                <th className="border-2 border-black w-64 text-left">
                                                    Field
                                                </th>
                                                <th className="border-2 border-black w-64 text-left">
                                                    Old
                                                </th>
                                                <th className="border-2 border-black w-64 text-left">
                                                    New
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="border-2 border-black w-64"></td>
                                                <td className="border-2 border-black w-64"></td>
                                                <td className="border-2 border-black w-64"></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div>
                                    <table className="w-full">
                                        <tbody>
                                            {Object.entries(object).map(
                                                ([key, value]) => (
                                                    <tr
                                                        key={
                                                            key +
                                                            "-historicalEntry"
                                                        }
                                                    >
                                                        <td
                                                            key={key}
                                                            className="border-2 border-black w-64"
                                                        >
                                                            {key}
                                                        </td>
                                                        <td
                                                            key={
                                                                key +
                                                                "-historicalEntryOldValue"
                                                            }
                                                            className="border-2 border-black w-64"
                                                        >
                                                            {value === null
                                                                ? "-"
                                                                : typeof value ===
                                                                      "string" &&
                                                                  value.length >=
                                                                      40
                                                                ? value.slice(
                                                                      0,
                                                                      39
                                                                  )
                                                                : value}
                                                        </td>
                                                        <td
                                                            key={
                                                                key +
                                                                "-historicalEntryNewValue"
                                                            }
                                                            className="border-2 border-black w-64"
                                                        >
                                                            {value === null
                                                                ? "-"
                                                                : value}
                                                        </td>
                                                    </tr>
                                                )
                                            )}
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
            <table className="min-w-full border-2 border-black">
                <thead className="border-2 border-black">
                    <tr>
                        <th className="border-2 border-black w-5"></th>
                        <th className="border-2 border-black w-64">Date</th>
                        <th className="border-2 border-black w-64">Object</th>
                        <th className="border-2 border-black w-64">Action</th>
                        <th className="border-2 border-black w-64">Who</th>
                    </tr>
                </thead>
                {/* <tbody>
                    <tr>
                        <td className="border-2 border-black"></td>
                        <td className="border-2 border-black"></td>
                        <td className="border-2 border-black"></td>
                        <td className="border-2 border-black"></td>
                    </tr>
                </tbody> */}
            </table>
            <table className="min-w-full">
                <thead>
                    <tr>
                        <th className="border-2 border-black w-5"></th>
                        <th className="border-2 border-black text-left w-64"></th>
                        <th className="border-2 border-black text-left w-64"></th>
                        <th className="border-2 border-black text-left w-64"></th>
                        <th className="border-2 border-black text-left w-64"></th>
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
