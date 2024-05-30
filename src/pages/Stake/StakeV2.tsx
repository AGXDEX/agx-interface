/* eslint-disable react/hook-use-state */
import { Trans, t } from "@lingui/macro";
import { useState, useEffect } from "react";

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
import { BigNumber, ethers } from "ethers";
import {
  GLP_DECIMALS,
  PLACEHOLDER_ACCOUNT,
  USD_DECIMALS,
} from "lib/legacy";

import useSWR from "swr";

import { getContract } from "config/contracts";

import Button from "components/Button/Button";
import TooltipWithPortal from "components/Tooltip/TooltipWithPortal";
import { getIcons } from "config/icons";
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

import { useLocalStorageByChainId } from "lib/localStorage";
import { DepositTooltipContent } from "components/Synthetics/MarketsList/DepositTooltipContent";
const { AddressZero } = ethers.constants;

import {
  ClaimAllModal,
  DepositModal,
} from "./components/modals";

import noNFT from "img/noNFT.svg";
import { STAKER_SUBGRAPH_URL, SWAP_SUBGRAPH_URL } from "config/subgraph";

const EXTERNAL_LINK_CHAIN_CONFIG = process.env.REACT_APP_ENV === "development" ? "nova_sepolia" : "nova_mainnet";

export default function StakeV2() {
  const { active, signer, account } = useWallet();
  const { chainId } = useChainId();

  const [, setPendingTxns] = usePendingTxns();

  const icons = getIcons(chainId)!;
  const hasInsurance = true;
  const [isStakeModalVisible, setIsStakeModalVisible] = useState(false);
  const [depositModalVisible, setDepositModalVisible] = useState(false);
  const [claimModalVisible, setClaimModalVisible] = useState(false);
  const [stakeModalTitle, setStakeModalTitle] = useState("");
  const [stakeModalMaxAmount, setStakeModalMaxAmount] = useState<BigNumber | undefined>(undefined);
  const [stakeValue, setStakeValue] = useState("");
  const [stakingTokenSymbol, setStakingTokenSymbol] = useState("");
  const [stakingTokenAddress, setStakingTokenAddress] = useState("");
  const [stakingFarmAddress, setStakingFarmAddress] = useState("");
  const [stakeMethodName, setStakeMethodName] = useState("");

  const [selectTab, setselectTab] = useState("Pool2");
  const [NFTdata, setNFTData] = useState<any[]>([]);
  const [depNFTData, setDepNFTData] = useState<any[]>([]);
  const [depNFTDataId, setDepNFTDataId] = useState<any[]>([]);
  const [stakeliquidity, setstakeliquidity] = useState("");
  const [NFTClaimed, setNFTClaimed] = useState("");
  const [totalReward, setTotalReward] = useState("");
  const [poolValue, setpoolValue] = useState(0);
  const [stakeAllValue, setstakeAllValue] = useState(0);
  const [stakeAPRValue, setstakeAPRValue] = useState("");
  const [AGXVFTValue, setAGXVFTValue] = useState("");

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

  const stakedGmxDistributorAddress = getContract(chainId, "StakedGmxDistributor");
  const stakedGlpDistributorAddress = getContract(chainId, "StakedGlpDistributor");

  const AGXAddress = getContract(chainId, "AGX");
  const wethAddress = getContract(chainId, "WethSwap");

  const excludedEsGmxAccounts = [stakedGmxDistributorAddress, stakedGlpDistributorAddress];

  const nativeTokenSymbol = getConstant(chainId, "nativeTokenSymbol");
  const wrappedTokenSymbol = getConstant(chainId, "wrappedTokenSymbol");

  useEffect(() => {
    axios
      .post(
        STAKER_SUBGRAPH_URL,
        '{"query":"{\\n  nfts(where: {owner: \\"' + account + '\\"}) {\\n    tokenId\\n    owner\\n    }\\n}"}'
      )
      .then((response) => {
        const array = response.data.data.nfts.map((item) => Number(item.tokenId));
        setNFTData(array);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
    axios
      .post(
        STAKER_SUBGRAPH_URL,
        '{"query":"{\\n  positions(where: {owner: \\"' +
          account +
          '\\"}) {\\n    tokenId\\n    owner\\n    staked\\n  liquidity\\n  incentiveId\\n    }\\n}"}'
      )
      .then((response) => {
        const array = response.data.data.positions.map((item) => item.tokenId);
        setDepNFTData(response.data.data.positions);
        setDepNFTDataId(array);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
    axios
      .post(
        STAKER_SUBGRAPH_URL,
        '{"query":"{\\n  incentives {\\n    liquidity\\n    }\\n}"}'
      )
      .then((response) => {
        setstakeliquidity(response.data.data.incentives[0].liquidity);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
    axios
      .post(
        STAKER_SUBGRAPH_URL,
        '{"query":"{\\n  incentives {\\n    id\\n    liquidity\\n    claimedToken\\n    }\\n}"}'
      )
      .then((response) => {
        setNFTClaimed(response.data.data.incentives[0].claimedToken);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
    axios
      .post(
        STAKER_SUBGRAPH_URL,
        '{"query":"{\\n  totalRewards(where: {owner: \\"' + account + '\\"})  {\\n    owner\\n    reward\\n    }\\n}"}'
      )
      .then((response) => {
        setTotalReward(response.data.data.totalRewards[0]?.reward);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }, [account, depositModalVisible, isWithdrawing]);

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
    setIsStakeModalVisible(true);
    setStakeModalTitle(t`Stake AGX`);
    setStakeValue("");
    setStakingTokenSymbol("AGX");
    setStakingTokenAddress(gmxAddress);
    setStakingFarmAddress(stakedGmxTrackerAddress);
    setStakeMethodName("stakeGmx");
  };

  const onClickPrimary = () => {
    setClaimModalVisible(true);
  };

  const { data: depNFTlist, mutate: refetchDepNFTlist } = useSWR(
    [`StakeV2:getSpecificNftId:${active}`, chainId, dexreaderAddress, "getSpecificNftIds"],
    {
      fetcher: contractFetcher(signer, DexReader, [depNFTDataId, AGXAddress, wethAddress]),
    }
  );

  let depNFTlists =
    depNFTlist &&
    depNFTData.filter((it) => {
      return depNFTlist.some((i) => {
        return i.toNumber() == Number(it.tokenId);
      });
    });

  const stakedTokens = (depNFTlist && depNFTlists?.filter((nft) => nft.staked).map((nft) => nft.tokenId)) || [];

  const { data: stakedRewardInfos } = useSWR(
    [`StakeV2:getRewardInfos:${active}`, chainId, dexreaderAddress, "getRewardInfos"],
    {
      fetcher: contractFetcher(signer, DexReader, [IncentiveKeyAddress, stakedTokens]),
    }
  );
  const { data: depBaselist } = useSWR([`StakeV2:getTokenURI:${active}`, chainId, dexreaderAddress, "getTokenURIs"], {
    fetcher: contractFetcher(signer, DexReader, [depNFTDataId ? depNFTDataId.map((i) => Number(i)) : []]),
  });
  const depUrlList =
    depNFTlists &&
    depNFTlists.map((it, ind) => {
      let obj = {};
      depBaselist &&
        depBaselist[0] &&
        depBaselist[0].length > 0 &&
        depBaselist[0].map((base, index) => {
          if (Number(it.tokenId) === Number(depBaselist[1][index])) {
            obj = JSON.parse(Buffer.from(base.split(",")[1], "base64").toString("utf-8"));
          }
        });
      return obj;
    });
  const rewardInfos = stakedRewardInfos?.length
    ? stakedRewardInfos.map((_, index) => ({
        reward: Number(formatAmount(stakedRewardInfos[0][index], 18, 2, true)),
        tokenId: Number(stakedRewardInfos[1][index]?.toString()),
      }))
    : [];
  const tokenIds = rewardInfos.length ? rewardInfos.map((x) => x.tokenId) : [];
  const tokenRewards = rewardInfos.length ? rewardInfos.map((x) => x.reward) : [];

  const mergedDepNFTlists = depNFTlists?.length
    ? depNFTlists.map((nft) => {
        const index = tokenIds.indexOf(parseInt(nft.tokenId, 10));
        return index !== -1 ? { ...nft, reward: tokenRewards[index] } : nft;
      })
    : [];
  const { data: NFTlist, mutate: refetchSpecificNftIds } = useSWR(
    [`StakeV2:getSpecificNftIds:${active}`, chainId, dexreaderAddress, "getSpecificNftIds"],
    {
      fetcher: contractFetcher(signer, DexReader, [NFTdata, AGXAddress, wethAddress]),
    }
  );
  const { data: baselist, mutate: refetchTokenURIs } = useSWR(
    [`StakeV2:getTokenURIs:${active}`, chainId, dexreaderAddress, "getTokenURIs"],
    {
      fetcher: contractFetcher(signer, DexReader, [NFTlist ? NFTlist.map((i) => Number(i)) : []]),
    }
  );
  const { data: Pool2ewards } = useSWR([`StakeV2:rewards:${active}`, chainId, uniV3StakerAddress, "rewards"], {
    fetcher: contractFetcher(signer, UniV3Staker, [AGXAddress, account]),
  });
  const { data: Pooladdress } = useSWR([`StakeV2:getPool:${active}`, chainId, v3FactoryAddress, "getPool"], {
    fetcher: contractFetcher(signer, UniswapV3Factory, [AGXAddress, EthPoolAddress, 10000]),
  });
  const urlList =
    NFTlist &&
    NFTlist.map((id, ind) => {
      let obj = {};
      baselist &&
        baselist[0] &&
        baselist[0].length > 0 &&
        baselist[0].map((base, index) => {
          if (Number(id) === Number(baselist[1][index])) {
            obj = JSON.parse(Buffer.from(base.split(",")[1], "base64").toString("utf-8"));
          }
        });
      return obj;
    });
  const { data: rewardRate } = useSWR([`StakeV2:rewardRate:${active}`, chainId, yieldTrackerAddress, "rewardRate"], {
    fetcher: contractFetcher(signer, YieldEmission),
  });
  const { agxPrice } = useAGXPrice();
  const ethAddress = getTokenBySymbol(ARBITRUM, "WETH").address;
  const { data: ethPrice, mutate: updateEthPrice } = useSWR<BigNumber>(
    [`StakeV3:ethPrice`, ARBITRUM, vaultAddress, "getMinPrice", ethAddress],
    {
      fetcher: contractFetcher(undefined, Vault) as any,
    }
  );

  useEffect(() => {
    if (Pooladdress) {
      axios
        .post(
          SWAP_SUBGRAPH_URL,
          '{"query":"{\\n pool(id: \\"' +
            Pooladdress.toLowerCase() +
            '\\") {\\n token0 {\\nid\\n}\\n token1 {\\nid\\n}\\n liquidity\\n totalValueLockedToken0\\n totalValueLockedToken1\\n }\\n}"}'
        )
        .then((response) => {
          let num = 0;
          const { token0, token1, liquidity, totalValueLockedToken0, totalValueLockedToken1 } = response.data.data.pool;

          if (token0.id.toLowerCase() === AGXAddress?.toLowerCase()) {
            num =
              Number(totalValueLockedToken0) * agxPrice +
              Number(totalValueLockedToken1) * (Number(ethPrice) / 10 ** 30);
            const AGXVFTValue = (Number(stakeliquidity) / Number(liquidity)) * Number(totalValueLockedToken0);
            setAGXVFTValue(Number(AGXVFTValue.toFixed(2)).toLocaleString());
          } else {
            num =
              Number(totalValueLockedToken1) * agxPrice +
              Number(totalValueLockedToken0) * (Number(ethPrice) / 10 ** 30);
            const AGXVFTValue = (Number(stakeliquidity) / Number(liquidity)) * Number(totalValueLockedToken1);
            setAGXVFTValue(Number(AGXVFTValue.toFixed(2)).toLocaleString());
          }

          setpoolValue(num);
          setstakeAllValue((num * Number(stakeliquidity)) / Number(liquidity));

          const stakeAPRValue = Number(stakeliquidity) === 0 ? "0" : ((agxPrice * 20000000) / stakeAllValue).toFixed(2);
          setstakeAPRValue(Number((Number(stakeAPRValue) * 100).toFixed(2)).toLocaleString());
        })
        .catch((error) => {
          console.log("Error:", error);
        });
    }
  }, [Pooladdress, agxPrice, ethPrice, stakeliquidity, stakeAllValue]);

  const stake = async (tokenId) => {
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

      await new Promise((resolve) => setTimeout(resolve, 3000));
      refetchDepNFTlist();

      try {
        const response = await axios.post(
          STAKER_SUBGRAPH_URL,
          '{"query":"{\\n positions(where: {owner: \\"' +
            account +
            '\\"}) {\\n tokenId\\n owner\\n staked\\n incentiveId\\n }\\n}"}'
        );
        const array = response.data.data.positions.map((item) => item.tokenId);
        setDepNFTData(response.data.data.positions);
        setDepNFTDataId(array);
        refetchDepNFTlist();

        axios
        .post(
          "https://sepolia.graph.zklink.io/subgraphs/name/staker",
          '{"query":"{\\n  positions(where: {owner: \\"' +
            account +
            '\\"}) {\\n    tokenId\\n    owner\\n    staked\\n  liquidity\\n  incentiveId\\n    }\\n}"}'
        )
        .then((response) => {
          const array = response.data.data.positions.map((item) => item.tokenId);
          setDepNFTData(response.data.data.positions);
          setDepNFTDataId(array);
        })
        .catch((error) => {
          console.log("Error:", error);
        });

      } catch (error) {
        console.log("Error:", error);
      }

      depNFTlists =
        depNFTlist &&
        depNFTData.filter((it) => {
          return depNFTlist.some((i) => {
            return i.toNumber() == Number(it.tokenId);
          });
        });

      refetchDepNFTlist();
    } catch (error) {
      console.log("Error:", error);
    } finally {
      refetchDepNFTlist();
      setIsStaking(false);
      setSelectedCard(null);
    }
  };

  const withdraw = async (tokenId) => {
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

      await new Promise((resolve) => setTimeout(resolve, 3000));
      refetchDepNFTlist();
      refetchSpecificNftIds();
      refetchTokenURIs();

      try {
        const response = await axios.post(
          STAKER_SUBGRAPH_URL,
          '{"query":"{\\n  positions(where: {owner: \\"' +
            account +
            '\\"}) {\\n    tokenId\\n    owner\\n    staked\\n    incentiveId\\n    }\\n}"}'
        );

        const { positions } = response.data.data;
        const tokenIds = positions.map((item) => item.tokenId);
        setDepNFTData(positions);
        setDepNFTDataId(tokenIds);

        depNFTlists =
          depNFTlist &&
          positions.filter((position) => {
            return depNFTlist.some((tokenId) => tokenId.toNumber() === Number(position.tokenId));
          });
      } catch (error) {
        console.log("Error fetching positions:", error);
      }
    } catch (error) {
      console.log("Error withdrawing token:", error);
    } finally {
      setIsWithdrawing(false);
      setSelectedCard(null);
      refetchSpecificNftIds();
      refetchTokenURIs();
    }
  };

  const unstake = async (tokenId) => {
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

      await new Promise((resolve) => setTimeout(resolve, 3000));
      refetchDepNFTlist();

      try {
        const response = await axios.post(
          STAKER_SUBGRAPH_URL,
          '{"query":"{\\n positions(where: {owner: \\"' +
            account +
            '\\"}) {\\n tokenId\\n owner\\n staked\\n incentiveId\\n }\\n}"}'
        );
        const array = response.data.data.positions.map((item) => item.tokenId);
        setDepNFTData(response.data.data.positions);
        setDepNFTDataId(array);
        refetchDepNFTlist();

        depNFTlists =
          depNFTlist &&
          depNFTData.filter((it) => {
            return depNFTlist.some((i) => {
              return i.toNumber() == Number(it.tokenId);
            });
          });

        refetchDepNFTlist();
      } catch (error) {
        console.log("Error fetching positions:", error);
      }

      refetchDepNFTlist();
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

  const swapLabel = "BuyAlp";
  const [swapTokenAddress, setSwapTokenAddress] = useLocalStorageByChainId(
    chainId,
    `${swapLabel}-swap-token-address`,
    AddressZero
  );
  const history = useHistory();
  const selectToken = (token) => {
    setSwapTokenAddress(token.address);
    history.push("/buy");
  };

  const totalUserStakedLiquidity = depNFTData
    .filter((entry) => entry && typeof entry.liquidity !== "undefined")
    .reduce((sum, { liquidity }) => sum + BigInt(liquidity), BigInt(0));

  const stakedAGXAmount = (
    (Number(totalUserStakedLiquidity) * Number(AGXVFTValue?.replace(/,/g, "") ?? "0")) /
    Number(stakeliquidity)
  ).toFixed(2);

  const userStakedAGXAmount = stakedAGXAmount === "NaN" ? "0.00" : stakedAGXAmount;
  const formattedPoolValue = isNaN(poolValue) ? 0 : poolValue;


  return (
    <div className="default-container page-layout">
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
        setNFTData={setNFTData}
        Pool2ewards={Pool2ewards}
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
        setNFTData={setNFTData}
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
              <div className="StakeV2-tit">Current Emisions</div>
              <div>
                {rewardRate && Number(((Number(rewardRate) / 10 ** 18) * 86400 + 59523).toFixed(2)).toLocaleString()}{" "}
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
              <div className="StakeV2-claimNum">
                {agxPrice &&
                  Pool2ewards &&
                  rewards &&
                  ((Number(Pool2ewards) / 10 ** 18 + Number(rewards) / 10 ** 18) * agxPrice)
                    .toFixed(2)
                    .toLocaleString()}
              </div>
              <div className="StakeV2-claimToken">USDT</div>
            </div>
            <div className="StakeV2-claimBox">
              <div className="StakeV2-claimNum">
                {Pool2ewards &&
                  rewards &&
                  Number((Number(Pool2ewards) / 10 ** 18 + Number(rewards) / 10 ** 18).toFixed(2)).toLocaleString()}
              </div>
              <div className="StakeV2-claimToken">AGX</div>
            </div>
            <Button variant="secondary" className="StakeV2-button" onClick={onClickPrimary} disabled={!rewards}>
              Claim
            </Button>
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
              <span className="soons">soon</span>
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
                  <div>{stakeAPRValue === "NaN" ? "0.00" : stakeAPRValue}%</div>
                </div>
                <div className="StakeV2-fomBox">
                  <div className="StakeV2-tit">Stake AGX in LP NFT:</div>
                  <div>{AGXVFTValue}</div>
                </div>
                <div className="StakeV2-fomBox">
                  <div className="StakeV2-tit">TVL</div>
                  <div>${Number(formattedPoolValue.toFixed(2)).toLocaleString()}</div>
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
                  <div>{Pool2ewards && (Number(Pool2ewards) / 10 ** 18).toFixed(2).toLocaleString()}</div>
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
            <Button variant="secondary" className="StakeV2-stakeButton" onClick={() => showStakeGmxModals()} disabled>
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
                        <img src={depUrlList[index]?.image || ""} alt="" />
                      </div>
                      <div className="depButton">
                        <Button
                          variant="secondary"
                          className={cx("stakeButton ishide", { show: !item.staked }, { showMobile: !item.staked })}
                          onClick={() => stake(Number(item.tokenId))}
                          loading={isStaking && Number(selectedCard) === Number(item.tokenId)}
                        >
                          <Trans>Stake</Trans>
                        </Button>
                        <Button
                          variant="secondary"
                          className={cx("stakeButton ishide", { show: !item.staked }, { showMobile: !item.staked })}
                          onClick={() => withdraw(Number(item.tokenId))}
                          loading={isWithdrawing && Number(selectedCard) === Number(item.tokenId)}
                        >
                          <Trans>Withdraw</Trans>
                        </Button>
                        <Button
                          variant="secondary"
                          className={cx("stakeButton ishide", { show: item.staked }, { showMobile: item.staked })}
                          onClick={() => unstake(Number(item.tokenId))}
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
              {(!mergedDepNFTlists || mergedDepNFTlists.length === 0) && (
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
              manage = calculateManage(managedUsd, glpSupplyUsd);
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
