import {Html5QrcodeScanner} from 'html5-qrcode';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import {useEffect, useState} from "react";
import {Head, useForm} from "@inertiajs/react";
import {__} from "@/Libs/Lang.jsx";

export default function Reader({auth, role, success}) {

    const [scanResult, setScanResult] = useState(null);
    const {get} = useForm({});
    useEffect(() => {
        const scanner = new Html5QrcodeScanner('reader', {
            qrbox: {
                width: 250,
                height: 250,
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
        get(route("reader.query", scanResult));
    }
    const onQrResetClick = () =>{
        get(route("reader"));
    }
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{__("Reader")}</h2>}
            role={role}
        >
            <Head title="Item types"/>
            <div className="py-12">
                {success && (<div>

                </div>)}
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    {scanResult
                        ? <div className="grid grid-cols-2">
                            <div className="flex justify-center items-center py-4">
                                <a type="button" onClick={onQrButtonClick}>
                                    <div className="px-6 py-6 bg-emerald-600 w-full h-full rounded mr-2 text-white shadow transition-all hover:bg-emerald-700">
                                        {scanResult}
                                    </div>
                                </a>
                            </div>
                            <div className="flex justify-center items-center py-4">
                                <a type="button" onClick={onQrResetClick}>
                                    <div className="px-6 py-6 bg-red-600 rounded mr-2 text-white shadow transition-all hover:bg-amber-700">
                                        Skenuoti iš naujo
                                    </div>
                                </a>
                            </div>
                        </div>
                        : <div id='reader'></div>
                    }
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
