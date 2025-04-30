import { useState } from "react";

export const useSidebar = () => {
  const [open, setOpen] = useState(false);

  return {
    open,
    setOpen,
    openSidebar: () => setOpen(true),
    closeSidebar: () => setOpen(false),
  };
};
