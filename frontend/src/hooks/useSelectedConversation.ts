import {useMediaQuery} from "./useMediaQuery";
import {formatMessageTime} from "../lib/utils";
import {useChatStore, type Message} from "../store/useChatStore";
import {useAuthStore, type User} from "../store/useAuthStore";
import {authClient} from "../lib/auth-client";

// John Doe -> JD
export function getInitials(name: string): string {
  if (!name) return "";
  return name
    .split(" ")
    .filter(Boolean)
    .map((namePart: string) => namePart[0])
    .join("");
}

// mapUserToConversation is an adapter — it converts the raw backend shapes (a user document + an array of message documents) into the clean view-model that the chat UI components expect to render.

// Two transformations happen:
// 1. Messages → UI messages
// 2. User → peer

interface MapUserToConversationParams {
  user: User;
  messages: Message[];
  authUser: User | null | undefined;
  onlineUsers: string[];
}

export interface MappedMessage {
  id: string;
  role: string;
  text: string;
  time: string;
  imageUrl?: string;
  videoUrl?: string;
}

export interface MappedConversation {
  id: string | undefined;
  peer: {
    name: string;
    subtitle: string | undefined;
    isOnline: boolean;
    avatarUrl: string;
    initials: string;
  };
  messages: MappedMessage[];
}

function mapUserToConversation({
  user,
  messages,
  authUser,
  onlineUsers,
}: MapUserToConversationParams): MappedConversation {
  const mappedMessages = messages.map((message: Message) => ({
    id: message._id,
    role: String(message.senderId) === String(authUser?._id || authUser?.id) ? "me" : "them",
    text: message.text || "",
    time: formatMessageTime(message.createdAt),
    imageUrl: message.image,
    videoUrl: message.video,
  }));

  return {
    id: user._id || user.id,
    peer: {
      name: user.fullName || user.name || "",
      subtitle: user.email,
      isOnline: onlineUsers.includes(user._id || user.id || ""),
      avatarUrl: user.profilePic || user.image || "",
      initials: getInitials(user.fullName || user.name || ""),
    },
    messages: mappedMessages,
  };
}

export function useSelectedConversation() {
  const activeConversationId = useChatStore(
    (state) => state.activeConversationId,
  );
  const conversations = useChatStore((state) => state.conversations);
  const users = useChatStore((state) => state.users);
  const messages = useChatStore((state) => state.messages);

  const authUser = useAuthStore((state) => state.authUser);
  const {data: session} = authClient.useSession();
  const sessionUser = session?.user;
  const onlineUsers = useAuthStore((state) => state.onlineUsers);

  const isLargeScreen = useMediaQuery("(min-width: 1024px)");

  const selectedUser = activeConversationId
    ? users.find((user) => user._id === activeConversationId) ||
      conversations.find((user) => user._id === activeConversationId)
    : null;

  const activeConversation = selectedUser
    ? mapUserToConversation({
        user: selectedUser,
        messages,
        authUser: authUser || sessionUser,
        onlineUsers,
      })
    : null;

  return {
    activeConversation,
    activeConversationId,
    isLargeScreen,
  };
}
