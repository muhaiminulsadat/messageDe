import { create } from "zustand";
import { persist, type PersistOptions } from "zustand/middleware";
import type { StateCreator } from "zustand";

import { axiosInstance } from "../lib/axios";
import { useAuthStore, type User } from "./useAuthStore";
import toast from "react-hot-toast";

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  text?: string;
  image?: string;
  video?: string;
  createdAt: string;
  updatedAt: string;
}

export type MessagePayload = FormData | { text: string };

interface ChatState {
  users: User[];
  conversations: User[];
  messages: Message[];
  selectedUser: User | null;
  activeConversationId: string | null;

  isConversationsLoading: boolean;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  searchQuery: string;
  sidebarTab: string;
  composerText: string;
  isSoundEnabled: boolean;
  isSendingMedia: boolean;

  getUsers: () => Promise<void>;
  getConversations: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  sendMessage: (messageData: MessagePayload) => Promise<boolean>;

  subscribeToMessages: (userId: string) => void;
  unsubscribeFromMessages: () => void;

  setSelectedUser: (user: User | null) => void;
  setActiveConversationId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setSidebarTab: (tab: string) => void;
  setComposerText: (text: string) => void;
  setSoundEnabled: (enabled: boolean) => void;

  sendTextMessage: (conversationId: string | null) => Promise<boolean>;
  sendMediaMessage: (params: { conversationId: string | null; file: File | null }) => Promise<boolean>;
}

type PersistedSlice = Pick<ChatState, "isSoundEnabled">;

const persistConfig: PersistOptions<ChatState, PersistedSlice> = {
  name: "imessage-storage",
  partialize: (state) => ({ isSoundEnabled: state.isSoundEnabled }),
};

const chatStoreCreator: StateCreator<ChatState> = (set, get) => ({
  users: [],
  conversations: [],
  messages: [],
  selectedUser: null,
  activeConversationId: null,
  isConversationsLoading: false,
  isUsersLoading: false,
  isMessagesLoading: false,
  searchQuery: "",
  sidebarTab: "chats",
  composerText: "",
  isSoundEnabled: true,
  isSendingMedia: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get<User[]>("/messages/users");
      set((state) => ({
        users: res.data,
        selectedUser:
          state.selectedUser &&
          res.data.some((user) => user._id === state.selectedUser?._id)
            ? state.selectedUser
            : null,
      }));
    } catch (error) {
      console.error("Error in getUsers:", error);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getConversations: async () => {
    set({ isConversationsLoading: true });
    try {
      const res = await axiosInstance.get<User[]>("/messages/conversations");
      set({ conversations: res.data });
    } catch (error) {
      console.error("Error in getConversations:", error);
    } finally {
      set({ isConversationsLoading: false });
    }
  },

  getMessages: async (userId) => {
    if (!userId) return;
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get<Message[]>(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    if (!selectedUser) return false;

    const userId = selectedUser._id || selectedUser.id;
    if (!userId) return false;

    try {
      const res = await axiosInstance.post<Message>(
        `/messages/send/${userId}`,
        messageData,
      );
      set({ messages: [...messages, res.data], composerText: "" });
      get().getConversations();
      return true;
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to send message");
      return false;
    }
  },

  sendTextMessage: async (conversationId) => {
    const messageText = get().composerText.trim();
    if (!conversationId || !messageText) return false;
    return get().sendMessage({ text: messageText });
  },

  sendMediaMessage: async ({ conversationId, file }) => {
    if (!conversationId || !file) return false;

    const formData = new FormData();
    formData.append("media", file);

    set({ isSendingMedia: true });
    try {
      return await get().sendMessage(formData);
    } finally {
      set({ isSendingMedia: false });
    }
  },

  subscribeToMessages: (userId) => {
    if (!userId) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("newMessage");
    socket.on("newMessage", (newMessage: Message) => {
      if (String(newMessage.senderId) !== String(userId)) return;

      set({ messages: [...get().messages, newMessage] });
      get().getConversations();
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket?.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),

  setActiveConversationId: (activeConversationId) => {
    set((state) => ({
      activeConversationId,
      selectedUser:
        state.users.find((user) => user._id === activeConversationId) ||
        state.conversations.find((user) => user._id === activeConversationId) ||
        null,
      messages: activeConversationId ? state.messages : [],
    }));
  },

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSidebarTab: (sidebarTab) => set({ sidebarTab }),
  setComposerText: (composerText) => set({ composerText }),
  setSoundEnabled: (isSoundEnabled) => set({ isSoundEnabled }),
});

export const useChatStore = create<ChatState>()(
  persist(chatStoreCreator, persistConfig),
);