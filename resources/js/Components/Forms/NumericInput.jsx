import {forwardRef, useEffect, useRef} from 'react';

export default forwardRef(function TextInput({ type = 'text', className = '', isFocused = false, ...props }, ref) {
    const input = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, []);
    const handleNumericInput = (e) => {

        const currentValue = e.target.value;
        const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'Tab'];
        const isNumber = e.key >= '0' && e.key <= '9';
        const isDotOrComma = e.key === '.' || e.key === ',';

        if (
            !isNumber &&
            !allowedKeys.includes(e.key) &&
            !isDotOrComma &&
            !e.ctrlKey
        ) {
            e.preventDefault();
        }
        if (isDotOrComma) {
            if (currentValue.includes('.') || currentValue.includes(',')) {
                e.preventDefault();
            } else {
                e.preventDefault();
                e.target.value = currentValue + '.';
            }
        }
    };
    return (
        <input
            {...props}
            type={type}
            className={
                'border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm ' +
                className
            }
            ref={input}
            onKeyDown={handleNumericInput}
            pattern="[0-9,.]*"
        />
    );
});
