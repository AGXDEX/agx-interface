import { useEffect, useState } from "react";
import { BigNumber } from "ethers";
import { ethers } from "ethers";
import Modal from "../Modal/Modal";
import { get1InchSwapUrl } from "config/links";
import { getLowestFeeTokenForBuyGlp, InfoTokens, Token } from "domain/tokens";
import { getNativeToken } from "config/tokens";
import { t, Trans } from "@lingui/macro";
import ExternalLink from "components/ExternalLink/ExternalLink";
import { SELECTED_CHAIN_LOCAL_STORAGE_KEY } from "config/localStorage";

const { AddressZero } = ethers.constants;

type Props = {
  isVisible: boolean;
  setIsVisible: () => void;
  swapTokenAddress: String
};

export default function depositModal({
  isVisible,
  setIsVisible,
  swapTokenAddress
}: Props) {
  const title = "Bridge";
  const chainKeyFromLocalStorage = localStorage.getItem(SELECTED_CHAIN_LOCAL_STORAGE_KEY);
  const bridgeUrl = `https://preview.portal.zklink.io/deposit-integrate?network=${chainKeyFromLocalStorage}&token=${swapTokenAddress}&title=${title}`;

  return (
    <Modal isVisible={isVisible} setIsVisible={setIsVisible} label='' className="deposit-modal">
      <div id="iframe-box">
        <iframe src={bridgeUrl} title="Bridge" style={{ border: "none" }}></iframe>
      </div>
    </Modal>
  );
}
