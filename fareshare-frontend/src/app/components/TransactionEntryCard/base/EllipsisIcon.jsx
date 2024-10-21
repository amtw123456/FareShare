export const EllipsisIcon = ({
    fill = 'currentColor',
    size,
    height,
    width,
    label,
    ...props
}) => {
    return (
        <svg
            width={size || width || 24}
            height={size || height || 24}
            viewBox="0 0 24 6"
            fill={fill}
            xmlns="http://www.w3.org/2000/svg"
            aria-label={label}
            role="img"
            {...props}
        >
            <circle cx="3" cy="3" r="3" />
            <circle cx="12" cy="3" r="3" />
            <circle cx="21" cy="3" r="3" />
        </svg>
    );
};
