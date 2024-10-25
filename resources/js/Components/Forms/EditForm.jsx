import PrimaryButton from "@/Components/PrimaryButton.jsx";
import {Link} from "@inertiajs/react";
import SecondaryButton from "@/Components/SecondaryButton.jsx";
import React from "react";
import DeleteButton from "@/Components/Forms/DeleteButton.jsx";

export default function EditForm({children, onSubmit, cancelButtonRoute, primaryButtonText, cancelButtonText, deleteButtonOnClick, deleteButtonText, canDelete = false, disabled})  {
    return(
        <form onSubmit={onSubmit} className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
            {children}
            <div className="flex justify-between mt-4">
                <div>
                    <Link href={route(cancelButtonRoute)}><SecondaryButton type="button" disabled={disabled}
                                                                           className="mr-2">{cancelButtonText}</SecondaryButton></Link>
                    <PrimaryButton disabled={disabled}>{primaryButtonText}</PrimaryButton>
                </div>
                {canDelete && <DeleteButton type="button" onClick={deleteButtonOnClick} disabled={disabled}>
                    {deleteButtonText}
                </DeleteButton>}
            </div>
        </form>
    )
}
