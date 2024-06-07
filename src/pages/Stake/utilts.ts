import { BigNumber } from "ethers";

const alpData = [
  300000.0, 597000.0, 891030.0, 1182119.7, 1470298.5, 1755595.52, 2038039.56, 2317659.17, 2594482.58, 2868537.75,
  3139852.37, 3408453.85, 3674369.31, 3937625.62, 4198249.36, 4456266.87, 4711704.2, 4964587.16, 5214941.28, 5462791.87,
  5708163.95, 5951082.31, 6191571.49, 6429655.78,
];

const accumulateData = [
  416666.6667, 833333.3333, 1250000, 1666666.667, 2083333.333, 2500000, 2916666.667, 3333333.333, 3750000, 4166666.667,
  4583333.333, 5000000, 5416666.667, 5833333.333, 6250000, 6666666.667, 7083333.333, 7500000, 7916666.667, 8333333.333,
  8750000, 9166666.667, 9583333.333, 10000000,
];
const stakingAgxAccumulateData = [
  200000.0, 398000.0, 594020.0, 788079.8, 980199.0, 1170397.01, 1358693.04, 1545106.11, 1729655.05, 1912358.5,
  2093234.91, 2272302.57, 2449579.54, 2625083.74, 2798832.91, 2970844.58, 3141136.13, 3309724.77, 3476627.52,
  3641861.25, 3805442.64, 3967388.21, 4127714.33, 4286437.18,
];

const currentTimestamp = Math.floor(Date.now() / 1000); // 获取当前时间戳
const secondsPerWeek = 7 * 24 * 60 * 60; // 一周的秒数

export function getEmissionData(startTimestamp, stakingAgxStartTimestamp) {
  const currentWeek = Math.max(Math.floor((currentTimestamp - startTimestamp) / secondsPerWeek) + 1, 1);
  const currentStakingAgxWeek = Math.max(
    Math.floor((currentTimestamp - stakingAgxStartTimestamp) / secondsPerWeek) + 1,
    1
  );

  const index = Math.min(currentWeek, alpData.length) - 1;
  const stakingAgxIndex = Math.min(currentStakingAgxWeek, stakingAgxAccumulateData.length) - 1;

  const totalAlpMiningAccumulate = alpData[index] || 0;
  const totalAccumulate = accumulateData[index] || 0;
  const totalStakingAgxAccumulate = stakingAgxAccumulateData[stakingAgxIndex] || 0;

  const totalEmissions = totalAlpMiningAccumulate + totalAccumulate + totalStakingAgxAccumulate;
  const formattedEmissions = totalEmissions.toFixed(2);
  const localizedEmissions = Number(formattedEmissions).toLocaleString();

  return {
    week: currentWeek,
    stakingAgxWeek: currentStakingAgxWeek,
    alpMiningAccumulate: totalAlpMiningAccumulate,
    accumulate: totalAccumulate,
    stakingAgxAccumulate: totalStakingAgxAccumulate,
    totalEmissions: localizedEmissions,
  };
}






export function calculateManage(managedUsd, glpSupplyUsd) {
  if (!managedUsd || managedUsd.isZero()) {
    return BigNumber.from(0);
  }

  if (!glpSupplyUsd || glpSupplyUsd.isZero()) {
    return BigNumber.from(0);
  }

  return managedUsd.mul(BigNumber.from(50000)).div(glpSupplyUsd);
}
