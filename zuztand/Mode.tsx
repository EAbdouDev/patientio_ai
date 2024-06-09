import { create } from "zustand";

interface ModeState {
  isInstuctor: boolean;
  setIsInstuctor: (value: boolean) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

const useMode = create<ModeState>((set) => ({
  isInstuctor: false,
  setIsInstuctor: (value) => set({ isInstuctor: value }),
  isLoading: true,
  setIsLoading: (value) => set({ isLoading: value }),
}));

export default useMode;
