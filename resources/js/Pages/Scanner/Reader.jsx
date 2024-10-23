import {Html5Qrcode} from 'html5-qrcode';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import {useEffect} from "react";
import {Head, router} from "@inertiajs/react";
import StringHelper from "@/Libs/StringHelper.jsx";
import FailureMessage from "@/Components/FailureMessage.jsx";
import SuccessMessage from "@/Components/SuccessMessage.jsx";

export default function Reader({auth, role, success, failure}) {
    useEffect(() => {
        const startScanner = (cameraId) => {
            const scanner = new Html5Qrcode("reader");
            const config = { fps: 15, qrbox: { width: 250, height: 250 } };

            const qrCodeSuccessCallback = (decodedText, decodedResult) => {
                scanner.clear();
                router.get(route('processScan', decodedText));
            }
            scanner.start(
                cameraId,
                config,
                qrCodeSuccessCallback,
                (error) => {
                    console.warn(`Code scan error = ${error}`);
                }
            );
        };
        Html5Qrcode.getCameras().then((devices) => {
            if (devices && devices.length) {
                const backCamera = devices.find(device => device.label.toLowerCase().includes('0, facing back') || device.label.toLowerCase().includes('environment'));
                const cameraId = backCamera ? backCamera.id : devices[3].id;
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
                className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{StringHelper.__("Reader")}</h2>}
            role={role}
        >
            <Head title={StringHelper.__("Scanner")}/>
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
