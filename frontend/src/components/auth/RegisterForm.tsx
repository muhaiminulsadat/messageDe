import { useState } from "react";
import { useNavigate } from "react-router";
import { authClient } from "../../lib/auth-client";
import {
  TextField,
  Label,
  Input,
  Button,
  Spinner,
} from "@heroui/react";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { toast } from "react-hot-toast";

export function RegisterForm() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await authClient.signUp.email({
        email,
        password,
        name,
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "Failed to create account");
      } else {
        toast.success("Account created successfully!");
        navigate("/");
      }
    } catch (err: any) {
      toast.error(err?.message || "Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextField
        value={name}
        onChange={setName}
        isRequired
        className="flex flex-col gap-1 w-full"
      >
        <Label className="text-xs font-semibold text-foreground font-sans">
          Name
        </Label>
        <div className="relative flex items-center">
          <span className="absolute left-3 text-zinc-400 z-10">
            <User className="h-4 w-4" />
          </span>
          <Input
            type="text"
            placeholder="Enter your name"
            className="pl-9 pr-3 py-2 w-full text-sm bg-background/50 border border-zinc-200 dark:border-zinc-800 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
          />
        </div>
      </TextField>

      <TextField
        value={email}
        onChange={setEmail}
        isRequired
        className="flex flex-col gap-1 w-full"
      >
        <Label className="text-xs font-semibold text-foreground font-sans">
          Email
        </Label>
        <div className="relative flex items-center">
          <span className="absolute left-3 text-zinc-400 z-10">
            <Mail className="h-4 w-4" />
          </span>
          <Input
            type="email"
            placeholder="name@example.com"
            className="pl-9 pr-3 py-2 w-full text-sm bg-background/50 border border-zinc-200 dark:border-zinc-800 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
          />
        </div>
      </TextField>

      <TextField
        value={password}
        onChange={setPassword}
        isRequired
        className="flex flex-col gap-1 w-full"
      >
        <Label className="text-xs font-semibold text-foreground font-sans">
          Password
        </Label>
        <div className="relative flex items-center">
          <span className="absolute left-3 text-zinc-400 z-10">
            <Lock className="h-4 w-4" />
          </span>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="pl-9 pr-10 py-2 w-full text-sm bg-background/50 border border-zinc-200 dark:border-zinc-800 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
          />
          <button
            className="absolute right-3 focus:outline-none z-10 cursor-pointer"
            type="button"
            onClick={togglePasswordVisibility}
            aria-label="toggle password visibility"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200" />
            ) : (
              <Eye className="h-4 w-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200" />
            )}
          </button>
        </div>
      </TextField>

      <Button
        type="submit"
        variant="primary"
        isDisabled={isLoading}
        className="w-full font-sans text-xs font-semibold text-accent-foreground rounded-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 py-2 cursor-pointer"
      >
        {isLoading ? (
          <>
            <Spinner size="sm" className="text-current" />
            <span>Creating Account...</span>
          </>
        ) : (
          <span>Create Account</span>
        )}
      </Button>
    </form>
  );
}
