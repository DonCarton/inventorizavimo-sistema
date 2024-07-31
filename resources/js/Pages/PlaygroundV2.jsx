import { useState } from 'react'

export default function Playground2({ inventoryItem }) {
    const [openRow, setOpenRow] = useState(0);
    const [openRow2, setOpenRow2] = useState(0);

    const handleOpenRow = (value) => {setOpenRow(value !== openRow ? value : 0)}
    const handleOpenRow2 = (value) => {setOpenRow2(value !== openRow2 ? value : 0)}

    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1;
    let dd = today.getDate();
    let HH = today.getHours();
    let MM = today.getMinutes();
    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;

    const formattedToday = dd + "/" + mm + "/" + yyyy + " " + HH + ":" + MM;
    return (
        <div className="max-w-screen-3xl">
            <table className="w-full border-2 border-black">
                <thead className="border-2 border-black">
                    <tr>
                        <th className="border-2 border-black w-4"></th>
                        <th className="border-2 border-black w-64">Column 2</th>
                        <th className="border-2 border-black w-64">Column 3</th>
                        <th className="border-2 border-black w-64">Column 4</th>
                        <th className="border-2 border-black w-64">Column 5</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border-2 border-black"></td>
                        <td className="border-2 border-black"></td>
                        <td className="border-2 border-black"></td>
                        <td className="border-2 border-black"></td>
                    </tr>
                </tbody>
            </table>
            <table className="w-full border-2 border-black">
                <thead>
                    <tr>
                        <th className="border-2 border-black w-4"></th>
                        <th className="border-2 border-black text-left w-64"></th>
                        <th className="border-2 border-black text-left w-64"></th>
                        <th className="border-2 border-black text-left w-64"></th>
                        <th className="border-2 border-black text-left w-64"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border-2 border-black">
                            <span className="flex justify-center">
                                <button onClick={() => handleOpenRow(1)} >V</button>
                            </span>
                        </td>
                        <td className="border-2 border-black">
                            {formattedToday}
                        </td>
                        <td className="border-2 border-black">Object</td>
                        <td className="border-2 border-black">Action</td>
                        <td className="border-2 border-black">Who</td>
                    </tr>
                    {openRow === 1 && <tr>
                        <td className="border-2 border-black">
                            <span className="flex justify-center">
                                <button onClick={() => setOpenRow(0)}>
                                    V
                                </button>
                            </span>
                        </td>
                        <td colSpan={4} className="border-2 border-black">
                            <div className="w-full">
                                <div>
                                    <table className="w-full">
                                        <thead>
                                            <tr>
                                                <th className="border-2 border-black w-64 text-left">Field</th>
                                                <th className="border-2 border-black w-64 text-left">Old</th>
                                                <th className="border-2 border-black w-64 text-left">New</th>
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
                                            <tr>
                                                <td className="border-2 border-black w-64">1</td>
                                                <td className="border-2 border-black w-64">2</td>
                                                <td className="border-2 border-black w-64">3</td>
                                            </tr>
                                            <tr>
                                                <td className="border-2 border-black w-64">1</td>
                                                <td className="border-2 border-black w-64">2</td>
                                                <td className="border-2 border-black w-64">3</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </td>
                    </tr>}
                    <tr>
                        <td className="border-2 border-black">
                            <span className="flex justify-center">
                                <button onClick={() => handleOpenRow2(2)} >V</button>
                            </span>
                        </td>
                        <td className="border-2 border-black">
                            {formattedToday}
                        </td>
                        <td className="border-2 border-black">Object</td>
                        <td className="border-2 border-black">Action</td>
                        <td className="border-2 border-black">Who</td>
                    </tr>
                    {openRow2 === 2 && <tr>
                        <td className="border-2 border-black">
                            <span className="flex justify-center">
                                <button onClick={() => setOpenRow2(0)}>
                                    V
                                </button>
                            </span>
                        </td>
                        <td colSpan={4} className="border-2 border-black">
                            <div className="w-full">
                                <div>
                                    <table className="w-full">
                                        <thead>
                                            <tr>
                                                <th className="border-2 border-black w-64 text-left">Field</th>
                                                <th className="border-2 border-black w-64 text-left">Old</th>
                                                <th className="border-2 border-black w-64 text-left">New</th>
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
                                            <tr>
                                                <td className="border-2 border-black w-64">1</td>
                                                <td className="border-2 border-black w-64">2</td>
                                                <td className="border-2 border-black w-64">3</td>
                                            </tr>
                                            <tr>
                                                <td className="border-2 border-black w-64">1</td>
                                                <td className="border-2 border-black w-64">2</td>
                                                <td className="border-2 border-black w-64">3</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </td>
                    </tr>}
                </tbody>
            </table>
        </div>
    );
}
