import { useRef } from 'react';
import TextInput from './TextInput';

export default function SearchInput({ value, onChange, onClear, className = '', ...props }) {
    const inputRef = useRef();

    const handleClear = () => {
        onClear?.();
        inputRef.current?.focus();
    };

    return (
        <div className="relative">
            <TextInput
                {...props}
                ref={inputRef}
                value={value}
                onChange={onChange}
                className={'pr-8 ' + className}
            />
            {value && (
                <button
                    type="button"
                    onClick={handleClear}
                    className="absolute inset-y-0 right-2 flex items-center text-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    tabIndex={-1}
                >
                    ✕
                </button>
            )}
        </div>
    );
}
