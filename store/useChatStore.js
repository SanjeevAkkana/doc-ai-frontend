import { create } from "zustand";

const useChatStore = create((set) => ({
  messages: [],
  isLoading: false,
  
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  setLoading: (loading) => set({ isLoading: loading }),

  clearChat: () => set({ messages: [] }),
}));

export default useChatStore;