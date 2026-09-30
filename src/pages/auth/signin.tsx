import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { useState, type FormEvent } from "react";

export default function SignInPage() {
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
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/",
      });

      if (!result || result.error) {
        setError("Email or password is incorrect.");
        return;
      }

      await router.push(result.url ?? "/");
    } catch {
      setError("Unable to sign in right now. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function sendEmailLink() {
    setError("");
    if (!email) {
      setError("Enter your email address first.");
      return;
    }

    setBusy(true);
    try {
      await signIn("email", { email, callbackUrl: "/" });
    } catch {
      setError("Unable to send a sign-in link. Check the email service configuration.");
      setBusy(false);
    }
  }

  return (
    <>
      <Head>
        <title>Log in | VidChill</title>
      </Head>
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-neutral-900">
        <section className="w-full max-w-sm">
          <Link href="/" className="text-sm font-semibold text-primary-600">
            VidChill
          </Link>
          <h1 className="mt-8 text-2xl font-semibold text-gray-900 dark:text-white">
            Log in
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-neutral-300">
            Use your email and password to continue.
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
                autoComplete="current-password"
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                onChange={(event) => setPassword(event.target.value)}
                required
                type="password"
                value={password}
              />
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
              {busy ? "Signing in..." : "Log in"}
            </button>
          </form>

          <button
            className="mt-3 w-full rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-60 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-800"
            disabled={busy}
            onClick={() => void sendEmailLink()}
            type="button"
          >
            Email me a sign-in link
          </button>

          <p className="mt-6 text-sm text-gray-600 dark:text-neutral-300">
            New to VidChill?{" "}
            <Link
              className="font-semibold text-primary-600 hover:underline"
              href="/auth/signup"
            >
              Create an account
            </Link>
          </p>
        </section>
      </main>
    </>
  );
}