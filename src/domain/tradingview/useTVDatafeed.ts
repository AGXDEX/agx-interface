import { HistoryCallback, PeriodParams, ResolutionString, SubscribeBarsCallback } from "charting_library";
import { getNativeToken, getNormalizedTokenSymbol, getPriceDecimals, getTokens, isChartAvailabeForToken } from "config/tokens";
import { useChainId } from "lib/chains";
import { useEffect, useMemo, useRef } from "react";
import { TVDataProvider } from "./TVDataProvider";
import { Bar, SymbolInfo } from "./types";
import { formatTimeInBarToMs } from "./utils";
import { SUPPORTED_RESOLUTIONS_V1 } from "config/tradingview";
import axios from "axios";

import { create } from "zustand";

export const usePeriodParam:any = create((set) => ({
  periodParams: {},
  setPeriodParams: (data) => set((state) => ({ periodParams: data })),
  removeAllBears: () => set({ bears: 0 }),
}));

function getConfigurationData(supportedResolutions) {
  return {
    supported_resolutions: Object.keys(supportedResolutions),
    supports_marks: false,
    supports_timescale_marks: false,
    supports_time: true,
    reset_cache_timeout: 100,
  };
}

type Props = {
  dataProvider?: TVDataProvider;
};

export default function useTVDatafeed({ dataProvider }: Props) {
  const { setPeriodParams } = usePeriodParam();
  const { chainId } = useChainId();
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>();
  const tvDataProvider = useRef<TVDataProvider>();
  const lastBarTime = useRef<number>(0);
  const missingBarsInfo = useRef({
    bars: [],
    isFetching: false,
  });

  const feedData = useRef(true);

  const stableTokens = useMemo(
    () =>
      getTokens(chainId)
        .filter((t) => t.isStable)
        .map((t) => t.symbol),
    [chainId]
  );

  const supportedResolutions = useMemo(() => dataProvider?.resolutions || SUPPORTED_RESOLUTIONS_V1, [dataProvider]);

  useEffect(() => {
    if (dataProvider && tvDataProvider.current !== dataProvider) {
      tvDataProvider.current = dataProvider;
    }
  }, [dataProvider]);

  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible") {
        missingBarsInfo.current.isFetching = true;
        const ticker = tvDataProvider.current?.currentTicker;
        const period = tvDataProvider.current?.currentPeriod;
        console.log(ticker, period, lastBarTime.current, "ticker, period, lastBarTime--->")
        if (ticker && period && lastBarTime.current && !stableTokens.includes(ticker)) {
          let data;
          try {
            console.log(lastBarTime.current,'lastBarTime--->')
            data = await tvDataProvider.current?.getMissingBars(chainId, ticker, period, lastBarTime.current);
          } catch (e) {
            data = [];
          }
          missingBarsInfo.current.bars = data;
          missingBarsInfo.current.isFetching = false;
          feedData.current = true;
        } else {
          feedData.current = false;
          missingBarsInfo.current.isFetching = false;
          missingBarsInfo.current.bars = [];
        }
      } else {
        feedData.current = false;
        missingBarsInfo.current.isFetching = false;
        missingBarsInfo.current.bars = [];
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return useMemo(() => {
    return {
      datafeed: {
        onReady: (callback) => {
          console.log("Data feed ready");
          setTimeout(() => callback(getConfigurationData(supportedResolutions)));
        },
        resolveSymbol(symbolName, onSymbolResolvedCallback) {
          console.log("Resolving symbol:", symbolName);
          if (!isChartAvailabeForToken(chainId, symbolName)) {
            symbolName = getNativeToken(chainId).symbol;
          }

          const pricescale = Math.pow(10, getPriceDecimals(chainId, symbolName));

          const symbolInfo = {
            name: symbolName,
            type: "crypto",
            description: symbolName + " / USD",
            ticker: symbolName,
            session: "24x7",
            minmov: 1,
            pricescale: pricescale,
            timezone: "Etc/UTC",
            has_intraday: true,
            has_daily: true,
            currency_code: "USD",
            visible_plots_set: "ohlc",
            data_status: "streaming",
            isStable: stableTokens.includes(symbolName),
          };
          setTimeout(() => onSymbolResolvedCallback(symbolInfo));
        },

        async getBars(
          symbolInfo: SymbolInfo,
          resolution: ResolutionString,
          periodParams: PeriodParams,
          onHistoryCallback: HistoryCallback,
          onErrorCallback: (error: string) => void
        ) {
          setPeriodParams(periodParams);
          const tokenSymbol = getNormalizedTokenSymbol(symbolInfo.name);
          const marketName = `Crypto.${tokenSymbol}/USD`;

          try {
            const response = await axios.get("https://benchmarks.pyth.network/v1/shims/tradingview/history", {
              params: {
                symbol: marketName,
                resolution,
                from: periodParams.from,
                to: periodParams.to,
              },
            });
            const data = response.data;

            if (data.s === "ok") {
              const bars = data.t.map((time, index) => ({
                time: time * 1000, // 将时间戳转换为毫秒
                open: data.o[index],
                high: data.h[index],
                low: data.l[index],
                close: data.c[index],
                volume: data.v[index],
              }));
              onHistoryCallback(bars, { noData: bars.length === 0 });
            }
          } catch (error) {
            console.error("Error fetching bars:", error);
            onHistoryCallback([], { noData: true }); // 处理错误情况
          }
        },
        subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) => {
          console.log("Subscribing to real-time bars for", symbolInfo.name, resolution);
          const { ticker, isStable } = symbolInfo;
          intervalRef.current && clearInterval(intervalRef.current);
          const fetchRealTimeData = async () => {
            try {
              const currentTimestamp = Math.floor(Date.now() / 1000);
              const response = await axios.get("https://benchmarks.pyth.network/v1/shims/tradingview/history", {
                params: {
                  symbol: symbolInfo.name,
                  resolution: 1,
                  from: currentTimestamp - 60,
                  to: currentTimestamp,
                },
              });

              const data = response.data;
              if (data.s === "ok" && data.t.length > 0) {
                const lastBar = {
                  time: data.t[data.t.length - 1] * 1000,
                  open: data.o[data.o.length - 1],
                  high: data.h[data.h.length - 1],
                  low: data.l[data.l.length - 1],
                  close: data.c[data.c.length - 1],
                  volume: data.v[data.v.length - 1],
                };
                onRealtimeCallback(lastBar);
              }
            } catch (error) {
              console.error("Error fetching real-time data:", error);
            }
          };

          // 定时调用 fetchRealTimeData 函数,例如每秒钟调用一次
          // const intervalId = setInterval(fetchRealTimeData, 5000);

          // 保存订阅信息
          if (!isStable) {
            intervalRef.current = setInterval(fetchRealTimeData, 5000);
          }
        },
        unsubscribeBars: (id) => {
          // id is in the format ETH_#_USD_#_5
          const ticker = id.split("_")[0];
          console.log("unsubscribeBars", id, ticker);
          const isStable = stableTokens.includes(ticker);
          if (!isStable && intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        },
      },
    };
  }, [chainId, stableTokens, supportedResolutions, tvDataProvider, dataProvider]);
}
