import connectWalletImg from "img/ic_wallet_24.svg";
import AddressDropdown from "../AddressDropdown/AddressDropdown";
import ConnectWalletButton from "../Common/ConnectWalletButton";

import axios from "axios";
import { Trans } from "@lingui/macro";
import cx from "classnames";
import { ARBITRUM, ARBITRUM_GOERLI, AVALANCHE, AVALANCHE_FUJI, getChainName } from "config/chains";
import { isDevelopment } from "config/env";
import { getIcon } from "config/icons";
import { useChainId } from "lib/chains";
import { getAccountUrl, isHomeSite } from "lib/legacy";
import LanguagePopupHome from "../NetworkDropdown/LanguagePopupHome";
import NetworkDropdown from "../NetworkDropdown/NetworkDropdown";
import ChainDropdown from "components/ChainDropDown/ChainDropdown";
import "./Header.scss";
import { HeaderLink } from "./HeaderLink";
import useWallet from "lib/wallets/useWallet";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useTradePageVersion } from "lib/useTradePageVersion";
import { chainList } from "config/networks";
import { helperToast } from "lib/helperToast";
import { rainbowKitConfig } from "lib/wallets/rainbowKitConfig";
import { switchChain } from "@wagmi/core";
import { useQuery } from "@tanstack/react-query";

type Props = {
  openSettings: () => void;
  small?: boolean;
  disconnectAccountAndCloseSettings: () => void;
  showRedirectModal: (to: string) => void;
};

const NETWORK_OPTIONS = [
  {
    label: getChainName(ARBITRUM),
    value: ARBITRUM,
    icon: getIcon(ARBITRUM, "network"),
    color: "#264f79",
  },
  {
    label: getChainName(AVALANCHE),
    value: AVALANCHE,
    icon: getIcon(AVALANCHE, "network"),
    color: "#E841424D",
  },
];

if (isDevelopment()) {
  NETWORK_OPTIONS.push({
    label: getChainName(ARBITRUM_GOERLI),
    value: ARBITRUM_GOERLI,
    icon: getIcon(ARBITRUM_GOERLI, "network"),
    color: "#264f79",
  });
  NETWORK_OPTIONS.push({
    label: getChainName(AVALANCHE_FUJI),
    value: AVALANCHE_FUJI,
    icon: getIcon(AVALANCHE_FUJI, "network"),
    color: "#E841424D",
  });
}

const project = "agx";

const fetchNovaPoints = async (address, project) => {
  const response = await axios.get(
    `https://lrt-points.zklink.io/nova/points/project?address=${address}&project=${project}`
  );
  return response.data;
};

export function AppHeaderUser({ openSettings, small, disconnectAccountAndCloseSettings, showRedirectModal }: Props) {
  const { chainId } = useChainId();
  const { active, account } = useWallet();
  const { openConnectModal } = useConnectModal();
  const showConnectionOptions = !isHomeSite();
  const [tradePageVersion] = useTradePageVersion();

  const { data: novaPointsData } = useQuery({
    queryKey: ["novaPoints", account, project],
    queryFn: () => fetchNovaPoints(account, project),
    enabled: !!account,
    //TODO: Confirm data structure
    select: (data) => data.data.length || 0,
  });

  // const tradeLink = tradePageVersion === 2 ? "/trade" : "/v1";
  const tradeLink = "/v1";

  const selectorLabel = getChainName(chainId);
  const icon = getIcon(chainId, "network");
  const selectChain = "ethereum";

  if (!active || !account) {
    return (
      <div className="App-header-user">
        {/* <div className="network-img-box">
          <img className="network-dropdown-icon network-img" src={icon} alt={selectorLabel} />
        </div> */}

        <div className="moreButton">
          <div className="addNova" onClick={() => addNovaChain()}>
            Add Nova to Wallet
          </div>
        </div>
        {/* <ChainDropdown networkOptions={chainList} selectorLabel={selectChain} /> */}
        <div className={cx("App-header-trade-link")}>
          <HeaderLink className="default-btn" to={tradeLink!} showRedirectModal={showRedirectModal}>
            {isHomeSite() ? <Trans>Launch App</Trans> : <Trans>Trade</Trans>}
          </HeaderLink>
        </div>
        {showConnectionOptions && openConnectModal ? (
          <>
            <ConnectWalletButton onClick={openConnectModal} imgSrc={connectWalletImg}>
              {small ? <Trans>Connect</Trans> : <Trans>Connect Wallet</Trans>}
            </ConnectWalletButton>
            {/* {isDevelopment() && (
              <NetworkDropdown
                small={small}
                networkOptions={NETWORK_OPTIONS}
                selectorLabel={selectorLabel}
                openSettings={openSettings}
              />
            )} */}
          </>
        ) : (
          <LanguagePopupHome />
        )}
      </div>
    );
  }

  const accountUrl = getAccountUrl(chainId, account);

  const addEvmChain = async (chain) => {
    if (!window.ethereum) {
      helperToast.error("Please install a wallet first.");
      throw new Error("Please install a wallet first.");
    }
    const chainId = await window.ethereum.request({
      method: "eth_chainId",
    });
    if (chainId === "0x" + ARBITRUM.toString(16)) {
      helperToast.success(
        <div>
          <Trans>You have already added the zkLink Nova Network to your wallet.</Trans>
          <br />
        </div>
      );
    } else {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [chain],
      });
      // await switchChain(rainbowKitConfig, { chainId: chain.chainId })
      const nowChainId = await window.ethereum.request({
        method: "eth_chainId",
      });
      if (nowChainId === "0x" + ARBITRUM.toString(16)) {
        helperToast.error("You have successfully add zkLink Nova Network to your wallet.");
      }
    }
  };
  const addNovaChain = async () => {
    await addEvmChain({
      chainId: "0x" + ARBITRUM.toString(16),
      chainName: process.env.REACT_APP_ENV === "development" ? "zkLink Nova Testnet" : "zkLink Nova",
      rpcUrls: [
        process.env.REACT_APP_ENV === "development" ? "https://sepolia.rpc.zklink.io" : "https://rpc.zklink.io",
      ],
      iconUrls: [],
      nativeCurrency: {
        name: "ETH",
        symbol: "ETH",
        decimals: 18,
      },
      blockExplorerUrls: [
        (process.env.REACT_APP_ENV === "development"
          ? "https://sepolia.explorer.zklink.io"
          : "https://explorer.zklink.io") ?? "",
      ],
    });
  };
  return (
    <div className="App-header-user">
      {/* <div className="network-img-box">
        <img className="network-dropdown-icon network-img" src={icon} alt={selectorLabel} />
      </div> */}
      <div className="moreButton">
        <div className="addNova" onClick={() => addNovaChain()}>
          Add Nova to Wallet
        </div>
        <div className="novaPoints">Nova Points: {novaPointsData || 0}</div>
      </div>
      {/* <ChainDropdown networkOptions={chainList} selectorLabel={selectChain} /> */}
      <div className={cx("App-header-trade-link")}>
        <HeaderLink className="default-btn" to={tradeLink!} showRedirectModal={showRedirectModal}>
          {isHomeSite() ? <Trans>Launch App</Trans> : <Trans>Trade</Trans>}
        </HeaderLink>
      </div>

      {showConnectionOptions ? (
        <>
          <div className="App-header-user-address">
            <AddressDropdown
              account={account}
              accountUrl={accountUrl}
              disconnectAccountAndCloseSettings={disconnectAccountAndCloseSettings}
            />
          </div>
          {/* {isDevelopment() && (
            <NetworkDropdown
              small={small}
              networkOptions={NETWORK_OPTIONS}
              selectorLabel={selectorLabel}
              openSettings={openSettings}
            />
          )} */}
        </>
      ) : (
        <LanguagePopupHome />
      )}
    </div>
  );
}
