import React from 'react';
import { usePage } from '@inertiajs/react';

function ApplicationLogoColour(props) {
    const { appLogoPathColour } = usePage().props;
    return (
        <img {...props} src={appLogoPathColour} alt="Logo White" />
    );
}

export default ApplicationLogoColour;
