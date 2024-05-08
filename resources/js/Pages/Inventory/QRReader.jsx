import {Html5QrcodeScanner} from 'html5-qrcode';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {useEffect, useState} from "react";
import {Head, useForm} from "@inertiajs/react";

export default function QRReader({auth}) {

    const [scanResult, setScanResult] = useState(null);
    const {get} = useForm({});
    useEffect(() => {
        const scanner = new Html5QrcodeScanner('reader', {
            qrbox: {
                width: 500,
                height: 500,
            },
            fps: 5,
        });

        scanner.render(success, error);

        function success(result) {
            scanner.clear();
            setScanResult(result);
            //redirectScan(result);
        }

        function error(err) {
            console.log(error);
        }
    }, []);
    const onQrButtonClick = () => {
        get(route("qrreader.query", scanResult));
    }
    const onQrResetClick = () =>{
        get(route("qrreader"));
    }
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">QR reader</h2>}
        >
            <Head title="Item types"/>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {scanResult
                        ? <div>
                            <h1>Kodas atpažintas:</h1>
                            <button className="bg-emerald-600 rounded px-3 mr-2 text-white shadow transition-all hover:bg-emerald-700" onClick={onQrButtonClick}>{scanResult}</button>
                            <button className="bg-red-600 rounded px-3 mr-2 text-white shadow transition-all hover:bg-amber-700" onClick={onQrResetClick}>Skenuoti iš naujo</button>
                        </div>
                        : <div id='reader'></div>
                    }
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
