import { BigNumber, ethers } from "ethers";
import { sample } from "lodash";
import { NetworkMetadata } from "lib/wallets";
import { isDevelopment } from "./env";

const { parseEther } = ethers.utils;

export const ENV_ARBITRUM_RPC_URLS = process.env.REACT_APP_ARBITRUM_RPC_URLS;
export const ENV_AVALANCHE_RPC_URLS = process.env.REACT_APP_AVALANCHE_RPC_URLS;

export const BSС_MAINNET = 56;
export const BSС_TESTNET = 97;
export const ETH_MAINNET = 1;
export const AVALANCHE = 810180;
export const AVALANCHE_FUJI = 43113;
type ArbitrumType = 810181 | 810180;


const currentChain = process.env.REACT_APP_ENV === "development" ? 810181 : 810180;
export const ARBITRUM = currentChain;

export const ARBITRUM_GOERLI = 421613;
export const FEES_HIGH_BPS = 50;
export const DEFAULT_ALLOWED_SLIPPAGE_BPS = 30;
export const NOVA = 810180;
export const NOVA_SEPOLIA = 810183;

// TODO take it from web3
export const DEFAULT_CHAIN_ID = ARBITRUM;
export const CHAIN_ID = DEFAULT_CHAIN_ID;

export const SUPPORTED_CHAIN_IDS = [ARBITRUM, AVALANCHE];

if (isDevelopment()) {
  SUPPORTED_CHAIN_IDS.push();
}

export const IS_NETWORK_DISABLED = {
  [ARBITRUM]: false,
  // [AVALANCHE]: false,
  [BSС_MAINNET]: false,
  [NOVA]: false,
  [NOVA_SEPOLIA]: false,
};

export const CHAIN_NAMES_MAP = {
  [BSС_MAINNET]: "BSC",
  [BSС_TESTNET]: "BSC Testnet",
  [ARBITRUM_GOERLI]: "Arbitrum Goerli",
  [ARBITRUM]: process.env.REACT_APP_ENV === "development" ? "zkLink Nova Sepolia Testnet" : "zkLink Nova",
  // [AVALANCHE]: "Avalanche",
  [AVALANCHE_FUJI]: "Avalanche Fuji",
  [NOVA]: "zkLink Nova",
  [NOVA_SEPOLIA]: "zkLink Nova Sepolia Testnet",
};

export const GAS_PRICE_ADJUSTMENT_MAP = {
  [ARBITRUM]: "0",
  // [AVALANCHE]: "3000000000", // 3 gwei
  [NOVA]: "0",
};

export const MAX_GAS_PRICE_MAP = {
  [AVALANCHE]: "200000000000", // 200 gwei
};

export const HIGH_EXECUTION_FEES_MAP = {
  [ARBITRUM]: 5, // 5 USD
  // [AVALANCHE]: 5, // 5 USD
  [AVALANCHE_FUJI]: 5, // 5 USD
  [NOVA]: 5, // 5 USD
  [NOVA_SEPOLIA]: 5, // 5 USD
};

export const EXCESSIVE_EXECUTION_FEES_MAP = {
  [ARBITRUM]: 10, // 10 USD
  // [AVALANCHE]: 10, // 10 USD
  [AVALANCHE_FUJI]: 10, // 10 USD
  [NOVA]: 10, // 10 USD
  [NOVA_SEPOLIA]: 10, // 10 USD
};

export const EXECUTION_FEE_MULTIPLIER_MAP = {
  // if gas prices on Arbitrum are high, the main transaction costs would come from the L2 gas usage
  // for executing positions this is around 65,000 gas
  // if gas prices on Ethereum are high, than the gas usage might be higher, this calculation doesn't deal with that
  // case yet
  [ARBITRUM]: 65000,
  // multiplier for Avalanche is just the average gas usage
  // [AVALANCHE]: 700000,
  [AVALANCHE_FUJI]: 700000,
  [NOVA]: 700000,
  [NOVA_SEPOLIA]: 700000,
};

export const NETWORK_EXECUTION_TO_CREATE_FEE_FACTOR = {
  [ARBITRUM]: BigNumber.from(10).pow(29).mul(5),
  // [AVALANCHE]: BigNumber.from(10).pow(29).mul(35),
  [AVALANCHE_FUJI]: BigNumber.from(10).pow(29).mul(2),
  [NOVA]: BigNumber.from(10).pow(29).mul(5),
  [NOVA_SEPOLIA]: BigNumber.from(10).pow(29).mul(5),
} as const;

export const EXECUTION_FEE_CONFIG_V2: {
  [chainId: number]: {
    shouldUseMaxPriorityFeePerGas: boolean;
    defaultBufferBps?: number;
  };
} = {
  // [AVALANCHE]: {
  //   shouldUseMaxPriorityFeePerGas: true,
  //   defaultBufferBps: 1000, // 10%
  // },
  [AVALANCHE_FUJI]: {
    shouldUseMaxPriorityFeePerGas: true,
    defaultBufferBps: 1000, // 10%
  },
  [ARBITRUM]: {
    shouldUseMaxPriorityFeePerGas: false,
    defaultBufferBps: 1000, // 10%
  },
  [ARBITRUM_GOERLI]: {
    shouldUseMaxPriorityFeePerGas: false,
    defaultBufferBps: 1000, // 10%
  },
  [NOVA]: {
    shouldUseMaxPriorityFeePerGas: false,
    defaultBufferBps: 1000, // 10%
  },
  [NOVA_SEPOLIA]: {
    shouldUseMaxPriorityFeePerGas: false,
    defaultBufferBps: 1000, // 10%
  },
};

const constants = {
  [BSС_MAINNET]: {
    nativeTokenSymbol: "BNB",
    defaultCollateralSymbol: "BUSD",
    defaultFlagOrdersEnabled: false,
    positionReaderPropsLength: 8,
    v2: false,
  },

  [BSС_TESTNET]: {
    nativeTokenSymbol: "BNB",
    defaultCollateralSymbol: "BUSD",
    defaultFlagOrdersEnabled: true,
    positionReaderPropsLength: 8,
    v2: false,
  },

  [ARBITRUM_GOERLI]: {
    nativeTokenSymbol: "ETH",
    wrappedTokenSymbol: "WETH",
    defaultCollateralSymbol: "USDC",
    defaultFlagOrdersEnabled: false,
    positionReaderPropsLength: 9,
    v2: true,

    SWAP_ORDER_EXECUTION_GAS_FEE: parseEther("0.0003"),
    INCREASE_ORDER_EXECUTION_GAS_FEE: parseEther("0.0003"),
    // contract requires that execution fee be strictly greater than instead of gte
    DECREASE_ORDER_EXECUTION_GAS_FEE: parseEther("0.000300001"),
  },

  [ARBITRUM]: {
    nativeTokenSymbol: "ETH",
    wrappedTokenSymbol: "WETH",
    defaultCollateralSymbol: "USDC",
    defaultFlagOrdersEnabled: false,
    positionReaderPropsLength: 9,
    v2: true,

    SWAP_ORDER_EXECUTION_GAS_FEE: parseEther("0.0003"),
    INCREASE_ORDER_EXECUTION_GAS_FEE: parseEther("0.0003"),
    // contract requires that execution fee be strictly greater than instead of gte
    DECREASE_ORDER_EXECUTION_GAS_FEE: parseEther("0.000300001"),
  },

  // [AVALANCHE]: {
  //   nativeTokenSymbol: "AVAX",
  //   wrappedTokenSymbol: "WAVAX",
  //   defaultCollateralSymbol: "USDC",
  //   defaultFlagOrdersEnabled: true,
  //   positionReaderPropsLength: 9,
  //   v2: true,

  //   SWAP_ORDER_EXECUTION_GAS_FEE: parseEther("0.01"),
  //   INCREASE_ORDER_EXECUTION_GAS_FEE: parseEther("0.01"),
  //   // contract requires that execution fee be strictly greater than instead of gte
  //   DECREASE_ORDER_EXECUTION_GAS_FEE: parseEther("0.0100001"),
  // },

  [AVALANCHE_FUJI]: {
    nativeTokenSymbol: "AVAX",
    wrappedTokenSymbol: "WAVAX",
    defaultCollateralSymbol: "USDC",
    defaultFlagOrdersEnabled: true,
    positionReaderPropsLength: 9,
    v2: true,

    SWAP_ORDER_EXECUTION_GAS_FEE: parseEther("0.01"),
    INCREASE_ORDER_EXECUTION_GAS_FEE: parseEther("0.01"),
    // contract requires that execution fee be strictly greater than instead of gte
    DECREASE_ORDER_EXECUTION_GAS_FEE: parseEther("0.0100001"),
  },
  [NOVA]: {
    nativeTokenSymbol: "ETH",
    wrappedTokenSymbol: "WETH",
    defaultCollateralSymbol: "USDC",
    defaultFlagOrdersEnabled: false,
    positionReaderPropsLength: 9,
    v2: true,

    SWAP_ORDER_EXECUTION_GAS_FEE: parseEther("0.0003"),
    INCREASE_ORDER_EXECUTION_GAS_FEE: parseEther("0.0003"),
    // contract requires that execution fee be strictly greater than instead of gte
    DECREASE_ORDER_EXECUTION_GAS_FEE: parseEther("0.000300001"),
  },

  [NOVA_SEPOLIA]: {
    nativeTokenSymbol: "ETH",
    wrappedTokenSymbol: "WETH",
    defaultCollateralSymbol: "USDC.e",
    defaultFlagOrdersEnabled: false,
    positionReaderPropsLength: 9,
    v2: true,

    SWAP_ORDER_EXECUTION_GAS_FEE: parseEther("0.0003"),
    INCREASE_ORDER_EXECUTION_GAS_FEE: parseEther("0.0003"),
    // contract requires that execution fee be strictly greater than instead of gte
    DECREASE_ORDER_EXECUTION_GAS_FEE: parseEther("0.000300001"),
  },
};

const ALCHEMY_WHITELISTED_DOMAINS = ["gmx.io", "app.gmx.io"];

export const RPC_PROVIDERS = {
  [ETH_MAINNET]: ["https://rpc.ankr.com/eth"],
  [BSС_MAINNET]: [
    "https://bsc-dataseed.binance.org",
    "https://bsc-dataseed1.defibit.io",
    "https://bsc-dataseed1.ninicoin.io",
    "https://bsc-dataseed2.defibit.io",
    "https://bsc-dataseed3.defibit.io",
    "https://bsc-dataseed4.defibit.io",
    "https://bsc-dataseed2.ninicoin.io",
    "https://bsc-dataseed3.ninicoin.io",
    "https://bsc-dataseed4.ninicoin.io",
    "https://bsc-dataseed1.binance.org",
    "https://bsc-dataseed2.binance.org",
    "https://bsc-dataseed3.binance.org",
    "https://bsc-dataseed4.binance.org",
  ],
  [BSС_TESTNET]: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
  [ARBITRUM]:
    process.env.REACT_APP_ENV === "development" ? ["https://sepolia.rpc.zklink.io"] : ["https://rpc.zklink.io"],
  [ARBITRUM_GOERLI]: [
    "https://goerli-rollup.arbitrum.io/rpc",
    // "https://endpoints.omniatech.io/v1/arbitrum/goerli/public",
    // "https://arbitrum-goerli.public.blastapi.io",
  ],
  // [AVALANCHE]: ["https://api.avax.network/ext/bc/C/rpc"],
  [AVALANCHE_FUJI]: [
    "https://avalanche-fuji-c-chain.publicnode.com",
    "https://api.avax-test.network/ext/bc/C/rpc",
    // "https://ava-testnet.public.blastapi.io/v1/avax/fuji/public",
    // "https://rpc.ankr.com/avalanche_fuji",
  ],
  [NOVA]: ["https://rpc.zklink.io"],
  [NOVA_SEPOLIA]: ["https://sepolia.rpc.zklink.io"],
};

export const FALLBACK_PROVIDERS = {
  // [ARBITRUM]: ENV_ARBITRUM_RPC_URLS ? JSON.parse(ENV_ARBITRUM_RPC_URLS) : [getAlchemyHttpUrl()],
  [ARBITRUM]:
    process.env.REACT_APP_ENV === "development" ? ["https://sepolia.rpc.zklink.io"] : ["https://rpc.zklink.io"],
  // [AVALANCHE]: ENV_AVALANCHE_RPC_URLS
  //   ? JSON.parse(ENV_AVALANCHE_RPC_URLS)
  //   : ["https://avax-mainnet.gateway.pokt.network/v1/lb/626f37766c499d003aada23b"],
  [AVALANCHE_FUJI]: [
    "https://endpoints.omniatech.io/v1/avax/fuji/public",
    "https://api.avax-test.network/ext/bc/C/rpc",
    "https://ava-testnet.public.blastapi.io/ext/bc/C/rpc",
  ],
  [ARBITRUM_GOERLI]: ["https://arb-goerli.g.alchemy.com/v2/cZfd99JyN42V9Clbs_gOvA3GSBZH1-1j"],
  [NOVA]: ["https://rpc.zklink.io"],
  [NOVA_SEPOLIA]: ["https://sepolia.rpc.zklink.io"],
};

export const NETWORK_METADATA: { [chainId: number]: NetworkMetadata } = {
  [BSС_MAINNET]: {
    chainId: "0x" + BSС_MAINNET.toString(16),
    chainName: "BSC",
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: RPC_PROVIDERS[BSС_MAINNET],
    blockExplorerUrls: ["https://bscscan.com"],
  },
  [BSС_TESTNET]: {
    chainId: "0x" + BSС_TESTNET.toString(16),
    chainName: "BSC Testnet",
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: RPC_PROVIDERS[BSС_TESTNET],
    blockExplorerUrls: ["https://testnet.bscscan.com/"],
  },
  [ARBITRUM_GOERLI]: {
    chainId: "0x" + ARBITRUM_GOERLI.toString(16),
    chainName: "Arbitrum Goerli Testnet",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: RPC_PROVIDERS[ARBITRUM_GOERLI],
    blockExplorerUrls: ["https://goerli.arbiscan.io/"],
  },
  [ARBITRUM]: {
    chainId: "0x" + ARBITRUM.toString(16),
    chainName: "Arbitrum",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: RPC_PROVIDERS[ARBITRUM],
    blockExplorerUrls: [getExplorerUrl(ARBITRUM)],
  },
  // [AVALANCHE]: {
  //   chainId: "0x" + AVALANCHE.toString(16),
  //   chainName: "Avalanche",
  //   nativeCurrency: {
  //     name: "AVAX",
  //     symbol: "AVAX",
  //     decimals: 18,
  //   },
  //   rpcUrls: RPC_PROVIDERS[AVALANCHE],
  //   blockExplorerUrls: [getExplorerUrl(AVALANCHE)],
  // },
  [AVALANCHE_FUJI]: {
    chainId: "0x" + AVALANCHE_FUJI.toString(16),
    chainName: "Avalanche Fuji Testnet",
    nativeCurrency: {
      name: "AVAX",
      symbol: "AVAX",
      decimals: 18,
    },
    rpcUrls: RPC_PROVIDERS[AVALANCHE_FUJI],
    blockExplorerUrls: [getExplorerUrl(AVALANCHE_FUJI)],
  },
  [NOVA]: {
    chainId: "0x" + NOVA.toString(16),
    chainName: "zkLink Nova",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: RPC_PROVIDERS[NOVA],
    blockExplorerUrls: [getExplorerUrl(NOVA)],
  },
  [NOVA_SEPOLIA]: {
    chainId: "0x" + NOVA_SEPOLIA.toString(16),
    chainName: "zkLink Nova Sepolia Testnet",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: RPC_PROVIDERS[NOVA_SEPOLIA],
    blockExplorerUrls: ["https://sepolia.explorer.zklink.io"],
  },
};

export const getConstant = (chainId: number, key: string) => {
  if (!constants[chainId]) {
    throw new Error(`Unsupported chainId ${chainId}`);
  }

  if (!(key in constants[chainId])) {
    throw new Error(`Key ${key} does not exist for chainId ${chainId}`);
  }

  return constants[chainId][key];
};

export function getChainName(chainId: number) {
  return CHAIN_NAMES_MAP[chainId];
}

export function getRpcUrl(chainId: number): string | undefined {
  return sample(RPC_PROVIDERS[chainId]);
}

export function getFallbackRpcUrl(chainId: number): string | undefined {
  return sample(FALLBACK_PROVIDERS[chainId]);
}

export function getAlchemyHttpUrl() {
  if (ALCHEMY_WHITELISTED_DOMAINS.includes(window.location.host)) {
    return "https://arb-mainnet.g.alchemy.com/v2/RcaXYTizJs51m-w9SnRyDrxSZhE5H9Mf";
  }
  return "https://arb-mainnet.g.alchemy.com/v2/hxBqIr-vfpJ105JPYLei_ibbJLe66k46";
}

export function getAlchemyWsUrl() {
  if (ALCHEMY_WHITELISTED_DOMAINS.includes(window.location.host)) {
    return "wss://arb-mainnet.g.alchemy.com/v2/RcaXYTizJs51m-w9SnRyDrxSZhE5H9Mf";
  }
  return "wss://arb-mainnet.g.alchemy.com/v2/hxBqIr-vfpJ105JPYLei_ibbJLe66k46";
}

export function getExplorerUrl(chainId) {
  if (chainId === 3) {
    return "https://ropsten.etherscan.io/";
  } else if (chainId === 42) {
    return "https://kovan.etherscan.io/";
  } else if (chainId === BSС_MAINNET) {
    return "https://bscscan.com/";
  } else if (chainId === BSС_TESTNET) {
    return "https://testnet.bscscan.com/";
  } else if (chainId === ARBITRUM_GOERLI) {
    return "https://goerli.arbiscan.io/";
  } else if (chainId === ARBITRUM) {
    // return "https://arbiscan.io/";
    return "https://sepolia.explorer.zklink.io/";
  } else if (chainId === AVALANCHE) {
    return "https://snowtrace.io/";
  } else if (chainId === AVALANCHE_FUJI) {
    return "https://testnet.snowtrace.io/";
  } else if (chainId === NOVA) {
    return "https://explorer.zklink.io/";
  } else if (chainId === NOVA_SEPOLIA) {
    return "https://sepolia.explorer.zklink.io/";
  }
  return "https://etherscan.io/";
}

export function getTokenExplorerUrl(chainId: number, tokenAddress: string) {
  return `${getExplorerUrl(chainId)}token/${tokenAddress}`;
}

export function getHighExecutionFee(chainId) {
  return HIGH_EXECUTION_FEES_MAP[chainId] ?? 5;
}

export function getExcessiveExecutionFee(chainId) {
  return EXCESSIVE_EXECUTION_FEES_MAP[chainId] ?? 10;
}

export function getExecutionFeeMultiplier(chainId) {
  return EXECUTION_FEE_MULTIPLIER_MAP[chainId] || 1;
}

export function isSupportedChain(chainId) {
  return SUPPORTED_CHAIN_IDS.includes(chainId);
}
