import StringHelper from "@/Libs/StringHelper.jsx";

export default function Playground({ data }) {
    return (
        <div className="max-w-screen-3xl">
            {/*<pre>{JSON.stringify(data,undefined,2)}</pre>*/}
            <table className="border-2 border-black">
                <thead>
                    <tr>
                        <th></th>
                        <th>When</th>
                        <th>Object</th>
                        <th>What</th>
                        <th>Who</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>V</td>
                        <td colSpan={4}>
                            <div className="w-full">
                                <div>
                                    <table className="w-full border-2 border-black">
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
                                        <tr className="text-wrap">
                                            {Object.entries(data.data[0].fields).map(([key, value], index) =>
                                                (
                                                    <td key={key} className="w-64">{value === null ? '-' : value}</td>
                                                ))}

                                            {Object.entries(data.data[0].new_values).map(([key, value], index) =>
                                                (
                                                    <td key={key} className="w-64">{value === null ? '-' : value}</td>
                                                ))}

                                            {Object.entries(data.data[0].old_values).map(([key, value], index) =>
                                                (
                                                    <td key={key} className="w-64">{value}</td>
                                                ))}
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
