import "@/styles/globals.css";
import { CssBaseline, GeistProvider } from "@geist-ui/core";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <GeistProvider>
      <SessionProvider session={session}>
        <CssBaseline />
        <Component {...pageProps} />
      </SessionProvider>
    </GeistProvider>
  );
}
