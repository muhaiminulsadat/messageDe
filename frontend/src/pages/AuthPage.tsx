import { useState } from "react";
import { useWallpaper } from "../context/wallpaper";
import {
  Tabs,
  TabList,
  Tab,
} from "@heroui/react";
import { AppLogo } from "../components/AppLogo";
import { ThemeToggle } from "../components/ThemeToggle";
import { ThemePresetPicker } from "../components/ThemePresetPicker";
import { LoginForm } from "../components/auth/LoginForm";
import { RegisterForm } from "../components/auth/RegisterForm";

function AuthPage() {
  const { frameStyle } = useWallpaper();
  const [activeTab, setActiveTab] = useState<string>("login");

  return (
    <div
      className="box-border flex min-h-dvh flex-col p-3 sm:p-5 md:p-8"
      style={frameStyle}
    >
      <div className="mx-auto flex w-full max-w-368 flex-1 flex-col overflow-hidden rounded-3xl border border-border bg-background text-foreground shadow-2xl relative">
        {/* Floating Top Right Theme Controls */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
          <ThemePresetPicker />
          <ThemeToggle />
        </div>

        <main className="relative flex flex-1 flex-col overflow-hidden md:flex-row">
          {/* Left panel - Decorative / Brand */}
          <div className="relative hidden flex-1 flex-col justify-between bg-zinc-950 p-10 text-white md:flex overflow-hidden border-r border-border">
            <div className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-overlay" style={{ backgroundImage: "url('/auth.png')" }}></div>
            {/* Ambient light overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent z-0"></div>
            
            {/* Top brand */}
            <div className="relative z-10 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md shadow-md border border-white/10">
                <AppLogo size={24} />
              </div>
              <span className="font-sans text-xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">MessageDe</span>
            </div>

            {/* Bottom display copy */}
            <div className="relative z-10 space-y-3">
              <h2 className="text-3xl font-semibold tracking-tight text-white leading-tight font-sans">
                Chat with clarity.
              </h2>
              <p className="text-sm text-zinc-400 max-w-[40ch] leading-relaxed">
                A premium real-time messaging client built for speed, security, and rich customizable aesthetics.
              </p>
            </div>
          </div>

          {/* Right panel - Form */}
          <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-12 lg:px-20 bg-background/50 backdrop-blur-xs relative z-10">
            <div className="mx-auto w-full max-w-md space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold tracking-tight text-foreground font-sans">
                  {activeTab === "login" ? "Welcome Back" : "Get Started"}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-sans">
                  {activeTab === "login" 
                    ? "Enter your credentials to access your secure chat workspace." 
                    : "Create a new secure account and start connecting in real time."}
                </p>
              </div>

              <Tabs
                selectedKey={activeTab}
                onSelectionChange={(key) => setActiveTab(key as string)}
                className="w-full"
              >
                <TabList
                  aria-label="Auth options"
                  className="flex bg-default-100/50 p-1 border border-default-200/50 rounded-xl w-full"
                >
                  <Tab
                    id="login"
                    className="flex-1 text-center py-2 text-xs font-semibold rounded-lg cursor-pointer select-none text-foreground data-[selected=true]:bg-background data-[selected=true]:shadow-sm"
                  >
                    Login
                  </Tab>
                  <Tab
                    id="register"
                    className="flex-1 text-center py-2 text-xs font-semibold rounded-lg cursor-pointer select-none text-foreground data-[selected=true]:bg-background data-[selected=true]:shadow-sm"
                  >
                    Register
                  </Tab>
                </TabList>
              </Tabs>

              {activeTab === "login" ? <LoginForm /> : <RegisterForm />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AuthPage;
