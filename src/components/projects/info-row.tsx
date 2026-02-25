import React from "react";

interface InfoRowProps {
    label: string;
    value: string;
}

const InfoRow = ({ label, value }: InfoRowProps) => {
    return (
        <div className="grid grid-cols-[1fr_4fr]">
            <p className="text-sm text-muted-foreground/50 font-medium tracking-wide">{label}</p>
            <p className="text-base font-normal tracking-wide text-muted-foreground capitalize">
                {value}
            </p>
        </div>
    );
};

export default InfoRow;
