import React from "react";
import Footer from "components/Footer/Footer";
import "./BridgeToNova.css";
import { useChainId } from "lib/chains";
// const { chainId } = useChainId();
import { useLocalStorageByChainId } from "lib/localStorage";
import { SELECTED_CHAIN_LOCAL_STORAGE_KEY } from "config/localStorage";
import { useLocation } from "react-router-dom";
export default function BridgeToNova() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.hash.substr(1)); // 去掉开头的 '#'
  const swapTokenAddress = searchParams.get("swapTokenAddress");
  const title = "Bridge";
  const chainKeyFromLocalStorage = localStorage.getItem(SELECTED_CHAIN_LOCAL_STORAGE_KEY);
  const bridgeUrl = `https://preview.portal.zklink.io/deposit-integrate?network=${chainKeyFromLocalStorage}&token=${swapTokenAddress}&title=${title}`;

  return (
    <div className="default-container page-layout">
      <div id="iframe-box">
        <iframe src={bridgeUrl} title="Bridge" style={{ border: "none" }}></iframe>
      </div>
      <Footer />
    </div>
  );
}
