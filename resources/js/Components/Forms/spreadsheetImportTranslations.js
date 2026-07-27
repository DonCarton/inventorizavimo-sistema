// Lithuanian translations for react-spreadsheet-import, deep-merged by RSI itself against its
// English defaults (node_modules/react-spreadsheet-import/dist/translationsRSIProps.js) — any
// key left out here silently falls back to English rather than breaking.
export const spreadsheetImportTranslations = {
    uploadStep: {
        title: 'Įkelti failą',
        manifestTitle: 'Laukiami duomenys:',
        manifestDescription: '(Kitame žingsnyje galėsite pervadinti arba pašalinti stulpelius)',
        maxRecordsExceeded: (maxRecords) => `Per daug įrašų. Leidžiama iki ${maxRecords}`,
        dropzone: {
            title: 'Įkelkite .xlsx, .xls arba .csv failą',
            errorToastDescription: 'įkėlimas atmestas',
            activeDropzoneTitle: 'Įkelkite failą čia...',
            buttonTitle: 'Pasirinkti failą',
            loadingTitle: 'Apdorojama...',
        },
        selectSheet: {
            title: 'Pasirinkite naudotiną lapą',
            nextButtonTitle: 'Toliau',
            backButtonTitle: 'Atgal',
        },
    },
    selectHeaderStep: {
        title: 'Pasirinkite antraštės eilutę',
        nextButtonTitle: 'Toliau',
        backButtonTitle: 'Atgal',
    },
    matchColumnsStep: {
        title: 'Susieti stulpelius',
        nextButtonTitle: 'Toliau',
        backButtonTitle: 'Atgal',
        userTableTitle: 'Jūsų lentelė',
        templateTitle: 'Taps',
        selectPlaceholder: 'Pasirinkite stulpelį...',
        ignoredColumnText: 'Stulpelis ignoruojamas',
        subSelectPlaceholder: 'Pasirinkite...',
        matchDropdownTitle: 'Sieti',
        unmatched: 'Nesusieta',
        duplicateColumnWarningTitle: 'Kito stulpelio pasirinkimas panaikintas',
        duplicateColumnWarningDescription: 'Stulpeliai negali kartotis',
    },
    validationStep: {
        title: 'Patikrinti duomenis',
        nextButtonTitle: 'Patvirtinti',
        backButtonTitle: 'Atgal',
        noRowsMessage: 'Duomenų nerasta',
        noRowsMessageWhenFiltered: 'Klaidų turinčių duomenų nerasta',
        discardButtonTitle: 'Atmesti pažymėtas eilutes',
        filterSwitchTitle: 'Rodyti tik eilutes su klaidomis',
    },
    alerts: {
        confirmClose: {
            headerTitle: 'Baigti importo procesą',
            bodyText: 'Ar tikrai? Įvesta informacija nebus išsaugota.',
            cancelButtonTitle: 'Atšaukti',
            exitButtonTitle: 'Išeiti',
        },
        submitIncomplete: {
            headerTitle: 'Aptikta klaidų',
            bodyText: 'Vis dar yra eilučių su klaidomis. Klaidingos eilutės bus praleistos pateikiant duomenis.',
            bodyTextSubmitForbidden: 'Vis dar yra eilučių su klaidomis.',
            cancelButtonTitle: 'Atšaukti',
            finishButtonTitle: 'Pateikti',
        },
        submitError: {
            title: 'Klaida',
            defaultMessage: 'Pateikiant duomenis įvyko klaida',
        },
        unmatchedRequiredFields: {
            headerTitle: 'Susieti ne visi stulpeliai',
            bodyText: 'Yra privalomų stulpelių, kurie nesusieti arba ignoruojami. Ar norite tęsti?',
            listTitle: 'Nesusieti stulpeliai:',
            cancelButtonTitle: 'Atšaukti',
            continueButtonTitle: 'Tęsti',
        },
        toast: {
            error: 'Klaida',
        },
    },
};
