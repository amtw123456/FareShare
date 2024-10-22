export const XIcon = ({
    fill = 'currentColor',
    size,
    height,
    width,
    ...props
}) => {
    return (
        <svg
            width={size || width || 24}
            height={size || height || 24}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M18.364 5.636a1 1 0 010 1.414L13.414 12l4.95 4.95a1 1 0 11-1.414 1.414L12 13.414l-4.95 4.95a1 1 0 11-1.414-1.414l4.95-4.95-4.95-4.95A1 1 0 117.05 5.636L12 10.586l4.95-4.95a1 1 0 011.414 0z"
                fill={fill}
            />
        </svg>
    );
};
