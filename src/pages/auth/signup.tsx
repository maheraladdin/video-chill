import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { useState, type FormEvent } from "react";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(payload.error ?? "Unable to create your account.");
        return;
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/",
      });

      if (!result || result.error) {
        setError("Account created. Please log in with your new credentials.");
        return;
      }

      await router.push(result.url ?? "/");
    } catch {
      setError("Unable to create your account right now. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Head>
        <title>Create account | VidChill</title>
      </Head>
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-neutral-900">
        <section className="w-full max-w-sm">
          <Link href="/" className="text-sm font-semibold text-primary-600">
            VidChill
          </Link>
          <h1 className="mt-8 text-2xl font-semibold text-gray-900 dark:text-white">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-neutral-300">
            Sign up with your email and a password.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-gray-700 dark:text-neutral-200">
              Email
              <input
                autoComplete="email"
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                onChange={(event) => setEmail(event.target.value)}
                required
                type="email"
                value={email}
              />
            </label>
            <label className="block text-sm font-medium text-gray-700 dark:text-neutral-200">
              Password
              <input
                autoComplete="new-password"
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                minLength={8}
                onChange={(event) => setPassword(event.target.value)}
                required
                type="password"
                value={password}
              />
              <span className="mt-1 block text-xs font-normal text-gray-500 dark:text-neutral-400">
                Use at least 8 characters.
              </span>
            </label>

            {error && (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            )}

            <button
              className="w-full rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
              disabled={busy}
              type="submit"
            >
              {busy ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-sm text-gray-600 dark:text-neutral-300">
            Already have an account?{" "}
            <Link
              className="font-semibold text-primary-600 hover:underline"
              href="/auth/signin"
            >
              Log in
            </Link>
          </p>
        </section>
      </main>
    </>
  );
}