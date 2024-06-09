import { create } from "zustand";

interface Transcript {
  text: string | undefined;
  confidence: number;
  ai?: boolean;
}

interface ChatState {
  chatHistory: { role: string; parts: { text: string }[] }[];
  setChatHistory: (
    updater: (
      prevChat: { role: string; parts: { text: string }[] }[]
    ) => { role: string; parts: { text: string }[] }[]
  ) => void;
  addChatHistory: (role: string, text: string) => void;
  transcripts: Transcript[];
  setTranscripts: (
    updater: (prevTranscripts: Transcript[]) => Transcript[]
  ) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  audioURL: any;
  setAudioURL: (url: any) => void;
}

const useChat = create<ChatState>((set) => ({
  chatHistory: [],
  setChatHistory: (updater) =>
    set((state) => ({
      chatHistory: updater(state.chatHistory),
    })),
  addChatHistory: (role, text) =>
    set((state) => ({
      chatHistory: [...state.chatHistory, { role, parts: [{ text }] }],
    })),
  transcripts: [],
  setTranscripts: (updater) =>
    set((state) => ({
      transcripts: updater(state.transcripts),
    })),

  isLoading: true,
  setIsLoading: (value) => set({ isLoading: value }),
  audioURL: null,
  setAudioURL: (url) => set({ audioURL: url }),
}));

export default useChat;
