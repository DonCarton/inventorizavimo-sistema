import React, {useEffect, useRef, useState} from 'react';
import Modal from '@/Components/Modal';
import {FiUpload, FiX} from 'react-icons/fi';
import Checkbox2 from "@/Components/Checkbox2.jsx";

const FileUploadModal = ({
                             isOpen,
                             onClose,
                             onFileSelect,
                             onFailsViaMailCheck,
                             onSubmit,
                             selectFileText,
                             checkboxText = 'Do you wish to receive the failed import via email?',
                             itemNotSpecifiedText,
                             submitButtonText,
                             alertTextForMissingFile,
                             alertForWrongType,
                             modalHeaderText
                         }) => {
    const fileInputRef = useRef(null);
    const [selectedFileName, setSelectedFileName] = useState(null);
    const [sendFailsViaMail, setSendFailsViaMail] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setSelectedFileName(null); // Reset selected file when modal opens
        }
    }, [isOpen]);
    const handleButtonClick = (e) => {
        e.preventDefault();
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const fileType = file.name.split('.').pop().toLowerCase();
        if (fileType !== 'xlsx' && fileType !== 'csv') {
            alert(alertForWrongType + '.');
            return;
        }
        if (file) {
            setSelectedFileName(file.name);
            onFileSelect(file);
        }
    };

    const handleFeedback = (e) => {
        setSendFailsViaMail(e.target.checked);
        onFailsViaMailCheck(e);
    }

    const handleSubmit = (e) => {
        if (!selectedFileName) {
            alert(alertTextForMissingFile + '.');
            return;
        }
        e.preventDefault();
        onSubmit();
        onClose();
    };

    return (
        <Modal show={isOpen} onClose={onClose}>
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">{modalHeaderText}</h2>
                    <button onClick={onClose}>
                        <FiX/>
                    </button>
                </div>
                <input
                    type="file"
                    accept=".xlsx, .csv"
                    ref={fileInputRef}
                    style={{display: 'none'}}
                    onChange={handleFileChange}
                />
                <div className="grid grid-cols-3 gap-4">
                    <button
                        className="flex items-center justify-center border border-gray-300 rounded-md p-2 hover:bg-gray-100"
                        onClick={handleButtonClick}
                    >
                        <FiUpload className="mr-2"/></button>
                    {selectedFileName ?
                        <div className="col-span-2 text-center">
                            <p className="font-semibold">{selectFileText}</p>
                            <p>{selectedFileName}</p>
                        </div>
                        :
                        <div className="col-span-2 text-center">
                            <p className="font-semibold">{selectFileText}</p>
                            <p>{itemNotSpecifiedText}</p>
                        </div>}
                    <div className="col-span-3 flex items-center">
                        <Checkbox2
                            id="file-upload-checkbox"
                            checked={sendFailsViaMail}
                            onChange={handleFeedback}
                        />
                        <label htmlFor="file-upload-checkbox" className="text-sm">
                            {checkboxText}
                        </label>
                    </div>
                    <button
                        className="col-span-3 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                        onClick={handleSubmit}
                    >
                        {submitButtonText}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default FileUploadModal;
