export function calculateAlpAPR(glpSupplyUsd: string, rewardRate: string, agxPrice: number): string {
  const SECONDS_PER_YEAR = 60 * 60 * 24 * 365;
  const WEI_DECIMALS = 10 ** 18;
  const PERCENTAGE_MULTIPLIER = 100;
  const PRECISION_MULTIPLIER = 10 ** 30;

  if (Number(glpSupplyUsd) === 0) {
    return "0%";
  }

  if (!rewardRate || !agxPrice) {
    return "N/A";
  }

  const glpSupply = Number(glpSupplyUsd);
  const rewardRatePerSecond = Number(rewardRate) / WEI_DECIMALS;
  const yearlyRewardValue = rewardRatePerSecond * SECONDS_PER_YEAR * agxPrice;
  const apr = (yearlyRewardValue / glpSupply) * PRECISION_MULTIPLIER * PERCENTAGE_MULTIPLIER;

  return `${apr.toLocaleString()}%`;
}
