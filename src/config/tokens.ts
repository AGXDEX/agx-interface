import { Token } from "domain/tokens";
import { ethers } from "ethers";
import { ARBITRUM, ARBITRUM_GOERLI, AVALANCHE, AVALANCHE_FUJI, NOVA, NOVA_SEPOLIA } from "./chains";
import { getContract } from "./contracts";

export const NATIVE_TOKEN_ADDRESS = ethers.constants.AddressZero;

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
  [ARBITRUM]: [
    {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
      address: ethers.constants.AddressZero, // ，ethers.constants.AddressZero 0x5bfbF217Fb73474319fC48aD355e79d91E69eedE
      isNative: true,
      isShortable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
      coingeckoUrl: "https://www.coingecko.com/en/coins/ethereum",
      // explorerUrl: "https://explorer.zklink.io/address/0x5bfbF217Fb73474319fC48aD355e79d91E69eedE",
      isV1Available: true,
    },
    {
      name: "Bitcoin (WBTC)",
      symbol: "BTC",
      assetSymbol: "WBTC",
      decimals: 18,
      address: "0x45d4A0E4467484d46E00b57475fe8d4394236A81",
      isShortable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/26115/thumb/btcb.png?1655921693",
      coingeckoUrl: "https://www.coingecko.com/en/coins/wrapped-bitcoin",
      explorerUrl: "https://explorer.zklink.io/address/0x45d4A0E4467484d46E00b57475fe8d4394236A81",
      isV1Available: true,
    },
    {
      name: "pufETH",
      symbol: "pufETH",
      decimals: 18,
      address: "0xE64F021d74D8803D4315696dD60E9C4213E75394",
      isShortable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/35176/large/pufETH-200-200-resolution.png?1707753174",
      coingeckoUrl: "https://www.coingecko.com/en/coins/pufeth",
      explorerUrl: "https://sepolia.explorer.zklink.io/address/0xE64F021d74D8803D4315696dD60E9C4213E75394",
      isV1Available: true,
    },
    {
      name: "ezETH",
      symbol: "ezETH",
      decimals: 18,
      address: "0xbEC6Aa5DB3E6A2Ff9865cea3f6f4CF0D9c434Da6",
      isShortable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/34753/large/Ezeth_logo_circle.png?1713496404",
      coingeckoUrl: "https://www.coingecko.com/en/coins/renzo-restaked-eth",
      explorerUrl: "https://sepolia.explorer.zklink.io/address/0xbEC6Aa5DB3E6A2Ff9865cea3f6f4CF0D9c434Da6",
      isV1Available: true,
    },
    {
      name: "Tether",
      symbol: "USDT",
      decimals: 18,
      address: "0x751Da73C410A0A0f64C143057bC5B36cfC8Ebd30",
      isShortable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/325/small/Tether-logo.png",
      coingeckoUrl: "https://www.coingecko.com/en/coins/tether",
      explorerUrl: "https://sepolia.explorer.zklink.io/address/0x751Da73C410A0A0f64C143057bC5B36cfC8Ebd30",
      isV1Available: true,
    },
    {
      name: "USD Coin",
      symbol: "USDC",
      decimals: 18,
      address: "0xD8824ca60F391aeFD38252968B67048FE8B91623",
      isStable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png?1547042389",
      coingeckoUrl: "https://www.coingecko.com/en/coins/usd-coin",
      explorerUrl: "https://sepolia.explorer.zklink.io/address/0xD8824ca60F391aeFD38252968B67048FE8B91623",
      isV1Available: true,
    },
  ],
  [NOVA]: [
    {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
      address: ethers.constants.AddressZero,
      isNative: true,
      isShortable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
      coingeckoUrl: "https://www.coingecko.com/en/coins/ethereum",
      isV1Available: true,
    },
    {
      name: "Bitcoin (WBTC)",
      symbol: "BTC",
      assetSymbol: "WBTC",
      decimals: 8,
      address: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
      isShortable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/26115/thumb/btcb.png?1655921693",
      coingeckoUrl: "https://www.coingecko.com/en/coins/wrapped-bitcoin",
      explorerUrl: "https://explorer.zklink.io/address/0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f",
      isV1Available: true,
    },
    {
      name: "pufETH",
      symbol: "pufETH",
      decimals: 8,
      address: "0xD9A442856C234a39a81a089C06451EBAa4306a72",
      isShortable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/35176/large/pufETH-200-200-resolution.png?1707753174",
      coingeckoUrl: "https://www.coingecko.com/en/coins/pufeth",
      explorerUrl: "https://explorer.zklink.io/address/0xD9A442856C234a39a81a089C06451EBAa4306a72",
    },
    {
      name: "ezETH",
      symbol: "ezETH",
      decimals: 8,
      address: "0xbf5495efe5db9ce00f80364c8b423567e58d2110",
      isShortable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/34753/large/Ezeth_logo_circle.png?1713496404",
      coingeckoUrl: "https://www.coingecko.com/en/coins/renzo-restaked-eth",
      explorerUrl: "https://explorer.zklink.io/address/0xbf5495efe5db9ce00f80364c8b423567e58d2110",
    },
  ],
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
