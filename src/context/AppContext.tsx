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
  isPageLoading: boolean;
  loadingProgress: number;
  dataLoaded: boolean;
  setLoadingProgress: (progress: number) => void;
  setDataLoaded: (loaded: boolean) => void;
  finishPageLoading: () => void;
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
  isPageLoading: true,
  loadingProgress: 0,
  dataLoaded: false,
  setLoadingProgress: () => { },
  setDataLoaded: () => { },
  finishPageLoading: () => { },
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

  // Loading state management
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);

  const finishPageLoading = () => {
    setIsPageLoading(false);
  };

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
    isPageLoading,
    loadingProgress,
    dataLoaded,
    setLoadingProgress,
    setDataLoaded,
    finishPageLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
