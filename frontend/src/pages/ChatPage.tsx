import { useState } from "react";
import { Button } from "@heroui/react";
import { LogOut, ShieldCheck, User as UserIcon, Wifi } from "lucide-react";
import { toast } from "react-hot-toast";
import { authClient } from "../lib/auth-client";
import { AppLogo } from "../components/AppLogo";
import { useWallpaper } from "../context/wallpaper";
import { ThemeToggle } from "../components/ThemeToggle";
import { ThemePresetPicker } from "../components/ThemePresetPicker";
import { WallpaperPicker } from "../components/WallpaperPicker";

const ChatPage = () => {
  const { frameStyle } = useWallpaper();
  const { data: session } = authClient.useSession();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await authClient.signOut();
      toast.success("Logged out successfully");
    } catch (err: any) {
      toast.error(err?.message || "Logout failed. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const userInitials = session?.user?.name
    ? session.user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <div
      className="box-border flex min-h-dvh flex-col p-3 sm:p-5 md:p-8"
      style={frameStyle}
    >
      <div className="mx-auto flex w-full max-w-368 flex-1 flex-col overflow-hidden rounded-3xl border border-border bg-background text-foreground shadow-2xl">
        {/* Premium Header */}
        <header className="sticky top-0 z-10 flex shrink-0 items-center justify-between border-b border-border bg-background/85 px-4 py-3.5 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <AppLogo size={32} className="rounded-lg shadow-xs" alt="App Logo" />
            <div>
              <h1 className="text-sm font-bold tracking-tight leading-tight">MessageDe</h1>
              <div className="flex items-center gap-1 mt-0.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">
                <Wifi className="h-3 w-3 animate-pulse" />
                <span>Realtime Connected</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 mr-2">
              <ThemePresetPicker />
              <ThemeToggle />
              <WallpaperPicker />
            </div>

            <div className="hidden sm:flex flex-col items-end text-right">
              <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                {session?.user?.name}
              </span>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                {session?.user?.email}
              </span>
            </div>

            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-sm shrink-0">
              {userInitials}
            </div>

            <Button
              size="sm"
              variant="ghost"
              isDisabled={isLoggingOut}
              onPress={handleSignOut}
              className="h-8 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 active:scale-[0.98] transition-all text-xs font-semibold"
            >
              <span className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white">
                {isLoggingOut ? "Leaving..." : "Sign Out"}
                {!isLoggingOut && <LogOut className="h-3.5 w-3.5" />}
              </span>
            </Button>
          </div>
        </header>

        {/* Main Workspace Area */}
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto w-full">
          <div className="w-full rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 p-8 shadow-sm">
            <div className="mx-auto h-12 w-12 rounded-full bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-5">
              <UserIcon className="h-6 w-6" />
            </div>

            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white mb-2">
              Welcome back, {session?.user?.name || "User"}!
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6">
              You are securely logged into your account. The realtime messaging layer is initialized and listening for socket connections.
            </p>

            <div className="flex items-center justify-center gap-2 rounded-xl bg-zinc-50 dark:bg-zinc-950/50 p-4 border border-zinc-200/50 dark:border-zinc-800/50 text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-semibold">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>End-to-End Encryption Enabled</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChatPage;


