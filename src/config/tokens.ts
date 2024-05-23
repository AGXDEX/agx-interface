import { Token } from "domain/tokens";
import { ethers } from "ethers";
import { ARBITRUM, ARBITRUM_GOERLI, AVALANCHE, AVALANCHE_FUJI } from "./chains";
import { getContract } from "./contracts";

export const NATIVE_TOKEN_ADDRESS = ethers.constants.AddressZero;
import { SELECTED_CHAIN_LOCAL_STORAGE_KEY } from "config/localStorage";
const chainKeyFromLocalStorage = localStorage.getItem(SELECTED_CHAIN_LOCAL_STORAGE_KEY)||'nova';
const ChainToken: Token[] = [
  // {
  //   name: "Dai",
  //   symbol: "Dai",
  //   decimals: 18,
  //   address: "0xfc31ff38e24901052b813dcebef5a9a10eaf25ec",
  //   isShortable: true,
  //   imageUrl: "https://assets.coingecko.com/coins/images/34753/large/Ezeth_logo_circle.png?1713496404",
  //   coingeckoUrl: "https://www.coingecko.com/en/coins/renzo-restaked-eth",
  //   explorerUrl: "https://sepolia.explorer.zklink.io/address/0xD7C43Ef14bb17C8bBD6575992aa35d9EBBfc512D",
  //   isV1Available: true,
  //   l1Addresses: [
  //     {
  //       key: "arbitrum",
  //       address: "0x2416092f143378750bb29b79eD961ab195CcEea5",
  //     },
  //   ],
  // },
  {
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
    address: ethers.constants.AddressZero, // ，ethers.constants.AddressZero
    isNative: true,
    isShortable: true,
    imageUrl: "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
    coingeckoUrl: "https://www.coingecko.com/en/coins/ethereum",
    isV1Available: true,
    l1Addresses: [
      // 0x0000000000000000000000000000000000000000
    ],
  },
  {
    name: "Wrapped Ethereum",
    symbol: "WETH",
    decimals: 18,
    //TODO: WETH9 address config
    address: "0x6e42d10eB474a17b14f3cfeAC2590bfa604313C7",
    isWrapped: true,
    baseSymbol: "ETH",
    imageUrl: "https://assets.coingecko.com/coins/images/2518/thumb/weth.png?1628852295",
    coingeckoUrl: "https://www.coingecko.com/en/coins/ethereum",
    isV1Available: true,
    l1Addresses: [
      {
        key: "ethereum",
        address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      },
      {
        key: "primary",
        address: "0xe5d7c2a44ffddf6b295a15c148167daaaf5cf34f",
      },
      {
        key: "zksync",
        address: "0x5aea5775959fbc2557cc8789bc1bf90a239d9a91",
      },
      {
        key: "arbitrum",
        address: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
      },
      {
        key: "mantle",
        address: "0xdEAddEaDdeadDEadDEADDEAddEADDEAddead1111",
      },
      {
        key: "manta",
        address: "0x0Dc808adcE2099A9F62AA87D9670745AbA741746",
      },
      {
        key: "optimism",
        address: "0x4200000000000000000000000000000000000006",
      },
      {
        key: "base",
        address: "0x4200000000000000000000000000000000000006",
      },
    ],
  },
  {
    name: "Bitcoin (WBTC)",
    symbol: "WBTC",
    assetSymbol: "WBTC",
    decimals: 8,
    address: "0xbEacb61e11940e38EAdCf41860b9ea31E2a90deC",
    isShortable: true,
    imageUrl: "https://assets.coingecko.com/coins/images/26115/thumb/btcb.png?1655921693",
    coingeckoUrl: "https://www.coingecko.com/en/coins/wrapped-bitcoin",
    explorerUrl: "https://explorer.zklink.io/address/0xbEacb61e11940e38EAdCf41860b9ea31E2a90deC",
    isV1Available: true,
    l1Addresses: [
      {
        key: "ethereum",
        address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
      },
      {
        key: "primary",
        address: "0x3aAB2285ddcDdaD8edf438C1bAB47e1a9D05a9b4",
      },
      {
        key: "zksync",
        address: "0xBBeB516fb02a01611cBBE0453Fe3c580D7281011",
      },
      {
        key: "arbitrum",
        address: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
      },
      {
        key: "mantle",
        address: "0xCAbAE6f6Ea1ecaB08Ad02fE02ce9A44F09aebfA2",
      },
      {
        key: "manta",
        address: "0x305E88d809c9DC03179554BFbf85Ac05Ce8F18d6",
      },
      {
        key: "optimism",
        address: "0x68f180fcCe6836688e9084f035309E29Bf0A2095",
      },
      {
        key: "base",
        address: "0x1ceA84203673764244E05693e42E6Ace62bE9BA5",
      },
    ],
  },
  {
    name: "pufETH",
    symbol: "pufETH",
    decimals: 18,
    address: "0x1569046dC6D4bd5d06cA5fa2fb83D2885bd87b20",
    isShortable: true,
    imageUrl: "https://assets.coingecko.com/coins/images/35176/large/pufETH-200-200-resolution.png?1707753174",
    coingeckoUrl: "https://www.coingecko.com/en/coins/pufeth",
    explorerUrl: "https://sepolia.explorer.zklink.io/address/0x1569046dC6D4bd5d06cA5fa2fb83D2885bd87b20",
    isV1Available: true,
    l1Addresses: [
      {
        key: "ethereum",
        address: "0xD9A442856C234a39a81a089C06451EBAa4306a72",
      },
    ],
  },
  {
    name: "ezETH",
    symbol: "ezETH",
    decimals: 18,
    address: "0xD7C43Ef14bb17C8bBD6575992aa35d9EBBfc512D",
    isShortable: true,
    imageUrl: "https://assets.coingecko.com/coins/images/34753/large/Ezeth_logo_circle.png?1713496404",
    coingeckoUrl: "https://www.coingecko.com/en/coins/renzo-restaked-eth",
    explorerUrl: "https://sepolia.explorer.zklink.io/address/0xD7C43Ef14bb17C8bBD6575992aa35d9EBBfc512D",
    isV1Available: true,
    l1Addresses: [
      {
        key: "arbitrum",
        address: "0x2416092f143378750bb29b79eD961ab195CcEea5",
      },
    ],
  },
  {
    name: "Tether",
    symbol: "USDT",
    decimals: 6,
    address: "0x773646397e21C0B4a323f7FdB98B6c45F5Df5A65",
    isStable: true,
    imageUrl: "https://assets.coingecko.com/coins/images/325/small/Tether-logo.png",
    coingeckoUrl: "https://www.coingecko.com/en/coins/tether",
    explorerUrl: "https://sepolia.explorer.zklink.io/address/0x773646397e21C0B4a323f7FdB98B6c45F5Df5A65",
    isV1Available: true,
    l1Addresses: [
      {
        key: "ethereum",
        address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      },
      {
        key: "primary",
        address: "0xA219439258ca9da29E9Cc4cE5596924745e12B93",
      },
      {
        key: "zksync",
        address: "0x493257fD37EDB34451f62EDf8D2a0C418852bA4C",
      },
      {
        key: "arbitrum",
        address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
      },
      {
        key: "mantle",
        address: "0x201EBa5CC46D216Ce6DC03F6a759e8E766e956aE",
      },
      {
        key: "manta",
        address: "0xf417F5A458eC102B90352F697D6e2Ac3A3d2851f",
      },
      {
        key: "optimism",
        address: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
      },
      {
        key: "base",
        address: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2",
      },
    ],
  },

  {
    name: "USD Coin",
    symbol: "USDC",
    decimals: 6,
    address: "0x0A8714d8fc4bE1b8f2B2AB29b8e4fEe9B271a57D",
    isStable: true,
    imageUrl: "https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png?1547042389",
    coingeckoUrl: "https://www.coingecko.com/en/coins/usd-coin",
    explorerUrl: "https://sepolia.explorer.zklink.io/address/0x0A8714d8fc4bE1b8f2B2AB29b8e4fEe9B271a57D",
    isV1Available: true,
    l1Addresses: [
      {
        key: "ethereum",
        address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      },
      {
        key: "primary",
        address: "0x176211869cA2b568f2A7D4EE941E073a821EE1ff",
      },
      {
        key: "zksync",
        address: "0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4",
      },
      {
        key: "arbitrum",
        address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
      },
      {
        key: "mantle",
        address: "0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9",
      },
      {
        key: "manta",
        address: "0xb73603C5d87fA094B7314C74ACE2e64D165016fb",
      },
      {
        key: "optimism",
        address: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
      },
      {
        key: "base",
        address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      },
    ],
  },
];
const novaChain = [
    // {
    //   name: "Dai",
    //   symbol: "Dai",
    //   decimals: 18,
    //   address: '0x5f2eC2cC20C1B556E397e70193b28bE7b459C54f', // ，ethers.constants.AddressZero
    //   isNative: true,
    //   isShortable: true,
    //   imageUrl: "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
    //   coingeckoUrl: "https://www.coingecko.com/en/coins/ethereum",
    //   isV1Available: true,
    // },
    {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
      address: ethers.constants.AddressZero, // ，ethers.constants.AddressZero
      isNative: true,
      isShortable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
      coingeckoUrl: "https://www.coingecko.com/en/coins/ethereum",
      isV1Available: true,
    },
    {
      name: "Wrapped Ethereum",
      symbol: "WETH",
      decimals: 18,
      address: "0x6e42d10eB474a17b14f3cfeAC2590bfa604313C7",
      isWrapped: true,
      baseSymbol: "ETH",
      imageUrl: "https://assets.coingecko.com/coins/images/2518/thumb/weth.png?1628852295",
      coingeckoUrl: "https://www.coingecko.com/en/coins/ethereum",
      isV1Available: true,
    },
    {
      name: "Bitcoin (WBTC)",
      symbol: "WBTC",
      assetSymbol: "WBTC",
      decimals: 8,
      address: "0xbEacb61e11940e38EAdCf41860b9ea31E2a90deC",
      isShortable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/26115/thumb/btcb.png?1655921693",
      coingeckoUrl: "https://www.coingecko.com/en/coins/wrapped-bitcoin",
      explorerUrl: "https://explorer.zklink.io/address/0xbEacb61e11940e38EAdCf41860b9ea31E2a90deC",
      isV1Available: true,
    },
    {
      name: "pufETH",
      symbol: "pufETH",
      decimals: 18,
      address: "0x1569046dC6D4bd5d06cA5fa2fb83D2885bd87b20",
      isShortable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/35176/large/pufETH-200-200-resolution.png?1707753174",
      coingeckoUrl: "https://www.coingecko.com/en/coins/pufeth",
      explorerUrl: "https://sepolia.explorer.zklink.io/address/0x1569046dC6D4bd5d06cA5fa2fb83D2885bd87b20",
      isV1Available: true,
    },
    {
      name: "ezETH",
      symbol: "ezETH",
      decimals: 18,
      address: "0xD7C43Ef14bb17C8bBD6575992aa35d9EBBfc512D",
      isShortable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/34753/large/Ezeth_logo_circle.png?1713496404",
      coingeckoUrl: "https://www.coingecko.com/en/coins/renzo-restaked-eth",
      explorerUrl: "https://sepolia.explorer.zklink.io/address/0xD7C43Ef14bb17C8bBD6575992aa35d9EBBfc512D",
      isV1Available: true,
    },
    {
      name: "Tether",
      symbol: "USDT",
      decimals: 6,
      address: "0x773646397e21C0B4a323f7FdB98B6c45F5Df5A65",
      isStable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/325/small/Tether-logo.png",
      coingeckoUrl: "https://www.coingecko.com/en/coins/tether",
      explorerUrl: "https://sepolia.explorer.zklink.io/address/0x773646397e21C0B4a323f7FdB98B6c45F5Df5A65",
      isV1Available: true,
    },
    {
      name: "USD Coin",
      symbol: "USDC",
      decimals: 6,
      address: "0x0A8714d8fc4bE1b8f2B2AB29b8e4fEe9B271a57D",
      isStable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png?1547042389",
      coingeckoUrl: "https://www.coingecko.com/en/coins/usd-coin",
      explorerUrl: "https://sepolia.explorer.zklink.io/address/0x0A8714d8fc4bE1b8f2B2AB29b8e4fEe9B271a57D",
      isV1Available: true,
    },
  ]

const tokens: any[] = chainKeyFromLocalStorage === 'nova'? novaChain: ChainToken.filter((token) => {
  return token.symbol === "ETH" || token.l1Addresses?.some((address) => address.key === chainKeyFromLocalStorage);
}).map((item) => {
  return novaChain.find((i) => i.symbol === item.symbol)
});
export const TOKENS: { [chainId: number]: Token[] } = {
  [AVALANCHE]: [
    {
      name: "Avalanche",
      symbol: "AVAX",
      decimals: 18,
      address: ethers.constants.AddressZero,
      isNative: true,
      isShortable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/12559/small/coin-round-red.png?1604021818",
      coingeckoUrl: "https://www.coingecko.com/en/coins/avalanche",
      isV1Available: true,
    },
    {
      name: "Wrapped AVAX",
      symbol: "WAVAX",
      decimals: 18,
      address: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
      isWrapped: true,
      baseSymbol: "AVAX",
      imageUrl: "https://assets.coingecko.com/coins/images/12559/small/coin-round-red.png?1604021818",
      coingeckoUrl: "https://www.coingecko.com/en/coins/avalanche",
      explorerUrl: "https://snowtrace.io/address/0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
      isV1Available: true,
    },
    {
      name: "Ethereum (WETH.e)",
      symbol: "ETH",
      assetSymbol: "WETH.e",
      address: "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB",
      decimals: 18,
      isShortable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
      coingeckoUrl: "https://www.coingecko.com/en/coins/weth",
      coingeckoSymbol: "WETH",
      explorerUrl: "https://snowtrace.io/address/0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB",
      isV1Available: true,
    },
    {
      name: "Bitcoin (BTC.b)",
      symbol: "BTC",
      assetSymbol: "BTC.b",
      address: "0x152b9d0FdC40C096757F570A51E494bd4b943E50",
      decimals: 8,
      isShortable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/26115/thumb/btcb.png?1655921693",
      coingeckoUrl: "https://www.coingecko.com/en/coins/bitcoin-avalanche-bridged-btc-b",
      explorerUrl: "https://snowtrace.io/address/0x152b9d0FdC40C096757F570A51E494bd4b943E50",
      isV1Available: true,
    },
    {
      name: "Bitcoin (WBTC.e)",
      symbol: "WBTC",
      assetSymbol: "WBTC.e",
      address: "0x50b7545627a5162F82A992c33b87aDc75187B218",
      decimals: 8,
      isShortable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/7598/thumb/wrapped_bitcoin_wbtc.png?1548822744",
      coingeckoUrl: "https://www.coingecko.com/en/coins/wrapped-bitcoin",
      coingeckoSymbol: "WBTC",
      explorerUrl: "https://snowtrace.io/address/0x50b7545627a5162F82A992c33b87aDc75187B218",
      isV1Available: true,
    },
    {
      name: "USD Coin",
      symbol: "USDC",
      address: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
      decimals: 6,
      isStable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png?1547042389",
      coingeckoUrl: "https://www.coingecko.com/en/coins/usd-coin",
      explorerUrl: "https://snowtrace.io/address/0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
      isV1Available: true,
    },
    {
      name: "Bridged USDC (USDC.e)",
      symbol: "USDC.e",
      address: "0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664",
      decimals: 6,
      isStable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png?1547042389",
      coingeckoUrl: "https://www.coingecko.com/en/coins/bridged-usdc-avalanche-bridge",
      explorerUrl: "https://snowtrace.io/address/0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664",
      isV1Available: true,
    },
    {
      name: "Tether",
      symbol: "USDT",
      decimals: 6,
      address: "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7",
      isStable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/325/small/Tether-logo.png",
      coingeckoUrl: "https://www.coingecko.com/en/coins/tether",
      explorerUrl: "https://snowtrace.io/address/0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7",
    },
    {
      name: "Tether",
      symbol: "USDT.e",
      decimals: 6,
      address: "0xc7198437980c041c805A1EDcbA50c1Ce5db95118",
      isStable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/325/small/Tether-logo.png",
      coingeckoUrl: "https://www.coingecko.com/en/coins/tether",
      explorerUrl: "https://snowtrace.io/address/0xc7198437980c041c805A1EDcbA50c1Ce5db95118",
    },
    {
      name: "Dai",
      symbol: "DAI.e",
      address: "0xd586E7F844cEa2F87f50152665BCbc2C279D8d70",
      decimals: 18,
      isStable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/9956/thumb/4943.png?1636636734",
      coingeckoUrl: "https://www.coingecko.com/en/coins/dai",
      explorerUrl: "https://snowtrace.io/address/0xd586E7F844cEa2F87f50152665BCbc2C279D8d70",
    },
    {
      name: "Magic Internet Money",
      symbol: "MIM",
      address: "0x130966628846BFd36ff31a822705796e8cb8C18D",
      decimals: 18,
      isStable: true,
      isTempHidden: true,
      imageUrl: "https://assets.coingecko.com/coins/images/16786/small/mimlogopng.png",
      coingeckoUrl: "https://www.coingecko.com/en/coins/magic-internet-money",
      explorerUrl: "https://snowtrace.io/address/0x130966628846BFd36ff31a822705796e8cb8C18D",
      isV1Available: true,
    },
    {
      name: "Chainlink",
      symbol: "LINK",
      decimals: 18,
      priceDecimals: 3,
      address: "0x5947BB275c521040051D82396192181b413227A3",
      isStable: false,
      isShortable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/877/thumb/chainlink-new-logo.png?1547034700",
      coingeckoUrl: "https://www.coingecko.com/en/coins/chainlink",
      explorerUrl: "https://snowtrace.io/address/0x5947BB275c521040051D82396192181b413227A3",
    },
    {
      name: "Dogecoin",
      symbol: "DOGE",
      decimals: 8,
      priceDecimals: 4,
      address: "0xC301E6fe31062C557aEE806cc6A841aE989A3ac6",
      isSynthetic: true,
      imageUrl: "https://assets.coingecko.com/coins/images/5/small/dogecoin.png?1547792256",
      coingeckoUrl: "https://www.coingecko.com/en/coins/dogecoin",
    },
    {
      name: "Litecoin",
      symbol: "LTC",
      decimals: 8,
      address: "0x8E9C35235C38C44b5a53B56A41eaf6dB9a430cD6",
      isSynthetic: true,
      imageUrl: "https://assets.coingecko.com/coins/images/2/small/litecoin.png?1547033580",
      coingeckoUrl: "https://www.coingecko.com/en/coins/litecoin",
    },
    {
      name: "Wrapped SOL (Wormhole)",
      symbol: "SOL",
      assetSymbol: "WSOL (Wormhole)",
      decimals: 9,
      address: "0xFE6B19286885a4F7F55AdAD09C3Cd1f906D2478F",
      imageUrl: "https://assets.coingecko.com/coins/images/4128/small/solana.png?1640133422",
      coingeckoUrl: "https://www.coingecko.com/en/coins/solana",
      coingeckoSymbol: "SOL",
      explorerUrl: "https://snowtrace.io/address/0xFE6B19286885a4F7F55AdAD09C3Cd1f906D2478F",
    },
    {
      name: "XRP",
      symbol: "XRP",
      decimals: 6,
      priceDecimals: 4,
      address: "0x34B2885D617cE2ddeD4F60cCB49809fc17bb58Af",
      imageUrl: "https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png?1605778731",
      coingeckoUrl: "https://www.coingecko.com/en/coins/xrp",
      isSynthetic: true,
    },
    {
      name: "GMX",
      symbol: "GMX",
      address: getContract(AVALANCHE, "GMX"),
      decimals: 18,
      imageUrl: "https://assets.coingecko.com/coins/images/18323/small/arbit.png?1631532468",
      isPlatformToken: true,
      coingeckoUrl: "https://www.coingecko.com/en/coins/gmx",
      explorerUrl: "https://snowtrace.io/address/0x62edc0692bd897d2295872a9ffcac5425011c661",
    },
    {
      name: "Escrowed GMX",
      symbol: "esGMX",
      address: getContract(AVALANCHE, "ES_GMX"),
      decimals: 18,
      isPlatformToken: true,
    },
    {
      name: "GMX LP",
      symbol: "GLP",
      address: getContract(AVALANCHE, "GLP"),
      decimals: 18,
      isPlatformToken: true,
      imageUrl: "https://github.com/gmx-io/gmx-assets/blob/main/GMX-Assets/PNG/GLP_LOGO%20ONLY.png?raw=true",
      explorerUrl: "https://snowtrace.io/address/0x9e295B5B976a184B14aD8cd72413aD846C299660",
      reservesUrl: "https://portfolio.nansen.ai/dashboard/gmx?chain=AVAX",
    },
    {
      name: "GMX Market tokens",
      symbol: "GM",
      address: "<market-token-address>",
      decimals: 18,
      imageUrl: "https://raw.githubusercontent.com/gmx-io/gmx-assets/main/GMX-Assets/PNG/GM_LOGO.png",
      isPlatformToken: true,
    },
  ],
  [ARBITRUM_GOERLI]: [
    {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
      address: ethers.constants.AddressZero,
      isNative: true,
      isShortable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
    },
    {
      name: "Wrapped Ethereum",
      symbol: "WETH",
      decimals: 18,
      address: "0xe39Ab88f8A4777030A534146A9Ca3B52bd5D43A3",
      isWrapped: true,
      baseSymbol: "ETH",
      imageUrl: "https://assets.coingecko.com/coins/images/2518/thumb/weth.png?1628852295",
      coingeckoUrl: "https://www.coingecko.com/en/coins/ethereum",
      explorerUrl: "https://goerli.arbiscan.io/address/0xe39Ab88f8A4777030A534146A9Ca3B52bd5D43A3",
    },
    {
      name: "Bitcoin",
      symbol: "BTC",
      decimals: 8,
      address: "0xCcF73F4Dcbbb573296BFA656b754Fe94BB957d62",
      isShortable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/7598/thumb/wrapped_bitcoin_wbtc.png?1548822744",
      coingeckoUrl: "https://www.coingecko.com/en/coins/bitcoin",
      explorerUrl: "https://goerli.arbiscan.io/address/0xCcF73F4Dcbbb573296BFA656b754Fe94BB957d62",
    },
    {
      name: "USD Coin",
      symbol: "USDC",
      decimals: 6,
      address: "0x04FC936a15352a1b15b3B9c56EA002051e3DB3e5",
      isStable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png?1547042389",
      coingeckoUrl: "https://www.coingecko.com/en/coins/usd-coin",
      explorerUrl: "https://goerli.arbiscan.io/address/0x04FC936a15352a1b15b3B9c56EA002051e3DB3e5",
    },
    {
      name: "Tether",
      symbol: "USDT",
      decimals: 6,
      address: "0xBFcBcdCbcc1b765843dCe4DF044B92FE68182a62",
      isStable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/325/small/Tether-logo.png",
      coingeckoUrl: "https://www.coingecko.com/en/coins/tether",
      explorerUrl: "https://goerli.arbiscan.io/address/0xBFcBcdCbcc1b765843dCe4DF044B92FE68182a62",
    },
    {
      name: "Dai",
      symbol: "DAI",
      address: "0x7b7c6c49fA99b37270077FBFA398748c27046984",
      decimals: 18,
      isStable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/9956/thumb/4943.png?1636636734",
      coingeckoUrl: "https://www.coingecko.com/en/coins/dai",
      explorerUrl: "https://goerli.arbiscan.io/address/0x7b7c6c49fA99b37270077FBFA398748c27046984",
    },
    {
      name: "Solana",
      symbol: "SOL",
      decimals: 18,
      address: "0x9A98a11279FaeB0fF695dFEC3C4B8a29138d0a2f",
      isSynthetic: true,
      imageUrl: "https://assets.coingecko.com/coins/images/4128/small/solana.png?1640133422",
      coingeckoUrl: "https://www.coingecko.com/en/coins/solana",
    },
    {
      name: "Test token",
      symbol: "TEST",
      decimals: 18,
      address: "0x13C52ccB49fE3228356D0C355641961646A0D9B2",
      isSynthetic: true,
      coingeckoUrl: "https://www.coingecko.com/en/coins/tether",
    },
    {
      name: "BNB",
      symbol: "BNB",
      isSynthetic: true,
      decimals: 18,
      address: "0xa076E6db62f61bd1A4fC283F84739D2b0c80e2a3",
      coingeckoUrl: "https://www.coingecko.com/en/coins/binancecoin",
    },
    {
      name: "Cardano",
      symbol: "ADA",
      decimals: 18,
      priceDecimals: 4,
      address: "0x5F8a8f06da2848f846A2b5e3e42A4A2eEC5f337B",
      isSynthetic: true,
      coingeckoUrl: "https://www.coingecko.com/en/coins/cardano",
    },
    {
      name: "TRON",
      symbol: "TRX",
      decimals: 18,
      priceDecimals: 4,
      address: "0x7a9Ba06548D0499f6Debf97809CC351c1e85795D",
      isSynthetic: true,
      coingeckoUrl: "https://www.coingecko.com/en/coins/tron",
    },
    {
      name: "Polygon",
      symbol: "MATIC",
      decimals: 18,
      priceDecimals: 4,
      address: "0xd98D28787F5598749331052f952196428F61e3aD",
      isSynthetic: true,
      coingeckoUrl: "https://www.coingecko.com/en/coins/polygon",
    },
    {
      name: "Polkadot",
      symbol: "DOT",
      decimals: 18,
      address: "0x7361D58cBc6495B6419397dFd5ebE2e2017F23E9",
      isSynthetic: true,
      coingeckoUrl: "https://www.coingecko.com/en/coins/polkadot",
    },
    {
      name: "Uniswap",
      symbol: "UNI",
      decimals: 18,
      priceDecimals: 3,
      address: "0x6DEbb9cC48819941F797a2F0c63f9168C19fD057",
      isSynthetic: true,
      coingeckoUrl: "https://www.coingecko.com/en/coins/uniswap",
    },
    {
      name: "Dogecoin",
      symbol: "DOGE",
      isSynthetic: true,
      isShortable: true,
      decimals: 8,
      priceDecimals: 4,
      address: "0x3e2fA75b78edF836299127FBAA776304B4712972",
      coingeckoUrl: "https://www.coingecko.com/en/coins/dogecoin",
    },
    {
      name: "Chainlink",
      symbol: "LINK",
      decimals: 18,
      priceDecimals: 3,
      address: "0x55602A94239a7926D92da5C53Fb96E80372382aa",
      isSynthetic: true,
      coingeckoUrl: "https://www.coingecko.com/en/coins/chainlink",
    },
    {
      name: "XRP",
      symbol: "XRP",
      decimals: 6,
      priceDecimals: 4,
      address: "0xF1C2093383453831e8c90ecf809691123116dAaC",
      isSynthetic: true,
      imageUrl: "https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png?1605778731",
      coingeckoUrl: "https://www.coingecko.com/en/coins/xrp",
    },
    {
      name: "GMX",
      symbol: "GMX",
      address: "",
      decimals: 18,
      imageUrl: "https://assets.coingecko.com/coins/images/18323/small/arbit.png?1631532468",
      isPlatformToken: true,
    },
    {
      name: "Escrowed GMX",
      symbol: "esGMX",
      address: "",
      decimals: 18,
      isPlatformToken: true,
    },
    {
      name: "GMX LP",
      symbol: "GLP",
      address: "",
      decimals: 18,
      imageUrl: "https://github.com/gmx-io/gmx-assets/blob/main/GMX-Assets/PNG/GLP_LOGO%20ONLY.png?raw=true",
      isPlatformToken: true,
    },
    {
      name: "GMX Market tokens",
      symbol: "GM",
      address: "<market-token-address>",
      decimals: 18,
      imageUrl: "https://raw.githubusercontent.com/gmx-io/gmx-assets/main/GMX-Assets/PNG/GM_LOGO.png",
      isPlatformToken: true,
    },
  ],
  [AVALANCHE_FUJI]: [
    {
      name: "Avalanche",
      symbol: "AVAX",
      decimals: 18,
      address: ethers.constants.AddressZero,
      isNative: true,
      isShortable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/12559/small/coin-round-red.png?1604021818",
    },
    {
      name: "Wrapped AVAX",
      symbol: "WAVAX",
      decimals: 18,
      address: "0x1D308089a2D1Ced3f1Ce36B1FcaF815b07217be3",
      isWrapped: true,
      baseSymbol: "AVAX",
      imageUrl: "https://assets.coingecko.com/coins/images/12559/small/coin-round-red.png?1604021818",
      coingeckoUrl: "https://www.coingecko.com/en/coins/avalanche",
      explorerUrl: "https://testnet.snowtrace.io/address/0x1D308089a2D1Ced3f1Ce36B1FcaF815b07217be3",
    },
    {
      name: "Ethereum (WETH.e)",
      symbol: "ETH",
      assetSymbol: "WETH.e",
      address: "0x82F0b3695Ed2324e55bbD9A9554cB4192EC3a514",
      decimals: 18,
      isShortable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
      coingeckoUrl: "https://www.coingecko.com/en/coins/weth",
      coingeckoSymbol: "WETH",
      explorerUrl: "https://testnet.snowtrace.io/address/0x82F0b3695Ed2324e55bbD9A9554cB4192EC3a514",
    },
    {
      name: "USD Coin",
      symbol: "USDC",
      address: "0x3eBDeaA0DB3FfDe96E7a0DBBAFEC961FC50F725F",
      decimals: 6,
      isStable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png?1547042389",
      coingeckoUrl: "https://www.coingecko.com/en/coins/usd-coin",
      explorerUrl: "https://testnet.snowtrace.io/address/0x3eBDeaA0DB3FfDe96E7a0DBBAFEC961FC50F725F",
    },
    {
      name: "Tether",
      symbol: "USDT",
      decimals: 6,
      address: "0x50df4892Bd13f01E4e1Cd077ff394A8fa1A3fD7c",
      isStable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/325/small/Tether-logo.png",
      coingeckoUrl: "https://www.coingecko.com/en/coins/dai",
      explorerUrl: "https://testnet.snowtrace.io/address/0x50df4892Bd13f01E4e1Cd077ff394A8fa1A3fD7c",
    },
    {
      name: "Dai",
      symbol: "DAI",
      address: "0x51290cb93bE5062A6497f16D9cd3376Adf54F920",
      decimals: 6,
      isStable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/9956/thumb/4943.png?1636636734",
      coingeckoUrl: "https://www.coingecko.com/en/coins/dai",
      explorerUrl: "https://testnet.snowtrace.io/address/0x51290cb93bE5062A6497f16D9cd3376Adf54F920",
    },
    {
      name: "Bitcoin (WBTC)",
      symbol: "WBTC",
      decimals: 8,
      address: "0x3Bd8e00c25B12E6E60fc8B6f1E1E2236102073Ca",
      imageUrl: "https://assets.coingecko.com/coins/images/7598/thumb/wrapped_bitcoin_wbtc.png?1548822744",
      coingeckoUrl: "https://www.coingecko.com/en/coins/wrapped-bitcoin",
      explorerUrl: "https://testnet.snowtrace.io/address/0x3Bd8e00c25B12E6E60fc8B6f1E1E2236102073Ca",
    },
    {
      name: "Solana",
      symbol: "SOL",
      decimals: 18,
      address: "0x137f4a7336df4f3f11894718528516edaaD0B082",
      isSynthetic: true,
      imageUrl: "https://assets.coingecko.com/coins/images/4128/small/solana.png?1640133422",
      coingeckoUrl: "https://www.coingecko.com/en/coins/solana",
    },
    {
      name: "Test token",
      symbol: "TEST",
      decimals: 18,
      address: "0x42DD131E1086FFCc59bAE9498D71E20E0C889B14",
      isSynthetic: true,
      coingeckoUrl: "https://www.coingecko.com/en/coins/tether",
    },
    {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
      address: "0x110892Dd5fa73bE430c0ade694febD9a4CAc68Be",
      isSynthetic: true,
      coingeckoUrl: "https://www.coingecko.com/en/coins/binancecoin",
    },
    {
      name: "Cardano",
      symbol: "ADA",
      decimals: 18,
      priceDecimals: 4,
      address: "0xE64dfFF37Fa6Fe969b792B4146cEe2774Ef6e1a1",
      isSynthetic: true,
      coingeckoUrl: "https://www.coingecko.com/en/coins/cardano",
    },
    {
      name: "TRON",
      symbol: "TRX",
      decimals: 18,
      priceDecimals: 4,
      address: "0x0D1495527C255068F2f6feE31C85d326D0A76FE8",
      isSynthetic: true,
      coingeckoUrl: "https://www.coingecko.com/en/coins/tron",
    },
    {
      name: "Polygon",
      symbol: "MATIC",
      decimals: 18,
      priceDecimals: 4,
      address: "0xadc4698B257F78187Fd675FBf591a09f4c975240",
      isSynthetic: true,
      coingeckoUrl: "https://www.coingecko.com/en/coins/polygon",
    },
    {
      name: "Polkadot",
      symbol: "DOT",
      address: "0x65FFb5664a7B3377A5a27D9e59C72Fb1A5E94962",
      decimals: 18,
      isSynthetic: true,
      coingeckoUrl: "https://www.coingecko.com/en/coins/polkadot",
    },
    {
      name: "Uniswap",
      symbol: "UNI",
      decimals: 18,
      priceDecimals: 3,
      address: "0xF62dC1d2452d0893735D22945Af53C290b158eAF",
      isSynthetic: true,
      coingeckoUrl: "https://www.coingecko.com/en/coins/uniswap",
    },
    {
      name: "Dogecoin",
      symbol: "DOGE",
      decimals: 8,
      priceDecimals: 4,
      address: "0x2265F317eA5f47A684E5B26c50948617c945d986",
      isSynthetic: true,
      isShortable: true,
      coingeckoUrl: "https://www.coingecko.com/en/coins/dogecoin",
    },
    {
      name: "Chainlink",
      symbol: "LINK",
      decimals: 18,
      priceDecimals: 3,
      address: "0x6BD09E8D65AD5cc761DF62454452d4EC1545e647",
      isSynthetic: true,
      isShortable: true,
      coingeckoUrl: "https://www.coingecko.com/en/coins/chainlink",
    },
    {
      name: "XRP",
      symbol: "XRP",
      decimals: 6,
      priceDecimals: 4,
      address: "0xF1C2093383453831e8c90ecf809691123116dAaC",
      isSynthetic: true,
      imageUrl: "https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png?1605778731",
      coingeckoUrl: "https://www.coingecko.com/en/coins/xrp",
    },
    {
      name: "GMX",
      symbol: "GMX",
      address: "",
      decimals: 18,
      imageUrl: "https://assets.coingecko.com/coins/images/18323/small/arbit.png?1631532468",
      isPlatformToken: true,
    },
    {
      name: "Escrowed GMX",
      symbol: "esGMX",
      address: "",
      decimals: 18,
      isPlatformToken: true,
    },
    {
      name: "GMX LP",
      symbol: "GLP",
      address: "",
      decimals: 18,
      imageUrl: "https://github.com/gmx-io/gmx-assets/blob/main/GMX-Assets/PNG/GLP_LOGO%20ONLY.png?raw=true",
      isPlatformToken: true,
    },
    {
      name: "GMX Market tokens",
      symbol: "GM",
      address: "<market-token-address>",
      decimals: 18,
      imageUrl: "https://raw.githubusercontent.com/gmx-io/gmx-assets/main/GMX-Assets/PNG/GM_LOGO.png",
      isPlatformToken: true,
    },
  ],
  [ARBITRUM]: tokens,
  // [ARBITRUM]: [
  //   {
  //     name: "Ethereum",
  //     symbol: "ETH",
  //     decimals: 18,
  //     address: ethers.constants.AddressZero, // ，ethers.constants.AddressZero
  //     isNative: true,
  //     isShortable: true,
  //     imageUrl: "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
  //     coingeckoUrl: "https://www.coingecko.com/en/coins/ethereum",
  //     isV1Available: true,
  //   },
  //   {
  //     name: "Wrapped Ethereum",
  //     symbol: "WETH",
  //     decimals: 18,
  //     address: "0x6e42d10eB474a17b14f3cfeAC2590bfa604313C7",
  //     isWrapped: true,
  //     baseSymbol: "ETH",
  //     imageUrl: "https://assets.coingecko.com/coins/images/2518/thumb/weth.png?1628852295",
  //     coingeckoUrl: "https://www.coingecko.com/en/coins/ethereum",
  //     isV1Available: true,
  //   },
  //   {
  //     name: "Bitcoin (WBTC)",
  //     symbol: "BTC",
  //     assetSymbol: "WBTC",
  //     decimals: 8,
  //     address: "0xbEacb61e11940e38EAdCf41860b9ea31E2a90deC",
  //     isShortable: true,
  //     imageUrl: "https://assets.coingecko.com/coins/images/26115/thumb/btcb.png?1655921693",
  //     coingeckoUrl: "https://www.coingecko.com/en/coins/wrapped-bitcoin",
  //     explorerUrl: "https://explorer.zklink.io/address/0xbEacb61e11940e38EAdCf41860b9ea31E2a90deC",
  //     isV1Available: true,
  //   },
  //   {
  //     name: "pufETH",
  //     symbol: "pufETH",
  //     decimals: 18,
  //     address: "0x1569046dC6D4bd5d06cA5fa2fb83D2885bd87b20",
  //     isShortable: true,
  //     imageUrl: "https://assets.coingecko.com/coins/images/35176/large/pufETH-200-200-resolution.png?1707753174",
  //     coingeckoUrl: "https://www.coingecko.com/en/coins/pufeth",
  //     explorerUrl: "https://sepolia.explorer.zklink.io/address/0x1569046dC6D4bd5d06cA5fa2fb83D2885bd87b20",
  //     isV1Available: true,
  //   },
  //   {
  //     name: "ezETH",
  //     symbol: "ezETH",
  //     decimals: 18,
  //     address: "0xD7C43Ef14bb17C8bBD6575992aa35d9EBBfc512D",
  //     isShortable: true,
  //     imageUrl: "https://assets.coingecko.com/coins/images/34753/large/Ezeth_logo_circle.png?1713496404",
  //     coingeckoUrl: "https://www.coingecko.com/en/coins/renzo-restaked-eth",
  //     explorerUrl: "https://sepolia.explorer.zklink.io/address/0xD7C43Ef14bb17C8bBD6575992aa35d9EBBfc512D",
  //     isV1Available: true,
  //   },
  //   {
  //     name: "Tether",
  //     symbol: "USDT",
  //     decimals: 6,
  //     address: "0x773646397e21C0B4a323f7FdB98B6c45F5Df5A65",
  //     isStable: true,
  //     imageUrl: "https://assets.coingecko.com/coins/images/325/small/Tether-logo.png",
  //     coingeckoUrl: "https://www.coingecko.com/en/coins/tether",
  //     explorerUrl: "https://sepolia.explorer.zklink.io/address/0x773646397e21C0B4a323f7FdB98B6c45F5Df5A65",
  //     isV1Available: true,
  //   },
  //   {
  //     name: "USD Coin",
  //     symbol: "USDC",
  //     decimals: 6,
  //     address: "0x0A8714d8fc4bE1b8f2B2AB29b8e4fEe9B271a57D",
  //     isStable: true,
  //     imageUrl: "https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png?1547042389",
  //     coingeckoUrl: "https://www.coingecko.com/en/coins/usd-coin",
  //     explorerUrl: "https://sepolia.explorer.zklink.io/address/0x0A8714d8fc4bE1b8f2B2AB29b8e4fEe9B271a57D",
  //     isV1Available: true,
  //   },
  // ],
};

export const TOKEN_COLOR_MAP = {
  ETH: "#6062a6",
  BTC: "#F7931A",
  WBTC: "#F7931A",
  USDC: "#2775CA",
  "USDC.e": "#2A5ADA",
  USDT: "#67B18A",
  MIM: "#9695F8",
  FRAX: "#000",
  DAI: "#FAC044",
  UNI: "#E9167C",
  AVAX: "#E84142",
  LINK: "#3256D6",
  DOGE: "#BA9F2F",
  SOL: "#38cbc1",
  ARB: "#162c4f",
  NEAR: "#07eb98",
  BNB: "#efb90b",
  ATOM: "#6f7390",
  XRP: "#23292f",
  LTC: "#16182e",
  OP: "#ff0421",
  default: "#6062a6",
};

export const TOKENS_MAP: { [chainId: number]: { [address: string]: Token } } = {};
export const V1_TOKENS: { [chainId: number]: Token[] } = {};
export const V2_TOKENS: { [chainId: number]: Token[] } = {};
export const SYNTHETIC_TOKENS: { [chainId: number]: Token[] } = {};
export const TOKENS_BY_SYMBOL_MAP: { [chainId: number]: { [symbol: string]: Token } } = {};
export const WRAPPED_TOKENS_MAP: { [chainId: number]: Token } = {};
export const NATIVE_TOKENS_MAP: { [chainId: number]: Token } = {};

const CHAIN_IDS = [ARBITRUM, ARBITRUM_GOERLI, AVALANCHE, AVALANCHE_FUJI];

for (let j = 0; j < CHAIN_IDS.length; j++) {
  const chainId = CHAIN_IDS[j];

  TOKENS_MAP[chainId] = {};
  TOKENS_BY_SYMBOL_MAP[chainId] = {};
  SYNTHETIC_TOKENS[chainId] = [];
  V1_TOKENS[chainId] = [];
  V2_TOKENS[chainId] = [];

  let tokens = TOKENS[chainId];

  let wrappedTokenAddress: string | undefined;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    TOKENS_MAP[chainId][token.address] = token;
    TOKENS_BY_SYMBOL_MAP[chainId][token.symbol] = token;

    if (token.isWrapped) {
      WRAPPED_TOKENS_MAP[chainId] = token;
      wrappedTokenAddress = token.address;
    }

    if (token.isNative) {
      NATIVE_TOKENS_MAP[chainId] = token;
    }

    if (token.isV1Available && !token.isTempHidden) {
      V1_TOKENS[chainId].push(token);
    }

    if (!token.isPlatformToken && !token.isTempHidden) {
      V2_TOKENS[chainId].push(token);
    }

    if (token.isSynthetic) {
      SYNTHETIC_TOKENS[chainId].push(token);
    }
  }

  NATIVE_TOKENS_MAP[chainId].wrappedAddress = wrappedTokenAddress;
}

export function getSyntheticTokens(chainId: number) {
  return SYNTHETIC_TOKENS[chainId];
}

export function getWrappedToken(chainId: number) {
  return WRAPPED_TOKENS_MAP[chainId];
}

export function getNativeToken(chainId: number) {
  return NATIVE_TOKENS_MAP[chainId];
}

export function getTokens(chainId: number) {
  return TOKENS[chainId];
}

export function getV1Tokens(chainId: number) {
  return V1_TOKENS[chainId];
}

export function getV2Tokens(chainId: number) {
  return V2_TOKENS[chainId];
}

export function getTokensMap(chainId: number) {
  return TOKENS_MAP[chainId];
}

export function getWhitelistedV1Tokens(chainId: number) {
  return getV1Tokens(chainId);
}

export function getVisibleV1Tokens(chainId: number) {
  return getV1Tokens(chainId).filter((token) => !token.isWrapped);
}

export function isValidToken(chainId: number, address: string) {
  if (!TOKENS_MAP[chainId]) {
    throw new Error(`Incorrect chainId ${chainId}`);
  }
  return address in TOKENS_MAP[chainId];
}

export function getToken(chainId: number, address: string) {
  if (!TOKENS_MAP[chainId]) {
    throw new Error(`Incorrect chainId ${chainId}`);
  }
  if (!TOKENS_MAP[chainId][address]) {
    throw new Error(`Incorrect address "${address}" for chainId ${chainId}`);
  }

  return TOKENS_MAP[chainId][address];
}

export function getTokenBySymbol(
  chainId: number,
  symbol: string,
  { isSynthetic = false, version }: { isSynthetic?: boolean; version?: "v1" | "v2" } = {}
) {
  let tokens = Object.values(TOKENS_MAP[chainId]);

  if (version) {
    tokens = version === "v1" ? getV1Tokens(chainId) : getV2Tokens(chainId);
  }

  if (isSynthetic) {
    const syntheticToken = tokens.find((token) => {
      return token.symbol.toLowerCase() === symbol.toLowerCase() && token.isSynthetic;
    });
    if (syntheticToken) {
      return syntheticToken;
    }
  }
  const token =
    tokens.find((token) => token.symbol.toLowerCase() === symbol.toLowerCase()) ||
    TOKENS_BY_SYMBOL_MAP[chainId][symbol];

  if (!token) {
    throw new Error(`Incorrect symbol "${symbol}" for chainId ${chainId}`);
  }

  return token;
}

export function convertTokenAddress(chainId: number, address: string, convertTo?: "wrapped" | "native") {
  const wrappedToken = getWrappedToken(chainId);

  if (convertTo === "wrapped" && address === NATIVE_TOKEN_ADDRESS) {
    return wrappedToken.address;
  }

  if (convertTo === "native" && address === wrappedToken.address) {
    return NATIVE_TOKEN_ADDRESS;
  }

  return address;
}

export function getNormalizedTokenSymbol(tokenSymbol) {
  if (["WBTC", "WETH", "WAVAX"].includes(tokenSymbol)) {
    return tokenSymbol.substr(1);
  } else if (tokenSymbol.includes(".")) {
    return tokenSymbol.split(".")[0];
  }
  return tokenSymbol;
}

export function isChartAvailabeForToken(chainId: number, tokenSymbol: string) {
  let token;

  try {
    token = getTokenBySymbol(chainId, tokenSymbol);
  } catch (e) {
    return false;
  }

  if (token.isChartDisabled || token.isPlatformToken) return false;

  return true;
}

export function getPriceDecimals(chainId: number, tokenSymbol?: string) {
  if (!tokenSymbol) return 2;

  try {
    const token = getTokenBySymbol(chainId, tokenSymbol);
    return token.priceDecimals ?? 2;
  } catch (e) {
    return 2;
  }
}

export function getTokenBySymbolSafe(
  chainId: number,
  symbol: string,
  { isSynthetic = false, version }: { isSynthetic?: boolean; version?: "v1" | "v2" } = {}
) {
  try {
    return getTokenBySymbol(chainId, symbol, { isSynthetic, version });
  } catch (e) {
    return;
  }
}

export function isTokenInList(token: Token, tokenList: Token[]): boolean {
  return tokenList.some((t) => t.address === token.address);
}
