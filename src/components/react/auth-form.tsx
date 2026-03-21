import { useState } from "react";
import { IconLoader2 } from "@tabler/icons-react";
import { authClient } from "@/lib/auth-client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Mode = "login" | "sign-up";

function Field({
  id,
  label,
  className,
  ...props
}: React.ComponentProps<typeof Input> & {
  id: string;
  label: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} {...props} />
    </div>
  );
}

export function AuthForm({ mode }: { mode: Mode }) {
  const isLogin = mode === "login";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);

      if (isLogin) {
        await authClient.signIn.email(
          {
            email,
            password,
            callbackURL: "/admin",
            rememberMe: true,
          },
          {
            onSuccess: () => {
              setLoading(false);
              setSuccess("Signed in successfully. Redirecting...");
              window.setTimeout(() => {
                window.location.href = "/admin";
              }, 300);
            },
            onError: (ctx) => {
              setLoading(false);
              setError(ctx.error?.message ?? "Failed to sign in.");
            },
          },
        );
        return;
      }

      const name = String(formData.get("name") || "").trim();
      const image = String(formData.get("image") || "").trim() || undefined;

      if (password.length < 8) {
        setLoading(false);
        setError("Password must be at least 8 characters.");
        return;
      }

      const { error: signUpError } = await authClient.signUp.email(
        {
          email,
          password,
          name,
          image,
          callbackURL: "/login",
        },
        {
          onError: () => {
            setLoading(false);
          },
        },
      );

      setLoading(false);

      if (signUpError) {
        setError(signUpError.message ?? "Failed to sign up.");
        return;
      }

      setSuccess("Account created successfully. Redirecting...");
      window.setTimeout(() => {
        window.location.href = "/login";
      }, 500);
    } catch (caughtError) {
      setLoading(false);
      setError((caughtError as Error).message ?? "Unexpected error.");
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center p-4">
      <form className="flex-1" onSubmit={onSubmit}>
        <div className="container mx-auto w-full max-w-lg space-y-8 rounded-lg p-6 shadow-lg">
          <h1 className="mb-8! flex items-center justify-center text-center text-2xl font-semibold uppercase">
            {loading ? (
              <IconLoader2 className="mr-3 size-5 animate-spin text-fg-base" />
            ) : null}
            <span className="mr-3">
              {isLogin ? "Login" : "Create your account"}
            </span>
          </h1>

          {!isLogin ? (
            <Field
              id="name"
              name="name"
              label="Name"
              type="text"
              placeholder="Jane Doe"
              required
            />
          ) : null}

          <Field
            id="email"
            name="email"
            label="Email"
            type="email"
            placeholder="jane@example.com"
            required
          />

          <Field
            id="password"
            name="password"
            label="Password"
            type="password"
            minLength={8}
            placeholder={isLogin ? "Your password" : "Minimum 8 characters"}
            required
          />

          {!isLogin ? (
            <Field
              id="image"
              name="image"
              label="Image URL (optional)"
              type="url"
              placeholder="https://..."
            />
          ) : null}

          {error ? (
            <Alert variant="destructive">
              <AlertTitle>
                {isLogin ? "Sign in failed" : "Sign up failed"}
              </AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
          {success ? (
            <Alert>
              <AlertTitle>
                {isLogin ? "Signed in" : "Account created"}
              </AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          ) : null}

          <div className="flex justify-center">
            <Button type="submit" className="w-1/2" disabled={loading}>
              {isLogin ? "Sign in" : "Sign up"}
            </Button>
          </div>

          <p className="mt-4 text-center text-sm text-fg-subtle">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <a
              href={isLogin ? "/sign-up" : "/login"}
              className="text-fg-link underline"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
