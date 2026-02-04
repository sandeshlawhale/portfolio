"use client";
import { MyData } from "@/constants/data";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Check, Copy, Mail } from "lucide-react";
import { trackEvent, getDeviceType } from "@/utils/api/analytics";

const CopyMail = () => {
  const [isEmailCopied, setIsEmailCopied] = useState(false);

  const handleCopyEmail = async () => {
    trackEvent({
      type: "interaction",
      category: "contact",
      event: "email_copied",
      metadata: { device: getDeviceType() }
    });
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
    <div className="flex flex-col gap-2">
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
      <Button
        variant="ghost"
        className="flex items-center justify-center text-sm text-mutedText hover:text-primaryText w-full gap-2 transition-colors"
        onClick={() => {
          trackEvent({
            type: "interaction",
            category: "contact",
            event: "email_link_opened",
            metadata: { device: getDeviceType() }
          });
          window.location.href = `mailto:${MyData.email}`;
        }}
      >
        <Mail className="w-4 h-4" /> Open in Mail App
      </Button>
    </div>
  );
};

export default CopyMail;
