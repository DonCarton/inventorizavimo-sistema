export default function Playground({inventoryItem}) {
    return (
        <div className="max-w-screen-3xl">
            <table className="w-full border-2 border-black">
                <thead className="border-2 border-black">
                    <tr>
                        <th className="border-2 border-black">Column 1</th>
                        <th className="border-2 border-black">Column 2</th>
                        <th className="border-2 border-black">Column 3</th>
                        <th className="border-2 border-black">Column 4</th>
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
                        <th className="border-2 border-black">None</th>
                        <th className="border-2 border-black">None</th>
                        <th className="border-2 border-black">None</th>
                        <th className="border-2 border-black">None</th>
                    </tr>
                </thead>
                <tbody>
                <tr>
                    <td className="border-2 border-black"><span>V</span></td>
                    <td colSpan={3} className="border-2 border-black">
                        <div className="grid grid-cols-3 gap-2">
                                <ul className="border-2 border-black">
                                    <li>1</li>
                                    <li>1</li>
                                    <li>1</li>
                                    <li>1</li>
                                    <li>1</li>
                                    <li>1</li>
                                    <li>1</li>
                                    <li>1</li>
                                    <li>1</li>
                                    <li>1</li>
                                    <li>1</li>
                                    <li>1</li>
                                </ul>
                            <div className="border-2 border-black">
                                <ul>
                                    <li>1</li>
                                    <li>1</li>
                                    <li>1</li>
                                    <li>1</li>
                                    <li>1</li>
                                    <li>1</li>
                                    <li>1</li>
                                    <li>1</li>
                                    <li>1</li>
                                    <li>1</li>
                                </ul>
                            </div>
                            <div className="border-2 border-black">
                                <ul>
                                    <li>1</li>
                                    <li>1</li>
                                    <li>1</li>
                                    <li>1</li>
                                    <li>1</li>
                                    <li>1</li>
                                    <li>1</li>
                                    <li>1</li>
                                    <li>1</li>
                                    <li>1</li>
                                </ul>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td className="border-2 border-black"><span>V</span></td>
                    <td colSpan={3} className="border-2 border-black">
                        <div className="grid grid-cols-3 gap-2">
                            <div>1</div>
                            <div>1</div>
                            <div>1</div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td className="border-2 border-black"><span>V</span></td>
                    <td colSpan={3} className="border-2 border-black">
                    <div className="grid grid-cols-3 gap-2">
                            <div>1</div>
                            <div>1</div>
                            <div>1</div>
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    )
}
