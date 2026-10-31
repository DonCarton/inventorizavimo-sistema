import StringHelper from "@/Libs/StringHelper";

/**
 * "2.5 K / month" from an item resource (averageConsumption + measurementUnit),
 * or "—" when the item has no recorded usage yet. Must be called during render
 * (StringHelper reads the page props).
 */
export default function formatMonthlyConsumption(item) {
    if (item.averageConsumption === null || item.averageConsumption === undefined) {
        return "-";
    }
    const unit = item.measurementUnit ? `${item.measurementUnit.code}` : "";
    return `${item.averageConsumption}${unit}/${StringHelper.__("month")}`;
}
