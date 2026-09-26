import { useState } from "react";
import { Loader2, Mail } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button.jsx";
import { useAuth } from "../auth/AuthContext.jsx";
import { FormError, PasswordField, TextField } from "../auth/fields.jsx";

export const Login = ({ onSwitchToSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { login, isLoggingIn } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    const result = await login(email, password);
    if (!result.success) {
      setError(result.error);
      toast.error(result.error || "Login failed. Please try again.");
      return;
    }

    const pendingInvite = localStorage.getItem("pendingInvite");

    if (pendingInvite) {
      localStorage.removeItem("pendingInvite");
      navigate(`/join-trip/${pendingInvite}`);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="animate-fade-up">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
        <p className="mt-2 text-muted-foreground">
          Sign in to keep sharing your travel memories.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <FormError>{error}</FormError>

        <TextField
          id="email"
          label="Email"
          icon={Mail}
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoggingIn}
          required
        />

        <PasswordField
          id="password"
          label="Password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoggingIn}
          required
        />

        <Button type="submit" size="lg" className="w-full" disabled={isLoggingIn}>
          {isLoggingIn ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="font-semibold text-primary hover:underline"
          disabled={isLoggingIn}
        >
          Create one
        </button>
      </p>
    </div>
  );
};
