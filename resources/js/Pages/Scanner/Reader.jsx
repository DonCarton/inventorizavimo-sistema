import {Html5Qrcode} from 'html5-qrcode';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import {useEffect, useState} from "react";
import {Head, router} from "@inertiajs/react";
import {__} from "@/Libs/Lang.jsx";
import FailureMessage from "@/Components/FailureMessage.jsx";
import SuccessMessage from "@/Components/SuccessMessage.jsx";

export default function Reader({auth, role, success, failure}) {
    useEffect(() => {
        // Function to start the scanner with the back camera
        const startScanner = (cameraId) => {
            const scanner = new Html5Qrcode("reader");
            const config = { fps: 5, qrbox: { width: 250, height: 250 } };

            scanner.start(
                cameraId,
                config,
                (decodedText, decodedResult) => {
                    // Handle the scanned result here
                    console.log(`Code matched = ${decodedText}`, decodedResult);
                    scanner.clear();
                    router.get(route('processScan', decodedText));
                },
                (error) => {
                    // Handle scan errors or failures here
                    console.warn(`Code scan error = ${error}`);
                }
            );
        };

        // Fetch the list of cameras and select the back camera
        Html5Qrcode.getCameras().then((devices) => {
            if (devices && devices.length) {
                // Find the back camera
                const backCamera = devices.find(device => device.label.toLowerCase().includes('back') || device.label.toLowerCase().includes('environment'));
                const cameraId = backCamera ? devices[0].id :  backCamera.id;
                startScanner(cameraId);
            }
        }).catch(err => {
            console.error(err);
        });
    }, []);
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2
                className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{__("Reader")}</h2>}
            role={role}
        >
            <Head title={__("Scanner")}/>
            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    {success && (<SuccessMessage message={success}/>)}
                    {failure && (<FailureMessage message={failure}/>)}
                    <div id='reader'/>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
