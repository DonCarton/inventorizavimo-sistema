// Deep-merged with react-spreadsheet-import's own defaultTheme (lodash `merge`),
// so only overrides need to be listed here. Colors follow the app's PrimaryButton
// (bg-pink-800, hover/active pink-700/900, focus ring pink-500) since this project
// has no custom Tailwind color palette — it uses Tailwind's default scale directly.
export const spreadsheetImportTheme = {
    fonts: {
        heading: 'Figtree, ui-sans-serif, system-ui, sans-serif',
        body: 'Figtree, ui-sans-serif, system-ui, sans-serif',
    },
    colors: {
        rsi: {
            50: '#fdf2f8',
            100: '#fce7f3',
            200: '#fbcfe8',
            300: '#f9a8d4',
            400: '#f472b6',
            500: '#ec4899',
            600: '#db2777',
            700: '#be185d',
            800: '#9d174d',
            900: '#831843',
        },
    },
};
