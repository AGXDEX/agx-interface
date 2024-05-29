import {
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  blast,
  blastSepolia,
  goerli,
  linea,
  mainnet,
  manta,
  mantaTestnet,
  mantle,
  mantleTestnet,
  optimism,
  optimismSepolia,
  sepolia,
  zkSync,
  zkSyncSepoliaTestnet,
} from "@wagmi/core/chains";
import { defineChain } from "viem";

// import type { Token } from "@/types";
import type { Chain } from "@wagmi/core/chains";
import type { Address } from "viem";

export const mantaSepolia = /*#__PURE__*/ defineChain({
  id: 3441006,
  name: "Manta Pacific Sepolia Testnet",
  network: "manta-sepolia",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    default: { http: ["https://pacific-rpc.sepolia-testnet.manta.network/http"] },
  },
  blockExplorers: {
    default: {
      name: "Manta Pacific Sepolia",
      url: "https://pacific-explorer.sepolia-testnet.manta.network",
    },
  },
  contracts: {
    multicall3: {
      address: "0x5Be4F807e0ae836Fc754dDEDDd72c0F4A28C8d43",
      blockCreated: 468626,
    },
  }
});


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
  mantleGoerliTestnet: {
    ...mantleTestnet,
    name: "Mantle Goerli Testnet",
  },
  manta: {
    ...manta,
    name: "Manta Mainnet",
  },
  mantaGoerliTestnet: {
    ...mantaTestnet,
    name: "Manta Goerli Testnet",
  },
  mantaSepoliaTestnet: {
    ...mantaSepolia,
    name: "Manta Sepolia Testnet",
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
  zkSync: {
    ...zkSync,
    name: "zkSync Mainnet",
  },
  zkSyncSepoliaTestnet: {
    ...zkSyncSepoliaTestnet,
    name: "zkSync Sepolia Testnet",
  },
  blast: {
    ...blast,
    name: "Blast Mainnet",
  },
  blastSepoliaTestnet: {
    ...blastSepolia,
    name: "Blast Sepolia Testnet",
  },
  optimism: {
    ...optimism,
    name: "Optimism Mainnet",
  },
  optimismSepoliaTestnet: {
    ...optimismSepolia,
    name: "Optimism Sepolia Testnet",
  },
  base: {
    ...base,
    name: "Base Mainnet",
  },
  baseSepoliaTestnet: {
    ...baseSepolia,
    name: "Base Sepolia Testnet",
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
    key: "nova",
    name: "zkLink Nova",
    rpcUrl: "https://rpc.zklink.io",
    logoUrl: "/img/nova-logo.png",
    blockExplorerUrl: "https://explorer.zklink.io",
    blockExplorerApi: "https://explorer-api.zklink.io",
    withdrawalFinalizerApi: "https://withdrawal-api.zklink.io",
    mainContract: "0x9719cD314BBf84B18aAEDEF56DF88E2267aA01e3",
    erc20BridgeL1: "0x63e059BDEDeA829c22EfA31CbaDb9bea5E86c3Cd",
    erc20BridgeL2: "0xcc43208B28B1eC25F000EfC0D2c2aF044715F888",
    l1Gateway: "0xc6EbbD78E8f81626Bc62570f3C5949221F87b3Ee",
    isEthGasToken: true,
    l1Network: l1Networks.mainnet,
  },
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
    key: "nova",
    name: "zkLink Nova Testnet",
    rpcUrl: "https://sepolia.rpc.zklink.io",
    logoUrl: "/img/nova-logo.png",
    blockExplorerUrl: "https://sepolia.explorer.zklink.io",
    blockExplorerApi: "https://sepolia.explorer-api.zklink.io",
    withdrawalFinalizerApi: "https://sepolia.withdrawal-api.zklink.io",
    mainContract: "0x9719cD314BBf84B18aAEDEF56DF88E2267aA01e3",
    erc20BridgeL1: "0x63e059BDEDeA829c22EfA31CbaDb9bea5E86c3Cd",
    erc20BridgeL2: "0xcc43208B28B1eC25F000EfC0D2c2aF044715F888",
    l1Gateway: "0xc6EbbD78E8f81626Bc62570f3C5949221F87b3Ee",
    isEthGasToken: true,
    l1Network: l1Networks.sepolia,
  },
  {
    id: 810181,
    key: "ethereum",
    name: "Ethereum Sepolia Testnet",
    rpcUrl: "https://sepolia.rpc.zklink.io",
    logoUrl: "/img/ethereum.svg",
    blockExplorerUrl: "https://sepolia.explorer.zklink.io",
    blockExplorerApi: "https://sepolia.explorer-api.zklink.io",
    withdrawalFinalizerApi: "https://sepolia.withdrawal-api.zklink.io",
    mainContract: "0x9719cD314BBf84B18aAEDEF56DF88E2267aA01e3",
    erc20BridgeL1: "0x63e059BDEDeA829c22EfA31CbaDb9bea5E86c3Cd",
    erc20BridgeL2: "0xcc43208B28B1eC25F000EfC0D2c2aF044715F888",
    l1Gateway: "0xc6EbbD78E8f81626Bc62570f3C5949221F87b3Ee",
    isEthGasToken: true,
    l1Network: l1Networks.sepolia,
  },
  {
    id: 810181,
    key: 'primary', //"primary"
    name: "Linea Sepolia Testnet",
    rpcUrl: "https://sepolia.rpc.zklink.io",
    logoUrl: "/img/linea.svg",
    blockExplorerUrl: "https://sepolia.explorer.zklink.io",
    blockExplorerApi: "https://sepolia.explorer-api.zklink.io",
    withdrawalFinalizerApi: "https://sepolia.withdrawal-api.zklink.io",
    mainContract: "0x16393A77e1d5C2D285BDad9079afC5942f255407",
    erc20BridgeL1: "0xea05Fad671D93aF9472D747866019991DF183F0f",
    erc20BridgeL2: "0x6336D1DfE362a84933e526588A0fa20dd87736aE",
    isEthGasToken: true,
    l1Network: l1Networks.linea,
  },
  {
    id: 810181,
    key: "zksync",
    name: "zkSync Sepolia Testnet",
    rpcUrl: "https://sepolia.rpc.zklink.io",
    logoUrl: "/img/zksync.svg",
    blockExplorerUrl: "https://sepolia.explorer.zklink.io",
    blockExplorerApi: "https://sepolia.explorer-api.zklink.io",
    withdrawalFinalizerApi: "https://sepolia.withdrawal-api.zklink.io",
    mainContract: "0x02627EFACfc2B000E77132fE9346C543eB980bAb",
    erc20BridgeL1: "0xBf145DfdE964213246A4fcB8003621E8b0F11ffc",
    erc20BridgeL2: "0xEbEAf62E4bCb4FdeC35100838c86c84B8134ADE0",
    l1Gateway: "0x67ba43eD3860D155D16f82D12cA93A7B2e77bF2F",
    isEthGasToken: true,
    l1Network: l1Networks.zkSyncSepoliaTestnet,
  },
  {
    id: 810181,
    key: "arbitrum",
    name: "Arbitrum Sepolia Testnet",
    rpcUrl: "https://sepolia.rpc.zklink.io",
    logoUrl: "/img/arbitrum-arb-logo.svg",
    blockExplorerUrl: "https://sepolia.explorer.zklink.io",
    blockExplorerApi: "https://sepolia.explorer-api.zklink.io",
    withdrawalFinalizerApi: "https://sepolia.withdrawal-api.zklink.io",
    mainContract: "0xaE1875112Ae010A9fe755418B206AfB33Ee0b1fA",
    erc20BridgeL1: "0xFC31fF38e24901052b813DcEBEF5A9A10EaF25Ec",
    erc20BridgeL2: "0x7e1B152f25D2ff0771026067B5c8B5A1C8457478",
    l1Gateway: "0xd75F08D0E513a072799C510d04D9AddC3a28Bd9A",
    isEthGasToken: true,
    l1Network: l1Networks.arbitrumSepolia,
  },
  {
    id: 810181,
    key: "optimism",
    name: "Optimism Sepolia Testnet",
    rpcUrl: "https://sepolia.rpc.zklink.io",
    logoUrl: "/img/optimism.svg",
    blockExplorerUrl: "https://sepolia.explorer.zklink.io",
    blockExplorerApi: "https://sepolia.explorer-api.zklink.io",
    withdrawalFinalizerApi: "https://sepolia.withdrawal-api.zklink.io",
    mainContract: "0xbaC8EF345C684B0871dF390f44273160Ba3E6bc1",
    erc20BridgeL1: "0x70194e2400eb89fA22E3bd0DaFa097CA09DAE76C",
    erc20BridgeL2: "0x07476D10A8B3c614DC92a698cCeC34Aa9B844B92",
    l1Gateway: "0x2f24331ddFB2D582079C200d1c233F168901a4e1",
    isEthGasToken: true,
    l1Network: l1Networks.optimismSepoliaTestnet,
  },
  {
    id: 810181,
    key: "base",
    name: "Base Sepolia Testnet",
    rpcUrl: "https://sepolia.rpc.zklink.io",
    logoUrl: "/img/base.svg",
    blockExplorerUrl: "https://sepolia.explorer.zklink.io",
    blockExplorerApi: "https://sepolia.explorer-api.zklink.io",
    withdrawalFinalizerApi: "https://sepolia.withdrawal-api.zklink.io",
    mainContract: "0x8c4b80A5D5374Ff2Dc07310EF9Fdbc44e487b6C2",
    erc20BridgeL1: "0xeA6232604C847d14638a30c1D261AF6C321AAB05",
    erc20BridgeL2: "0x7c3c5C8528D55Af0C641846fF4756200DEFDC513",
    l1Gateway: "0x4E2d5bAaF470028fE48a23bd5b680f4EC7A06f85",
    isEthGasToken: true,
    l1Network: l1Networks.baseSepoliaTestnet,
  },
  {
    id: 810181,
    key: "manta",
    name: "Manta Sepolia Testnet",
    rpcUrl: "https://sepolia.rpc.zklink.io",
    logoUrl: "/img/manta.jpg",
    blockExplorerUrl: "https://sepolia.explorer.zklink.io",
    blockExplorerApi: "https://sepolia.explorer-api.zklink.io",
    withdrawalFinalizerApi: "https://sepolia.withdrawal-api.zklink.io",
    mainContract: "0xEe5aFbd53D661968d13315f6960BBb103C2a1eCc",
    erc20BridgeL1: "0x4C58CbF4e9594898e2cC66FdA3F435Cd3622Fe9f",
    erc20BridgeL2: "0x1F282e46d75622C5B26921094b4ebF7D58D83CE2",
    l1Gateway: "0xC8a31aA097c8D1dCF588C425415E4e5A0E250e67",
    isEthGasToken: true,
    l1Network: l1Networks.mantaSepoliaTestnet,
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
