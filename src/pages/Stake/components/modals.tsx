/* eslint-disable react-perf/jsx-no-new-array-as-prop */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Trans, t } from "@lingui/macro";
import { useState } from "react";
import Checkbox from "components/Checkbox/Checkbox";
import Modal from "components/Modal/Modal";
// import NModal as Modal from "components/ui/Modal";
import cx from "classnames";

import RewardRouter from "abis/RewardRouter.json";
import Token from "abis/Token.json";
import Vester from "abis/Vester.json";
import GLP from "abis/GLP.json";
import NFTPositionsManager from "abis/NFTPositionsManager.json";
import UniV3Staker from "abis/UniV3Staker.json";
import YieldEmission from "abis/YieldEmission.json";
import StakeAGX from "abis/StakeAGX.json";

import { useRecommendStakeGmxAmount } from "domain/stake/useRecommendStakeGmxAmount";
import { useAccumulatedBnGMXAmount } from "domain/rewards/useAccumulatedBnGMXAmount";
import { Contract, ethers } from "ethers";
import { getPageTitle } from "lib/legacy";
import { BASIS_POINTS_DIVISOR } from "config/factors";

import useSWR from "swr";

import { getContract } from "config/contracts";

import Button from "components/Button/Button";
import BuyInputSele from "components/BuyInputSele/BuyInputSele";
import SEO from "components/Common/SEO";
import ExternalLink from "components/ExternalLink/ExternalLink";
import StatsTooltipRow from "components/StatsTooltip/StatsTooltipRow";
import TooltipWithPortal from "components/Tooltip/TooltipWithPortal";
import { AlertInfo } from "components/AlertInfo/AlertInfo";
import { getIcons } from "config/icons";
import { callContract, contractFetcher } from "lib/contracts";
import { useLocalStorageSerializeKey } from "lib/localStorage";
import { bigNumberify, formatAmount, formatAmountFree, limitDecimals, parseValue } from "lib/numbers";
// import "../Stake.css";
import useIsMetamaskMobile from "lib/wallets/useIsMetamaskMobile";
import { MAX_METAMASK_MOBILE_DECIMALS } from "config/ui";

import { approveTokens } from "domain/tokens";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { UiModal } from "components/ui/Modal";
import { displayTransactionHash, formatTimestamp } from "utils/formatter";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "components/ui/dialog";
import { X } from "lucide-react";
import { getExplorerUrl } from "config/chains";
import { useChainId } from "lib/chains";
import { useStakeAGXContract } from "./staking-modal";
import { DataTable } from "components/DataTable";

const fetchClaimableReward = async (contract, account) => {
  const reward = await contract.claimable(account);
  return reward.toString();
};

const useClaimableReward = (account, chainId) => {
  const contract = useStakeAGXContract(chainId);
  return useQuery({
    queryKey: ["claimableReward", account, chainId],
    queryFn: () => fetchClaimableReward(contract, account),
    enabled: !!account && !!chainId,
    refetchInterval: 10000,
  });
};

const { AddressZero } = ethers.constants;
function ClaimAllModal(props) {
  const {
    isVisible,
    setIsVisible,
    chainId,
    title,
    maxAmount,
    value,
    setValue,
    active,
    account,
    signer,
    stakingTokenSymbol,
    stakingTokenAddress,
    farmAddress,
    rewardRouterAddress,
    stakeMethodName,
    setPendingTxns,
    showNFTdata,
    URLlist,
    Pool2Rewards,
    rewards,
    getNew,
    getStake,
  } = props;
  const [tokenId, setTokenId] = useState("");
  const NFTPositionsManagerAddress = getContract(chainId, "nonfungibleTokenPositionManagerAddress");
  const IncentiveKeyAddress = getContract(chainId, "IncentiveKey");
  const uniV3StakerAddress = getContract(chainId, "v3StakerAddress");
  const ALPAddress = getContract(chainId, "ALP");
  const AGXAddress = getContract(chainId, "AGX");
  const yieldTrackerAddress = getContract(chainId, "YieldTracker");
  const { data: claimableReward, isLoading: isLoadingClaimableReward } = useClaimableReward(account, chainId);

  const useClaimReward = (chainId) => {
    const queryClient = useQueryClient();
    const contract = useStakeAGXContract(chainId);
    return useMutation({
      mutationFn: async () => {
        const tx = await contract.claim();
        await tx.wait();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["totalStakingClaim", chainId] });
        queryClient.invalidateQueries({ queryKey: ["totalStakedWithoutMultiplier", chainId] });
        setIsDeposit(false);
        setIsVisible(false);
        getNew();
      },
    });
  };

  const { mutateAsync: claimReward } = useClaimReward(chainId);

  const [isDeposit, setIsDeposit] = useState(false);

  const tags = [
    { duration: "360 days", days: 360, multiplier: "5" },
    { duration: "180 days", days: 180, multiplier: "4" },
    { duration: "90 days", days: 90, multiplier: "3" },
    { duration: "No Lock", days: 0, multiplier: "2" },
  ];
  const [selectedTag, setSelectedTag] = useState<any>(tags[0]);
  const goDeposit = () => {
    if (isDeposit || !tokenId) {
      return;
    }
    if (tokenId === "Liquidity") {
      setIsDeposit(true);
      const contract = new ethers.Contract(yieldTrackerAddress, YieldEmission.abi, signer);
      callContract(chainId, contract, "claimWithPeriod", [(selectedTag.days * 86400)], {
        sentMsg: t`Claim submitted.`,
        failMsg: t`Claim failed.`,
        successMsg: t`Claim completed!`,
        setPendingTxns,
      }).finally(() => {
        setIsDeposit(false);
        setIsVisible(false);
        getNew();
      });
    } else if (tokenId === "Staking") {
      setIsDeposit(true);
      // const queryClient = useQueryClient();
      const stakeAGXAddress = getContract(chainId, "StakeAGX");
      const contract = new ethers.Contract(stakeAGXAddress, StakeAGX.abi, signer);
      callContract(chainId, contract, "claim", [(selectedTag.days * 86400)], {
        sentMsg: t`Claim submitted.`,
        failMsg: t`Claim failed.`,
        successMsg: t`Claim completed!`,
        setPendingTxns,
      }).finally(() => {
        // queryClient.invalidateQueries({ queryKey: ["totalStakingClaim", chainId] });
        // queryClient.invalidateQueries({ queryKey: ["totalStakedWithoutMultiplier", chainId] });
        setIsDeposit(false);
        setIsVisible(false);
        getNew();
      });
    } else {
      setIsDeposit(true);
      const contract = new ethers.Contract(uniV3StakerAddress, UniV3Staker.abi, signer);
      callContract(chainId, contract, "claimReward", [AGXAddress, account, (selectedTag.days * 86400)], {
        sentMsg: t`Claim submitted.`,
        failMsg: t`Claim failed.`,
        successMsg: t`Claim completed!`,
        setPendingTxns,
      }).finally(() => {
        setIsDeposit(false);
        setIsVisible(false);
        getNew();
      });
    }
  };

  const handleClickTag = (tag) => {
    setSelectedTag(tag);
  };
  return (
    <div className="StakeModal largeModal">
      <Modal isVisible={isVisible} setIsVisible={setIsVisible} label={title}>
        <div className="claimModal">
          <div className="tabBox">
            <div>
              <Checkbox
                isChecked={tokenId === "Staking"}
                setIsChecked={(isChecked) => {
                  isChecked ? setTokenId("Staking") : setTokenId("");
                }}
              >
                <span className="muted">
                  <Trans>Staking</Trans>
                </span>
              </Checkbox>
            </div>
            <div>
              {Number(Number(ethers.utils.formatEther(claimableReward || 0)).toFixed(2)).toLocaleString()}
              AGX
            </div>
          </div>
          <div className="tabBox">
            <div>
              <Checkbox
                isChecked={tokenId === "Pool2"}
                setIsChecked={(isChecked) => {
                  isChecked ? setTokenId("Pool2") : setTokenId("");
                }}
              >
                <span className="muted">
                  <Trans>Pool2 Mining</Trans>
                </span>
              </Checkbox>
            </div>
            <div>{Pool2Rewards && Number((Number(Pool2Rewards) / 10 ** 18).toFixed(2)).toLocaleString()} AGX</div>
          </div>
          <div className="tabBox">
            <div>
              <Checkbox
                isChecked={tokenId === "Liquidity"}
                setIsChecked={(isChecked) => {
                  isChecked ? setTokenId("Liquidity") : setTokenId("");
                }}
              >
                <span className="muted">
                  <Trans>ALP Liquidity Mining</Trans>
                </span>
              </Checkbox>
            </div>
            <div>{rewards && Number((Number(rewards) / 10 ** 18).toFixed(2)).toLocaleString()} AGX</div>
          </div>
        </div>
        <div className="mb-2">AGX Lock Duration</div>
        <div className="grid grid-cols-4 gap-4 mb-4">
          {tags.map((tag,index) => (
            <div key={tag.days+index} className="relative flex items-center md:p-6 p-3 pt-10 md:pt-6 bg-[#18191E] rounded-lg cursor-pointer"
            onClick={() => handleClickTag(tag)}>
              <div className="absolute left-3 top-3">
                <label
                  className="relative flex items-center rounded-full cursor-pointer"
                  htmlFor={`duration-${tag.days}`}
                >
                  <input
                    type="radio"
                    className="p-3 before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-[#5D00FB] transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-[#5D00FB] checked:before:bg-[#5D00FB] hover:before:opacity-10"
                    name="duration"
                    value={tag.days}
                    checked={selectedTag?.days === tag?.days}
                    onChange={() => handleClickTag(tag)}
                    id={`duration-${tag.days}`}
                    aria-label={`${tag.days} days`}
                  />
                  <span className="absolute text-[#5D00FB] transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="!h-4 !w-4"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
                    </svg>
                  </span>
                </label>
              </div>

              <div className="flex-col items-center justify-center w-full text-lg">
                <span className="text-white flex">{tag.duration}</span>
              </div>
            </div>
          ))}
        </div>
        <div>You will receive</div>
        <div className="Exchange-swap-button-container">
          <Button variant="primary-action" className="w-full" onClick={goDeposit} loading={isDeposit}>
            Claim
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function DepositModal(props) {
  const {
    isVisible,
    setIsVisible,
    chainId,
    title,
    active,
    account,
    signer,
    setPendingTxns,
    showNFTdata,
    depBaselist,
    baseUriList,
    URLlist,
  } = props;
  const dexreaderAddress = getContract(chainId, "dexreader");
  const queryClient = useQueryClient();
  const [tokenId, setTokenId] = useState(null);
  const NFTPositionsManagerAddress = getContract(chainId, "nonfungibleTokenPositionManagerAddress");
  const uniV3StakerAddress = getContract(chainId, "v3StakerAddress");
  const [isDeposit, setIsDeposit] = useState(false);

  const getPositionInfo = async (_tokenId) => {
    if (!signer || !NFTPositionsManagerAddress) return;

    const positionContract = new Contract(NFTPositionsManagerAddress, NFTPositionsManager.abi, signer);
    const result = await positionContract.positions(_tokenId);
    return result;
  };

  const goDeposit = async () => {
    if (isDeposit || !tokenId) {
      return;
    }

    setIsDeposit(true);

    try {
      const contract = new ethers.Contract(NFTPositionsManagerAddress, NFTPositionsManager.abi, signer);
      await callContract(chainId, contract, "safeTransferFrom", [account, uniV3StakerAddress, tokenId], {
        sentMsg: t`Deposit submitted.`,
        failMsg: t`Deposit failed.`,
        successMsg: t`Deposit completed!`,
        setPendingTxns,
      });
      const positionInfo = await getPositionInfo(tokenId);
      queryClient.setQueryData(
        [`StakeV2:getTokenURIs:${active}`, chainId, dexreaderAddress, showNFTdata],
        (prevNFTlist: any) => {
          return prevNFTlist[1]?.filter((tId) => Number(tId.toString()) !== tokenId);
        }
      );
      queryClient.setQueryData(
        [`StakeV2:getDepositedTokenURIs:${active}`, chainId, dexreaderAddress, "getTokenURIs"],
        (prevNFTlist: any) => {
          const formattedId = ethers.BigNumber.from(tokenId);
          if (prevNFTlist) {
            const updatedList = prevNFTlist[1].map((tId) => tId);
            if (!updatedList.some((tId) => tId.eq(formattedId))) {
              updatedList.push(formattedId);
              const tokenIndex = baseUriList[1].findIndex((tId) => tId.eq(formattedId));
              const selectedDepBase = baseUriList[0][tokenIndex];
              return [[...prevNFTlist[0], selectedDepBase], updatedList];
            }
          } else {
            return [prevNFTlist[0], [formattedId]];
          }
          return prevNFTlist;
        }
      );
      queryClient.setQueryData(
        [`StakeV2:getSpecificNftIds:${active}`, chainId, dexreaderAddress],
        (prevNFTlist: any) => {
          return prevNFTlist.filter((tId) => Number(tId.toString()) !== tokenId);
        }
      );
      queryClient.setQueryData(
        [`StakeV2:getDepositSpecificNftId:${active}`, chainId, dexreaderAddress],
        (prevNFTlist: any) => {
          return [...prevNFTlist, ethers.BigNumber.from(tokenId)];
        }
      );
      queryClient.setQueryData(["positions", account], (prevPositionsData: any) => {
        const updatedPositions = [
          ...prevPositionsData,
          {
            liquidity: positionInfo.liquidity.toString(),
            tokenId: String(tokenId),
            stake: false,
            owner: account,
          },
        ];
        return updatedPositions;
      });
    } catch (error) {
      console.error("Error depositing token:", error);
    } finally {
      setTokenId(null);
      setIsDeposit(false);
      setIsVisible(false);
    }
  };
  return (
    <div className="StakeModal largeModal">
      <Modal isVisible={isVisible} setIsVisible={setIsVisible} label={title}>
        <div className="NFTCard">
          {showNFTdata &&
            showNFTdata.length > 0 &&
            showNFTdata.map((item, index) => {
              return (
                <div
                  key={item}
                  onClick={() => {
                    setTokenId(item.toNumber());
                  }}
                  className={cx("NFTBox", { tokenActive: tokenId === item.toNumber() })}
                >
                  <img src={URLlist[index]?.image || ""} alt="" />
                </div>
              );
            })}
        </div>
        <div className="Exchange-swap-button-container depositButton">
          <Button variant="primary-action" onClick={goDeposit} loading={isDeposit}>
            Deposit
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function StakeModal(props) {
  const {
    isVisible,
    setIsVisible,
    chainId,
    title,
    maxAmount,
    value,
    setValue,
    active,
    account,
    signer,
    stakingTokenSymbol,
    stakingTokenAddress,
    farmAddress,
    rewardRouterAddress,
    stakeMethodName,
    setPendingTxns,
  } = props;
  const [isStaking, setIsStaking] = useState(false);
  const isMetamaskMobile = useIsMetamaskMobile();
  const [isApproving, setIsApproving] = useState(false);
  const icons = getIcons(chainId)!;
  const { data: tokenAllowance } = useSWR(
    active && stakingTokenAddress && [active, chainId, stakingTokenAddress, "allowance", account, farmAddress],
    {
      fetcher: contractFetcher(signer, Token),
    }
  );

  let amount = parseValue(value, 18);
  const needApproval = farmAddress !== AddressZero && tokenAllowance && amount && amount.gt(tokenAllowance);

  const getError = () => {
    if (!amount || amount.eq(0)) {
      return t`Enter an amount`;
    }
    if (maxAmount && amount.gt(maxAmount)) {
      return t`Max amount exceeded`;
    }
  };

  const onClickPrimary = () => {
    if (needApproval) {
      approveTokens({
        setIsApproving,
        signer,
        tokenAddress: stakingTokenAddress,
        spender: farmAddress,
        chainId,
      });
      return;
    }

    setIsStaking(true);
    const contract = new ethers.Contract(rewardRouterAddress, RewardRouter.abi, signer);

    callContract(chainId, contract, stakeMethodName, [amount], {
      sentMsg: t`Stake submitted!`,
      failMsg: t`Stake failed.`,
      setPendingTxns,
    })
      .then(() => {
        setIsVisible(false);
      })
      .finally(() => {
        setIsStaking(false);
      });
  };

  const isPrimaryEnabled = () => {
    const error = getError();
    if (error) {
      return false;
    }
    if (isApproving) {
      return false;
    }
    if (isStaking) {
      return false;
    }
    return true;
  };

  const getPrimaryText = () => {
    const error = getError();
    if (error) {
      return error;
    }
    if (isApproving) {
      return t`Approving ${stakingTokenSymbol}...`;
    }
    if (needApproval) {
      return t`Approve ${stakingTokenSymbol}`;
    }
    if (isStaking) {
      return t`Staking...`;
    }
    return t`Stake`;
  };

  return (
    <div className="StakeModal bigModal">
      <Modal isVisible={isVisible} setIsVisible={setIsVisible} label={title}>
        <BuyInputSele
          topLeftLabel={t`Stake`}
          topRightLabel={t`Max`}
          topRightValue={formatAmount(maxAmount, 18, 4, true)}
          onClickTopRightLabel={() => {
            const formattedMaxAmount = formatAmountFree(maxAmount, 18, 18);
            const finalMaxAmount = isMetamaskMobile
              ? limitDecimals(formattedMaxAmount, MAX_METAMASK_MOBILE_DECIMALS)
              : formattedMaxAmount;
            setValue(finalMaxAmount);
          }}
          inputValue={value}
          onInputValueChange={(e) => setValue(e.target.value)}
          showMaxButton={false}
        >
          <div className="Stake-modal-icons">
            <img className="mr-xs icon" height="22" src={icons["glp"]} alt={stakingTokenSymbol} />
            {stakingTokenSymbol}
          </div>
        </BuyInputSele>

        <div className="Exchange-swap-button-container">
          <Button variant="primary-action" className="w-full" onClick={onClickPrimary} disabled={!isPrimaryEnabled()}>
            {/* {getPrimaryText()} */}
            Confirm
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function UnstakeModal(props) {
  const {
    isVisible,
    setIsVisible,
    chainId,
    title,
    maxAmount,
    value,
    setValue,
    signer,
    unstakingTokenSymbol,
    rewardRouterAddress,
    unstakeMethodName,
    multiplierPointsAmount,
    reservedAmount,
    bonusGmxInFeeGmx,
    setPendingTxns,
    processedData,
    nativeTokenSymbol,
  } = props;
  const [isUnstaking, setIsUnstaking] = useState(false);
  const icons = getIcons(chainId)!;
  let amount = parseValue(value, 18);
  let burnAmount;

  if (
    multiplierPointsAmount &&
    multiplierPointsAmount.gt(0) &&
    amount &&
    amount.gt(0) &&
    bonusGmxInFeeGmx &&
    bonusGmxInFeeGmx.gt(0)
  ) {
    burnAmount = multiplierPointsAmount.mul(amount).div(bonusGmxInFeeGmx);
  }

  let unstakeBonusLostPercentage;
  if (amount?.gt(0) && multiplierPointsAmount?.gt(0)) {
    unstakeBonusLostPercentage = amount
      ?.add(burnAmount)
      .mul(BASIS_POINTS_DIVISOR)
      ?.div(multiplierPointsAmount?.add(processedData.esGmxInStakedGmx)?.add(processedData.gmxInStakedGmx));
  }

  const getError = () => {
    if (!amount) {
      return t`Enter an amount`;
    }
    if (amount.gt(maxAmount)) {
      return t`Max amount exceeded`;
    }
  };

  const onClickPrimary = () => {
    setIsUnstaking(true);
    const contract = new ethers.Contract(rewardRouterAddress, RewardRouter.abi, signer);
    callContract(chainId, contract, unstakeMethodName, [amount], {
      sentMsg: t`Unstake submitted!`,
      failMsg: t`Unstake failed.`,
      successMsg: t`Unstake completed!`,
      setPendingTxns,
    })
      .then(() => {
        setIsVisible(false);
      })
      .finally(() => {
        setIsUnstaking(false);
      });
  };

  const isPrimaryEnabled = () => {
    const error = getError();
    if (error) {
      return false;
    }
    if (isUnstaking) {
      return false;
    }
    return true;
  };

  const getPrimaryText = () => {
    const error = getError();
    if (error) {
      return error;
    }
    if (isUnstaking) {
      return t`Unstaking...`;
    }
    return t`Unstake`;
  };

  return (
    <div className="StakeModal">
      <Modal isVisible={isVisible} setIsVisible={setIsVisible} label={title}>
        <BuyInputSele
          topLeftLabel={t`Unstake`}
          topRightLabel={t`Max`}
          topRightValue={formatAmount(maxAmount, 18, 4, true)}
          onClickTopRightLabel={() => setValue(formatAmountFree(maxAmount, 18, 18))}
          inputValue={value}
          onInputValueChange={(e) => setValue(e.target.value)}
          showMaxButton={false}
        >
          <div className="Stake-modal-icons">
            {/* <img
              className="mr-xs icon"
              height="22"
              src={icons[unstakingTokenSymbol?.toLowerCase()]}
              alt={unstakingTokenSymbol}
            /> */}
            test
            {/* {unstakingTokenSymbol} */}
          </div>
        </BuyInputSele>
        {reservedAmount && reservedAmount.gt(0) && (
          <AlertInfo type="info">
            You have {formatAmount(reservedAmount, 18, 2, true)} tokens reserved for vesting.
          </AlertInfo>
        )}
        {burnAmount?.gt(0) && unstakeBonusLostPercentage?.gt(0) && amount && !amount.gt(maxAmount) && (
          <AlertInfo type="warning">
            <Trans>
              Unstaking will burn&nbsp;
              <ExternalLink className="display-inline" href="https://docs.gmx.io/docs/tokenomics/rewards">
                {formatAmount(burnAmount, 18, 4, true)} Multiplier Points
              </ExternalLink>
              .&nbsp;
              <span>
                You will earn {formatAmount(unstakeBonusLostPercentage, 2, 2)}% less {nativeTokenSymbol} rewards with
                this action.
              </span>
            </Trans>
          </AlertInfo>
        )}
        <div className="Exchange-swap-button-container">
          <Button variant="primary-action" className="w-full" onClick={onClickPrimary} disabled={!isPrimaryEnabled()}>
            {getPrimaryText()}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function VesterDepositModal(props) {
  const {
    isVisible,
    setIsVisible,
    chainId,
    title,
    maxAmount,
    value,
    setValue,
    balance,
    vestedAmount,
    averageStakedAmount,
    maxVestableAmount,
    signer,
    stakeTokenLabel,
    reserveAmount,
    maxReserveAmount,
    vesterAddress,
    setPendingTxns,
  } = props;
  const [isDepositing, setIsDepositing] = useState(false);
  const icons = getIcons(chainId)!;

  let amount = parseValue(value, 18);

  let nextReserveAmount = reserveAmount;

  let nextDepositAmount = vestedAmount;
  if (amount) {
    nextDepositAmount = vestedAmount.add(amount);
  }

  let additionalReserveAmount = bigNumberify(0);
  if (amount && averageStakedAmount && maxVestableAmount && maxVestableAmount.gt(0) && nextReserveAmount) {
    nextReserveAmount = nextDepositAmount.mul(averageStakedAmount).div(maxVestableAmount);
    if (nextReserveAmount?.gt(reserveAmount)) {
      additionalReserveAmount = nextReserveAmount.sub(reserveAmount);
    }
  }

  const getError = () => {
    if (!amount || amount.eq(0)) {
      return t`Enter an amount`;
    }
    if (maxAmount && amount.gt(maxAmount)) {
      return t`Max amount exceeded`;
    }
    if (nextReserveAmount && nextReserveAmount?.gt(maxReserveAmount)) {
      return t`Insufficient staked tokens`;
    }
  };

  const onClickPrimary = () => {
    setIsDepositing(true);
    const contract = new ethers.Contract(vesterAddress, Vester.abi, signer);

    callContract(chainId, contract, "deposit", [amount], {
      sentMsg: t`Deposit submitted!`,
      failMsg: t`Deposit failed!`,
      successMsg: t`Deposited!`,
      setPendingTxns,
    })
      .then(() => {
        setIsVisible(false);
      })
      .finally(() => {
        setIsDepositing(false);
      });
  };

  const isPrimaryEnabled = () => {
    const error = getError();
    if (error) {
      return false;
    }
    if (isDepositing) {
      return false;
    }
    return true;
  };

  const getPrimaryText = () => {
    const error = getError();
    if (error) {
      return error;
    }
    if (isDepositing) {
      return t`Depositing...`;
    }
    return t`Deposit`;
  };

  return (
    <SEO title={getPageTitle(t`Earn`)}>
      <div className="StakeModal">
        <Modal isVisible={isVisible} setIsVisible={setIsVisible} label={title} className="non-scrollable">
          <BuyInputSele
            topLeftLabel={t`Deposit`}
            topRightLabel={t`Max`}
            topRightValue={formatAmount(maxAmount, 18, 4, true)}
            onClickTopRightLabel={() => setValue(formatAmountFree(maxAmount, 18, 18))}
            inputValue={value}
            onInputValueChange={(e) => setValue(e.target.value)}
            showMaxButton={false}
          >
            <div className="Stake-modal-icons">
              <img className="mr-xs icon" height="22" src={icons.esgmx} alt="esGMX" />
              esAGX
            </div>
          </BuyInputSele>

          <div className="VesterDepositModal-info-rows">
            <div className="Exchange-info-row">
              <div className="Exchange-info-label">
                <Trans>Wallet</Trans>
              </div>
              <div className="align-right">{formatAmount(balance, 18, 2, true)} esAGX</div>
            </div>
            <div className="Exchange-info-row">
              <div className="Exchange-info-label">
                <Trans>Vault Capacity</Trans>
              </div>
              <div className="align-right">
                <TooltipWithPortal
                  handle={`${formatAmount(nextDepositAmount, 18, 2, true)} / ${formatAmount(
                    maxVestableAmount,
                    18,
                    2,
                    true
                  )}`}
                  position="top-end"
                  renderContent={() => {
                    return (
                      <div>
                        <p className="text-white">
                          <Trans>Vault Capacity for your Account:</Trans>
                        </p>
                        <StatsTooltipRow
                          showDollar={false}
                          label={t`Deposited`}
                          value={`${formatAmount(vestedAmount, 18, 2, true)} esGMX`}
                        />
                        <StatsTooltipRow
                          showDollar={false}
                          label={t`Max Capacity`}
                          value={`${formatAmount(maxVestableAmount, 18, 2, true)} esGMX`}
                        />
                      </div>
                    );
                  }}
                />
              </div>
            </div>
            {reserveAmount && (
              <div className="Exchange-info-row">
                <div className="Exchange-info-label">
                  <Trans>Reserve Amount</Trans>
                </div>
                <div className="align-right">
                  <TooltipWithPortal
                    handle={`${formatAmount(
                      reserveAmount && reserveAmount.gte(additionalReserveAmount)
                        ? reserveAmount
                        : additionalReserveAmount,
                      18,
                      2,
                      true
                    )} / ${formatAmount(maxReserveAmount, 18, 2, true)}`}
                    position="top-end"
                    renderContent={() => {
                      return (
                        <>
                          <StatsTooltipRow
                            label={t`Current Reserved`}
                            value={formatAmount(reserveAmount, 18, 2, true)}
                            showDollar={false}
                          />
                          <StatsTooltipRow
                            label={t`Additional reserve required`}
                            value={formatAmount(additionalReserveAmount, 18, 2, true)}
                            showDollar={false}
                          />
                          {amount && nextReserveAmount.gt(maxReserveAmount) && (
                            <>
                              <br />
                              <Trans>
                                You need a total of at least {formatAmount(nextReserveAmount, 18, 2, true)}{" "}
                                {stakeTokenLabel} to vest {formatAmount(amount, 18, 2, true)} esGMX.
                              </Trans>
                            </>
                          )}
                        </>
                      );
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="Exchange-swap-button-container">
            <Button variant="primary-action" className="w-full" onClick={onClickPrimary} disabled={!isPrimaryEnabled()}>
              {getPrimaryText()}
            </Button>
          </div>
        </Modal>
      </div>
    </SEO>
  );
}

function VesterWithdrawModal(props) {
  const { isVisible, setIsVisible, chainId, title, signer, vesterAddress, setPendingTxns } = props;
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const onClickPrimary = () => {
    setIsWithdrawing(true);
    const contract = new ethers.Contract(vesterAddress, Vester.abi, signer);

    callContract(chainId, contract, "withdraw", [], {
      sentMsg: t`Withdraw submitted.`,
      failMsg: t`Withdraw failed.`,
      successMsg: t`Withdrawn!`,
      setPendingTxns,
    })
      .then(() => {
        setIsVisible(false);
      })
      .finally(() => {
        setIsWithdrawing(false);
      });
  };

  return (
    <div className="StakeModal">
      <Modal isVisible={isVisible} setIsVisible={setIsVisible} label={title}>
        <Trans>
          <div>
            This will withdraw and unreserve all tokens as well as pause vesting.
            <br />
            <br />
            esGMX tokens that have been converted to GMX will be claimed and remain as GMX tokens.
            <br />
            <br />
            To claim GMX tokens without withdrawing, use the "Claim" button under the Total Rewards section.
            <br />
            <br />
          </div>
        </Trans>
        <div className="Exchange-swap-button-container">
          <Button variant="primary-action" className="w-full" onClick={onClickPrimary} disabled={isWithdrawing}>
            {!isWithdrawing && "Confirm Withdraw"}
            {isWithdrawing && "Confirming..."}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function AffiliateVesterWithdrawModal(props) {
  const { isVisible, setIsVisible, chainId, signer, setPendingTxns } = props;
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const affiliateVesterAddress = getContract(chainId, "AffiliateVester");

  const onClickPrimary = () => {
    setIsWithdrawing(true);
    const contract = new ethers.Contract(affiliateVesterAddress, Vester.abi, signer);

    callContract(chainId, contract, "withdraw", [], {
      sentMsg: t`Withdraw submitted.`,
      failMsg: t`Withdraw failed.`,
      successMsg: t`Withdrawn!`,
      setPendingTxns,
    })
      .then(() => {
        setIsVisible(false);
      })
      .finally(() => {
        setIsWithdrawing(false);
      });
  };

  return (
    <div className="StakeModal">
      <Modal isVisible={isVisible} setIsVisible={setIsVisible} label={t`Withdraw from Affiliate Vault`}>
        <Trans>
          <div>
            This will withdraw all esGMX tokens as well as pause vesting.
            <br />
            <br />
            esGMX tokens that have been converted to GMX will be claimed and remain as GMX tokens.
            <br />
            <br />
            To claim GMX tokens without withdrawing, use the "Claim" button.
            <br />
            <br />
          </div>
        </Trans>
        <div className="Exchange-swap-button-container">
          <Button variant="primary-action" className="w-full" onClick={onClickPrimary} disabled={isWithdrawing}>
            {!isWithdrawing && "Confirm Withdraw"}
            {isWithdrawing && "Confirming..."}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function CompoundModal(props) {
  const {
    isVisible,
    setIsVisible,
    rewardRouterAddress,
    active,
    account,
    signer,
    chainId,
    setPendingTxns,
    totalVesterRewards,
    nativeTokenSymbol,
    wrappedTokenSymbol,
    processedData,
  } = props;
  const [isCompounding, setIsCompounding] = useState(false);
  const [shouldClaimGmx, setShouldClaimGmx] = useLocalStorageSerializeKey(
    [chainId, "StakeV2-compound-should-claim-gmx"],
    true
  );
  const [shouldStakeGmx, setShouldStakeGmx] = useLocalStorageSerializeKey(
    [chainId, "StakeV2-compound-should-stake-gmx"],
    true
  );
  const [shouldClaimEsGmx, setShouldClaimEsGmx] = useLocalStorageSerializeKey(
    [chainId, "StakeV2-compound-should-claim-es-gmx"],
    true
  );
  const [shouldStakeEsGmx, setShouldStakeEsGmx] = useLocalStorageSerializeKey(
    [chainId, "StakeV2-compound-should-stake-es-gmx"],
    true
  );
  const [shouldStakeMultiplierPoints, setShouldStakeMultiplierPoints] = useState(true);
  const [shouldClaimWeth, setShouldClaimWeth] = useLocalStorageSerializeKey(
    [chainId, "StakeV2-compound-should-claim-weth"],
    true
  );
  const [shouldConvertWeth, setShouldConvertWeth] = useLocalStorageSerializeKey(
    [chainId, "StakeV2-compound-should-convert-weth"],
    true
  );

  const gmxAddress = getContract(chainId, "GMX");
  const stakedGmxTrackerAddress = getContract(chainId, "StakedGmxTracker");

  const [isApproving, setIsApproving] = useState(false);

  const { data: tokenAllowance } = useSWR(
    active && [active, chainId, gmxAddress, "allowance", account, stakedGmxTrackerAddress],
    {
      fetcher: contractFetcher(signer, Token),
    }
  );

  const needApproval = shouldStakeGmx && tokenAllowance && totalVesterRewards && totalVesterRewards.gt(tokenAllowance);

  const isPrimaryEnabled = () => {
    return !isCompounding && !isApproving && !isCompounding;
  };

  const getPrimaryText = () => {
    if (isApproving) {
      return t`Approving AGX...`;
    }
    if (needApproval) {
      return t`Approve AGX`;
    }
    if (isCompounding) {
      return t`Compounding...`;
    }
    return t`Compound`;
  };

  const onClickPrimary = () => {
    if (needApproval) {
      approveTokens({
        setIsApproving,
        signer,
        tokenAddress: gmxAddress,
        spender: stakedGmxTrackerAddress,
        chainId,
      });
      return;
    }

    setIsCompounding(true);

    const contract = new ethers.Contract(rewardRouterAddress, RewardRouter.abi, signer);
    callContract(
      chainId,
      contract,
      "handleRewards",
      [
        shouldClaimGmx || shouldStakeGmx,
        shouldStakeGmx,
        shouldClaimEsGmx || shouldStakeEsGmx,
        shouldStakeEsGmx,
        shouldStakeMultiplierPoints,
        shouldClaimWeth || shouldConvertWeth,
        shouldConvertWeth,
      ],
      {
        sentMsg: t`Compound submitted!`,
        failMsg: t`Compound failed.`,
        successMsg: t`Compound completed!`,
        setPendingTxns,
      }
    )
      .then(() => {
        setIsVisible(false);
      })
      .finally(() => {
        setIsCompounding(false);
      });
  };

  const toggleShouldStakeGmx = (value) => {
    if (value) {
      setShouldClaimGmx(true);
    }
    setShouldStakeGmx(value);
  };

  const toggleShouldStakeEsGmx = (value) => {
    if (value) {
      setShouldClaimEsGmx(true);
    }
    setShouldStakeEsGmx(value);
  };

  const toggleConvertWeth = (value) => {
    if (value) {
      setShouldClaimWeth(true);
    }
    setShouldConvertWeth(value);
  };

  const accumulatedBnGMXAmount = useAccumulatedBnGMXAmount();

  const recommendStakeGmx = useRecommendStakeGmxAmount(
    {
      accumulatedGMX: processedData?.totalVesterRewards,
      accumulatedBnGMX: accumulatedBnGMXAmount,
      accumulatedEsGMX: processedData?.totalEsGmxRewards,
      stakedGMX: processedData?.gmxInStakedGmx,
      stakedBnGMX: processedData?.bnGmxInFeeGmx,
      stakedEsGMX: processedData?.esGmxInStakedGmx,
    },
    {
      shouldStakeGmx,
      shouldStakeEsGmx,
    }
  );

  return (
    <div className="StakeModal">
      <Modal isVisible={isVisible} setIsVisible={setIsVisible} label={t`Compound Rewards`}>
        {recommendStakeGmx.gt(0) && (
          <AlertInfo type="info">
            <Trans>
              You have reached the maximum Boost Percentage. Stake an additional{" "}
              {formatAmount(recommendStakeGmx, 18, 2, true)} AGX or esAGX to be able to stake your unstaked{" "}
              {formatAmount(accumulatedBnGMXAmount, 18, 4, true)} Multiplier Points.
            </Trans>
          </AlertInfo>
        )}
        <div className="CompoundModal-menu">
          <div>
            <Checkbox
              isChecked={shouldStakeMultiplierPoints}
              setIsChecked={setShouldStakeMultiplierPoints}
              disabled={true}
            >
              <Trans>Stake Multiplier Points</Trans>
            </Checkbox>
          </div>
          <div>
            <Checkbox isChecked={shouldClaimGmx} setIsChecked={setShouldClaimGmx} disabled={shouldStakeGmx}>
              <Trans>Claim AGX Rewards</Trans>
            </Checkbox>
          </div>
          <div>
            <Checkbox isChecked={shouldStakeGmx} setIsChecked={toggleShouldStakeGmx}>
              <Trans>Stake AGX Rewards</Trans>
            </Checkbox>
          </div>
          <div>
            <Checkbox isChecked={shouldClaimEsGmx} setIsChecked={setShouldClaimEsGmx} disabled={shouldStakeEsGmx}>
              <Trans>Claim esAGX Rewards</Trans>
            </Checkbox>
          </div>
          <div>
            <Checkbox isChecked={shouldStakeEsGmx} setIsChecked={toggleShouldStakeEsGmx}>
              <Trans>Stake esAGX Rewards</Trans>
            </Checkbox>
          </div>
          <div>
            <Checkbox isChecked={shouldClaimWeth} setIsChecked={setShouldClaimWeth} disabled={shouldConvertWeth}>
              <Trans>Claim {wrappedTokenSymbol} Rewards</Trans>
            </Checkbox>
          </div>
          <div>
            <Checkbox isChecked={shouldConvertWeth} setIsChecked={toggleConvertWeth}>
              <Trans>
                Convert {wrappedTokenSymbol} to {nativeTokenSymbol}
              </Trans>
            </Checkbox>
          </div>
        </div>
        <div className="Exchange-swap-button-container">
          <Button variant="primary-action" className="w-full" onClick={onClickPrimary} disabled={!isPrimaryEnabled()}>
            {getPrimaryText()}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function ClaimModal(props) {
  const {
    isVisible,
    setIsVisible,
    rewardRouterAddress,
    signer,
    chainId,
    setPendingTxns,
    nativeTokenSymbol,
    wrappedTokenSymbol,
  } = props;
  const [isClaiming, setIsClaiming] = useState(false);
  const [shouldClaimGmx, setShouldClaimGmx] = useLocalStorageSerializeKey(
    [chainId, "StakeV2-claim-should-claim-gmx"],
    true
  );
  const [shouldClaimEsGmx, setShouldClaimEsGmx] = useLocalStorageSerializeKey(
    [chainId, "StakeV2-claim-should-claim-es-gmx"],
    true
  );
  const [shouldClaimWeth, setShouldClaimWeth] = useLocalStorageSerializeKey(
    [chainId, "StakeV2-claim-should-claim-weth"],
    true
  );
  const [shouldConvertWeth, setShouldConvertWeth] = useLocalStorageSerializeKey(
    [chainId, "StakeV2-claim-should-convert-weth"],
    true
  );

  const isPrimaryEnabled = () => {
    return !isClaiming;
  };

  const getPrimaryText = () => {
    if (isClaiming) {
      return t`Claiming...`;
    }
    return t`Claim`;
  };

  const onClickPrimary = () => {
    setIsClaiming(true);

    const contract = new ethers.Contract(rewardRouterAddress, RewardRouter.abi, signer);
    callContract(
      chainId,
      contract,
      "handleRewards",
      [
        shouldClaimGmx,
        false, // shouldStakeGmx
        shouldClaimEsGmx,
        false, // shouldStakeEsGmx
        false, // shouldStakeMultiplierPoints
        shouldClaimWeth,
        shouldConvertWeth,
      ],
      {
        sentMsg: t`Claim submitted.`,
        failMsg: t`Claim failed.`,
        successMsg: t`Claim completed!`,
        setPendingTxns,
      }
    )
      .then(() => {
        setIsVisible(false);
      })
      .finally(() => {
        setIsClaiming(false);
      });
  };

  const toggleConvertWeth = (value) => {
    if (value) {
      setShouldClaimWeth(true);
    }
    setShouldConvertWeth(value);
  };

  return (
    <div className="StakeModal">
      <Modal isVisible={isVisible} setIsVisible={setIsVisible} label={t`Claim Rewards`}>
        <div className="CompoundModal-menu">
          <div>
            <Checkbox isChecked={shouldClaimGmx} setIsChecked={setShouldClaimGmx}>
              <Trans>Claim AGX Rewards</Trans>
            </Checkbox>
          </div>
          <div>
            <Checkbox isChecked={shouldClaimEsGmx} setIsChecked={setShouldClaimEsGmx}>
              <Trans>Claim esAGX Rewards</Trans>
            </Checkbox>
          </div>
          <div>
            <Checkbox isChecked={shouldClaimWeth} setIsChecked={setShouldClaimWeth} disabled={shouldConvertWeth}>
              <Trans>Claim {wrappedTokenSymbol} Rewards</Trans>
            </Checkbox>
          </div>
          <div>
            <Checkbox isChecked={shouldConvertWeth} setIsChecked={toggleConvertWeth}>
              <Trans>
                Convert {wrappedTokenSymbol} to {nativeTokenSymbol}
              </Trans>
            </Checkbox>
          </div>
        </div>
        <div className="Exchange-swap-button-container">
          <Button variant="primary-action" className="w-full" onClick={onClickPrimary} disabled={!isPrimaryEnabled()}>
            {getPrimaryText()}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export function ClaimHistoryModal(props) {
  const { chainId } = useChainId();
  const { isVisible, setIsVisible, data } = props;

  const renderType = (_type) => {
    switch (Number(_type)) {
      case 1:
        return "Pool2 mining";
      case 2:
        return "ALP Liquidity Mining";
      case 3:
        return "Staking";
      default:
        return "Unknown";
    }
  };
  const columns: any[] = [
    {
      accessorKey: "type",
      header: ({ column }) => {
        return (
          <div className="border-b border-none font-medium p-4 pl-8 pt-0 pb-3 text-slate-400  text-left">Type</div>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="border-b border-none p-4  text-white text-left">{renderType(Number(row.original.type))}</div>
        );
      },
    },
    {
      accessorKey: "period",
      header: ({ column }) => {
        return (
          <div className="border-b border-none font-medium p-4 pr-8 pt-0 pb-3 text-slate-400  text-left">
            AGX Amount
          </div>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="border-b border-none p-4  text-white text-left">
            {formatAmount(ethers.BigNumber.from(row.original.amount), 18, 4, true)} AGX
          </div>
        );
      },
    },
    {
      accessorKey: "blockTimestamp",
      sortingFn: (rowA, rowB) => {
        const numA = rowA.original.blockTime;
        const numB = rowB.original.blockTime;
        return numA < numB ? 1 : numA > numB ? -1 : 0;
      },
      header: ({ column }) => {
        return <div className="border-b border-none font-medium p-4 pr-8 pt-0 pb-3 text-slate-400 text-left">Time</div>;
      },
      cell: ({ row }) => {
        return (
          <div className="border-b border-none p-4 pr-8  text-white text-left">
            {formatTimestamp(row.original.blockTimestamp)}
          </div>
        );
      },
    },
    {
      accessorKey: "transactionHash",
      header: ({ column }) => {
        return (
          <div className="border-b border-none font-medium p-4 pr-8 pt-0 pb-3 text-slate-400  text-center">Tx Hash</div>
        );
      },
      cell: ({ row }) => {
        return (
          <div
            className="border-b border-none font-medium p-4 pr-8 pt-0 pb-3 text-center  text-white underline cursor-pointer"
            onClick={() => {
              const txUrl = getExplorerUrl(chainId) + "tx/" + row.original.transactionHash;
              window.open(txUrl, "_blank");
            }}
          >
            {displayTransactionHash(row.original.transactionHash)}
          </div>
        );
      },
    },
  ];
  if (!isVisible) return null;
  return (
    <Dialog open={isVisible}>
      <DialogContent className="sm:max-w-[925px] bg-[#292B2F] focus:outline-none">
        <div
          className="absolute cursor-pointer right-6 top-6 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground bg-white/10 p-5 rounded-full"
          onClick={() => {
            setIsVisible(false);
          }}
        >
          <X size={18} />
          <span className="sr-only">Close</span>
        </div>
        <DialogHeader className="items-center py-4">
          <DialogTitle className="text-3xl">Claim History</DialogTitle>
        </DialogHeader>
        {!data?.length ? (
          <div className="flex flex-col items-center justify-center min-h-[200px]">
            <div className="text-2xl text-[#88898F] text-center">No claim history</div>
          </div>
        ) : (
          <>
            <DataTable columns={columns} data={data} />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function AffiliateClaimModal(props) {
  const { isVisible, setIsVisible, signer, chainId, setPendingTxns, totalVesterRewards } = props;
  const [isClaiming, setIsClaiming] = useState(false);
  const affiliateVesterAddress = getContract(chainId, "AffiliateVester");

  const isPrimaryEnabled = () => {
    if (totalVesterRewards.isZero()) {
      return false;
    }

    return !isClaiming;
  };

  const getPrimaryText = () => {
    if (isClaiming) {
      return t`Claiming...`;
    }
    return t`Claim`;
  };

  const onClickPrimary = () => {
    setIsClaiming(true);

    const affiliateVesterContract = new ethers.Contract(affiliateVesterAddress, Vester.abi, signer);

    callContract(chainId, affiliateVesterContract, "claim", [], {
      sentMsg: t`Claim submitted.`,
      failMsg: t`Claim failed.`,
      successMsg: t`Claim completed!`,
      setPendingTxns,
    })
      .then(() => {
        setIsVisible(false);
      })
      .finally(() => {
        setIsClaiming(false);
      });
  };

  return (
    <div className="StakeModal">
      <Modal isVisible={isVisible} setIsVisible={setIsVisible} label={t`Claim Affiliate Vault Rewards`}>
        <Trans>
          <div>
            This will claim {formatAmount(totalVesterRewards, 18, 4, true)} AGX.
            <br />
            <br />
            After claiming, you can stake these AGX tokens by using the "Stake" button in the AGX section of this Earn
            page.
            <br />
            <br />
          </div>
        </Trans>
        <div className="Exchange-swap-button-container">
          <Button variant="primary-action" className="w-full" onClick={onClickPrimary} disabled={!isPrimaryEnabled()}>
            {getPrimaryText()}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export {
  ClaimAllModal,
  DepositModal,
  StakeModal,
  UnstakeModal,
  VesterDepositModal,
  VesterWithdrawModal,
  CompoundModal,
  ClaimModal,
  AffiliateClaimModal,
  AffiliateVesterWithdrawModal,
};
