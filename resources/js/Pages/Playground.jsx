import { __ } from "@/Libs/Lang.jsx";

export default function Playground({ data }) {
    return (
        <div className="max-w-screen-3xl">
            {data.map((entry) => (
                <ul key={entry.id}>
                    <li>Objektas: {entry.id}</li>
                    {Object.entries(entry.properties).map(
                        ([key, value], index) =>
                            Object.entries(entry.properties[key]).map(
                                ([key, value], index) => (
                                    <li key={key}>
                                        {key}:{value}
                                    </li>
                                )
                            )
                    )}
                </ul>
            ))}
        </div>
    );
}
