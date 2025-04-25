"use client";
import { MyGames, MyProjects } from "@/constants/data";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface AppContextType {
  searchSlug: string | null;
  setSearchSlug: Dispatch<SetStateAction<string | null>>;
  projects: typeof MyProjects;
  projectGames: typeof MyProjects;
  isOpen: boolean;
  openPalette: () => void;
  closePalette: () => void;
  resetAmongUsCount: () => void;
  amongUsCount: number;
  setAmongUsCount: Dispatch<SetStateAction<number>>;
  increaseAmongUsCount: () => void;
}

const defaultContext: AppContextType = {
  searchSlug: null,
  setSearchSlug: () => {},
  projects: MyProjects,
  projectGames: MyProjects,
  isOpen: false,
  openPalette: () => true,
  closePalette: () => false,
  resetAmongUsCount: () => {},
  amongUsCount: 0,
  setAmongUsCount: () => {},
  increaseAmongUsCount: () => {},
};

const AppContext = createContext<AppContextType>(defaultContext);

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const projects = MyProjects;
  const projectGames = MyGames;
  const [searchSlug, setSearchSlug] = useState<string | null>(
    MyProjects[0].slug
  );
  const [isOpen, setIsOpen] = useState(false);

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

  // sidebar in work page
  const openPalette = () => setIsOpen(true);
  const closePalette = () => setIsOpen(false);

  const value: AppContextType = {
    searchSlug,
    setSearchSlug,
    projects,
    projectGames,
    isOpen,
    openPalette,
    closePalette,
    amongUsCount,
    setAmongUsCount,
    increaseAmongUsCount,
    resetAmongUsCount,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
