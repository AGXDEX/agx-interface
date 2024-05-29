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

const currentTimestamp = Math.floor(Date.now() / 1000); // 获取当前时间戳
const secondsPerWeek = 7 * 24 * 60 * 60; // 一周的秒数

export function getEmissionData(startTimestamp) {
  const currentWeek = Math.max(Math.floor((currentTimestamp - startTimestamp) / secondsPerWeek) + 1, 1);

  const index = Math.min(currentWeek, alpData.length) - 1;

  const totalAlpMiningAccumulate = alpData[index] || 0;
  const totalAccumulate = accumulateData[index] || 0;

  const totalEmissions = totalAlpMiningAccumulate + totalAccumulate;
  const formattedEmissions = totalEmissions.toFixed(2);
  const localizedEmissions = Number(formattedEmissions).toLocaleString();

  return {
    week: currentWeek,
    alpMiningAccumulate: totalAlpMiningAccumulate,
    accumulate: totalAccumulate,
    totalEmissions: localizedEmissions,
  };
}





export function calculateManage(managedUsd, glpSupplyUsd) {
  if (!managedUsd || managedUsd.isZero()) {
    console.error("Error: managedUsd is zero or undefined.");
    return BigNumber.from(0);
  }

  if (!glpSupplyUsd || glpSupplyUsd.isZero()) {
    console.error("Error: division by zero. 'glpSupplyUsd' is zero or undefined.");
    return BigNumber.from(0);
  }

  return managedUsd.mul(BigNumber.from(50000)).div(glpSupplyUsd);
}
