import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiConfig } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { BettingCard } from "../components/BettingCard";
import { config, rainbowConfig } from "../wagmi";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider {...rainbowConfig}>
          <Component {...pageProps} />
          <BettingCard />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
}

export default MyApp;
