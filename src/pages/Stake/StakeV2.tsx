import { Trans, t } from "@lingui/macro";
import { useCallback, useMemo, useState, useEffect } from "react";

import Checkbox from "components/Checkbox/Checkbox";
import Footer from "components/Footer/Footer";
import Modal from "components/Modal/Modal";
import Tooltip from "components/Tooltip/Tooltip";
import cx from "classnames";
import { Link,useHistory } from "react-router-dom";

import GlpManager from "abis/GlpManager.json";
import ReaderV2 from "abis/ReaderV2.json";
import RewardReader from "abis/RewardReader.json";
import RewardRouter from "abis/RewardRouter.json";
import Token from "abis/Token.json";
import Vault from "abis/Vault.json";
import Vester from "abis/Vester.json";
import TimeDistributor from "abis/TimeDistributor.json";
import YieldTracker from "abis/YieldTracker.json";
import GLP from "abis/GLP.json";
import NFTPositionsManager from "abis/NFTPositionsManager.json";
import UniV3Staker from "abis/UniV3Staker.json";
import UniswapV3Factory from "abis/UniswapV3Factory.json";
import DexReader from "abis/DexReader.json";
import VaultV2 from "abis/VaultV2.json";
import YieldEmission from "abis/YieldEmission.json";

import { ARBITRUM, AVALANCHE, getConstant } from "config/chains";
import { useGmxPrice, useTotalGmxStaked, useTotalGmxSupply,useAGXPrice } from "domain/legacy";
import { useRecommendStakeGmxAmount } from "domain/stake/useRecommendStakeGmxAmount";
import { useAccumulatedBnGMXAmount } from "domain/rewards/useAccumulatedBnGMXAmount";
import { useMaxBoostBasicPoints } from "domain/rewards/useMaxBoostBasisPoints";
import { BigNumber, ethers } from "ethers";
import {
  GLP_DECIMALS,
  PLACEHOLDER_ACCOUNT,
  USD_DECIMALS,
  getBalanceAndSupplyData,
  getDepositBalanceData,
  getPageTitle,
  getProcessedData,
  getStakingData,
} from "lib/legacy";
import { BASIS_POINTS_DIVISOR } from "config/factors";

import useSWR from "swr";

import { getContract } from "config/contracts";

import Button from "components/Button/Button";
import BuyInputSele from "components/BuyInputSele/BuyInputSele";
import SEO from "components/Common/SEO";
import ExternalLink from "components/ExternalLink/ExternalLink";
import GMXAprTooltip from "components/Stake/GMXAprTooltip";
import ChainsStatsTooltipRow from "components/StatsTooltip/ChainsStatsTooltipRow";
import StatsTooltipRow from "components/StatsTooltip/StatsTooltipRow";
import { GmList } from "components/Synthetics/GmList/GmList";
import TooltipWithPortal from "components/Tooltip/TooltipWithPortal";
import { AlertInfo } from "components/AlertInfo/AlertInfo";
import { getIcons } from "config/icons";
import { getServerUrl } from "config/backend";
import { getIsSyntheticsSupported } from "config/features";
import { getTotalGmInfo, useMarketTokensData, useMarketsInfoRequest } from "domain/synthetics/markets";
import { useMarketTokensAPR } from "domain/synthetics/markets/useMarketTokensAPR";
import { useChainId } from "lib/chains";
import { callContract, contractFetcher } from "lib/contracts";
import { helperToast } from "lib/helperToast";
import { useLocalStorageSerializeKey } from "lib/localStorage";
import {
  BN_ZERO,
  bigNumberify,
  expandDecimals,
  formatAmount,
  formatAmountFree,
  formatKeyAmount,
  limitDecimals,
  parseValue,
} from "lib/numbers";
import "./StakeV2.css";
import useWallet from "lib/wallets/useWallet";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import PageTitle from "components/PageTitle/PageTitle";
import useIsMetamaskMobile from "lib/wallets/useIsMetamaskMobile";
import { MAX_METAMASK_MOBILE_DECIMALS } from "config/ui";
import UserIncentiveDistributionList from "components/Synthetics/UserIncentiveDistributionList/UserIncentiveDistributionList";
import useIncentiveStats from "domain/synthetics/common/useIncentiveStats";
import useVestingData from "domain/vesting/useVestingData";
import { useStakedBnGMXAmount } from "domain/rewards/useStakedBnGMXAmount";
import { usePendingTxns } from "lib/usePendingTxns";
import axios from "axios";
import {
  getV1Tokens,
  getWhitelistedV1Tokens,
} from "config/tokens";
import { getTokenBySymbol } from "config/tokens";
import { getTokenInfo } from "domain/tokens/utils";

import { approveTokens, useInfoTokens } from "domain/tokens";
import {
  getBuyGlpFromAmount,
} from "lib/legacy";

import { useLocalStorageByChainId } from "lib/localStorage";
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
    setNFTData,
    Pool2ewards
  } = props;
  const [tokenId, setTokenId] = useState('');
  const NFTPositionsManagerAddress = getContract(chainId, "nonfungibleTokenPositionManagerAddress");
  const IncentiveKeyAddress = getContract(chainId, "IncentiveKey");
  const uniV3StakerAddress = getContract(chainId, "v3StakerAddress");
  const ALPAddress = getContract(chainId, "ALP");
  const AGXAddress = getContract(chainId, "AGX");
  
  const [isDeposit, setIsDeposit] = useState(false);
  const goDeposit = () => {
    if (isDeposit || !tokenId) {
      return
    }
    if (tokenId === 'Liquidity') {
      setIsDeposit(true);
      const contract = new ethers.Contract(ALPAddress, GLP.abi, signer);
      callContract(chainId, contract, "claim", [account], {
        sentMsg: t`Claim submitted.`,
        failMsg: t`Claim failed.`,
        successMsg: t`Claim completed!`,
        setPendingTxns,
      }).finally(() => {
        setIsDeposit(false);
        setIsVisible(false)
      });
    } else if (tokenId === 'Staking') {
      setIsDeposit(true);
      const contract = new ethers.Contract(uniV3StakerAddress, UniV3Staker.abi, signer);
      callContract(chainId, contract, "claimReward", [AGXAddress,account,Pool2ewards.toNumber()], {
        sentMsg: t`Claim submitted.`,
        failMsg: t`Claim failed.`,
        successMsg: t`Claim completed!`,
        setPendingTxns,
      }).finally(() => {
        setIsDeposit(false);
        setIsVisible(false)
      });
    } else {
      setIsDeposit(true);
      const contract = new ethers.Contract(uniV3StakerAddress, UniV3Staker.abi, signer);
      callContract(chainId, contract, "claimReward", [AGXAddress,account,Pool2ewards], {
        sentMsg: t`Claim submitted.`,
        failMsg: t`Claim failed.`,
        successMsg: t`Claim completed!`,
        setPendingTxns,
      }).finally(() => {
        setIsDeposit(false);
        setIsVisible(false)
      });
    }
  };
  return (
    <div className="StakeModal largeModal">
      <Modal isVisible={isVisible} setIsVisible={setIsVisible} label={title}>
        <div className="claimModal">
          <div className="tabBox">
            <div>
              <Checkbox isChecked={tokenId==='Staking'} setIsChecked={(isChecked)=>{isChecked?setTokenId('Staking'):setTokenId('')}}>
                <span className="muted">
                  <Trans>
                  Staking
                  </Trans>
                </span>
              </Checkbox>
            </div>
            <div>
              1
            </div>
          </div>
          <div className="tabBox">
            <div>
              <Checkbox isChecked={tokenId==='Pool2'} setIsChecked={(isChecked)=>{isChecked?setTokenId('Pool2'):setTokenId('')}}>
                <span className="muted">
                  <Trans>
                  Pool2 Mining
                  </Trans>
                </span>
              </Checkbox>
            </div>
            <div>
              {Pool2ewards && (Number(Pool2ewards)/(10**18)).toFixed(4).toLocaleString()}
            </div>
          </div>
          <div className="tabBox">
            <div>
              <Checkbox isChecked={tokenId==='Liquidity'} setIsChecked={(isChecked)=>{isChecked?setTokenId('Liquidity'):setTokenId('')}}>
                <span className="muted">
                  <Trans>
                  Liquidity Mining
                  </Trans>
                </span>
              </Checkbox>
            </div>
            <div>
              1
            </div>
          </div>
        </div>
        <div>You will receive</div>
        <div className="Exchange-swap-button-container">
          <Button variant="primary-action" className="w-full" onClick={goDeposit}>
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
    setNFTData
  } = props;
  const [tokenId, setTokenId] = useState(null);
  const NFTPositionsManagerAddress = getContract(chainId, "nonfungibleTokenPositionManagerAddress");
  const IncentiveKeyAddress = getContract(chainId, "IncentiveKey");
  const uniV3StakerAddress = getContract(chainId, "v3StakerAddress");
  const ALPAddress = getContract(chainId, "ALP");
  const [isDeposit, setIsDeposit] = useState(false);
  const goDeposit = () => {
    if (isDeposit || !tokenId) {
      return
    }
    setIsDeposit(true);
    const contract = new ethers.Contract(NFTPositionsManagerAddress, NFTPositionsManager.abi, signer);
    callContract(chainId, contract, "safeTransferFrom", [account,uniV3StakerAddress,tokenId], {
      sentMsg: t`Deposit submitted.`,
      failMsg: t`Deposit failed.`,
      successMsg: t`Deposit completed!`,
      setPendingTxns,
    }).finally(() => {
      axios.post('https://sepolia.graph.zklink.io/subgraphs/name/staker', "{\"query\":\"{\\n  nfts(where: {owner: \\\""+ account +"\\\"}) {\\n    tokenId\\n    owner\\n    }\\n}\"}")
      .then(response => {
        const array = response.data.data.nfts.map(item => item.tokenId);
        setNFTData(array);
      })
      .catch(error => {
        console.error('Error:', error);
      });
      setTokenId(null)
      setIsDeposit(false);
      setIsVisible(false)
    });
  };
  return (
    <div className="StakeModal largeModal">
      <Modal isVisible={isVisible} setIsVisible={setIsVisible} label={title}>
        <div className="NFTCard">
          {showNFTdata && showNFTdata.length > 0 && showNFTdata.map((item,index) => {
            return (
              <div key={item} onClick={()=>{setTokenId(item.toNumber())}} className={cx("NFTBox",{ 'tokenActive': tokenId === item.toNumber() })}>
                <img src={URLlist[index]?.image || ''}/>
              </div>
            );
          })}
        </div>
        <div className="Exchange-swap-button-container depositButton">
          <Button variant="primary-action" onClick={goDeposit}>
            {/* {getPrimaryText()} */}
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
            <img
              className="mr-xs icon"
              height="22"
              src={icons[stakingTokenSymbol.toLowerCase()]}
              alt={stakingTokenSymbol}
            />
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
            <img
              className="mr-xs icon"
              height="22"
              src={icons[unstakingTokenSymbol.toLowerCase()]}
              alt={unstakingTokenSymbol}
            />
            {unstakingTokenSymbol}
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
              esGMX
            </div>
          </BuyInputSele>

          <div className="VesterDepositModal-info-rows">
            <div className="Exchange-info-row">
              <div className="Exchange-info-label">
                <Trans>Wallet</Trans>
              </div>
              <div className="align-right">{formatAmount(balance, 18, 2, true)} esGMX</div>
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
      return t`Approving GMX...`;
    }
    if (needApproval) {
      return t`Approve GMX`;
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
              {formatAmount(recommendStakeGmx, 18, 2, true)} GMX or esGMX to be able to stake your unstaked{" "}
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
              <Trans>Claim GMX Rewards</Trans>
            </Checkbox>
          </div>
          <div>
            <Checkbox isChecked={shouldStakeGmx} setIsChecked={toggleShouldStakeGmx}>
              <Trans>Stake GMX Rewards</Trans>
            </Checkbox>
          </div>
          <div>
            <Checkbox isChecked={shouldClaimEsGmx} setIsChecked={setShouldClaimEsGmx} disabled={shouldStakeEsGmx}>
              <Trans>Claim esGMX Rewards</Trans>
            </Checkbox>
          </div>
          <div>
            <Checkbox isChecked={shouldStakeEsGmx} setIsChecked={toggleShouldStakeEsGmx}>
              <Trans>Stake esGMX Rewards</Trans>
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
              <Trans>Claim GMX Rewards</Trans>
            </Checkbox>
          </div>
          <div>
            <Checkbox isChecked={shouldClaimEsGmx} setIsChecked={setShouldClaimEsGmx}>
              <Trans>Claim esGMX Rewards</Trans>
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
            This will claim {formatAmount(totalVesterRewards, 18, 4, true)} GMX.
            <br />
            <br />
            After claiming, you can stake these GMX tokens by using the "Stake" button in the GMX section of this Earn
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

export default function StakeV2() {
  const { active, signer, account } = useWallet();
  const { chainId } = useChainId();
  const { openConnectModal } = useConnectModal();
  const incentiveStats = useIncentiveStats(chainId);

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

  const [isUnstakeModalVisible, setIsUnstakeModalVisible] = useState(false);
  const [unstakeModalTitle, setUnstakeModalTitle] = useState("");
  const [unstakeModalMaxAmount, setUnstakeModalMaxAmount] = useState<BigNumber | undefined>(undefined);
  const [unstakeModalReservedAmount, setUnstakeModalReservedAmount] = useState<BigNumber | undefined>(undefined);
  const [unstakeValue, setUnstakeValue] = useState("");
  const [unstakingTokenSymbol, setUnstakingTokenSymbol] = useState("");
  const [unstakeMethodName, setUnstakeMethodName] = useState("");

  const [isVesterDepositModalVisible, setIsVesterDepositModalVisible] = useState(false);
  const [vesterDepositTitle, setVesterDepositTitle] = useState("");
  const [vesterDepositStakeTokenLabel, setVesterDepositStakeTokenLabel] = useState("");
  const [vesterDepositMaxAmount, setVesterDepositMaxAmount] = useState<BigNumber | undefined>();
  const [vesterDepositBalance, setVesterDepositBalance] = useState<BigNumber | undefined>();
  const [vesterDepositEscrowedBalance, setVesterDepositEscrowedBalance] = useState<BigNumber | undefined>();
  const [vesterDepositVestedAmount, setVesterDepositVestedAmount] = useState<BigNumber | undefined>();
  const [vesterDepositAverageStakedAmount, setVesterDepositAverageStakedAmount] = useState<
    BigNumber | undefined | string
  >("");
  const [vesterDepositMaxVestableAmount, setVesterDepositMaxVestableAmount] = useState<BigNumber | undefined>();
  const [vesterDepositValue, setVesterDepositValue] = useState("");
  const [vesterDepositReserveAmount, setVesterDepositReserveAmount] = useState<BigNumber | undefined>();
  const [vesterDepositMaxReserveAmount, setVesterDepositMaxReserveAmount] = useState<BigNumber | undefined>();
  const [vesterDepositAddress, setVesterDepositAddress] = useState("");

  const [isVesterWithdrawModalVisible, setIsVesterWithdrawModalVisible] = useState(false);
  const [isAffiliateVesterWithdrawModalVisible, setIsAffiliateVesterWithdrawModalVisible] = useState(false);
  const [vesterWithdrawTitle, setVesterWithdrawTitle] = useState("");
  const [vesterWithdrawAddress, setVesterWithdrawAddress] = useState("");

  const [isCompoundModalVisible, setIsCompoundModalVisible] = useState(false);
  const [isClaimModalVisible, setIsClaimModalVisible] = useState(false);
  const [isAffiliateClaimModalVisible, setIsAffiliateClaimModalVisible] = useState(false);
  const [selectTab, setselectTab] = useState('Staking');
  const [NFTdata, setNFTData] = useState<any[]>([]);
  const [depNFTData, setDepNFTData] = useState<any[]>([]);
  const [depNFTDataId, setDepNFTDataId] = useState<any[]>([]);
  const [showNFTdata, setshowNFTData] = useState<any[]>([]);
  const [stakeliquidity, setstakeliquidity] = useState('');
  const [NFTClaimed, setNFTClaimed] = useState('');
  const [totalReward, setTotalReward] = useState('');
  const [poolValue, setpoolValue] = useState(0);
  const [stakeAllValue, setstakeAllValue] = useState(0);
  const [stakeAPRValue, setstakeAPRValue] = useState('');
  const [AGXVFTValue, setAGXVFTValue] = useState('');

  const rewardRouterAddress = getContract(chainId, "RewardRouter");
  const rewardReaderAddress = getContract(chainId, "RewardReader");
  const readerAddress = getContract(chainId, "Reader");

  const EthPoolAddress = getContract(chainId, "UniswapAGXEthPool");
  const vaultAddress = getContract(chainId, "Vault");
  const nativeTokenAddress = getContract(chainId, "NATIVE_TOKEN");
  const gmxAddress = getContract(chainId, "GMX");
  const esGmxAddress = getContract(chainId, "ES_GMX");
  const bnGmxAddress = getContract(chainId, "BN_GMX");
  const glpAddress = getContract(chainId, "GLP");

  const stakedGmxTrackerAddress = getContract(chainId, "StakedGmxTracker");
  const bonusGmxTrackerAddress = getContract(chainId, "BonusGmxTracker");
  const feeGmxTrackerAddress = getContract(chainId, "FeeGmxTracker");

  const stakedGlpTrackerAddress = getContract(chainId, "StakedGlpTracker");
  const feeGlpTrackerAddress = getContract(chainId, "FeeGlpTracker");

  const glpManagerAddress = getContract(chainId, "GlpManager");

  const timeDistributorAddress = getContract(chainId, "TimeDistributor");
  const yieldTrackerAddress = getContract(chainId, "YieldTracker");

  const NFTPositionsManagerAddress = getContract(chainId, "nonfungibleTokenPositionManagerAddress");
  const dexreaderAddress = getContract(chainId, "dexreader");
  const uniV3StakerAddress = getContract(chainId, "v3StakerAddress");
  const v3FactoryAddress = getContract(chainId, "v3Factory");
  const IncentiveKeyAddress = getContract(chainId, "IncentiveKey");

  const stakedGmxDistributorAddress = getContract(chainId, "StakedGmxDistributor");
  const stakedGlpDistributorAddress = getContract(chainId, "StakedGlpDistributor");

  const gmxVesterAddress = getContract(chainId, "GmxVester");
  const glpVesterAddress = getContract(chainId, "GlpVester");
  const affiliateVesterAddress = getContract(chainId, "AffiliateVester");
  const AGXAddress = getContract(chainId, "AGX");
  const wethAddress = getContract(chainId, "WethSwap");
  const ALPAddress = getContract(chainId, "ALP");

  const excludedEsGmxAccounts = [stakedGmxDistributorAddress, stakedGlpDistributorAddress];

  const nativeTokenSymbol = getConstant(chainId, "nativeTokenSymbol");
  const wrappedTokenSymbol = getConstant(chainId, "wrappedTokenSymbol");


  useEffect(() => {
    axios.post('https://sepolia.graph.zklink.io/subgraphs/name/staker', "{\"query\":\"{\\n  nfts(where: {owner: \\\""+ account +"\\\"}) {\\n    tokenId\\n    owner\\n    }\\n}\"}")
      .then(response => {
        const array = response.data.data.nfts.map(item => item.tokenId);
        setNFTData(array);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    axios.post('https://sepolia.graph.zklink.io/subgraphs/name/staker', "{\"query\":\"{\\n  positions(where: {owner: \\\""+ account +"\\\"}) {\\n    tokenId\\n    owner\\n    staked\\n    incentiveId\\n    }\\n}\"}")
      .then(response => {
        const array = response.data.data.positions.map(item => item.tokenId);
        setDepNFTData(response.data.data.positions);
        setDepNFTDataId(array)
      })
      .catch(error => {
        console.error('Error:', error);
      });
    axios.post('https://sepolia.graph.zklink.io/subgraphs/name/staker', "{\"query\":\"{\\n  incentives {\\n    liquidity\\n    }\\n}\"}")
      .then(response => {
        setstakeliquidity(response.data.data.incentives[0].liquidity)
      })
      .catch(error => {
        console.error('Error:', error);
      });
    axios.post('https://sepolia.graph.zklink.io/subgraphs/name/staker', "{\"query\":\"{\\n  incentives {\\n    id\\n    liquidity\\n    claimedToken\\n    }\\n}\"}")
      .then(response => {
        setNFTClaimed(response.data.data.incentives[0].claimedToken)
      })
      .catch(error => {
        console.error('Error:', error);
      });
    axios.post('https://sepolia.graph.zklink.io/subgraphs/name/staker', "{\"query\":\"{\\n  totalRewards(where: {owner: \\\""+ account +"\\\"})  {\\n    owner\\n    reward\\n    }\\n}\"}")
      .then(response => {
        setTotalReward(response.data.data.totalRewards[0].reward)
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);
  const walletTokens = [gmxAddress, esGmxAddress, glpAddress, stakedGmxTrackerAddress];
  const depositTokens = [
    gmxAddress,
    esGmxAddress,
    stakedGmxTrackerAddress,
    bonusGmxTrackerAddress,
    bnGmxAddress,
    glpAddress,
  ];
  const rewardTrackersForDepositBalances = [
    stakedGmxTrackerAddress,
    stakedGmxTrackerAddress,
    bonusGmxTrackerAddress,
    feeGmxTrackerAddress,
    feeGmxTrackerAddress,
    feeGlpTrackerAddress,
  ];
  const rewardTrackersForStakingInfo = [
    stakedGmxTrackerAddress,
    bonusGmxTrackerAddress,
    feeGmxTrackerAddress,
    stakedGlpTrackerAddress,
    feeGlpTrackerAddress,
  ];
  const stakedBnGmxSupply = useStakedBnGMXAmount(chainId);
  const { marketsInfoData, tokensData } = useMarketsInfoRequest(chainId);
  const { marketTokensData } = useMarketTokensData(chainId, { isDeposit: false });
  const { marketsTokensAPRData, marketsTokensIncentiveAprData } = useMarketTokensAPR(chainId);
  const vestingData = useVestingData(account);

  const { data: walletBalances } = useSWR(
    [
      `StakeV2:walletBalances:${active}`,
      chainId,
      readerAddress,
      "getTokenBalancesWithSupplies",
      account || PLACEHOLDER_ACCOUNT,
    ],
    {
      fetcher: contractFetcher(signer, ReaderV2, [walletTokens]),
    }
  );

  const { data: depositBalances } = useSWR(
    [
      `StakeV2:depositBalances:${active}`,
      chainId,
      rewardReaderAddress,
      "getDepositBalances",
      account || PLACEHOLDER_ACCOUNT,
    ],
    {
      fetcher: contractFetcher(signer, RewardReader, [depositTokens, rewardTrackersForDepositBalances]),
    }
  );

  const { data: stakingInfo } = useSWR(
    [`StakeV2:stakingInfo:${active}`, chainId, rewardReaderAddress, "getStakingInfo", account || PLACEHOLDER_ACCOUNT],
    {
      fetcher: contractFetcher(signer, RewardReader, [rewardTrackersForStakingInfo]),
    }
  );

  const { data: stakedGmxSupply } = useSWR(
    [`StakeV2:stakedGmxSupply:${active}`, chainId, gmxAddress, "balanceOf", stakedGmxTrackerAddress],
    {
      fetcher: contractFetcher(signer, Token),
    }
  );
  const { data: AGXBalance } = useSWR([`GlpSwap:glpBalance:${active}`, chainId, AGXAddress, "balanceOf", account], {
    fetcher: contractFetcher(signer, GLP),
  });
  const { data: aums } = useSWR([`StakeV2:getAums:${active}`, chainId, glpManagerAddress, "getAums"], {
    fetcher: contractFetcher(signer, GlpManager),
  });

  const { data: totalEmissions } = useSWR(
    [`StakeV2:totalEmission:${active}`, chainId, timeDistributorAddress, "totalEmission"],
    {
      fetcher: contractFetcher(signer, TimeDistributor),
    }
  );
  const { data: totalClaimed } = useSWR([`StakeV2:totalClaim:${active}`, chainId, yieldTrackerAddress, "totalClaim"], {
    fetcher: contractFetcher(signer, YieldEmission),
  });
  const { data: perinterval } = useSWR(
    [`StakeV2:getTokensPerInterval:${active}`, chainId, yieldTrackerAddress, "getTokensPerInterval"],
    {
      fetcher: contractFetcher(signer, YieldTracker),
    }
  );
  const { data: rewards } = useSWR([`StakeV2:claimable:${active}`, chainId, yieldTrackerAddress, "claimable"], {
    fetcher: contractFetcher(signer, YieldTracker, [account]),
  });
  const { data: nativeTokenPrice } = useSWR(
    [`StakeV2:nativeTokenPrice:${active}`, chainId, vaultAddress, "getMinPrice", nativeTokenAddress],
    {
      fetcher: contractFetcher(signer, Vault),
    }
  );
  const { data: esGmxSupply } = useSWR(
    [`StakeV2:esGmxSupply:${active}`, chainId, readerAddress, "getTokenSupply", esGmxAddress],
    {
      fetcher: contractFetcher(signer, ReaderV2, [excludedEsGmxAccounts]),
    }
  );
  const accumulatedBnGMXAmount = useAccumulatedBnGMXAmount();

  const maxBoostBasicPoints = useMaxBoostBasicPoints();

  const { gmxPrice, gmxPriceFromArbitrum, gmxPriceFromAvalanche } = useGmxPrice(
    chainId,
    { arbitrum: chainId === ARBITRUM ? signer : undefined },
    active
  );

  let { total: totalGmxSupply } = useTotalGmxSupply();

  const stakedGMXInfo = useTotalGmxStaked();
  const { [AVALANCHE]: avaxGmxStaked, [ARBITRUM]: arbitrumGmxStaked, total: totalGmxStaked } = stakedGMXInfo;

  const gmxSupplyUrl = getServerUrl(chainId, "/gmx_supply");
  const { data: gmxSupply } = useSWR([gmxSupplyUrl], {
    fetcher: (args) => fetch(...args).then((res) => res.text()),
  });

  const isGmxTransferEnabled = true;

  let esGmxSupplyUsd;
  if (esGmxSupply && gmxPrice) {
    esGmxSupplyUsd = esGmxSupply.mul(gmxPrice).div(expandDecimals(1, 18));
  }

  let aum;
  if (aums && aums.length > 0) {
    aum = aums[0].add(aums[1]).div(2);
  }

  let perinter;
  if (perinterval) {
    perinter = perinterval.mul(24);
  }
  const { balanceData, supplyData } = useMemo(() => getBalanceAndSupplyData(walletBalances), [walletBalances]);
  const depositBalanceData = useMemo(() => getDepositBalanceData(depositBalances), [depositBalances]);
  const stakingData = useMemo(() => getStakingData(stakingInfo), [stakingInfo]);

  const userTotalGmInfo = useMemo(() => {
    if (!active) return;
    return getTotalGmInfo(marketTokensData);
  }, [marketTokensData, active]);

  const processedData = getProcessedData(
    balanceData,
    supplyData,
    depositBalanceData,
    stakingData,
    vestingData,
    aum,
    nativeTokenPrice,
    stakedGmxSupply,
    stakedBnGmxSupply,
    gmxPrice,
    gmxSupply,
    maxBoostBasicPoints?.div(BASIS_POINTS_DIVISOR)
  );

  let hasMultiplierPoints = false;
  let multiplierPointsAmount;
  if (accumulatedBnGMXAmount && processedData?.bnGmxInFeeGmx) {
    multiplierPointsAmount = accumulatedBnGMXAmount.add(processedData.bnGmxInFeeGmx);
    if (multiplierPointsAmount.gt(0)) {
      hasMultiplierPoints = true;
    }
  }
  let totalRewardTokens;

  if (processedData && processedData.bnGmxInFeeGmx && processedData.bonusGmxInFeeGmx) {
    totalRewardTokens = processedData.bnGmxInFeeGmx.add(processedData.bonusGmxInFeeGmx);
  }

  let totalRewardAndLpTokens = totalRewardTokens ?? bigNumberify(0);
  if (processedData?.glpBalance) {
    totalRewardAndLpTokens = totalRewardAndLpTokens.add(processedData.glpBalance);
  }
  if (userTotalGmInfo?.balance?.gt(0)) {
    totalRewardAndLpTokens = totalRewardAndLpTokens.add(userTotalGmInfo.balance);
  }

  const bonusGmxInFeeGmx = processedData ? processedData.bonusGmxInFeeGmx : undefined;

  let stakedGmxSupplyUsd;
  if (!totalGmxStaked.isZero() && gmxPrice) {
    stakedGmxSupplyUsd = totalGmxStaked.mul(gmxPrice).div(expandDecimals(1, 18));
  }

  let totalSupplyUsd;
  if (totalGmxSupply && !totalGmxSupply.isZero() && gmxPrice) {
    totalSupplyUsd = totalGmxSupply.mul(gmxPrice).div(expandDecimals(1, 18));
  }

  let maxUnstakeableGmx = bigNumberify(0);
  if (
    totalRewardTokens &&
    vestingData &&
    vestingData.gmxVesterPairAmount &&
    multiplierPointsAmount &&
    processedData?.bonusGmxInFeeGmx
  ) {
    const availableTokens = totalRewardTokens.sub(vestingData.gmxVesterPairAmount);
    const stakedTokens = processedData.bonusGmxInFeeGmx;
    const divisor = multiplierPointsAmount.add(stakedTokens);
    if (divisor.gt(0)) {
      maxUnstakeableGmx = availableTokens.mul(stakedTokens).div(divisor);
    }
  }

  const showDepositModals = () => {
    if (NFTlist.length >0) {
      setDepositModalVisible(true);
    }
  };
  const showStakeGmxModals = () => {
    setIsStakeModalVisible(true);
    setStakeModalTitle(t`Stake FOM`);
    setStakeModalMaxAmount(processedData?.gmxBalance);
    setStakeValue("");
    setStakingTokenSymbol("GMX");
    setStakingTokenAddress(gmxAddress);
    setStakingFarmAddress(stakedGmxTrackerAddress);
    setStakeMethodName("stakeGmx");
  };
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
      shouldStakeGmx: true,
      shouldStakeEsGmx: true,
    }
  );

  const renderBoostPercentageTooltip = useCallback(() => {
    return (
      <div>
        <Trans>
          You are earning {formatAmount(processedData?.boostBasisPoints, 2, 2, false)}% more {nativeTokenSymbol} rewards
          using {formatAmount(processedData?.bnGmxInFeeGmx, 18, 4, true)} Staked Multiplier Points.
        </Trans>
        <br />
        <br />
        {recommendStakeGmx.gt(0) ? (
          <Trans>
            You have reached the maximum Boost Percentage. Stake an additional{" "}
            {formatAmount(recommendStakeGmx, 18, 2, true)} GMX or esGMX to be able to stake your unstaked{" "}
            {formatAmount(accumulatedBnGMXAmount, 18, 4, true)} Multiplier Points using the "Compound" button.
          </Trans>
        ) : (
          <Trans>Use the "Compound" button to stake your Multiplier Points.</Trans>
        )}
      </div>
    );
  }, [nativeTokenSymbol, processedData, recommendStakeGmx, accumulatedBnGMXAmount]);

  const gmxAvgAprText = useMemo(() => {
    return `${formatAmount(processedData?.avgGMXAprForNativeToken, 2, 2, true)}%`;
  }, [processedData?.avgGMXAprForNativeToken]);

  const renderMultiplierPointsLabel = useCallback(() => {
    return t`Multiplier Points APR`;
  }, []);

  const renderMultiplierPointsValue = useCallback(() => {
    return (
      <Tooltip
        handle={`100.00%`}
        position="bottom-end"
        renderContent={() => {
          return (
            <Trans>
              Boost your rewards with Multiplier Points.&nbsp;
              <ExternalLink href="https://docs.gmx.io/docs/tokenomics/rewards#multiplier-points">
                Read more
              </ExternalLink>
              .
            </Trans>
          );
        }}
      />
    );
  }, []);

  let earnMsg;
  if (totalRewardAndLpTokens && totalRewardAndLpTokens.gt(0)) {
    let gmxAmountStr;
    if (processedData?.gmxInStakedGmx?.gt(0)) {
      gmxAmountStr = formatAmount(processedData.gmxInStakedGmx, 18, 2, true) + " GMX";
    }
    let esGmxAmountStr;
    if (processedData?.esGmxInStakedGmx?.gt(0)) {
      esGmxAmountStr = formatAmount(processedData.esGmxInStakedGmx, 18, 2, true) + " esGMX";
    }
    let mpAmountStr;
    if (processedData?.bnGmxInFeeGmx?.gt(0)) {
      mpAmountStr = formatAmount(processedData.bnGmxInFeeGmx, 18, 2, true) + " MP";
    }
    let glpStr;
    if (processedData?.glpBalance?.gt(0)) {
      glpStr = formatAmount(processedData.glpBalance, 18, 2, true) + " GLP";
    }
    let gmStr;
    if (userTotalGmInfo?.balance && userTotalGmInfo?.balance.gt(0)) {
      gmStr = formatAmount(userTotalGmInfo.balance, 18, 2, true) + " GM";
    }
    const amountStr = [gmxAmountStr, esGmxAmountStr, mpAmountStr, gmStr, glpStr].filter((s) => s).join(", ");
    earnMsg = (
      <div>
        <Trans>
          You are earning rewards with {formatAmount(totalRewardAndLpTokens, 18, 2, true)} tokens.
          <br />
          Tokens: {amountStr}.
        </Trans>
      </div>
    );
  }

  const stakedEntries = useMemo(
    () => ({
      "Staked on Arbitrum": arbitrumGmxStaked,
      "Staked on Avalanche": avaxGmxStaked,
    }),
    [arbitrumGmxStaked, avaxGmxStaked]
  );

  const [isClaiming, setIsClaiming] = useState(false);
  const isPrimaryEnabled = () => {
    return !isClaiming;
  };

  const getPrimaryText = () => {
    if (isClaiming) {
      return t`Claiming...`;
    }
    return t`Claim All`;
  };
  const onClickPrimary = () => {
    setClaimModalVisible(true)
  };

  const { data: depNFTlist } = useSWR([`StakeV2:getSpecificNftId:${active}`, chainId, dexreaderAddress, "getSpecificNftIds"], {
    fetcher: contractFetcher(signer, DexReader,[depNFTDataId,AGXAddress,wethAddress]),
  });
  let depNFTlists = depNFTlist && depNFTData.filter((it)=>{
    return depNFTlist.some((i)=>{
      return i.toNumber() == Number(it.tokenId) 
    })
  })
  const { data: depBaselist } = useSWR([`StakeV2:getTokenURI:${active}`, chainId, dexreaderAddress, "getTokenURIs"], {
    fetcher: contractFetcher(signer, DexReader,[depNFTDataId]),
  });
  // console.log(depNFTDataId)
  // console.log(depBaselist)
  // const depUrlList = depBaselist && depBaselist[0] && depBaselist[0].length> 0&&depBaselist[0].map((base)=>{
  //   let str = Buffer.from(base.split(',')[1], 'base64').toString('utf-8');
  //   return JSON.parse(str)
  // })
  const depUrlList = depNFTlists && depNFTlists.map((id,ind) => {
    let obj = {}
    depBaselist && depBaselist[0] && depBaselist[0].length> 0&&depBaselist[0].map((base,index)=>{
      if (Number(id) === Number(depBaselist[1][index])) {
        obj = JSON.parse(Buffer.from(base.split(',')[1], 'base64').toString('utf-8'))
      }
    })
    return obj
  })
  // console.log(depUrlList)
  const { data: NFTlist } = useSWR([`StakeV2:getSpecificNftIds:${active}`, chainId, dexreaderAddress, "getSpecificNftIds"], {
    fetcher: contractFetcher(signer, DexReader,[NFTdata,AGXAddress,wethAddress]),
  });
  // console.log(NFTlist)
  const { data: baselist } = useSWR([`StakeV2:getTokenURIs:${active}`, chainId, dexreaderAddress, "getTokenURIs"], {
    fetcher: contractFetcher(signer, DexReader,[NFTdata]),
  });
  const { data: Pool2ewards } = useSWR([`StakeV2:rewards:${active}`, chainId, uniV3StakerAddress, "rewards"], {
    fetcher: contractFetcher(signer, UniV3Staker,[AGXAddress,account]),
  });
  // console.log(Number(Pool2ewards))
  const { data: Pooladdress } = useSWR([`StakeV2:getPool:${active}`, chainId, v3FactoryAddress, "getPool"], {
    fetcher: contractFetcher(signer, UniswapV3Factory,[AGXAddress,EthPoolAddress,10000]),
  });
  // console.log(baselist)
  // console.log(NFTlist)

  const urlList = NFTlist && NFTlist.map((id,ind) => {
    let obj = {}
    baselist && baselist[0] && baselist[0].length> 0&&baselist[0].map((base,index)=>{
      if (Number(id) === Number(baselist[1][index])) {
        obj = JSON.parse(Buffer.from(base.split(',')[1], 'base64').toString('utf-8'))
      }
    })
    return obj
  })
  // console.log(urlList)
  const { data: rewardRate } = useSWR(
    [`StakeV2:rewardRate:${active}`, chainId, yieldTrackerAddress, "rewardRate"],
    {
      fetcher: contractFetcher(signer, YieldEmission),
    }
  );
  // console.log(Number(rewardRate)/(10**18))
  const { agxPrice } = useAGXPrice();
  const ethAddress = getTokenBySymbol(ARBITRUM, "WETH").address;
  const { data: ethPrice, mutate: updateEthPrice } = useSWR<BigNumber>(
    [`StakeV3:ethPrice`, ARBITRUM, vaultAddress, "getMinPrice", ethAddress],
    {
      fetcher: contractFetcher(undefined, Vault) as any,
    }
  );
  Pooladdress && axios.post('http://13.115.181.197:8000/subgraphs/name/novasap-subgraph', "{\"query\":\"{\\n  pool(id: \\\""+ Pooladdress.toLowerCase() +"\\\") {\\n    token0 {\\nid\\n}\\n    token1 {\\nid\\n}\\n    liquidity\\n    totalValueLockedToken0\\n    totalValueLockedToken1\\n    }\\n}\"}")
  .then(response => {
    let num = 0
    // console.log(agxPrice)
    // console.log(Number(ethPrice)/(10**30))
    if (response.data.data.pool.token0.id.toLowerCase() === AGXAddress) {
      // (totalValueLockedToken0 * token0 price) + (totalValueLockedToken1 * token1 price)
      num = (Number(response.data.data.pool.totalValueLockedToken0) * agxPrice) + (Number(response.data.data.pool.totalValueLockedToken1) * Number(ethPrice)/(10**30))
      let AGXVFTValue = Number(stakeliquidity)/Number(response.data.data.pool.liquidity)*Number(response.data.data.pool.totalValueLockedToken0)
      setAGXVFTValue(AGXVFTValue.toLocaleString())
    } else {
      num = (Number(response.data.data.pool.totalValueLockedToken1) * agxPrice) + (Number(response.data.data.pool.totalValueLockedToken0) * Number(ethPrice)/(10**30))
      let AGXVFTValue = Number(stakeliquidity)/Number(response.data.data.pool.liquidity)*Number(response.data.data.pool.totalValueLockedToken1)
      setAGXVFTValue(AGXVFTValue.toLocaleString())
    }
    setpoolValue(num)
    setstakeAllValue(num*Number(stakeliquidity)/Number(response.data.data.pool.liquidity))
    //   (agxprice * x)  / stake   TODO
    let stakeAPRValue = Number(stakeliquidity) === 0? '0':((agxPrice*20000000)/stakeAllValue).toFixed(2)
    setstakeAPRValue(Number(stakeAPRValue).toLocaleString())
  })
  .catch(error => {
    console.error('Error:', error);
  });
  const stake = (tokenId) => {
    const contract = new ethers.Contract(uniV3StakerAddress, UniV3Staker.abi, signer);
    callContract(chainId, contract, "stakeToken", [IncentiveKeyAddress,tokenId], {
      sentMsg: t`Stake submitted.`,
      failMsg: t`Stake failed.`,
      successMsg: t`Stake completed!`,
      setPendingTxns,
    }).finally(() => {
      axios.post('https://sepolia.graph.zklink.io/subgraphs/name/staker', "{\"query\":\"{\\n  positions(where: {owner: \\\""+ account +"\\\"}) {\\n    tokenId\\n    owner\\n    staked\\n    incentiveId\\n    }\\n}\"}")
      .then(response => {
        const array = response.data.data.positions.map(item => item.tokenId);
        setDepNFTData(response.data.data.positions);
        setDepNFTDataId(array)
      })
      .catch(error => {
        console.error('Error:', error);
      });
      depNFTlists = depNFTlist && depNFTData.filter((it)=>{
        return depNFTlist.some((i)=>{
          return i.toNumber() == Number(it.tokenId) 
        })
      })
    });
  };
  const Withdraw = (tokenId) => {
    const contract = new ethers.Contract(uniV3StakerAddress, UniV3Staker.abi, signer);
    callContract(chainId, contract, "withdrawToken", [tokenId, account,'0x'], {
      sentMsg: t`Withdraw submitted.`,
      failMsg: t`Withdraw failed.`,
      successMsg: t`Withdraw completed!`,
      setPendingTxns,
    }).finally(() => {
      axios.post('https://sepolia.graph.zklink.io/subgraphs/name/staker', "{\"query\":\"{\\n  positions(where: {owner: \\\""+ account +"\\\"}) {\\n    tokenId\\n    owner\\n    staked\\n    incentiveId\\n    }\\n}\"}")
      .then(response => {
        const array = response.data.data.positions.map(item => item.tokenId);
        setDepNFTData(response.data.data.positions);
        setDepNFTDataId(array)
      })
      .catch(error => {
        console.error('Error:', error);
      });
      depNFTlists = depNFTlist && depNFTData.filter((it)=>{
        return depNFTlist.some((i)=>{
          return i.toNumber() == Number(it.tokenId) 
        })
      })
    });
  };

  const Unstake = (tokenId) => {
    const contract = new ethers.Contract(uniV3StakerAddress, UniV3Staker.abi, signer);
    callContract(chainId, contract, "unstakeToken", [IncentiveKeyAddress,tokenId], {
      sentMsg: t`Unstake submitted.`,
      failMsg: t`Unstake failed.`,
      successMsg: t`Unstake completed!`,
      setPendingTxns,
    }).finally(() => {
      axios.post('https://sepolia.graph.zklink.io/subgraphs/name/staker', "{\"query\":\"{\\n  positions(where: {owner: \\\""+ account +"\\\"}) {\\n    tokenId\\n    owner\\n    staked\\n    incentiveId\\n    }\\n}\"}")
      .then(response => {
        const array = response.data.data.positions.map(item => item.tokenId);
        setDepNFTData(response.data.data.positions);
        setDepNFTDataId(array)
      })
      .catch(error => {
        console.error('Error:', error);
      });
      depNFTlists = depNFTlist && depNFTData.filter((it)=>{
        return depNFTlist.some((i)=>{
          return i.toNumber() == Number(it.tokenId) 
        })
      })
    });
  };

  const [feeBasisPoints, setFeeBasisPoints] = useState("");
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
    aum1 = aums[0]
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
    history.push('/buy');
  };
  return (
    <div className="default-container page-layout">
      <ClaimAllModal
        isVisible={claimModalVisible}
        setIsVisible={setClaimModalVisible}
        chainId={chainId}
        title='Claim All'
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
      />
      <DepositModal
        isVisible={depositModalVisible}
        setIsVisible={setDepositModalVisible}
        chainId={chainId}
        title='Choose your AGX-ETH NFT'
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
      />
      <StakeModal
        isVisible={isStakeModalVisible}
        setIsVisible={setIsStakeModalVisible}
        chainId={chainId}
        title={stakeModalTitle}
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
      />
      <UnstakeModal
        setPendingTxns={setPendingTxns}
        isVisible={isUnstakeModalVisible}
        setIsVisible={setIsUnstakeModalVisible}
        chainId={chainId}
        title={unstakeModalTitle}
        maxAmount={unstakeModalMaxAmount}
        reservedAmount={unstakeModalReservedAmount}
        value={unstakeValue}
        setValue={setUnstakeValue}
        signer={signer}
        unstakingTokenSymbol={unstakingTokenSymbol}
        rewardRouterAddress={rewardRouterAddress}
        unstakeMethodName={unstakeMethodName}
        multiplierPointsAmount={multiplierPointsAmount}
        bonusGmxInFeeGmx={bonusGmxInFeeGmx}
        processedData={processedData}
        nativeTokenSymbol={nativeTokenSymbol}
      />
      <VesterDepositModal
        isVisible={isVesterDepositModalVisible}
        setIsVisible={setIsVesterDepositModalVisible}
        chainId={chainId}
        title={vesterDepositTitle}
        stakeTokenLabel={vesterDepositStakeTokenLabel}
        maxAmount={vesterDepositMaxAmount}
        balance={vesterDepositBalance}
        escrowedBalance={vesterDepositEscrowedBalance}
        vestedAmount={vesterDepositVestedAmount}
        averageStakedAmount={vesterDepositAverageStakedAmount}
        maxVestableAmount={vesterDepositMaxVestableAmount}
        reserveAmount={vesterDepositReserveAmount}
        maxReserveAmount={vesterDepositMaxReserveAmount}
        value={vesterDepositValue}
        setValue={setVesterDepositValue}
        signer={signer}
        vesterAddress={vesterDepositAddress}
        setPendingTxns={setPendingTxns}
      />
      <VesterWithdrawModal
        isVisible={isVesterWithdrawModalVisible}
        setIsVisible={setIsVesterWithdrawModalVisible}
        vesterAddress={vesterWithdrawAddress}
        chainId={chainId}
        title={vesterWithdrawTitle}
        signer={signer}
        setPendingTxns={setPendingTxns}
      />
      <AffiliateVesterWithdrawModal
        isVisible={isAffiliateVesterWithdrawModalVisible}
        setIsVisible={setIsAffiliateVesterWithdrawModalVisible}
        chainId={chainId}
        signer={signer}
        setPendingTxns={setPendingTxns}
      />
      <CompoundModal
        active={active}
        account={account}
        setPendingTxns={setPendingTxns}
        isVisible={isCompoundModalVisible}
        multiplierPointsAmount={multiplierPointsAmount}
        processedData={processedData}
        setIsVisible={setIsCompoundModalVisible}
        rewardRouterAddress={rewardRouterAddress}
        totalVesterRewards={processedData?.totalVesterRewards}
        wrappedTokenSymbol={wrappedTokenSymbol}
        nativeTokenSymbol={nativeTokenSymbol}
        signer={signer}
        chainId={chainId}
      />
      <ClaimModal
        active={active}
        account={account}
        setPendingTxns={setPendingTxns}
        isVisible={isClaimModalVisible}
        setIsVisible={setIsClaimModalVisible}
        rewardRouterAddress={rewardRouterAddress}
        totalVesterRewards={processedData?.totalVesterRewards}
        wrappedTokenSymbol={wrappedTokenSymbol}
        nativeTokenSymbol={nativeTokenSymbol}
        signer={signer}
        chainId={chainId}
      />
      <AffiliateClaimModal
        signer={signer}
        chainId={chainId}
        setPendingTxns={setPendingTxns}
        isVisible={isAffiliateClaimModalVisible}
        setIsVisible={setIsAffiliateClaimModalVisible}
        totalVesterRewards={vestingData?.affiliateVesterClaimable ?? BN_ZERO}
      />
      <div className="box-padding">
        <PageTitle
          isTop
          title={t`Earn`}
          subtitle={
            <div>
              <Trans>Earn reward from trading fees and liquidity mining</Trans>
              {earnMsg && <div className="Page-description">{earnMsg}</div>}
            </div>
          }
        />
        <div className="App-card App-card-space-between StakeV2-content">
          <div className="StakeV2-title">AGX Statistics</div>
          <div className="StakeV2-box">
            <div className="StakeV2-totalBox">
              <div className="StakeV2-tit">Total Emissions</div>
              <div>{formatAmount(totalEmissions, 18, 2, true)}</div>
            </div>
            <div className="StakeV2-totalBox">
              <div className="StakeV2-tit">Total Claimed</div>
              <div>{NFTClaimed && ((Number(totalClaimed)/(10**18))+(Number(NFTClaimed)/(10**18))).toLocaleString()}</div>
            </div>
            <div className="StakeV2-totalBox">
              <div className="StakeV2-tit">Current Emisions</div>
              <div>{formatAmount(perinter, 18, 2, true)}</div>
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
              <div className="StakeV2-claimNum">{agxPrice && Pool2ewards && rewards && ((Number(Pool2ewards)/(10**18) + Number(rewards)/(10**18))*agxPrice).toFixed(2).toLocaleString()}</div>
              <div className="StakeV2-claimToken">USDT</div>
            </div>
            <div className="StakeV2-claimBox">
              <div className="StakeV2-claimNum">{Pool2ewards && rewards && (Number(Pool2ewards)/(10**18) + Number(rewards)/(10**18)).toFixed(2).toLocaleString()}</div>
              <div className="StakeV2-claimToken">AGX</div>
            </div>
            <Button
              variant="secondary"
              className="StakeV2-button"
              onClick={onClickPrimary}
              disabled={!rewards}
            >
              {getPrimaryText()}
            </Button>
          </div>
        </div>

        <div className="App-card App-card-space-between StakeV2-content">
          <div className="tabBox">
            <div className={cx("tab", { 'active': selectTab === 'Staking' })} onClick={()=>setselectTab('Staking')}>Staking</div>
            <div className={cx("tab", { 'active': selectTab === 'Pool2' })} onClick={()=>setselectTab('Pool2')}>Pool2 Mining</div>
            <div className={cx("tab", { 'active': selectTab === 'Liquidity' })} onClick={()=>setselectTab('Liquidity')}>Liquidity Mining</div>
          </div>
          <div className={cx("StakeV2-box between", { 'ishide': selectTab === 'Liquidity' })}>
            <div className="halfBox">
              <div className="StakeV2-stakeTitle padLeft">Overview</div>
              <div className={cx("mobileBox", {'ishide': selectTab !== 'Staking','show': selectTab === 'Staking' })}>
                <div className="StakeV2-fomBox">
                  <div className="StakeV2-tit">APR</div>
                  <div>1,333,213</div>
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
              <div className={cx("mobileBox", {'ishide': selectTab !== 'Pool2','show': selectTab === 'Pool2' })}>
                <div className="StakeV2-fomBox">
                  <div className="StakeV2-tit">APR</div>
                  <div>{stakeAPRValue}</div>
                </div>
                <div className="StakeV2-fomBox">
                  <div className="StakeV2-tit">Stake AGX in LP NFT:</div>
                  <div>{AGXVFTValue}</div>
                </div>
                <div className="StakeV2-fomBox">
                  <div className="StakeV2-tit">TVL</div>
                  <div>0</div>
                </div>
              </div>
            </div>
            <div className="halfBox">
              <div className="StakeV2-stakeTitle padLeft">My Data</div>
              <div className={cx("mobileBox", {'ishide': selectTab !== 'Staking','show': selectTab === 'Staking' })}>
                <div className="StakeV2-fomBox">
                  <div className="StakeV2-tit">AGX</div>
                  <div>{formatAmount(AGXBalance, 18, 2, true)}</div>
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
              <div className={cx("mobileBox", {'ishide': selectTab !== 'Pool2','show': selectTab === 'Pool2' })}>
                <div className="StakeV2-fomBox">
                  <div className="StakeV2-tit">Staked AGX in LP NFT</div>
                  <div>{formatAmount(AGXBalance, 18, 2, true)}</div>
                </div>
                <div className="StakeV2-fomBox">
                  <div className="StakeV2-tit">Total Reward</div>
                  <div>{(Number(totalReward)/(10**18)).toFixed(2).toLocaleString()}</div>
                </div>
                <div className="StakeV2-fomBox">
                  <div className="StakeV2-tit">Claimable Rewards</div>
                  <div>{Pool2ewards && (Number(Pool2ewards)/(10**18)).toFixed(2).toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
          <div className={cx("StakeV2-box marBottom", {'ishide': selectTab !== 'Staking','isShow': selectTab === 'Staking' })}>
            <div className="StakeV2-stakeTitle padLeft">Stake AGX</div>
            <Button variant="secondary" className="StakeV2-stakeButton" onClick={() => showStakeGmxModals()}>
              <Trans>Stake AGX</Trans>
            </Button>
          </div>
          <div className="tolong">
            <div className={cx("StakeV2-box marBottom", { 'ishide': selectTab !== 'Pool2' }, { 'isShow': selectTab === 'Pool2' })}>
              <div className="StakeV2-stakeTitle padLeft">Stake AGX-ETH LP</div>
              <Button variant="secondary" className="StakeV2-stakeButton" onClick={() => showDepositModals()} disabled={!NFTlist || NFTlist.length === 0}>
                <Trans>Deposit AGX-ETH LP</Trans>
              </Button>
            </div>
          </div>
          <div className={cx("addNow", {'ishide': selectTab !== 'Pool2','show': selectTab === 'Pool2' })}>Add liquidity to Uniswap AGX/ETH pool ( <span className="heightLight">full range</span> ) to receive your LP NFT. <a target="_blank" href={`https://novaswap.exchange/?chain=nova_sepolia#/add/ETH/${AGXAddress}/10000?minPrice=0.0000000000000000000000000000000000000029543&maxPrice=338490000000000000000000000000000000000`} className="">Add now &gt;&gt;</a>
          </div>
          <div className={cx("", {'ishide': selectTab !== 'Pool2','show': selectTab === 'Pool2' })}>
            <div className="StakeV2-stakeTitle padLeft">My deposit LP NFT</div>
            <div className="NFTCard">
              {depNFTlists && depNFTlists.length > 0 && depNFTlists.map((item,index) => {
                return (
                  <div key={item.tokenId}>
                    <div className={cx("")}>
                      <img src={depUrlList[index]?.image || ''}/>
                    </div>
                    <div className="depButton">
                      <Button variant="secondary" className={cx("stakeButton ishide", { 'show': !item.staked})} onClick={() => stake(Number(item.tokenId))}>
                        <Trans>Stake</Trans>
                      </Button>
                      <Button variant="secondary" className={cx("stakeButton ishide", { 'show': !item.staked })} onClick={() => Withdraw(Number(item.tokenId))}>
                        <Trans>Withdraw</Trans>
                      </Button>
                      <Button variant="secondary" className={cx("stakeButton ishide", { 'show': item.staked })} onClick={() => Unstake(Number(item.tokenId))}>
                        <Trans>Unstake</Trans>
                      </Button>
                    </div>
                  </div>
                  
                );
              })}
            </div>
          </div>
          <div className={cx("liquidity", {'ishide': selectTab !== 'Liquidity','show': selectTab === 'Liquidity' })}>
              <div className="table-tr">
                <div className="leftAlign">Pool</div>
                <div className="rightAlign">Daily Emission</div>
                <div className="rightAlign">Total Liquidity</div>
                <div className="rightAlign"></div>
              </div>
              {visibleTokens.map((token)=>{
                let tokenFeeBps;
                const obj = getBuyGlpFromAmount(
                  glpAmount,
                  token.address,
                  infoTokens,
                  glpPrice,
                  usdgSupply,
                  totalTokenWeights
                );
                if ('feeBasisPoints' in obj) {
                  tokenFeeBps = obj.feeBasisPoints;
                }
                const tokenInfo = getTokenInfo(infoTokens, token.address);
                let managedUsd;
                if (tokenInfo && tokenInfo.managedUsd) {
                  managedUsd = tokenInfo.managedUsd;
                }
                let manage = 1
                if (managedUsd) {
                  manage = managedUsd.mul(50000).div(glpSupplyUsd)
                }
                return (
                  <div className="table-td" key={token.symbol}>
                    <div className="leftAlign">{token.symbol}/USDT</div>
                    <div className="rightAlign">{formatAmount(manage, 0, 0, true)}</div>
                    <div className="rightAlign">{`${formatAmount(managedUsd, USD_DECIMALS, 0, true)}`}</div>
                    <div className="rightAlign">
                      <Button variant="secondary" onClick={() => selectToken(token)}>
                        <Trans>Add</Trans>
                      </Button>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
