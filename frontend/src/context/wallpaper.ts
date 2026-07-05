import {createContext, useContext} from "react";
import type { Wallpaper } from "../data/wallpapers";

export interface WallpaperContextType {
  wallpaperId: string;
  setWallpaperId: (id: string | ((prev: string) => string)) => void;
  wallpaper: Wallpaper;
  frameStyle: {
    backgroundImage: string;
    backgroundSize: string;
    backgroundPosition: string;
  };
}

export const WallpaperContext = createContext<WallpaperContextType | null>(null);

export function useWallpaper() {
  const ctx = useContext(WallpaperContext);

  if (!ctx) {
    throw new Error("useWallpaper must be used within WallpaperProvider");
  }
  return ctx;
}

