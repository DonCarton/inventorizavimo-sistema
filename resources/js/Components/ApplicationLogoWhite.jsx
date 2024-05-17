import React from 'react';
import { usePage } from '@inertiajs/react';

function ApplicationLogoWhite(props) {
    const { appLogoPath } = usePage().props;
    return (
        <img {...props} src={appLogoPath} alt="Logo White" />
    );
}

export default ApplicationLogoWhite;
