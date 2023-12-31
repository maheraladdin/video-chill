/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"));

/**
 * @type {{images: {domains: string[]}, reactStrictMode: boolean, i18n: {defaultLocale: string, locales: string[]}}}
 */
const config = {
  reactStrictMode: true,
  images: {
    domains: ["i.ytimg.com", "yt3.googleusercontent.com", "res.cloudinary.com"],
  },
  /**
   * If you have the "experimental: { appDir: true }" setting enabled, then you
   * must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
};
export default config;
