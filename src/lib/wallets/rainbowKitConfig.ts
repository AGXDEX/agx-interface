import { isInBinance } from "@binance/w3w-utils";
import { getDefaultConfig, WalletList } from "@rainbow-me/rainbowkit";
import {
  coinbaseWallet,
  coreWallet,
  injectedWallet,
  metaMaskWallet,
  okxWallet,
  bitgetWallet,
  foxWallet,
  rabbyWallet,
  safeWallet,
  trustWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { isDevelopment } from "config/env";
import { http, defineChain } from "viem";
import { arbitrumGoerli, avalanche, avalancheFuji } from "viem/chains";

import { gateWallet } from "./wallet/gateWallet";
import binanceWallet from "./connecters/binanceW3W/binanceWallet";
export const sepolia = /*#__PURE__*/ defineChain({
  id: 810181,
  name: "zkLink Nova Testnet",
  network: "nova",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    default: { http: ["https://sepolia.rpc.zklink.io"] },
    public: { http: ["https://sepolia.rpc.zklink.io"] },
  },
  blockExplorers: {
    etherscan: {
      name: "zkLink Nova Sepolia Testnet  Explorer",
      // url: "https://sepolia.lineascan.build",
      url: "hhttps://sepolia.explorer.zklink.io",
    },
    default: {
      name: "zkLink Nova Sepolia Testnet Explorer",
      // url: "https://sepolia.lineascan.build",
      url: "https://sepolia.explorer.zklink.io",
    },
  },
  contracts: {
    multicall3: {
      address: "0xcc43208B28B1eC25F000EfC0D2c2aF044715F888",
      blockCreated: 212929,
    },
  },
});
export const nova = /*#__PURE__*/ defineChain({
  id: 810180,
  name: "zkLink Nova",
  network: "nova",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    default: { http: ["https://rpc.zklink.io"] },
    public: { http: ["https://rpc.zklink.io"] },
  },
  blockExplorers: {
    etherscan: {
      name: "zkLink Nova Explorer",
      url: "hhttps://explorer.zklink.io",
    },
    default: {
      name: "zkLink Nova Explorer",
      url: "https://explorer.zklink.io",
    },
  },
  contracts: {
    multicall3: {
      address: "0x01c3f51294494e350AD69B999Db6B382b3B510b9",
      blockCreated: 212929,
    },
  },
});
const arbitrum = process.env.REACT_APP_ENV === "development" ? sepolia : nova;
const projectId = process.env.VITE_PROJECT_ID || '7ec53b38ab47f5f4d1943e88d6c04b6e';
const metadata = {
  name: "zkLink Nova App",
  description:
    "zkLink Nova App - Aggregated Layer 3 zkEVM network Aggregation Parade",
  url: "https://app.zklink.io",
  icons: ["../../img/nova-logo.png"],
};
gateWallet({
  projectId,
  walletConnectParameters: {
    metadata,
  },
});
const WALLET_CONNECT_PROJECT_ID = "de24cddbaf2a68f027eae30d9bb5df58";
const APP_NAME = "AGX";

const popularWalletList: WalletList = [
  {
    // Group name with standard name is localized by rainbow kit
    groupName: "Popular",
    wallets: [
      // rabbyWallet,
      walletConnectWallet,
      metaMaskWallet,
      // This wallet will automatically hide itself from the list when the fallback is not necessary or if there is no injected wallet available.
      injectedWallet,
      // The Safe option will only appear in the Safe Wallet browser environment.
      // safeWallet,
    ],
  },
];
//coinbaseWallet, trustWallet, coreWallet, 
const othersWalletList: WalletList = [
  {
    groupName: "Others",
    wallets: [binanceWallet,okxWallet,gateWallet,foxWallet, safeWallet],
  },
];

export const rainbowKitConfig = getDefaultConfig({
  appName: APP_NAME,
  projectId: WALLET_CONNECT_PROJECT_ID,
  chains: [arbitrum],
  transports: {
    [arbitrum.id]: http(),
    [arbitrumGoerli.id]: http(),
    [avalancheFuji.id]: http(),
  },
  wallets: [...popularWalletList, ...othersWalletList],
});
