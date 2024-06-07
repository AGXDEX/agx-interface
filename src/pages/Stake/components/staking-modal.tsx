import { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Token from "abis/Token.json";
import StakeAGX from "abis/StakeAGX.json";

import { Contract, ethers, BigNumber } from "ethers";

import { getContract } from "config/contracts";

import Button from "components/Button/Button";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "components/ui/dialog";
import { X } from "lucide-react";
import { useChainId } from "lib/chains";
import { cn } from "utils/classname";
import useWallet from "lib/wallets/useWallet";
import { fetchStakedAGXs } from "../hooks/services";
import { formatAmount } from "lib/numbers";

export const useStakeAGXContract = (chainId) => {
  const { signer } = useWallet();
  const stakeAGXAddress = getContract(chainId, "StakeAGX");
  return new Contract(stakeAGXAddress, StakeAGX.abi, signer);
};

export const useAGXContract = (chainId) => {
  const { signer } = useWallet();
  const AGXAddress = getContract(chainId, "AGX");
  return new Contract(AGXAddress, Token.abi, signer);
};

const tags = [
  { duration: "12 months", days: 360, multiplier: "5" },
  { duration: "6 months", days: 180, multiplier: "4" },
  { duration: "3 months", days: 90, multiplier: "3" },
  { duration: "2 months", days: 60, multiplier: "2" },
  { duration: "1 month", days: 30, multiplier: "1" },
];

export function useAGXBalance(account, chainId) {
  const contract = useAGXContract(chainId);

  return useQuery({
    queryKey: ["agxBalance", account, chainId],
    queryFn: async () => {
      const balance = await contract.balanceOf(account);
      return balance;
    },
    enabled: !!account && !!chainId,
  });
}

function useAGXAllowance(account, chainId) {
  const agxContract = useAGXContract(chainId);
  const stakeAGXContract = useStakeAGXContract(chainId);

  return useQuery({
    queryKey: ["agxAllowance", account, chainId],
    queryFn: async () => {
      const allowance = await agxContract.allowance(account, stakeAGXContract.address);
      return allowance;
    },
    enabled: !!account && !!chainId,
  });
}

const useApproveAGX = (account, chainId) => {
  const queryClient = useQueryClient();
  const stakeContract = useStakeAGXContract(chainId);
  const contract = useAGXContract(chainId);
  return useMutation({
    mutationFn: async (amount: any) => {
      const tx = await contract.approve(stakeContract.address, ethers.constants.MaxUint256);
      await tx.wait();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agxAllowance", account, chainId] });
    },
  });
};

const useStakeAGX = (account, chainId) => {
  const queryClient = useQueryClient();
  const contract = useStakeAGXContract(chainId);
  return useMutation({
    mutationFn: async ({ amount, period }: any) => {
      const formattedAmount = ethers.utils.parseEther(amount);
      const tx = await contract.stake(formattedAmount, period);
      await tx.wait();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agxBalance", account, chainId] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

const useUnstakeAGX = (chainId) => {
  const contract = useStakeAGXContract(chainId);
  return useMutation({
    mutationFn: async (id: any) => {
      const tx = await contract.unStake(id);
      await tx.wait();
    },
  });
};

const stakeSchema = z.object({
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Please enter a valid amount",
  }),
});

export function StakingModal(props) {
  const { chainId } = useChainId();
  const { account } = useWallet();
  const { mutate: approveAGX, isPending: isApproving } = useApproveAGX(account, chainId);
  const { mutate: stakeAGX, isPending } = useStakeAGX(account, chainId);
  const { data: balance, isLoading: isLoadingBalance } = useAGXBalance(account, chainId);
  const { data: allowance } = useAGXAllowance(account, chainId);

  const { isVisible, setIsVisible, data } = props;
  const [selectedTag, setSelectedTag] = useState<any>(tags[0]);

  const useStakedAGXs = (account) => {
    return useQuery({
      queryKey: ["stakedAGXs", account],
      queryFn: () => fetchStakedAGXs(account),
      enabled: !!account,
    });
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm({
    resolver: zodResolver(stakeSchema),
    mode: "onChange",
  });

  const handleClickTag = (tag) => {
    setSelectedTag(tag);
  };
  const onSubmit = async (data) => {
    const { amount } = data;
    await stakeAGX({ amount, period: selectedTag.days * 86400 });
  };

  const handleApprove = async () => {
    const amountInWei = ethers.utils.parseEther(amount);
    await approveAGX(amountInWei);
  };

  const amount = watch("amount");
  const amountInWei = amount ? ethers.utils.parseEther(amount) : ethers.constants.Zero;
  const showApproveButton = !allowance || allowance.lt(amountInWei);

  const { data: stakedAGXs } = useStakedAGXs(account);

  function getMultiplier(stakePeriod) {
    const days = Number(stakePeriod) / 86400;

    for (const tag of tags) {
      if (days >= tag.days) {
        return Number(tag.multiplier);
      }
    }

    return 0;
  }

 function useStakeReward(stake, user, chainId) {
   const contract = useStakeAGXContract(chainId);

   return useQuery({
     queryKey: ["userStakeReward", user, stake.id],
     queryFn: async () => {
       const userTotalStakedWithMultiplier = await contract.userTotalStakedWithMultiplier(user);
       const totalReward = await contract.userTotalStakedWithoutMultiplier(user);
       const stakeAmountInEther = ethers.utils.formatUnits(stake.amount, 18);
       const weightedAmount = Number(stakeAmountInEther) * getMultiplier(Number(stake.period));
       const reward = (weightedAmount / userTotalStakedWithMultiplier) * totalReward;

       return reward;
     },
     enabled: !!stake && !!user && !!chainId,
   });
 }
  const UnstakeButton = ({ stake, chainId }) => {
    const { account } = useWallet();
    const { mutate: unstake, isPending: isLoading } = useUnstakeAGX(chainId);

    const startTime = new Date(Number(stake.startTime) * 1000);
    const period = Number(stake.period) * 1000;
    const endTime = new Date(startTime.getTime() + period);

    const isUnstakeAvailable = Date.now() >= endTime.getTime();

    const { data: reward, isLoading: isRewardLoading } = useStakeReward(stake, account, chainId);


    return (
      <>
        <td className="border-b border-slate-700 p-4 pl-8  text-white">
          {formatAmount(BigNumber.from(stake.amount), 18, 2)}
        </td>
        <td className="border-b border-slate-700 p-4  text-white">{getMultiplier(Number(stake.period))}</td>
        <td className="border-b border-slate-700 p-4 pr-8  text-white">{Number(reward).toFixed(2)}</td>
        <td className="border-b border-slate-700 p-4 pr-8  text-white">{Number(stake.period) / 86400}</td>
        <td className="border-b border-slate-700 p-4 pr-8  text-white">
          {isUnstakeAvailable ? (
            <>
              <Button
                type="button"
                variant="primary"
                className="justify-center items-center px-16 py-4 !text-lg leading-6 text-center text-black whitespace-nowrap rounded-md max-md:px-5 max-md:max-w-full font-bold"
                loading={isLoading}
                onClick={() => unstake(parseInt(stake.id))}
              >
                Unstake
              </Button>
            </>
          ) : (
            "Locking"
          )}
        </td>
      </>
    );
  };

  const StakeList = () => {
    return (
      <div className="relative rounded-xl overflow-auto">
        <div className="shadow-sm overflow-hidden my-8">
          <table className="border-collapse table-fixed w-full text-lg">
            <thead>
              <tr>
                <th className="border-b border-none font-medium p-4 pl-8 pt-0 pb-3 text-slate-400  text-left">
                  My staked
                </th>
                <th className="border-b border-none font-medium p-4 pt-0 pb-3 text-slate-400  text-left">Multiplier</th>
                <th className="border-b border-none font-medium p-4 pr-8 pt-0 pb-3 text-slate-400  text-left">
                  Claimable Rewards
                </th>
                <th className="border-b border-none font-medium p-4 pr-8 pt-0 pb-3 text-slate-400  text-left">
                  Unlockable In
                </th>
                <th className="border-b border-none font-medium p-4 pr-8 pt-0 pb-3 text-slate-400  text-left">
                  Operation
                </th>
              </tr>
            </thead>
            <tbody>
              {stakedAGXs?.map((stake) => (
                <tr key={stake.id}>
                  <UnstakeButton stake={stake} chainId={chainId} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  if (!isVisible) return null;
  return (
    <Dialog open={isVisible}>
      <DialogContent className="sm:max-w-[625px] bg-[#292B2F] focus:outline-none">
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
          <DialogTitle className="text-3xl">Stake AGX</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col grow px-4 py-5 w-full rounded max-md:mt-10 max-md:max-w-full space-y-5">
            <div className="flex justify-between items-center max-md:flex-wrap max-md:max-w-full py-4 rounded-md">
              <div className="text-lg leading-5 text-zinc-400">Amount</div>
              <div className="flex gap-2.5">
                <div className="text-lg leading-5 text-zinc-400">Balance:</div>
                <div className="text-lg leading-5 text-white text-opacity-90">
                  {isLoadingBalance ? (
                    <span>Loading...</span>
                  ) : (
                    <span>{Number(ethers.utils.formatEther(balance || 0)).toFixed(2)} AGX</span>
                  )}
                </div>
              </div>
            </div>
            <input
              step="any"
              autoComplete="off"
              type="number"
              {...register("amount")}
              placeholder="Enter AGX amount"
              className={cn("input py-6 bg-[#18191E] text-xl rounded-lg mt-0", {
                "input-error": errors.amount,
              })}
            />
            {errors.amount && typeof errors.amount === "string" && (
              <p className="my-2 text-sm text-red-500">{errors.amount}</p>
            )}

            <div className="grid grid-cols-3 gap-4">
              {tags.map((tag) => (
                <div key={tag.days} className="relative flex items-center p-6 bg-[#18191E] rounded-lg cursor-pointer">
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
                    <span className="text-white flex">{tag.days} days</span>
                    <span className="text-gray-400 flex">Multiplier {tag.multiplier}</span>
                  </div>
                </div>
              ))}
            </div>
            {showApproveButton ? (
              <Button
                type="button"
                variant="primary"
                className="justify-center items-center px-16 py-4 !text-lg leading-6 text-center text-black whitespace-nowrap rounded-md max-md:px-5 max-md:max-w-full font-bold"
                loading={isApproving}
                onClick={handleApprove}
              >
                Approve
              </Button>
            ) : (
              <Button
                type="submit"
                variant="primary"
                className="justify-center items-center px-16 py-4 !text-lg leading-6 text-center text-black whitespace-nowrap rounded-md max-md:px-5 max-md:max-w-full font-bold"
                loading={isPending || isApproving}
              >
                Confirm
              </Button>
            )}
          </div>
        </form>
        <StakeList />
      </DialogContent>
    </Dialog>
  );
}

export default StakingModal;
