import StringHelper from "@/Libs/StringHelper.jsx";
import {Link} from "@inertiajs/react";

export default function LogsTable({logsForItem}) {
    return(
        <div className="overflow-auto">
            <div className="p-6">
                <table
                    className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead
                        className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                    <tr className="text-nowrap">
                        <th className="px-3 py-2">{StringHelper.__("Laboratory")}</th>
                        <th className="px-3 py-2">{StringHelper.__("Action")}</th>
                        <th className="px-3 py-2">{StringHelper.__("Amount")}</th>
                        <th className="px-3 py-2">{StringHelper.__("Comment")}</th>
                        <th className="px-3 py-2">{StringHelper.__("Created by")}</th>
                        <th className="px-3 py-2">{StringHelper.__("Created at")}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {logsForItem.data.map(logForItem => (
                        <tr key={logForItem.id} className={logForItem.action_taken === "RETURN" ? "bg-emerald-600 text-white text-xl border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-emerald-700" : "bg-red-300 text-white text-xl border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-red-400"}>
                            <td className="px-3 py-2">
                                <Link href={route("laboratories.show", logForItem.laboratory.id)}
                                      className="font-medium text-white hover:underline mx-1"> {logForItem.laboratory.name} </Link>
                            </td>
                            <td className="px-3 py-2">{StringHelper.__(logForItem.action_taken)}</td>
                            <td className="px-3 py-2">{logForItem.amount_handled}</td>
                            <td className="px-3 py-2">{logForItem.comment}</td>
                            <td className="px-3 py-2">
                                <Link href={route("users.show", logForItem.created_by.id)}
                                      className="font-medium text-white hover:underline mx-1"> {logForItem.created_by.email} </Link>
                            </td>
                            <td className="px-3 py-2">{logForItem.created_at}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
