import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

/**
 * Round axis steps (1, 2, 2.5 or 5 × 10^n) so the y-axis reads 0, 1, 2, 3 or 0, 0.5, 1
 * instead of 0, 0.85, 1.7. Whole-number units never get fractional steps.
 */
function niceTicks(max, decimals, targetSteps = 4) {
    if (!(max > 0)) {
        return [0, 1];
    }
    const rough = max / targetSteps;
    const magnitude = Math.pow(10, Math.floor(Math.log10(rough)));
    const residual = rough / magnitude;
    let step = (residual <= 1 ? 1 : residual <= 2 ? 2 : residual <= 2.5 ? 2.5 : residual <= 5 ? 5 : 10) * magnitude;
    if (decimals === 0) {
        step = Math.max(1, Math.ceil(step));
    }
    const top = Math.ceil(max / step) * step;
    const ticks = [];
    for (let value = 0; value <= top + step / 2; value += step) {
        ticks.push(Number(value.toFixed(6)));
    }
    return ticks;
}

function ChartTooltip({ active, payload, label, format, unitCode, usedLabel }) {
    if (!active || !payload?.length) {
        return null;
    }
    return (
        <div className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-md dark:border-gray-600 dark:bg-gray-800">
            <div className="text-gray-500 dark:text-gray-400">{label}</div>
            <div className="font-medium text-indigo-700 dark:text-indigo-300">
                {usedLabel}: {format(payload[0].value)} {unitCode}
            </div>
        </div>
    );
}

// Monthly consumption of one item (last 12 months, oldest first). Loaded lazily from
// the item page, so recharts is only downloaded there. `labels` holds translated
// strings because StringHelper can only be used inside the page's render.
export default function ConsumptionChart({ data, unitCode = "", decimals = 3, labels }) {
    const format = (value) => Number(value).toLocaleString(undefined, { maximumFractionDigits: decimals });
    const monthLabel = (month) => {
        const [year, monthNumber] = month.split("-");
        return `${year.slice(2)}-${monthNumber}`;
    };
    const ticks = niceTicks(Math.max(...data.map((entry) => entry.amount)), decimals);

    return (
        <div className="w-full h-64 text-gray-600 dark:text-gray-300" role="img" aria-label={labels.title}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.15} vertical={false} />
                    <XAxis dataKey="month" tickFormatter={monthLabel} stroke="currentColor" fontSize={12} tickLine={false} />
                    <YAxis stroke="currentColor" fontSize={12} tickLine={false} axisLine={false} width={48}
                           tickFormatter={format} ticks={ticks} domain={[0, ticks[ticks.length - 1]]} />
                    <Tooltip
                        cursor={{ fill: "currentColor", fillOpacity: 0.08 }}
                        content={<ChartTooltip format={format} unitCode={unitCode} usedLabel={labels.used} />}
                    />
                    <Bar dataKey="amount" fill="#4f46e5" radius={[3, 3, 0, 0]} maxBarSize={36} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
