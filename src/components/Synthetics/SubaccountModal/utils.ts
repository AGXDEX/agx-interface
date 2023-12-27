import { t } from "@lingui/macro";
import { TokenData, convertToTokenAmount } from "domain/synthetics/tokens";
import { BigNumber } from "ethers";
import { expandDecimals } from "lib/numbers";

const ZERO = BigNumber.from(0);

export function getButtonState({
  topUp,
  maxAutoTopUpAmount,
  wntForAutoTopUps,
  maxAllowedActions,

  needPayTokenApproval,

  mainAccEthBalance,
  isSubaccountActive,

  accountUpdateLoading,

  nativeTokenSymbol,
  wrappedTokenSymbol,
}: {
  topUp: BigNumber | null;
  maxAutoTopUpAmount: BigNumber | null;
  wntForAutoTopUps: BigNumber | null;
  maxAllowedActions: BigNumber | null;

  needPayTokenApproval: boolean;

  mainAccEthBalance: BigNumber | undefined;
  isSubaccountActive: boolean;

  accountUpdateLoading: boolean;

  nativeTokenSymbol: string;
  wrappedTokenSymbol: string;
}): { text: string; disabled?: true; spinner?: true } {
  if (!mainAccEthBalance) {
    return { disabled: true, text: t`${nativeTokenSymbol} is not available` };
  }

  if (needPayTokenApproval) {
    return { disabled: true, text: t`Allow ${wrappedTokenSymbol} to be spent` };
  }

  const ethSpendAmount = (topUp ?? ZERO).add(wntForAutoTopUps ?? ZERO);

  if (mainAccEthBalance.lt(ethSpendAmount)) {
    return { disabled: true, text: t`Insufficient ${nativeTokenSymbol} balance` };
  }

  if (!isSubaccountActive && maxAutoTopUpAmount === null) {
    return { disabled: true, text: t`Maximum auto top-up amount is required` };
  }

  if (!isSubaccountActive && maxAllowedActions === null) {
    return { disabled: true, text: t`Maximum allowed actions is required` };
  }

  if (accountUpdateLoading) {
    return { disabled: true, spinner: true, text: "" };
  } else if (isSubaccountActive) {
    let count = 0;
    if (topUp) count += 1;
    if (maxAutoTopUpAmount) count += 1;
    if (wntForAutoTopUps) count += 1;
    if (maxAllowedActions) count += 1;

    if (count === 0) {
      return { text: t`Update`, disabled: true };
    }

    return { text: t`Update` };
  } else if (!isSubaccountActive) {
    return { text: t`Activate` };
  }

  return { disabled: true, spinner: true, text: "" };
}

export function getApproxSubaccountActionsCountByBalance(
  mainAccWrappedTokenBalance: BigNumber,
  subAccNativeTokenBalance: BigNumber,
  executionFee: BigNumber,
  currentAutoTopUpAmount: BigNumber
) {
  if (executionFee.gt(subAccNativeTokenBalance)) {
    return BigNumber.from(0);
  }

  const topUp = currentAutoTopUpAmount.gt(executionFee) ? executionFee : currentAutoTopUpAmount;
  const reducedCost = executionFee.sub(topUp);

  // execution fee is fully reduced, calculating sum(countByMainAccBalance, subAccNativeTokenBalance / executionFee)
  if (reducedCost.lte(0)) {
    // how many times we can transfer executionFee + how many times we can perform without topUp
    const countByMainAccBalance = topUp.lte(0) ? BigNumber.from(0) : mainAccWrappedTokenBalance.div(topUp);
    return countByMainAccBalance.add(subAccNativeTokenBalance.div(executionFee));
  }

  const operationsWithReducedCost = subAccNativeTokenBalance.div(reducedCost);
  const operationsBackedByMainAccBalance = topUp.eq(0) ? BigNumber.from(0) : mainAccWrappedTokenBalance.div(topUp);

  if (operationsWithReducedCost.lte(operationsBackedByMainAccBalance)) {
    return subAccNativeTokenBalance.sub(executionFee).div(reducedCost).add(1);
  } else {
    const operationsWithoutReduce = subAccNativeTokenBalance
      .sub(reducedCost.mul(operationsBackedByMainAccBalance))
      .div(executionFee);

    return operationsBackedByMainAccBalance.add(operationsWithoutReduce);
  }
}

export function getDefaultValues(tokenData: TokenData) {
  return {
    topUp: notNullOrThrow(convertToTokenAmount(expandDecimals(20, 30), tokenData.decimals, tokenData.prices.maxPrice)),
    maxAutoTopUpAmount: notNullOrThrow(
      convertToTokenAmount(expandDecimals(5, 30), tokenData.decimals, tokenData.prices.maxPrice)
    ),
    wntForAutoTopUps: notNullOrThrow(
      convertToTokenAmount(expandDecimals(20, 30), tokenData.decimals, tokenData.prices.maxPrice)
    ),
    maxAllowedActions: notNullOrThrow(BigNumber.from(10)),
  };
}

function notNullOrThrow<T>(item: T | null | undefined): T {
  if (item === null || item === undefined) {
    throw new Error("Item is null or undefined");
  }

  return item;
}
