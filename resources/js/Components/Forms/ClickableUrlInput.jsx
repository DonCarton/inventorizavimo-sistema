import TextInput from "@/Components/TextInput.jsx";

export default function ClickableUrlInput({id, name, url, className = ''}){
    return(
        <div className="flex items-center space-x-2">
            <TextInput
                id={id}
                name={name}
                className={'hover:cursor-pointer read-only:text-white read-only:bg-gray-400 ' + className}
                value={url}
                readOnly
                inputProps={{style: {cursor: "pointer"}}}
                onClick={() => window.open(url, "_blank")}
            />
        </div>
    )
}
