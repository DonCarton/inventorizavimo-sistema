import {Html5Qrcode, Html5QrcodeSupportedFormats} from 'html5-qrcode';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import {useEffect, useState} from "react";
import {Head, router} from "@inertiajs/react";
import {__} from "@/Libs/Lang.jsx";
import FailureMessage from "@/Components/FailureMessage.jsx";
import SuccessMessage from "@/Components/SuccessMessage.jsx";

export default function Reader({auth, role, success, failure}) {
    const [emptyValue, setEmptyValue] = useState(null);
    useEffect(() => {
        const scanner = new Html5Qrcode(
            "reader", {
                formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE]
            });
        const qrCodeSuccessCallback = (decodedText, decodedResult) => {
            scanner.clear();
            router.get(route('processScan', decodedText));
        }
        const config = {fps: 10, qrbox: {width: 250, height: 250}};

        scanner.start({facingMode: "environment", deviceId: 2}, config, qrCodeSuccessCallback);
        Html5Qrcode.getCameras().then((devices) => {
            if (devices && devices.length) {
                // Find the back camera
                const backCamera = devices.find(device => device.label.toLowerCase().includes('back') || device.label.toLowerCase().includes('environment'));
                console.log(devices);
                setEmptyValue(devices);
                const cameraId = backCamera ? backCamera.id : devices[0].id;
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
                    {emptyValue !== null && <h1>{emptyValue[0]}{emptyValue[1]}</h1>}
                    <div id='reader'/>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
