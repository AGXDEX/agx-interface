/* eslint-disable react/hook-use-state */
import { Trans, t } from "@lingui/macro";
import { useState, useMemo } from "react";
import _ from "lodash";

import { toByteArray } from "base64-js";

import cx from "classnames";
import { useHistory } from "react-router-dom";

import GlpManager from "abis/GlpManager.json";
import ReaderV2 from "abis/ReaderV2.json";
import Vault from "abis/Vault.json";
import YieldTracker from "abis/YieldTracker.json";
import UniV3Staker from "abis/UniV3Staker.json";
import UniswapV3Factory from "abis/UniswapV3Factory.json";
import DexReader from "abis/DexReader.json";
import VaultV2 from "abis/VaultV2.json";
import YieldEmission from "abis/YieldEmission.json";

import { ARBITRUM, getConstant } from "config/chains";
import { useAGXPrice } from "domain/legacy";
import { BigNumber, Contract, ethers } from "ethers";
import { GLP_DECIMALS, PLACEHOLDER_ACCOUNT, USD_DECIMALS } from "lib/legacy";

import useSWR from "swr";

import { getContract } from "config/contracts";

import Button from "components/Button/Button";
import TooltipWithPortal from "components/Tooltip/TooltipWithPortal";
import { useChainId } from "lib/chains";
import { callContract, contractFetcher } from "lib/contracts";
import { bigNumberify, expandDecimals, formatAmount, parseValue } from "lib/numbers";
import "./StakeV2.css";
import useWallet from "lib/wallets/useWallet";
import PageTitle from "components/PageTitle/PageTitle";
import { usePendingTxns } from "lib/usePendingTxns";
import axios from "axios";
import { getV1Tokens, getWhitelistedV1Tokens } from "config/tokens";
import { getTokenBySymbol } from "config/tokens";
import { getTokenInfo } from "domain/tokens/utils";

import { useInfoTokens } from "domain/tokens";
import { getBuyGlpFromAmount } from "lib/legacy";

import { getEmissionData, calculateManage } from "./utilts";

import { DepositTooltipContent } from "components/Synthetics/MarketsList/DepositTooltipContent";

import { ClaimAllModal, ClaimHistoryModal, DepositModal, UnstakeModal } from "./components/modals";

import noNFT from "img/noNFT.svg";
import { STAKER_SUBGRAPH_URL, SWAP_SUBGRAPH_URL } from "config/subgraph";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { cn } from "utils/classname";
import StakingModal from "./components/staking-modal";

const EXTERNAL_LINK_CHAIN_CONFIG = process.env.REACT_APP_ENV === "development" ? "nova_sepolia" : "nova_mainnet";

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

const fetchTotalReward = async (account) => {
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

const fetchPoolData = async (poolAddress) => {
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

export default function StakeV2() {
  const queryClient = useQueryClient();
  const { active, signer, account } = useWallet();
  const { chainId } = useChainId();
  const [, setPendingTxns] = usePendingTxns();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isClaimHistoryModalVisible, setIsClaimHistoryModalVisible] = useState(false);
   const [isStakingModalVisible, setIsStakingModalVisible] = useState(false);
  const [depositModalVisible, setDepositModalVisible] = useState(false);
  const [claimModalVisible, setClaimModalVisible] = useState(false);
  const [stakeModalMaxAmount, setStakeModalMaxAmount] = useState<BigNumber | undefined>(undefined);
  const [stakeValue, setStakeValue] = useState("");
  const [stakingTokenSymbol, setStakingTokenSymbol] = useState("");
  const [stakingTokenAddress, setStakingTokenAddress] = useState("");
  const [stakingFarmAddress, setStakingFarmAddress] = useState("");
  const [stakeMethodName, setStakeMethodName] = useState("");

  const [selectTab, setselectTab] = useState("Pool2");
  const [isUnstaking, setIsUnstakeLoading] = useState(false);
  const [isStaking, setIsStaking] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const rewardRouterAddress = getContract(chainId, "RewardRouter");
  const readerAddress = getContract(chainId, "Reader");

  const EthPoolAddress = getContract(chainId, "UniswapAGXEthPool");
  const vaultAddress = getContract(chainId, "Vault");
  const gmxAddress = getContract(chainId, "GMX");

  const stakedGmxTrackerAddress = getContract(chainId, "StakedGmxTracker");

  const glpManagerAddress = getContract(chainId, "GlpManager");

  const yieldTrackerAddress = getContract(chainId, "YieldTracker");
  const dexreaderAddress = getContract(chainId, "dexreader");
  const uniV3StakerAddress = getContract(chainId, "v3StakerAddress");
  const v3FactoryAddress = getContract(chainId, "v3Factory");
  const IncentiveKeyAddress = getContract(chainId, "IncentiveKey");
  const AGXAddress = getContract(chainId, "AGX");
  const wethAddress = getContract(chainId, "WethSwap");

  const nativeTokenSymbol = getConstant(chainId, "nativeTokenSymbol");
  const wrappedTokenSymbol = getConstant(chainId, "wrappedTokenSymbol");

  const { data: aums } = useSWR([`StakeV2:getAums:${active}`, chainId, glpManagerAddress, "getAums"], {
    fetcher: contractFetcher(signer, GlpManager),
  });
  const { data: startTime } = useSWR([`StakeV2:startTime:${active}`, chainId, yieldTrackerAddress, "startTime"], {
    fetcher: contractFetcher(signer, YieldEmission),
  });
  const { data: totalClaimed } = useSWR([`StakeV2:totalClaim:${active}`, chainId, yieldTrackerAddress, "totalClaim"], {
    fetcher: contractFetcher(signer, YieldEmission),
  });
  const { data: rewards } = useSWR([`StakeV2:claimable:${active}`, chainId, yieldTrackerAddress, "claimable"], {
    fetcher: contractFetcher(signer, YieldTracker, [account]),
  });

  const emissionData = getEmissionData(Number(startTime?.toString()));

  let hasMultiplierPoints = false;

  const showDepositModals = () => {
    if (NFTlist.length > 0) {
      setDepositModalVisible(true);
    }
  };
  const showStakeGmxModals = () => {
    setStakeValue("");
    setStakingTokenSymbol("AGX");
    setStakingTokenAddress(gmxAddress);
    setStakingFarmAddress(stakedGmxTrackerAddress);
    setStakeMethodName("stakeGmx");
  };

  const onClickPrimary = () => {
    setClaimModalVisible(true);
  };

  const { data: NFTData } = useQuery({
    queryKey: ["NFTData", account],
    queryFn: () => fetchNFTData(account),
    enabled: !!account,
  });

  const { data: stakeliquidity } = useQuery({
    queryKey: ["stakeliquidity"],
    queryFn: fetchStakeLiquidity,
  });

  const { data: NFTClaimed } = useQuery({
    queryKey: ["NFTClaimed"],
    queryFn: fetchNFTClaimed,
  });

  const { data: totalReward } = useQuery({
    queryKey: ["totalReward", account],
    queryFn: () => fetchTotalReward(account),
    enabled: !!account,
  });

  const fetchClaimHistories = async ({ queryKey }) => {
    const [, account] = queryKey;
    const response = await axios.post(STAKER_SUBGRAPH_URL, {
      query: `{
      claimHistories(
        where: { owner: "${account}" }
        orderDirection: desc
        orderBy: blockTimestamp
      ) {
        type
        transactionHash
        blockTimestamp
        amount
      }
    }`,
    });
    return response.data.data.claimHistories;
  };

  const { data: claimHistories } = useQuery({
    queryKey: ["claimHistories", account],
    queryFn: fetchClaimHistories,
    enabled: !!account,
  });

  const { data: positionsData } = useQuery({
    queryKey: ["positions", account],
    queryFn: fetchPositions,
    enabled: !!account,
    refetchOnWindowFocus: false,
    select: (positions) => {
      const tokenIdArray = positions.map((item) => item.tokenId);
      return {
        positions,
        tokenIdArray,
      };
    },
  });

  const { positions: positionsAll, tokenIdArray: postionTokenIds } = positionsData || {};

  const fetchSpecificNftIds = async () => {
    if (!signer || !dexreaderAddress) return;

    const dexReaderContract = new Contract(dexreaderAddress, DexReader.abi, signer);
    const result = await dexReaderContract.getSpecificNftIds(postionTokenIds, AGXAddress, wethAddress);
    return result;
  };

  const { data: depNFTlist, refetch: refetchDepNFTlist } = useQuery({
    queryKey: [`StakeV2:getDepositSpecificNftId:${active}`, chainId, dexreaderAddress],
    queryFn: fetchSpecificNftIds,
    enabled: !!signer && !!dexreaderAddress && !!postionTokenIds,
    refetchOnWindowFocus: false,
  });

  const filteredDepNFTlists =
    depNFTlist &&
    positionsAll?.filter((it) => {
      return depNFTlist.some((i) => {
        return i.toNumber() == Number(it.tokenId);
      });
    });

  const stakedTokens = (depNFTlist && filteredDepNFTlists?.filter((nft) => nft.staked).map((nft) => nft.tokenId)) || [];

  const fetchRewardInfos = async ({ queryKey }) => {
    const [, , , stakedTokens] = queryKey;
    if (!signer || !dexreaderAddress) return;

    const dexReaderContract = new Contract(dexreaderAddress, DexReader.abi, signer);
    const result = await dexReaderContract.getRewardInfos(IncentiveKeyAddress, stakedTokens);
    return result;
  };

  const { data: stakedRewardInfos } = useQuery({
    queryKey: [`StakeV2:getRewardInfos:${active}`, chainId, dexreaderAddress, stakedTokens, "getRewardInfos"],
    queryFn: fetchRewardInfos,
    enabled: !!signer && !!dexreaderAddress && !!stakedTokens,
    refetchInterval: 10000,
  });

  const fetchDepBaselist = async ({ queryKey }) => {
    const [, , dexreaderAddress] = queryKey;
    if (!signer || !DexReader || !postionTokenIds || !dexreaderAddress) return [];

    const dexReaderContract = new Contract(dexreaderAddress, DexReader.abi, signer);
    const tokenIds = postionTokenIds.map((i) => Number(i));
    const result = await dexReaderContract.getTokenURIs(tokenIds);
    return result;
  };
  const { data: depBaselist, isLoading: isDepBaseListLoading } = useQuery({
    queryKey: [`StakeV2:getDepositedTokenURIs:${active}`, chainId, dexreaderAddress, "getTokenURIs"],
    queryFn: fetchDepBaselist,
    enabled: !!signer && !!dexreaderAddress && !!postionTokenIds,
    refetchOnWindowFocus: false,
  });

  const depUrlList = useMemo(() => {
    if (!filteredDepNFTlists || !depBaselist || !depBaselist[0]) return [];

    return filteredDepNFTlists.map((it) => {
      const tokenId = Number(it.tokenId);
      const baseIndex = depBaselist[1]?.findIndex((id) => Number(id) === tokenId);
      const base = depBaselist[0]?.[baseIndex];

      if (!base) return {};

      const decodedBase = new TextDecoder().decode(toByteArray(base.split(",")[1]));
      return JSON.parse(decodedBase);
    });
  }, [filteredDepNFTlists, depBaselist]);

  const rewardInfos = stakedRewardInfos?.length
    ? stakedRewardInfos.map((_, index) => ({
        reward: Number(formatAmount(stakedRewardInfos[0][index], 18, 2, true)),
        tokenId: Number(stakedRewardInfos[1][index]?.toString()),
      }))
    : [];
  const tokenIds = rewardInfos.length ? rewardInfos.map((x) => x.tokenId) : [];
  const tokenRewards = rewardInfos.length ? rewardInfos.map((x) => x.reward) : [];

  const mergedDepNFTlists = filteredDepNFTlists?.length
    ? filteredDepNFTlists.map((nft) => {
        const index = tokenIds.indexOf(parseInt(nft.tokenId, 10));
        return index !== -1 ? { ...nft, reward: tokenRewards[index] } : nft;
      })
    : [];
  const fetchNftIds = async ({ queryKey }) => {
    const [, , dexreaderAddress] = queryKey;
    if (!signer || !dexreaderAddress) return;

    const dexReaderContract = new Contract(dexreaderAddress, DexReader.abi, signer);
    const result = await dexReaderContract.getSpecificNftIds(NFTData, AGXAddress, wethAddress);
    return result;
  };
  const { data: NFTlist } = useQuery({
    queryKey: [`StakeV2:getSpecificNftIds:${active}`, chainId, dexreaderAddress],
    queryFn: fetchNftIds,
    enabled: !!signer && !!dexreaderAddress,
    refetchOnWindowFocus: false,
  });
  const fetchTokenURIs = async ({ queryKey }) => {
    const [, , dexreaderAddress, NFTlist] = queryKey;
    if (!signer || !dexreaderAddress || !NFTlist) return;

    const dexReaderContract = new Contract(dexreaderAddress, DexReader.abi, signer);
    const result = await dexReaderContract.getTokenURIs(NFTlist.map((i) => Number(i)));
    return result;
  };
  const { data: baselist } = useQuery({
    queryKey: [`StakeV2:getTokenURIs:${active}`, chainId, dexreaderAddress, NFTlist],
    queryFn: fetchTokenURIs,
    enabled: !!signer && !!dexreaderAddress && !!NFTlist,
    refetchOnWindowFocus: false,
  });
  const urlList = useMemo(() => {
    if (!NFTlist || !baselist || !baselist[0]) return [];

    return NFTlist.map((id) => {
      const baseIndex = baselist[1]?.findIndex((baseId) => Number(baseId) === Number(id));
      const base = baselist[0]?.[baseIndex];

      if (!base) return {};

      const decodedBase = new TextDecoder().decode(toByteArray(base.split(",")[1]));
      return JSON.parse(decodedBase);
    });
  }, [NFTlist, baselist]);

  const fetchPool2Rewards = async () => {
    if (!signer || !uniV3StakerAddress || !account) return null;
    const contract = new Contract(uniV3StakerAddress, UniV3Staker.abi, signer);
    return contract.rewards(AGXAddress, account);
  };

  const { data: Pool2Rewards } = useQuery({
    queryKey: [`StakeV2:rewards:${active}`, chainId, uniV3StakerAddress, AGXAddress, account, "rewards"],
    queryFn: fetchPool2Rewards,
    enabled: !!signer && !!uniV3StakerAddress && !!account,
    refetchInterval: 10000,
  });
  const { data: Pooladdress } = useSWR([`StakeV2:getPool:${active}`, chainId, v3FactoryAddress, "getPool"], {
    fetcher: contractFetcher(signer, UniswapV3Factory, [AGXAddress, EthPoolAddress, 10000]),
  });
  const fetchRewardRate = async () => {
    if (!signer || !yieldTrackerAddress) return null;
    const contract = new Contract(yieldTrackerAddress, YieldEmission.abi, signer);
    return contract.rewardRate();
  };
  const { data: rewardRate } = useQuery({
    queryKey: [`StakeV2:rewardRate:${active}`, chainId, yieldTrackerAddress, "rewardRate"],
    queryFn: fetchRewardRate,
    enabled: !!signer && !!yieldTrackerAddress,
    refetchInterval: 10000,
  });
  const { agxPrice } = useAGXPrice();
  const ethAddress = getTokenBySymbol(ARBITRUM, "WETH").address;
  const { data: ethPrice, mutate: updateEthPrice } = useSWR<BigNumber>(
    [`StakeV3:ethPrice`, ARBITRUM, vaultAddress, "getMinPrice", ethAddress],
    {
      fetcher: contractFetcher(undefined, Vault) as any,
    }
  );

  const stakeFn = async (tokenId) => {
    setIsStaking(true);
    setSelectedCard(tokenId);
    try {
      const contract = new ethers.Contract(uniV3StakerAddress, UniV3Staker.abi, signer);
      await callContract(chainId, contract, "stakeToken", [IncentiveKeyAddress, tokenId], {
        sentMsg: t`Stake submitted.`,
        failMsg: t`Stake failed.`,
        successMsg: t`Stake completed!`,
        setPendingTxns,
      });
      queryClient.setQueryData(["positions", account], (prevPositionsData: any) => {
        const updatedPositions = prevPositionsData.map((position) => {
          if (Number(position.tokenId) === tokenId) {
            return {
              ...position,
              staked: true,
            };
          }
          return position;
        });
        return updatedPositions;
      });
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsStaking(false);
      setSelectedCard(null);
    }
  };

  const withdrawFn = async (tokenId) => {
    setIsWithdrawing(true);
    setSelectedCard(tokenId);
    try {
      const contract = new ethers.Contract(uniV3StakerAddress, UniV3Staker.abi, signer);
      await callContract(chainId, contract, "withdrawToken", [tokenId, account, "0x"], {
        sentMsg: t`Withdraw submitted.`,
        failMsg: t`Withdraw failed.`,
        successMsg: t`Withdraw completed!`,
        setPendingTxns,
      });
      queryClient.setQueryData(
        [`StakeV2:getSpecificNftIds:${active}`, chainId, dexreaderAddress],
        (prevNFTlist: any) => {
          const formattedTokenId = ethers.BigNumber.from(tokenId);
          if (prevNFTlist) {
            if (!prevNFTlist.includes(formattedTokenId)) {
              return [...prevNFTlist, formattedTokenId];
            }
          } else {
            return [formattedTokenId];
          }
          return prevNFTlist;
        }
      );
      queryClient.setQueryData(
        [`StakeV2:getTokenURIs:${active}`, chainId, dexreaderAddress, NFTlist],
        (prevNFTlist: any) => {
          const formattedId = ethers.BigNumber.from(tokenId);
          if (prevNFTlist) {
            const updatedList = prevNFTlist[1].map((tId) => tId);
            if (!updatedList.some((tId) => tId.eq(formattedId))) {
              updatedList.push(formattedId);
              const tokenIndex = updatedList.findIndex((tId) => tId.eq(formattedId));
              const selectedDepBase = depBaselist[tokenIndex];
              return [[...prevNFTlist[0], selectedDepBase], updatedList];
            }
          } else {
            return [prevNFTlist[0], [formattedId]];
          }
          return prevNFTlist;
        }
      );
      queryClient.setQueryData(
        [`StakeV2:getDepositSpecificNftId:${active}`, chainId, dexreaderAddress],
        (prevNFTlist: any) => {
          return prevNFTlist?.filter((tId) => Number(tId.toString()) !== Number(tokenId));
        }
      );
      queryClient.setQueryData(["positions", account], (prevPositionsData: any) => {
        const updatedPositions = prevPositionsData.filter(
          (position: any) => Number(position.tokenId) !== Number(tokenId)
        );
        return updatedPositions;
      });
    } catch (error) {
      console.log("Error withdrawing token:", error);
    } finally {
      setIsWithdrawing(false);
      setSelectedCard(null);
    }
  };

  const unstakeFn = async (tokenId) => {
    setIsUnstakeLoading(true);
    setSelectedCard(tokenId);

    try {
      const contract = new ethers.Contract(uniV3StakerAddress, UniV3Staker.abi, signer);
      await callContract(chainId, contract, "unstakeToken", [IncentiveKeyAddress, tokenId], {
        sentMsg: t`Unstake submitted.`,
        failMsg: t`Unstake failed.`,
        successMsg: t`Unstake completed!`,
        setPendingTxns,
      });
      queryClient.setQueryData(["positions", account], (prevPositionsData: any) => {
        const updatedPositions = prevPositionsData.map((position) => {
          if (Number(position.tokenId) === tokenId) {
            return {
              ...position,
              staked: false,
            };
          }
          return position;
        });
        return updatedPositions;
      });
    } catch (error) {
      console.log("Error unstaking token:", error);
    } finally {
      setIsUnstakeLoading(false);
      setSelectedCard(null);
    }
  };
  const { data: totalTokenWeights } = useSWR(
    [`GlpSwap:totalTokenWeights:${active}`, chainId, vaultAddress, "totalTokenWeights"],
    {
      fetcher: contractFetcher(signer, VaultV2),
    }
  );
  const feeGlp = getContract(chainId, "GLP");
  const usdgAddress = getContract(chainId, "USDG");
  const tokensForBalanceAndSupplyQuery = [feeGlp, usdgAddress];
  const { data: balancesAndSupplies } = useSWR(
    [
      `GlpSwap:getTokenBalancesWithSupplies:${active}`,
      chainId,
      readerAddress,
      "getTokenBalancesWithSupplies",
      account || PLACEHOLDER_ACCOUNT,
    ],
    {
      fetcher: contractFetcher(signer, ReaderV2, [tokensForBalanceAndSupplyQuery]),
    }
  );
  const usdgSupply = balancesAndSupplies ? balancesAndSupplies[3] : bigNumberify(0);
  const glpSupply = balancesAndSupplies ? balancesAndSupplies[1] : bigNumberify(0);
  let aum1;
  if (aums && aums.length > 0) {
    aum1 = aums[0];
  }
  const glpPrice =
    aum1 && aum1.gt(0) && glpSupply.gt(0)
      ? aum1.mul(expandDecimals(1, GLP_DECIMALS)).div(glpSupply)
      : expandDecimals(1, USD_DECIMALS);
  const glpSupplyUsd = glpSupply.mul(glpPrice).div(expandDecimals(1, GLP_DECIMALS));
  const tokens = getV1Tokens(chainId);
  const tokenAddresses = tokens.map((token) => token.address);
  const { data: tokenBalances } = useSWR(
    [`GlpSwap:getTokenBalances:${active}`, chainId, readerAddress, "getTokenBalances", account || PLACEHOLDER_ACCOUNT],
    {
      fetcher: contractFetcher(signer, ReaderV2, [tokenAddresses]),
    }
  );
  const { infoTokens } = useInfoTokens(signer, chainId, active, tokenBalances, undefined);
  const [glpValue, setGlpValue] = useState("");
  const glpAmount = parseValue(glpValue, GLP_DECIMALS);

  const whitelistedTokens = getWhitelistedV1Tokens(chainId);
  const tokenList = whitelistedTokens.filter((t) => !t.isWrapped);
  const visibleTokens = tokenList.filter((t) => !t.isTempHidden);

  const history = useHistory();
  const selectToken = (token) => {
    history.push("/buy");
  };

  const totalUserStakedLiquidity = positionsAll
    ?.filter((entry) => entry && typeof entry.liquidity !== "undefined")
    .reduce((sum, { liquidity }) => sum + BigInt(liquidity), BigInt(0));

  const calculatePoolValues = (poolData, agxPrice, ethPrice, stakeliquidity) => {
    if (!poolData) return null;

    const { token0, token1, liquidity, totalValueLockedToken0, totalValueLockedToken1 } = poolData;
    const isAGXToken0 = _.toLower(token0.id) === _.toLower(AGXAddress);
    const totalValueLocked = _.map([totalValueLockedToken0, totalValueLockedToken1], _.toNumber);

    const poolValue = _.defaultTo(
      totalValueLocked[isAGXToken0 ? 0 : 1] * agxPrice + (totalValueLocked[isAGXToken0 ? 1 : 0] * ethPrice) / 1e30,
      0
    );
    const AGXVFTValue = _.defaultTo((stakeliquidity / liquidity) * totalValueLocked[isAGXToken0 ? 0 : 1], 0);
    const stakeAllValue = _.defaultTo((poolValue * stakeliquidity) / liquidity, 0);
    const stakeAPRValue =
      stakeliquidity === 0 ? "0" : _.defaultTo((((agxPrice * 2e7) / stakeAllValue) * 100).toFixed(2), "0");

    return {
      poolValue,
      AGXVFTValue: AGXVFTValue.toFixed(2),
      stakeAllValue,
      stakeAPRValue,
    };
  };

  const { data: poolData } = useQuery({
    queryKey: ["poolData", Pooladdress],
    queryFn: () => fetchPoolData(Pooladdress),
    enabled: !!Pooladdress,
    refetchInterval: 60000,
    select: (data) => calculatePoolValues(data, agxPrice, ethPrice, stakeliquidity),
  });
  const { poolValue, AGXVFTValue, stakeAPRValue } = poolData || {};
  const stakedAGXAmount = (
    (Number(totalUserStakedLiquidity) * Number(AGXVFTValue?.replace(/,/g, "") ?? "0")) /
    Number(stakeliquidity)
  ).toFixed(2);

  const userStakedAGXAmount = stakedAGXAmount === "NaN" ? "0.00" : stakedAGXAmount;
  const formattedPoolValue = isNaN(poolValue || 0) ? 0 : poolValue;

  return (
    <div className="default-container page-layout">
      <ClaimHistoryModal
        isVisible={isClaimHistoryModalVisible}
        setIsVisible={setIsClaimHistoryModalVisible}
        data={claimHistories}
      />
      <UnstakeModal isVisible={false} />
      <StakingModal isVisible={isStakingModalVisible} setIsVisible={setIsStakingModalVisible} data={claimHistories} />
      <ClaimAllModal
        isVisible={claimModalVisible}
        setIsVisible={setClaimModalVisible}
        chainId={chainId}
        title="Claim"
        maxAmount={stakeModalMaxAmount}
        value={stakeValue}
        setValue={setStakeValue}
        active={active}
        account={account}
        signer={signer}
        stakingTokenSymbol={stakingTokenSymbol}
        stakingTokenAddress={stakingTokenAddress}
        farmAddress={stakingFarmAddress}
        rewardRouterAddress={rewardRouterAddress}
        stakeMethodName={stakeMethodName}
        hasMultiplierPoints={hasMultiplierPoints}
        setPendingTxns={setPendingTxns}
        nativeTokenSymbol={nativeTokenSymbol}
        wrappedTokenSymbol={wrappedTokenSymbol}
        showNFTdata={NFTlist}
        URLlist={urlList}
        Pool2Rewards={Pool2Rewards}
        rewards={rewards}
      />
      <DepositModal
        isVisible={depositModalVisible}
        setIsVisible={setDepositModalVisible}
        chainId={chainId}
        title="Choose your AGX-ETH NFT"
        maxAmount={stakeModalMaxAmount}
        value={stakeValue}
        setValue={setStakeValue}
        active={active}
        account={account}
        signer={signer}
        stakingTokenSymbol={stakingTokenSymbol}
        stakingTokenAddress={stakingTokenAddress}
        farmAddress={stakingFarmAddress}
        rewardRouterAddress={rewardRouterAddress}
        stakeMethodName={stakeMethodName}
        hasMultiplierPoints={hasMultiplierPoints}
        setPendingTxns={setPendingTxns}
        nativeTokenSymbol={nativeTokenSymbol}
        wrappedTokenSymbol={wrappedTokenSymbol}
        showNFTdata={NFTlist}
        URLlist={urlList}
        depBaselist={depBaselist}
        baseUriList={baselist}
        refetchDepNFTlist={refetchDepNFTlist}
      />
      <div className="box-padding">
        <PageTitle
          isTop
          title={t`Earn`}
          subtitle={
            <div>
              <Trans>Earn reward from trading fees and liquidity mining</Trans>
            </div>
          }
        />
        <div className="App-card App-card-space-between StakeV2-content">
          <div className="StakeV2-title">AGX Statistics</div>
          <div className="StakeV2-box">
            <div className="StakeV2-totalBox">
              <div className="StakeV2-tit">Total Emissions</div>
              <div>{emissionData?.totalEmissions}</div>
            </div>
            <div className="StakeV2-totalBox">
              <div className="StakeV2-tit">Total Claimed</div>
              <div>
                {NFTClaimed &&
                  Number((Number(totalClaimed) / 10 ** 18 + Number(NFTClaimed) / 10 ** 18).toFixed(2)).toLocaleString()}
              </div>
            </div>
            <div className="StakeV2-totalBox">
              <div className="StakeV2-tit">
                <TooltipWithPortal
                  renderContent={() => {
                    return (
                      <div className="flex-col space-y-3">
                        <div>
                          Under Fair Launch Mode, the AGX Token release decrease every week follow up with the formula.
                        </div>
                        <div
                          className="underline cursor-pointer"
                          onClick={() => {
                            window.open("https://docs.agx.xyz/");
                          }}
                        >
                          Read more
                        </div>
                      </div>
                    );
                  }}
                >
                  Current Emisions
                </TooltipWithPortal>
              </div>
              <div>
                {rewardRate && Number(((Number(rewardRate) / 10 ** 18) * 86400 + 59523).toFixed(2)).toLocaleString()}
                /day
              </div>
            </div>
            <Button variant="secondary" to="/buy" className="StakeV2-button">
              <Trans>Buy</Trans>
            </Button>
          </div>
        </div>

        <div className="App-card App-card-space-between StakeV2-content">
          <div className="StakeV2-title">Claimable Rewards</div>
          <div className="StakeV2-box">
            <div className="StakeV2-claimBox">
              <TooltipWithPortal
                renderContent={() => {
                  return <>Claimable USDT = Claimable AGX * Current Prices</>;
                }}
              >
                <div className="StakeV2-claimNum">
                  {agxPrice && Pool2Rewards && rewards
                    ? Number(
                        ((Number(Pool2Rewards) / 10 ** 18 + Number(rewards) / 10 ** 18) * agxPrice).toFixed(2)
                      ).toLocaleString()
                    : 0}
                </div>
                <div className="StakeV2-claimToken">USDT</div>
              </TooltipWithPortal>
            </div>
            <div className="StakeV2-claimBox">
              <div className="StakeV2-claimNum">
                {Pool2Rewards && rewards
                  ? Number((Number(Pool2Rewards) / 10 ** 18 + Number(rewards) / 10 ** 18).toFixed(2)).toLocaleString()
                  : 0}
              </div>
              <div className="StakeV2-claimToken">AGX</div>
            </div>
            <div className="w-full flex justify-start items-center space-x-5">
              <Button
                variant="secondary"
                className="p-2.5 px-5 !bg-[#5D00FB] max-w-[80px] w-full"
                onClick={onClickPrimary}
                disabled={!rewards}
              >
                Claim
              </Button>
              <span
                className="cursor-pointer"
                onClick={() => {
                  setIsClaimHistoryModalVisible(true);
                }}
              >
                Claim History {`>`}
              </span>
            </div>
          </div>
        </div>

        <div className="App-card App-card-space-between StakeV2-content">
          <div className="StakeV2-title">Accumlate Points</div>
          <div className="StakeV2-box">
            <div className="flex w-full items-center">
              <div className="StakeV2-claimNum">0.0</div>
              <div className="flex h-full pb-5 items-end pl-4">Eigen Layer Points</div>
            </div>
            <div className="flex w-full items-center">
              <div className="StakeV2-claimNum">0.0</div>
              <div className="flex h-full pb-5 items-end pl-4">Puffer Points</div>
            </div>
            <div className="flex w-full items-center">
              <div className="StakeV2-claimNum">0.0</div>
              <div className="flex h-full pb-5 items-end pl-4">Zklink Points</div>
            </div>
          </div>
        </div>

        <div className="App-card App-card-space-between StakeV2-content">
          <div className="tabBox">
            <div className={cx("tab", { active: selectTab === "Pool2" })} onClick={() => setselectTab("Pool2")}>
              Pool2 Mining
            </div>
            <div className={cx("tab", { active: selectTab === "Liquidity" })} onClick={() => setselectTab("Liquidity")}>
              Liquidity Mining
            </div>
            <div className={cx("tab", { active: selectTab === "Staking" })} onClick={() => setselectTab("Staking")}>
              Staking
            </div>
          </div>
          <div className={cx("StakeV2-box between", { ishide: selectTab === "Liquidity" })}>
            <div className="halfBox">
              <div className="StakeV2-stakeTitle padLeft">Overview</div>
              <div className={cx("mobileBox", { ishide: selectTab !== "Staking", show: selectTab === "Staking" })}>
                <div className="StakeV2-fomBox">
                  <div className="StakeV2-tit">APR</div>
                  <div>0</div>
                </div>
                <div className="StakeV2-fomBox">
                  <div className="StakeV2-tit">Stake APR</div>
                  <div>0</div>
                </div>
                <div className="StakeV2-fomBox">
                  <div className="StakeV2-tit">Staked AGX</div>
                  <div>0</div>
                </div>
                <div className="StakeV2-fomBox">
                  <div className="StakeV2-tit">Total Staking Reward</div>
                  <div>0</div>
                </div>
              </div>
              <div className={cx("mobileBox", { ishide: selectTab !== "Pool2", show: selectTab === "Pool2" })}>
                <div className="StakeV2-fomBox">
                  <div className="StakeV2-tit">APR</div>
                  <div>
                    {stakeAPRValue === "NaN" || !isFinite(Number(stakeAPRValue))
                      ? "0.00%"
                      : `${Number(stakeAPRValue).toLocaleString()}%`}
                  </div>
                </div>
                <div className="StakeV2-fomBox">
                  <div className="StakeV2-tit">Stake AGX in LP NFT:</div>
                  <div>{Number(AGXVFTValue).toLocaleString()}</div>
                </div>
                <div className="StakeV2-fomBox">
                  <div className="StakeV2-tit">TVL</div>
                  <div>${Number(formattedPoolValue?.toFixed(2)).toLocaleString()}</div>
                </div>
              </div>
            </div>
            <div className="halfBox">
              <div className="StakeV2-stakeTitle padLeft">My Data</div>
              <div className={cx("mobileBox", { ishide: selectTab !== "Staking", show: selectTab === "Staking" })}>
                <div className="StakeV2-fomBox">
                  <div className="StakeV2-tit">AGX</div>
                  <div>0</div>
                </div>
                <div className="StakeV2-fomBox">
                  <div className="StakeV2-tit">Staked AGX</div>
                  <div>0</div>
                </div>
                <div className="StakeV2-fomBox">
                  <div className="StakeV2-tit">Total Reward</div>
                  <div>0</div>
                </div>
                <div className="StakeV2-fomBox">
                  <div className="StakeV2-tit">Claimable Rewards</div>
                  <div>0</div>
                </div>
              </div>
              <div className={cx("mobileBox", { ishide: selectTab !== "Pool2", show: selectTab === "Pool2" })}>
                <div className="StakeV2-fomBox">
                  <div className="StakeV2-tit">Staked AGX in LP NFT</div>
                  <div>{userStakedAGXAmount}</div>
                </div>
                <div className="StakeV2-fomBox">
                  <div className="StakeV2-tit">Total Reward</div>
                  <div>
                    {(isNaN(Number(totalReward)) ? 0 : Number(totalReward) / 10 ** 18).toFixed(2).toLocaleString()}
                  </div>
                </div>
                <div className="StakeV2-fomBox">
                  <div className="StakeV2-tit">Claimable Rewards</div>
                  <div>{Pool2Rewards && (Number(Pool2Rewards) / 10 ** 18).toFixed(2).toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={cx("StakeV2-box marBottom", {
              ishide: selectTab !== "Staking",
              isShow: selectTab === "Staking",
            })}
          >
            <div className="StakeV2-stakeTitle padLeft">Stake AGX</div>
            <Button variant="secondary" className="StakeV2-stakeButton" onClick={() => setIsStakingModalVisible(true)}>
              <Trans>Stake AGX</Trans>
            </Button>
          </div>
          <div className="tolong">
            <div
              className={cx(
                "StakeV2-box marBottom",
                { ishide: selectTab !== "Pool2" },
                { isShow: selectTab === "Pool2" }
              )}
            >
              <div className="StakeV2-stakeTitle padLeft">Stake AGX-ETH LP</div>
              <Button
                variant="secondary"
                className={cx("StakeV2-stakeButton", { "StakeV2-disabledButton": !NFTlist || NFTlist.length === 0 })}
                onClick={() => showDepositModals()}
                disabled={!NFTlist || NFTlist.length === 0}
              >
                <TooltipWithPortal renderContent={DepositTooltipContent}>
                  <Trans>Deposit AGX-ETH LP</Trans>
                </TooltipWithPortal>
              </Button>
            </div>
          </div>
          <div className={cx("addNow", { ishide: selectTab !== "Pool2", show: selectTab === "Pool2" })}>
            Add liquidity to Novaswap AGX/ETH pool ( <span className="heightLight">full range</span> ) to receive your
            LP NFT.
            <a
              target="_blank"
              rel="noreferrer"
              href={`https://novaswap.exchange/?chain=${EXTERNAL_LINK_CHAIN_CONFIG}#/add/ETH/${AGXAddress}/10000?minPrice=0.0000000000000000000000000000000000000029543&maxPrice=338490000000000000000000000000000000000`}
              className=""
            >
              Add now &gt;&gt;
            </a>
          </div>
          <div className={cx("", { ishide: selectTab !== "Pool2", show: selectTab === "Pool2" })}>
            <div className="StakeV2-stakeTitle padLeft">My deposit LP NFT</div>
            <div className="NFTCard">
              {mergedDepNFTlists &&
                mergedDepNFTlists.length > 0 &&
                mergedDepNFTlists.map((item, index) => {
                  return (
                    <div key={item.tokenId}>
                      <div className={cx("")}>
                        {depUrlList[index]?.image && !imageLoaded && !isDepBaseListLoading && (
                          <div className="bg-white/10 p-2 sm:p-4 sm:h-[300px] rounded-3xl shadow-lg flex flex-col sm:flex-row gap-5 select-none ">
                            <div className="h-[290px] sm:h-full sm:w-[170px] rounded-xl bg-[#181818] animate-pulse"></div>
                          </div>
                        )}
                        <img
                          className={cn("block", {
                            hidden: !imageLoaded || isDepBaseListLoading,
                          })}
                          src={depUrlList[index]?.image || ""}
                          onLoad={() => setImageLoaded(true)}
                          alt=""
                        />
                      </div>
                      <div
                        className={cn("depButton", {
                          hidden: !imageLoaded || isDepBaseListLoading,
                        })}
                      >
                        <Button
                          variant="secondary"
                          className={cx("stakeButton ishide", { show: !item.staked }, { showMobile: !item.staked })}
                          onClick={() => stakeFn(Number(item.tokenId))}
                          loading={isStaking && Number(selectedCard) === Number(item.tokenId)}
                        >
                          <Trans>Stake</Trans>
                        </Button>
                        <Button
                          variant="secondary"
                          className={cx("stakeButton ishide", { show: !item.staked }, { showMobile: !item.staked })}
                          onClick={() => withdrawFn(Number(item.tokenId))}
                          loading={isWithdrawing && Number(selectedCard) === Number(item.tokenId)}
                        >
                          <Trans>Withdraw</Trans>
                        </Button>
                        <Button
                          variant="secondary"
                          className={cx("stakeButton ishide", { show: item.staked }, { showMobile: item.staked })}
                          onClick={() => unstakeFn(Number(item.tokenId))}
                          loading={isUnstaking && Number(selectedCard) === Number(item.tokenId)}
                        >
                          <TooltipWithPortal
                            renderContent={() => {
                              return (
                                <>
                                  Accumulative Profit: {item?.reward ? item?.reward : 0} AGX <br />
                                  please unstake NFT to make it claimable
                                </>
                              );
                            }}
                          >
                            <Trans>Unstake</Trans>
                          </TooltipWithPortal>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              {(!mergedDepNFTlists || mergedDepNFTlists.length === 0) && !isDepBaseListLoading && (
                <div className="noNFT">
                  <img src={noNFT} alt="" />
                  <div className="noNFTInner">Your active V3 liquidity positions will appear here.</div>
                </div>
              )}
            </div>
          </div>
          <div className={cx("liquidity", { ishide: selectTab !== "Liquidity", show: selectTab === "Liquidity" })}>
            <div className="table-tr">
              <div className="leftAlign">Pool</div>
              <div className="rightAlign">Daily Emission</div>
              <div className="rightAlign">Total Liquidity</div>
              <div className="rightAlign"></div>
            </div>
            {visibleTokens.map((token) => {
              let tokenFeeBps;
              const obj = getBuyGlpFromAmount(
                glpAmount,
                token.address,
                infoTokens,
                glpPrice,
                usdgSupply,
                totalTokenWeights
              );
              if ("feeBasisPoints" in obj) {
                tokenFeeBps = obj.feeBasisPoints;
              }
              const tokenInfo = getTokenInfo(infoTokens, token.address);
              let managedUsd;
              if (tokenInfo && tokenInfo.managedUsd) {
                managedUsd = tokenInfo.managedUsd;
              } else {
                managedUsd = ethers.BigNumber.from(0);
              }
              let manage = 1;
              manage = managedUsd && calculateManage(managedUsd, glpSupplyUsd);
              return (
                <div className="table-td" key={token.symbol}>
                  <div className="leftAlign">{token.symbol}/ALP</div>
                  <div className="rightAlign">{formatAmount(manage, 0, 0, true)}</div>
                  <div className="rightAlign">{`${formatAmount(managedUsd, USD_DECIMALS, 0, true)}`}</div>
                  <div className="rightAlign">
                    <Button variant="secondary" onClick={() => selectToken(token)}>
                      <Trans>Add</Trans>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
