const Checkbox2 = ({label, checked, onChange, className = ''}) => {
    return (
        <div className={`flex items-center ${className}`}>
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="mr-2 rounded dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-indigo-600 shadow-sm focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:focus:ring-offset-gray-800"
            />
            <label className="text-gray-700 dark:text-gray-200">{label}</label>
        </div>
    )
}

export default Checkbox2;
