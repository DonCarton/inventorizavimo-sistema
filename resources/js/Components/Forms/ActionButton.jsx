export default function ActionButton({ className = '', disabled, children, ...props }) {
    return (
        <button
            {...props}
            className={
                `flex items-center px-4 py-2 bg-pink-800 dark:bg-gray-200 border border-transparent rounded-md text-white dark:text-gray-800 hover:bg-pink-700 dark:hover:bg-white focus:bg-pink-700 dark:focus:bg-white active:bg-pink-900 dark:active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150 ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
