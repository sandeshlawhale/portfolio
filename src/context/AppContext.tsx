"use client";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface AppContextType {
  isOpen: boolean;
  openPalette: () => void;
  closePalette: () => void;
  isWorkSidebarOpen: boolean;
  openWorkSidebar: () => void;
  closeWorkSidebar: () => void;
  resetAmongUsCount: () => void;
  amongUsCount: number;
  setAmongUsCount: Dispatch<SetStateAction<number>>;
  increaseAmongUsCount: () => void;
}

const defaultContext: AppContextType = {
  isOpen: false,
  openPalette: () => true,
  closePalette: () => false,
  isWorkSidebarOpen: false,
  openWorkSidebar: () => true,
  closeWorkSidebar: () => false,
  resetAmongUsCount: () => { },
  amongUsCount: 0,
  setAmongUsCount: () => { },
  increaseAmongUsCount: () => { },
};

const AppContext = createContext<AppContextType>(defaultContext);

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // states for command pallatte
  const [isOpen, setIsOpen] = useState(false);

  const [isWorkSidebarOpen, setIsWorkSidebarOpen] = useState(true);

  // work sidebar options
  const openWorkSidebar = () => setIsWorkSidebarOpen(!isWorkSidebarOpen);
  const closeWorkSidebar = () => setIsWorkSidebarOpen(false);

  // function to set amoung us
  const [amongUsCount, setAmongUsCount] = useState(0);
  const increaseAmongUsCount = () => {
    if (amongUsCount === 6) {
      return;
    }
    setAmongUsCount((prev) => prev + 1);
  };
  const resetAmongUsCount = () => {
    setAmongUsCount(0);
  };

  // to open the command line in page
  const openPalette = () => setIsOpen(true);
  const closePalette = () => setIsOpen(false);

  const value: AppContextType = {
    isOpen,
    openPalette,
    closePalette,
    isWorkSidebarOpen,
    openWorkSidebar,
    closeWorkSidebar,
    amongUsCount,
    setAmongUsCount,
    increaseAmongUsCount,
    resetAmongUsCount,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
