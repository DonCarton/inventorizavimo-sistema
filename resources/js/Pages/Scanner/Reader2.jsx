import {Html5QrcodeScanner} from 'html5-qrcode';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.jsx';
import {useEffect} from "react";
import {Head, router} from "@inertiajs/react";
import StringHelper from "@/Libs/StringHelper.jsx";
import FailureMessage from "@/Components/FailureMessage.jsx";
import SuccessMessage from "@/Components/SuccessMessage.jsx";

export default function Reader2({auth, success, failure}) {
    useEffect(() => {
        const scanner = new Html5QrcodeScanner('reader', {
            qrbox: {
                width: 250,
                height: 250,
            },
            fps: 5,
        });
        scanner.render(fetchOrFail, error);
        function fetchOrFail(result){
            scanner.clear();
            router.get(route('processScan', result));
        }
        function error(err) {
            console.log(err);
        }
    }, []);
    return (
        <AuthenticatedLayout
            user={auth.user}
            can={auth.can}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{StringHelper.__("Reader")}</h2>}
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
