import { ARBITRUM, AVALANCHE } from "config/chains";
import { BigNumber } from "ethers";
const key = Symbol(ARBITRUM);
export type VolumeInfo = {
  totalVolume: BigNumber;
  [AVALANCHE]: { totalVolume: BigNumber };
  [key]: { totalVolume: BigNumber };
};

export type VolumeStat = {
  swap: string;
  margin: string;
  liquidation: string;
  mint: string;
  burn: string;
};
