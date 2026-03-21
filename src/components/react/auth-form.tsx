import { useState, type FormEvent } from "react"
import { IconLoader2 } from "@tabler/icons-react"
import { authClient } from "@/lib/auth-client"

type Mode = "login" | "sign-up"

export function AuthForm({ mode }: { mode: Mode }) {
  const isLogin = mode === "login"
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setSuccess("")

    const form = event.currentTarget
    const formData = new FormData(form)
    const email = String(formData.get("email") || "").trim()
    const password = String(formData.get("password") || "")

    if (!email || !password) {
      setError("Email and password are required.")
      return
    }

    try {
      setLoading(true)

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
              setLoading(false)
              setSuccess("Signed in successfully. Redirecting...")
              window.setTimeout(() => {
                window.location.href = "/admin"
              }, 300)
            },
            onError: (ctx) => {
              setLoading(false)
              setError(ctx.error?.message ?? "Failed to sign in.")
            },
          },
        )
        return
      }

      const name = String(formData.get("name") || "").trim()
      const image = String(formData.get("image") || "").trim() || undefined

      if (password.length < 8) {
        setLoading(false)
        setError("Password must be at least 8 characters.")
        return
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
            setLoading(false)
          },
        },
      )

      setLoading(false)

      if (signUpError) {
        setError(signUpError.message ?? "Failed to sign up.")
        return
      }

      setSuccess("Account created successfully. Redirecting...")
      window.setTimeout(() => {
        window.location.href = "/login"
      }, 500)
    } catch (caughtError) {
      setLoading(false)
      setError((caughtError as Error).message ?? "Unexpected error.")
    }
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center p-4">
      <form className="flex-1" onSubmit={onSubmit}>
        <div className="container mx-auto w-full max-w-lg space-y-8 rounded-lg p-6 shadow-lg">
          <h1 className="mb-8! flex items-center justify-center text-center text-2xl font-semibold uppercase">
            {loading ? <IconLoader2 className="mr-3 size-5 animate-spin text-fg-base" /> : null}
            <span className="mr-3">{isLogin ? "Login" : "Create your account"}</span>
          </h1>

          {!isLogin ? (
            <div className="flex flex-col gap-2">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Jane Doe"
                required
                className="w-full rounded border px-3 py-2"
              />
            </div>
          ) : null}

          <div className="flex flex-col gap-2">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="jane@example.com"
              required
              className="w-full rounded border px-3 py-2"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              minLength={8}
              placeholder={isLogin ? "Your password" : "Minimum 8 characters"}
              required
              className="w-full rounded border px-3 py-2"
            />
          </div>

          {!isLogin ? (
            <div className="flex flex-col gap-2">
              <label htmlFor="image">Image URL (optional)</label>
              <input
                id="image"
                name="image"
                type="url"
                placeholder="https://..."
                className="w-full rounded border px-3 py-2"
              />
            </div>
          ) : null}

          {error ? <div className="text-sm text-red-600">{error}</div> : null}
          {success ? <div className="text-sm text-green-600">{success}</div> : null}

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-1/2 cursor-pointer rounded-full bg-bg-button-accent px-4 py-2 text-base hover:opacity-90"
              disabled={loading}
            >
              {isLogin ? "Sign in" : "Sign up"}
            </button>
          </div>

          <p className="mt-4 text-center text-sm text-fg-subtle">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <a href={isLogin ? "/sign-up" : "/login"} className="text-fg-link hover:underline">
              {isLogin ? "Sign up" : "Sign in"}
            </a>
          </p>
        </div>
      </form>
    </div>
  )
}
