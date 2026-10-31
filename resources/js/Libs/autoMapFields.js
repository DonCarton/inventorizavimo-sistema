/**
 * Maps file columns to fields when the column's (backend-slugged) header exactly
 * matches one of the field's aliases (its key or its label in any app language).
 * Columns already mapped in `existing` are kept as they are, a field is never
 * used twice, and when two columns match the same field the first one wins.
 *
 * @param {Array<string|null>} normalizedHeaders slugged file headers, by column
 * @param {Array<{key: string}>} fields importable fields
 * @param {Object<string, string[]>} aliases field key -> slugged names
 * @param {Object<string, string>} existing current mapping (header -> field key)
 * @returns {Object<string, string>} merged mapping
 */
export default function autoMapFields(normalizedHeaders, fields, aliases, existing = {}) {
    const mapping = { ...existing };
    const used = new Set(Object.values(mapping).filter(Boolean));

    normalizedHeaders.forEach((header) => {
        if (!header || mapping[header]) return;

        const match = fields.find(
            (field) => !used.has(field.key) && (aliases[field.key] || [field.key]).includes(header),
        );

        if (match) {
            mapping[header] = match.key;
            used.add(match.key);
        }
    });

    return mapping;
}
