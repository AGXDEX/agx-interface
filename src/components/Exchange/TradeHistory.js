import { useCallback, useMemo, useEffect } from "react";
import { ethers } from "ethers";
import { Link } from "react-router-dom";
import Tooltip from "components/Tooltip/Tooltip";

import {
  USD_DECIMALS,
  LIQUIDATION_FEE,
  TRADES_PAGE_SIZE,
  deserialize,
  getExchangeRateDisplay,
  INCREASE,
} from "lib/legacy";
import { MAX_LEVERAGE, BASIS_POINTS_DIVISOR } from "config/factors";
import { useTrades, useLiquidationsData, useHistoryTradeData } from "domain/legacy";
import { getContract } from "config/contracts";

import "./TradeHistory.css";
import { getExplorerUrl } from "config/chains";
import { bigNumberify, formatAmount } from "lib/numbers";
import { formatDateTime } from "lib/dates";
import StatsTooltipRow from "../StatsTooltip/StatsTooltipRow";
import { t, Trans } from "@lingui/macro";
import ExternalLink from "components/ExternalLink/ExternalLink";
import { getPriceDecimals } from "config/tokens";
import Pagination from "components/Pagination/Pagination";
import usePagination from "components/Referrals/usePagination";
import { TRADE_HISTORY_PER_PAGE } from "config/ui";

const { AddressZero } = ethers.constants;

function getPositionDisplay(increase, indexToken, isLong, sizeDelta) {
  const symbol = indexToken ? (indexToken.isWrapped ? indexToken.baseSymbol : indexToken.symbol) : "";
  const positionTypeText = increase ? t`Increase` : t`Decrease`;
  const longOrShortText = isLong ? t`Long` : t`Short`;
  return (
    <>
      {positionTypeText} {symbol} {longOrShortText} {increase ? "+" : "-"}
      {formatAmount(sizeDelta, USD_DECIMALS, 2, true)} USD
    </>
  );
}

function getOrderActionTitle(action) {
  let actionDisplay;

  if (action.startsWith("Create")) {
    actionDisplay = t`Create`;
  } else if (action.startsWith("Cancel")) {
    actionDisplay = t`Cancel`;
  } else {
    actionDisplay = t`Update`;
  }

  return t`${actionDisplay} Order`;
}

function renderLiquidationTooltip(liquidationData, label) {
  const minCollateral = liquidationData.size.mul(BASIS_POINTS_DIVISOR).div(MAX_LEVERAGE);
  const text =
    liquidationData.type === "full"
      ? t`This position was liquidated as the max leverage of 100x was exceeded.`
      : t`Max leverage of 100x was exceeded, the remaining collateral after deducting losses and fees have been sent back to your account:`;
  return (
    <Tooltip
      position="top-start"
      handle={label}
      renderContent={() => (
        <>
          {text}
          <br />
          <br />
          <StatsTooltipRow
            label={t`Initial collateral`}
            showDollar
            value={formatAmount(liquidationData.collateral, USD_DECIMALS, 2, true)}
          />
          <StatsTooltipRow
            label={t`Min required collateral`}
            showDollar
            value={formatAmount(minCollateral, USD_DECIMALS, 2, true)}
          />
          <StatsTooltipRow
            label={t`Borrow Fee`}
            showDollar
            value={formatAmount(liquidationData.borrowFee, USD_DECIMALS, 2, true)}
            className="text-red"
          />
          <StatsTooltipRow
            label={t`PnL`}
            showDollar={false}
            className="text-red"
            value={`-$${formatAmount(liquidationData.loss, USD_DECIMALS, 2, true)}`}
          />
          {liquidationData.type === "full" && (
            <StatsTooltipRow label={t`Liquidation Fee`} showDollar value={formatAmount(LIQUIDATION_FEE, 30, 2, true)} />
          )}
        </>
      )}
    />
  );
}

function getLiquidationData(liquidationsDataMap, key, timestamp) {
  return liquidationsDataMap && liquidationsDataMap[`${key}:${timestamp}`];
}

export default function TradeHistory(props) {
  const { account, infoTokens, getTokenInfo, chainId, nativeTokenAddress, shouldShowPaginationButtons } = props;
  // const { trades, setSize, size } = useTrades(chainId, account);
  const { trades, pageIndex: size, setPageIndex: setSize } = useHistoryTradeData(chainId, account, TRADES_PAGE_SIZE);
  // console.log(trades)
  const { currentPage, setCurrentPage, getCurrentData, pageCount } = usePagination(
    account,
    trades,
    TRADE_HISTORY_PER_PAGE
  );
  const currentPageData = getCurrentData();
  useEffect(() => {
    if (!pageCount || !currentPage) return;
    const totalPossiblePages = (TRADES_PAGE_SIZE * size) / TRADE_HISTORY_PER_PAGE;
    const doesMoreDataExist = pageCount >= totalPossiblePages;
    const isCloseToEnd = pageCount && pageCount < currentPage + 2;
    if (doesMoreDataExist && isCloseToEnd) {
      setSize((prevIndex) => prevIndex + 1);
    }
  }, [currentPage, pageCount, size, setSize]);

  const liquidationsData = useLiquidationsData(chainId, account);
  const liquidationsDataMap = useMemo(() => {
    if (!liquidationsData) {
      return null;
    }
    return liquidationsData.reduce((memo, item) => {
      const liquidationKey = `${item.key}:${item.timestamp}`;
      memo[liquidationKey] = item;
      return memo;
    }, {});
  }, [liquidationsData]);

  const getMsg = useCallback(
    (trade) => {
      // const defaultMsg = "";
      // const lowerCaseInfoTokens = Object.keys(infoTokens).reduce((obj, key) => {
      //   obj[key.toLowerCase()] = infoTokens[key];
      //   return obj;
      // }, {});
      // if (trade.type === "swaps") {
      //   const tokenIn = getTokenInfo(lowerCaseInfoTokens, trade.tokenIn.toLowerCase(), true, nativeTokenAddress);
      //   const tokenOut = getTokenInfo(lowerCaseInfoTokens, trade.tokenOut.toLowerCase(), true, nativeTokenAddress);
      //   if (!tokenIn || !tokenOut) {
      //     return defaultMsg;
      //   }
      //   return (
      //     <Trans>
      //       Swap {formatAmount(trade.amountIn, tokenIn.decimals, 4, true)} {tokenIn.symbol} for{" "}
      //       {formatAmount(trade.amountOut, tokenOut.decimals, 4, true)} {tokenOut.symbol}
      //     </Trans>
      //   );
      // }
      const tradeData = trade;
      const params = trade;
      const longOrShortText = trade?.isLong ? t`Long` : t`Short`;
      const defaultMsg = "";
      const lowerCaseInfoTokens = Object.keys(infoTokens).reduce((obj, key) => {
        obj[key.toLowerCase()] = infoTokens[key];
        return obj;
      }, {});

      if (tradeData.action === "Swap") {
        const tokenIn = getTokenInfo(lowerCaseInfoTokens, params.tokenIn, true, nativeTokenAddress);
        const tokenOut = getTokenInfo(lowerCaseInfoTokens, params.tokenOut, true, nativeTokenAddress);
        if (!tokenIn || !tokenOut) {
          return defaultMsg;
        }
        return (
          <Trans>
            Swap {formatAmount(params.amountIn, tokenIn.decimals, 4, true)} {tokenIn.symbol} for{" "}
            {formatAmount(params.amountOut, tokenOut.decimals, 4, true)} {tokenOut.symbol}
          </Trans>
        );
      }

      if (tradeData.action === "CreateIncreasePosition") {
        const indexToken = getTokenInfo(lowerCaseInfoTokens, params.indexToken, true, nativeTokenAddress);
        const indexTokenPriceDecimal = getPriceDecimals(chainId, indexToken.symbol);
        if (!indexToken) {
          return defaultMsg;
        }

        if (bigNumberify(params.sizeDelta).eq(0)) {
          return (
            <Trans>
              Request deposit into {indexToken.symbol} {longOrShortText}
            </Trans>
          );
        }

        return t`Request increase ${indexToken.symbol} ${longOrShortText}, +${formatAmount(
          params.sizeDelta,
          USD_DECIMALS,
          2,
          true
        )} USD, Acceptable Price: ${params.isLong ? "<" : ">"} ${formatAmount(
          params.acceptablePrice,
          USD_DECIMALS,
          indexTokenPriceDecimal,
          true
        )} USD`;
      }

      if (tradeData.action === "CreateDecreasePosition") {
        const indexToken = getTokenInfo(lowerCaseInfoTokens, params.indexToken, true, nativeTokenAddress);
        const indexTokenPriceDecimal = getPriceDecimals(chainId, indexToken.symbol);
        if (!indexToken) {
          return defaultMsg;
        }

        if (bigNumberify(params.sizeDelta).eq(0)) {
          return (
            <Trans>
              Request withdrawal from {indexToken.symbol} {longOrShortText}
            </Trans>
          );
        }

        return t`Request decrease ${indexToken.symbol} ${longOrShortText}, -${formatAmount(
          params.sizeDelta,
          USD_DECIMALS,
          2,
          true
        )} USD, Acceptable Price: ${params.isLong ? ">" : "<"} ${formatAmount(
          params.acceptablePrice,
          USD_DECIMALS,
          indexTokenPriceDecimal,
          true
        )} USD`;
      }
      if (tradeData.action === "IncreasePosition") {
        if (params.flags?.isOrderExecution) {
          return;
        }

        const indexToken = getTokenInfo(lowerCaseInfoTokens, params.indexToken, true, nativeTokenAddress);
        const indexTokenPriceDecimal = getPriceDecimals(chainId, indexToken.symbol);
        if (!indexToken) {
          return defaultMsg;
        }
        if (bigNumberify(params.sizeDelta).eq(0)) {
          return (
            <Trans>
              Deposit {formatAmount(params.collateralDelta, USD_DECIMALS, 2, true)} USD into {indexToken.symbol}{" "}
              {longOrShortText}
            </Trans>
          );
        }
        return t`Increase ${indexToken.symbol} ${longOrShortText}, +${formatAmount(
          params.sizeDelta,
          USD_DECIMALS,
          2,
          true
        )} USD, ${indexToken.symbol} Price: ${formatAmount(
          params.price,
          USD_DECIMALS,
          indexTokenPriceDecimal,
          true
        )} USD`;
      }

      if (tradeData.action === "DecreasePosition") {
        if (params.flags?.isOrderExecution) {
          return;
        }

        const indexToken = getTokenInfo(lowerCaseInfoTokens, params.indexToken, true, nativeTokenAddress);
        const indexTokenPriceDecimal = getPriceDecimals(chainId, indexToken.symbol);
        if (!indexToken) {
          return defaultMsg;
        }
        if (bigNumberify(params.sizeDelta).eq(0)) {
          return (
            <Trans>
              Withdraw {formatAmount(params.collateralDelta, USD_DECIMALS, 2, true)} USD from {indexToken.symbol}
              {longOrShortText}{" "}
            </Trans>
          );
        }
        const isLiquidation = params.flags?.isLiquidation;
        const liquidationData = getLiquidationData(liquidationsDataMap, params.key, tradeData.timestamp);

        if (isLiquidation && liquidationData) {
          return (
            <>
              {renderLiquidationTooltip(liquidationData, t`Partial Liquidation`)}&nbsp;
              {indexToken.symbol} {longOrShortText}, -{formatAmount(params.sizeDelta, USD_DECIMALS, 2, true)} USD,{" "}
              {indexToken.symbol}&nbsp; Price: ${formatAmount(params.price, USD_DECIMALS, indexTokenPriceDecimal, true)}{" "}
              USD
            </>
          );
        }
        const actionDisplay = isLiquidation ? t`Partially Liquidated` : t`Decreased`;
        return t`${actionDisplay} ${indexToken.symbol} ${longOrShortText},
        -${formatAmount(params.sizeDelta, USD_DECIMALS, 2, true)} USD,
        ${indexToken.symbol} Price: ${formatAmount(params.price, USD_DECIMALS, indexTokenPriceDecimal, true)} USD
      `;
      }

      if (tradeData.action === "LiquidatePosition") {
        const indexToken = getTokenInfo(lowerCaseInfoTokens, params.indexToken, true, nativeTokenAddress);
        const indexTokenPriceDecimal = getPriceDecimals(chainId, indexToken.symbol);
        if (!indexToken) {
          return defaultMsg;
        }
        const liquidationData = getLiquidationData(liquidationsDataMap, params.key, tradeData.timestamp);
        if (liquidationData) {
          return (
            <Trans>
              {renderLiquidationTooltip(liquidationData, t`Liquidated`)}&nbsp; {indexToken.symbol} {longOrShortText}, -
              {formatAmount(params.size, USD_DECIMALS, 2, true)} USD,&nbsp;
              {indexToken.symbol} Price: ${formatAmount(params.markPrice, USD_DECIMALS, indexTokenPriceDecimal, true)}{" "}
              USD
            </Trans>
          );
        }
        return t`
        Liquidated ${indexToken.symbol} ${longOrShortText},
        -${formatAmount(params.size, USD_DECIMALS, 2, true)} USD,
        ${indexToken.symbol} Price: ${formatAmount(params.markPrice, USD_DECIMALS, indexTokenPriceDecimal, true)} USD
      `;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getTokenInfo, infoTokens, nativeTokenAddress, chainId, liquidationsDataMap]
  );

  const tradesWithMessages = useMemo(() => {
    if (!currentPageData) {
      return [];
    }
    return currentPageData.map((trade) => ({
      msg: getMsg(trade),
      ...trade,
    }));
  }, [currentPageData, getMsg]);
// console.log(shouldShowPaginationButtons)
  return (
    <div className="TradeHistory">
      {tradesWithMessages.length === 0 && (
        <div className="TradeHistory-row App-box">
          <Trans>No trades yet</Trans>
        </div>
      )}
      {tradesWithMessages.length > 0 &&
        tradesWithMessages.map((trade, index) => {
          const txUrl = getExplorerUrl(chainId) + "tx/" + trade.transaction.id.split(':')[0]
          let msg = getMsg(trade);
          if (!msg) {
            return null;
          }
          return (
            <div className="TradeHistory-row App-box App-box-border" key={index}>
              <div>
                <div className="muted TradeHistory-time">
                  {formatDateTime(trade.transaction.timestamp)}
                  {(!account || account.length === 0) && (
                    <span>
                      {" "}
                      (<Link to={`/actions/v1/${account}`}>{account}</Link>)
                    </span>
                  )}
                </div>
                <ExternalLink className="plain TradeHistory-item-link" href={txUrl}>
                  {msg}
                </ExternalLink>
              </div>
            </div>
          );
        })}
      {shouldShowPaginationButtons && (
        <Pagination page={currentPage} pageCount={pageCount} onPageChange={(page) => setCurrentPage(page)} />
      )}
    </div>
  );
}
