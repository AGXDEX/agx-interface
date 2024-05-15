import {
  arbitrum,
  arbitrumSepolia,
  base,
  goerli,
  linea,
  lineaTestnet,
  mainnet,
  manta,
  mantaTestnet,
  mantle,
  mantleTestnet,
  optimism,
  scrollSepolia,
  sepolia,
  zkSync,
  zkSyncSepoliaTestnet,
} from "@wagmi/core/chains";
import { defineChain } from "viem";

// import type { Token } from "@/types";
import type { Chain } from "@wagmi/core/chains";
import type { Address } from "viem";

export const l1Networks = {
  mainnet: {
    ...mainnet,
    name: "Ethereum",
    network: "mainnet",
  },
  goerli: {
    ...goerli,
    name: "Ethereum Goerli Testnet",
  },
  sepolia: {
    ...sepolia,
    name: "Ethereum Sepolia Testnet",
  },
  linea: {
    ...linea,
    name: "Linea Mainnet",
  },
  mantle: {
    ...mantle,
    name: "Mantle Mainnet",
  },
  arbitrum: {
    ...arbitrum,
    name: "Arbitrum Mainnet",
  },
  arbitrumSepolia: {
    ...arbitrumSepolia,
    name: "Arbitrum Sepolia Testnet",
    blockExplorers: {
      default: {
        name: "Arbiscan",
        url: "https://sepolia.arbiscan.io",
      },
    },
  },
  scrollSepolia: {
    ...scrollSepolia,
    name: "Scroll Sepolia Testnet",
  },
  zkSync: {
    ...zkSync,
    name: "zkSync Mainnet",
  },
  zkSyncSepoliaTestnet: {
    ...zkSyncSepoliaTestnet,
    name: "zkSync Sepolia Testnet",
  },
  lineaGoerliTestnet: {
    ...lineaTestnet,
    name: "Linea Goerli Testnet",
  },
  mantleGoerliTestnet: {
    ...mantleTestnet,
    name: "Mantle Goerli Testnet",
  },
  mantaGoerliTestnet: {
    ...mantaTestnet,
    name: "Manta Goerli Testnet",
  },
  manta: {
    ...manta,
    name: "Manta Mainnet",
  },
  //   blast: {
  //     ...blast,
  //     name: "Blast Mainnet",
  //   },
  optimism: {
    ...optimism,
    name: "Optimism Mainnet",
  },
  base: {
    ...base,
    name: "Base Mainnet",
  },
} as const;
type Token = {
  l2Address: string;
  l1Address: string | null;
  name: string | null;
  symbol: string | null;
  decimals: number;
  usdPrice: number | null;
  liquidity: number | null;
  iconURL: string | null;
  networkKey: string | null;
};
export type L1Network = Chain;
export type ZkSyncNetwork = {
  id: number;
  key: string;
  name: string;
  rpcUrl: string;
  hidden?: boolean; // If set to true, the network will not be shown in the network selector
  l1Network?: L1Network;
  blockExplorerUrl?: string;
  blockExplorerApi?: string;
  withdrawalFinalizerApi?: string;
  logoUrl?: string;
  displaySettings?: {
    showPartnerLinks?: boolean;
  };
  mainContract?: Address;
  erc20BridgeL1?: Address;
  erc20BridgeL2?: Address;
  l1Gateway?: Address;
  isEthGasToken?: boolean;
  getTokens?: () => Token[] | Promise<Token[]>; // If blockExplorerApi is specified, tokens will be fetched from there. Otherwise, this function will be used.
  wethContract?: Address[];
};

export const nexusNode: ZkSyncNetwork[] = [
  {
    id: 810180,
    key: "ethereum",
    name: l1Networks.mainnet.name,
    rpcUrl: "https://rpc.zklink.io",
    logoUrl: "/img/ethereum.svg",
    blockExplorerUrl: "https://explorer.zklink.io",
    blockExplorerApi: "https://explorer-api.zklink.io",
    withdrawalFinalizerApi: "https://withdrawal-api.zklink.io",
    mainContract: "0x5fD9F73286b7E8683Bab45019C94553b93e015Cf",
    erc20BridgeL1: "0xAd16eDCF7DEB7e90096A259c81269d811544B6B6",
    erc20BridgeL2: "0x36CaABbAbfB9C09B722d9C3697C3Cb4A93650ea7",
    l1Gateway: "0x83Bc7394738A7A084081aF22EEC0051908c0055c",
    isEthGasToken: true,
    l1Network: l1Networks.mainnet,
    wethContract: ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"],
  },
  {
    id: 810180,
    key: "primary",
    name: l1Networks.linea.name,
    rpcUrl: "https://rpc.zklink.io",
    logoUrl: "/img/linea.svg",
    blockExplorerUrl: "https://explorer.zklink.io",
    blockExplorerApi: "https://explorer-api.zklink.io",
    withdrawalFinalizerApi: "https://withdrawal-api.zklink.io",
    mainContract: "0x5Cb18b6e4e6F3b46Ce646b0f4704D53724C5Df05",
    erc20BridgeL1: "0x62cE247f34dc316f93D3830e4Bf10959FCe630f8",
    erc20BridgeL2: "0x01c3f51294494e350AD69B999Db6B382b3B510b9",
    isEthGasToken: true,
    l1Network: l1Networks.linea,
    wethContract: ["0xe5d7c2a44ffddf6b295a15c148167daaaf5cf34f"],
  },
  {
    id: 810180,
    key: "zksync",
    name: l1Networks.zkSync.name,
    rpcUrl: "https://rpc.zklink.io",
    logoUrl: "/img/zksync.svg",
    blockExplorerUrl: "https://explorer.zklink.io",
    blockExplorerApi: "https://explorer-api.zklink.io",
    withdrawalFinalizerApi: "https://withdrawal-api.zklink.io",
    mainContract: "0xaFe8C7Cf33eD0fee179DFF20ae174C660883273A",
    erc20BridgeL1: "0xaB3DDB86072a35d74beD49AA0f9210098ebf2D08",
    erc20BridgeL2: "0x7187DB8AB8F65450a74dD40474bE778CF468C44a",
    l1Gateway: "0xeCD189e0f390826E137496a4e4a23ACf76c942Ab",
    isEthGasToken: true,
    l1Network: l1Networks.zkSync,
    wethContract: ["0x5aea5775959fbc2557cc8789bc1bf90a239d9a91", "0x8Ebe4A94740515945ad826238Fc4D56c6B8b0e60"],
  },
  {
    id: 810180,
    key: "arbitrum",
    name: l1Networks.arbitrum.name,
    rpcUrl: "https://rpc.zklink.io",
    logoUrl: "/img/arbitrum-arb-logo.svg",
    blockExplorerUrl: "https://explorer.zklink.io",
    blockExplorerApi: "https://explorer-api.zklink.io",
    withdrawalFinalizerApi: "https://withdrawal-api.zklink.io",
    mainContract: "0xFF73a1a1d27951A005eb23276dc99CB7F8d5420A",
    erc20BridgeL1: "0xfB0Ad0B3C2605A7CA33d6badd0C685E11b8F5585",
    erc20BridgeL2: "0x6B7551DBbaE2fb728cF851baee5c3A52DF6F60a4",
    l1Gateway: "0x273D59aed2d793167c162E64b9162154B07583C0",
    isEthGasToken: true,
    l1Network: l1Networks.arbitrum,
    wethContract: ["0x82af49447d8a07e3bd95bd0d56f35241523fbab1"],
  },
  {
    id: 810180,
    key: "mantle",
    name: l1Networks.mantle.name,
    rpcUrl: "https://rpc.zklink.io",
    logoUrl: "/img/mantle.svg",
    blockExplorerUrl: "https://explorer.zklink.io",
    blockExplorerApi: "https://explorer-api.zklink.io",
    withdrawalFinalizerApi: "https://withdrawal-api.zklink.io",
    mainContract: "0xD784d7128B46B60Ca7d8BdC17dCEC94917455657",
    erc20BridgeL1: "0x62351b47e060c61868Ab7E05920Cb42bD9A5f2B2",
    erc20BridgeL2: "0x321Ce902eDFC6466B224ce5D9A7Bc16858855272",
    l1Gateway: "0xdE1Ce751405Fe6D836349226EEdCDFFE1C3BE269",
    isEthGasToken: true,
    l1Network: l1Networks.mantle,
    wethContract: ["0xdEAddEaDdeadDEadDEADDEAddEADDEAddead1111"],
  },
  {
    id: 810180,
    key: "manta",
    name: l1Networks.manta.name,
    rpcUrl: "https://rpc.zklink.io",
    logoUrl: "/img/manta.jpg",
    blockExplorerUrl: "https://explorer.zklink.io",
    blockExplorerApi: "https://explorer-api.zklink.io",
    withdrawalFinalizerApi: "https://withdrawal-api.zklink.io",
    mainContract: "0xD784d7128B46B60Ca7d8BdC17dCEC94917455657",
    erc20BridgeL1: "0x44a65dc12865A1e5249b45b4868f32b0E37168FF",
    erc20BridgeL2: "0xa898E175CfDE9C6ABfCF5948eEfBA1B852eE5B09",
    l1Gateway: "0x649Dfa2c4d09D877419fA1eDC4005BfbEF7CD82D",
    isEthGasToken: true,
    l1Network: l1Networks.manta,
    wethContract: ["0x0Dc808adcE2099A9F62AA87D9670745AbA741746"],
  },

  {
    id: 810180,
    key: "optimism",
    name: l1Networks.optimism.name,
    rpcUrl: "https://rpc.zklink.io",
    logoUrl: "/img/optimism.svg",
    blockExplorerUrl: "https://explorer.zklink.io",
    blockExplorerApi: "https://explorer-api.zklink.io",
    withdrawalFinalizerApi: "https://withdrawal-api.zklink.io",
    mainContract: "0x46C8D02E93d5a03899dFa7Cf8A40A07589A3fA1b",
    erc20BridgeL1: "0x5Bd51296423A9079b931414C1De65e7057326EaA",
    erc20BridgeL2: "0x6aAdaA7Bf9F5283cAF3eb2E40573D1A4d02C8B15",
    l1Gateway: "0x668e8F67adB8219e1816C2E5bBEa055A78AF3026",
    isEthGasToken: true,
    l1Network: l1Networks.optimism,
    wethContract: ["0x4200000000000000000000000000000000000006"],
  },
  {
    id: 810180,
    key: "base",
    name: l1Networks.base.name,
    rpcUrl: "https://rpc.zklink.io",
    logoUrl: "/img/base.svg",
    blockExplorerUrl: "https://explorer.zklink.io",
    blockExplorerApi: "https://explorer-api.zklink.io",
    withdrawalFinalizerApi: "https://withdrawal-api.zklink.io",
    mainContract: "0xE473ce141b1416Fe526eb63Cf7433b7B8d7264Dd",
    erc20BridgeL1: "0x80d12A78EfE7604F00ed07aB2f16F643301674D5",
    erc20BridgeL2: "0xa03248B029b4e348F156f4b1d93CB433a4e1361e",
    l1Gateway: "0x4eEA93966AA5cd658225E0D43b665A5a491d2b7E",
    isEthGasToken: true,
    l1Network: l1Networks.base,
    wethContract: ["0x4200000000000000000000000000000000000006"],
  },
];

export const nexusSepoliaNode: ZkSyncNetwork[] = [
  {
    id: 810181,
    key: "sepolia",
    name: l1Networks.sepolia.name,
    rpcUrl: "https://sepolia.rpc.zklink.network",
    logoUrl: "/img/ethereum.svg",
    blockExplorerUrl: "https://sepolia.explorer.zklink.network",
    blockExplorerApi: "https://sepolia.explorer-api.zklink.network",
    withdrawalFinalizerApi: "https://sepolia.withdrawal-api.zklink.network",
    mainContract: "0x53438eddeB3d3fD39c99150acA2575f73cE14198",
    erc20BridgeL1: "0x9FF541E9de225157d245Ca46cFF6868e5c289C8F",
    erc20BridgeL2: "0x3247575b4336C79956C5Df667A19C0AcBA9C62D6",
    l1Gateway: "0xABE785340e1C1ed3228BC7ec460d2fEdD82260a0",
    //TODO
    l1Network: l1Networks.sepolia,
  },
  {
    id: 810181,
    key: "primary",
    name: l1Networks.arbitrumSepolia.name,
    rpcUrl: "https://sepolia.rpc.zklink.network",
    logoUrl: "/img/arbitrum-arb-logo.svg",
    blockExplorerUrl: "https://sepolia.explorer.zklink.network",
    blockExplorerApi: "https://sepolia.explorer-api.zklink.network",
    withdrawalFinalizerApi: "https://sepolia.withdrawal-api.zklink.network",
    mainContract: "0x788269f9353D7cbfE33c0889B7Dd1CAe833636E6",
    erc20BridgeL1: "0x72de6d167ded1ee5fba17334bdcce686f3204d38",
    erc20BridgeL2: "0x1895de0bea0eb8d8c7e6997c9be7649bb402d9e6",
    //TODO
    l1Network: l1Networks.arbitrumSepolia,
  },
  {
    id: 810181,
    key: "zksyncsepolia",
    name: l1Networks.zkSyncSepoliaTestnet.name,
    rpcUrl: "https://sepolia.rpc.zklink.network",
    logoUrl: "/img/era.svg",
    blockExplorerUrl: "https://sepolia.explorer.zklink.network",
    blockExplorerApi: "http://localhost:3020",
    withdrawalFinalizerApi: "https://sepolia.withdrawal-api.zklink.network",
    mainContract: "0x916aa29B23DBC0f143e1cEaE0460C874FCEc0f58",
    erc20BridgeL1: "0x",
    erc20BridgeL2: "0x",
    // TODO
    l1Network: l1Networks.zkSyncSepoliaTestnet,
  },
  {
    id: 810181,
    key: "scrollsepolia",
    name: l1Networks.scrollSepolia.name,
    rpcUrl: "https://sepolia.rpc.zklink.network",
    logoUrl: "/img/sepolia.jpg",
    blockExplorerUrl: "https://sepolia.explorer.zklink.network",
    blockExplorerApi: "http://localhost:3020",
    withdrawalFinalizerApi: "https://sepolia.withdrawal-api.zklink.network",
    mainContract: "0x939016af6140141d89C4252b0c0013F4e5F1f4D7",
    erc20BridgeL1: "0x",
    erc20BridgeL2: "0x",
    //TODO
    l1Network: l1Networks.scrollSepolia,
  },
];

const determineChainList = (): ZkSyncNetwork[] => {
  const zkSyncNetworks: ZkSyncNetwork[] = [];
  const nodeType = process.env.REACT_APP_ENV || "development";
  if (nodeType === "development") {
    zkSyncNetworks.push(...nexusSepoliaNode);
  } else {
    zkSyncNetworks.push(...nexusNode);
  }
  return zkSyncNetworks;
};

export const chainList: ZkSyncNetwork[] = determineChainList();
