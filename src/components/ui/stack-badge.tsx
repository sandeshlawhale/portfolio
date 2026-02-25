import Image from "next/image";

const StackBadge = ({
    icon,
    name,
    width = 16,
    height = 16,
}: {
    icon?: string;
    name: string;
    width?: number;
    height?: number;
}) => {
    return (
        <span className="text-sm inline-flex gap-2 items-center justify-center my-1 p-2 py-0.5 rounded-lg bg-secondary border-1 border-border border-dashed w-fit text-secondary-foreground align-middle">
            {icon && <Image src={icon} alt={name} width={width} height={height} />}
            {name}
        </span>
    );
};

export default StackBadge;
