const measureOptions = [
    { label: 'Kilograms', value: 'K' },
    { label: 'Litres', value: 'L' },
    { label: 'Packs', value: 'P' },
];

const labPrefixOptions = [
    {value: 'BIO', label: 'Gyvybės mokslų (BIO)'},
    {value: 'CHE', label: 'Chemijos (CHE)'},
    {value: 'FIZ', label: 'Fizikos ir astronomijos (FIZ)'},
    {value: 'FAB', label: 'Skaitmeninės gamybos - FabLab (FAB)'},
    {value: 'PRO', label: 'Vizualaus programavimo (PRO)'},
    {value: 'ROB', label: 'Mobiliųjų technologijų (ROB)'},
    {value: 'ŠVIE', label: 'Šviesos technologijų (SVI)'},
    {value: 'INZ', label: 'Inžinerijos (INZ)'},
    {value: 'BEN', label: 'STEAM bendrosios priemonės (BEN)'},
]

export const actionsOnInventory = [
    { value: 'REMOVE', label: "Remove", className: 'bg-red-300'},
    { value: 'RETURN', label: "Return", className: 'bg-emerald-400'}
]

export {measureOptions, labPrefixOptions};
