import PrimaryButton from "@/Components/PrimaryButton.jsx";
import {Link} from "@inertiajs/react";
import SecondaryButton from "@/Components/SecondaryButton.jsx";

export default function EditForm({children, onSubmit, cancelButtonRoute, primaryButtonText, cancelButtonText})  {
    return(
        <form onSubmit={onSubmit} className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
            {children}
            <div className="mt-4">
                <Link href={route(cancelButtonRoute)}><SecondaryButton type="button">{cancelButtonText}</SecondaryButton></Link>
                <PrimaryButton>{primaryButtonText}</PrimaryButton>
            </div>
        </form>
    )
}
