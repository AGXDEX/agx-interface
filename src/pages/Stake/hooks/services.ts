/* eslint-disable react/hook-use-state */
import axios from "axios";

import { STAKER_SUBGRAPH_URL, SWAP_SUBGRAPH_URL } from "config/subgraph";

export const fetchStakedAGXs = async (account) => {
  const query = `
    query($account: String!) {
      stakeAGXs(where: {owner: $account}) {
        id
        owner
        period
        startTime
        amount
      }
    }
  `;
  const response = await fetch(STAKER_SUBGRAPH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: { account },
    }),
  });
  const { data } = await response.json();
  data.stakeAGXs.reverse()
  return data.stakeAGXs;
};

export const fetchPositions = async ({ queryKey }) => {
  const [, account] = queryKey;
  if (!account) return;

  const response = await axios.post(STAKER_SUBGRAPH_URL, {
    query: `{
      positions(where: { owner: "${account}" }) {
        tokenId
        owner
        staked
        liquidity
      }
    }`,
  });

  return response.data.data.positions;
};

export const fetchNFTData = async (account) => {
  const { data } = await axios.post(STAKER_SUBGRAPH_URL, {
    query: `{
      nfts(where: {owner: "${account}"}) {
        tokenId
        owner
      }
    }`,
  });

  return data.data.nfts.map((item) => Number(item.tokenId));
};

export const fetchStakeLiquidity = async () => {
  const { data } = await axios.post(STAKER_SUBGRAPH_URL, {
    query: `{
      incentives {
        liquidity
      }
    }`,
  });

  return data.data.incentives[0].liquidity;
};

export const fetchNFTClaimed = async () => {
  const { data } = await axios.post(STAKER_SUBGRAPH_URL, {
    query: `{
      incentives {
        id
        liquidity
        claimedToken
      }
    }`,
  });

  return data.data.incentives[0].claimedToken;
};

export const fetchTotalReward = async (account) => {
  const { data } = await axios.post(STAKER_SUBGRAPH_URL, {
    query: `{
      totalRewards(where: {owner: "${account}"}) {
        owner
        reward
      }
    }`,
  });

  return data.data.totalRewards[0]?.reward;
};

export const fetchPoolData = async (poolAddress) => {
  if (!poolAddress) return null;

  const { data } = await axios.post(SWAP_SUBGRAPH_URL, {
    query: `{
      pool(id: "${poolAddress.toLowerCase()}") {
        token0 { id }
        token1 { id }
        liquidity
        totalValueLockedToken0
        totalValueLockedToken1
      }
    }`,
  });

  return data.data.pool;
};
