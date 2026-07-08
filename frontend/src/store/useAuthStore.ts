import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { io, Socket } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

export interface User {
  _id?: string;
  id?: string;
  email?: string;
  name?: string;
  image?: string | null;
  [key: string]: any;
}

interface AuthResponse {
  user: User;
}

interface AuthState {
  authUser: User | null;
  isCheckingAuth: boolean;
  onlineUsers: string[];
  socket: Socket | null;

  checkAuth: () => Promise<void>;
  clearAuth: () => void;
  connectSocket: (user: User) => void;
  disconnectSocket: () => void;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    set({ isCheckingAuth: true });

    try {
      const res = await axiosInstance.get<AuthResponse>("/auth/check");
      // Backend returns { user: AuthUser }
      const user = res.data?.user || res.data;
      set({ authUser: user });

      get().connectSocket(user);
    } catch (error) {
      console.error("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  clearAuth: () => {
    set({ authUser: null, isCheckingAuth: false, onlineUsers: [] });
    get().disconnectSocket();
  },

  connectSocket: (user) => {
    const userId = user._id || user.id;
    if (!userId || get().socket?.connected) return;

    const socket = io(BASE_URL, { query: { userId } });

    set({ socket });

    socket.on("getOnlineUsers", (userIds: string[]) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket?.connected) socket.disconnect();
    set({ socket: null });
  },
}));