"use client";
import { MyData } from "@/constants/data";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Check, Copy } from "lucide-react";

const CopyMail = () => {
  const [isEmailCopied, setIsEmailCopied] = useState(false);

  const handleCopyEmail = async () => {
    const email = MyData.email;
    await navigator.clipboard.writeText(email);
    setIsEmailCopied(true);
    const timeoutRef = setTimeout(() => {
      setIsEmailCopied(false);
    }, 5000);

    return () => {
      if (timeoutRef) {
        clearTimeout(timeoutRef);
      }
    };
  };
  return (
    <div>
      <Button
        className="flex items-center justify-center text-base border border-border bg-secondary hover:bg-secondary-light ease-in-out duration-300 cursor-pointer transition-colors w-full"
        onClick={handleCopyEmail}
      >
        {isEmailCopied ? (
          <p className="flex items-center justify-center gap-3">
            Copied <Check className="text-icon-muted" />
          </p>
        ) : (
          <p className="flex items-center justify-center gap-3">
            Copy email <Copy className="text-icon-muted" />
          </p>
        )}
      </Button>
    </div>
  );
};

export default CopyMail;
