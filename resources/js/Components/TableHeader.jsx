import {ChevronDownIcon, ChevronUpIcon} from "@heroicons/react/24/solid/index.js";

export default function TableHeader({
                                        name,
                                        sortable = true,
                                        sort_field = null,
                                        sort_direction = null,
                                        sortChanged = () => {},
    children
                                    }) {
    return (
        <th onClick={e => sortChanged(name)}
            className="cursor-pointer hover:underline">
            <div className="px-3 py-2 flex items-center justify-between gap-1 ">
                {children}
                {sortable &&
                    <div>
                        <ChevronUpIcon className={
                            "w-4 " + (sort_field === name && sort_direction === 'asc' ? "text-blue-700" : "")
                        }/>
                        <ChevronDownIcon className={
                            "w-4 -mt-2 " + (sort_field === name && sort_direction === 'desc' ? "text-blue-700" : "")
                        }/>
                    </div>}
            </div>
        </th>
    )
}
