import { createClient } from "./utils";
import { ARBITRUM, ARBITRUM_GOERLI, AVALANCHE, AVALANCHE_FUJI, ETH_MAINNET } from "config/chains";

export const chainlinkClient = createClient(ETH_MAINNET, "chainLink");

export const arbitrumGraphClient = createClient(ARBITRUM, "stats");
export const arbitrumReferralsGraphClient = createClient(ARBITRUM, "referrals");
export const arbitrumGoerliReferralsGraphClient = createClient(ARBITRUM_GOERLI, "referrals");
export const nissohGraphClient = createClient(ARBITRUM, "nissohVault");
export const endpointGraphClient = createClient(ARBITRUM, "endpoint");

export const avalancheGraphClient = createClient(AVALANCHE, "stats");
export const avalancheReferralsGraphClient = createClient(AVALANCHE, "referrals");
export const avalancheFujiReferralsGraphClient = createClient(AVALANCHE_FUJI, "referrals");

export const arbitrumSyntheticsStatsClient = createClient(ARBITRUM, "syntheticsStats");
export const avalancheSyntheticsStatsClient = createClient(AVALANCHE, "syntheticsStats");
export const avalancheFujiSyntheticsStatsClient = createClient(AVALANCHE_FUJI, "syntheticsStats");
export const arbitrumGoerliSyntheticsStatsClient = createClient(ARBITRUM_GOERLI, "syntheticsStats");

export const arbitrumLeaderboardClient = createClient(ARBITRUM, "leaderboard");
export const avalancheLeaderboardClient = createClient(AVALANCHE, "leaderboard");
export const avalancheFujiLeaderboardClient = createClient(AVALANCHE_FUJI, "leaderboard");
export const arbitrumGoerliLeaderboardClient = createClient(ARBITRUM_GOERLI, "leaderboard");

export function getSyntheticsGraphClient(chainId: number) {
  if (chainId === ARBITRUM) {
    return arbitrumSyntheticsStatsClient;
  }

  if (chainId === AVALANCHE) {
    return avalancheSyntheticsStatsClient;
  }

  if (chainId === AVALANCHE_FUJI) {
    return avalancheFujiSyntheticsStatsClient;
  }

  if (chainId === ARBITRUM_GOERLI) {
    return arbitrumGoerliSyntheticsStatsClient;
  }

  return null;
}

export function getLeaderboardGraphClient(chainId: number) {
  if (chainId === ARBITRUM) {
    return arbitrumLeaderboardClient;
  }

  if (chainId === AVALANCHE) {
    return avalancheLeaderboardClient;
  }

  if (chainId === AVALANCHE_FUJI) {
    return avalancheFujiLeaderboardClient;
  }

  if (chainId === ARBITRUM_GOERLI) {
    return arbitrumGoerliLeaderboardClient;
  }

  return null;
}

export function getGmxGraphClient(chainId: number) {
  if (chainId === ARBITRUM) {
    return arbitrumGraphClient;
  } else if (chainId === AVALANCHE) {
    return avalancheGraphClient;
  } else if (chainId === ARBITRUM_GOERLI || chainId === AVALANCHE_FUJI) {
    return null;
  }

  throw new Error(`Unsupported chain ${chainId}`);
}

export function getReferralsGraphClient(chainId) {
  if (chainId === ARBITRUM) {
    return arbitrumReferralsGraphClient;
  } else if (chainId === AVALANCHE) {
    return avalancheReferralsGraphClient;
  } else if (chainId === AVALANCHE_FUJI) {
    return avalancheFujiReferralsGraphClient;
  } else if (chainId === ARBITRUM_GOERLI) {
    return arbitrumGoerliReferralsGraphClient;
  }
  throw new Error(`Unsupported chain ${chainId}`);
}
