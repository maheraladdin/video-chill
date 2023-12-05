import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import {Toaster} from "react-hot-toast";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import ThemeContextProvider from "~/context/theme-context";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
        <ThemeContextProvider>
            <Component {...pageProps} />
            <Toaster />
        </ThemeContextProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
