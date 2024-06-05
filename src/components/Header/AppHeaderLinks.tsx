import { FiX } from "react-icons/fi";
import { Trans } from "@lingui/macro";
import { Link } from "react-router-dom";

import { HeaderLink } from "./HeaderLink";
import "./Header.scss";
import ExternalLink from "components/ExternalLink/ExternalLink";
import logoImg from "img/logo_GMX.svg";
import { useQueryClient } from "@tanstack/react-query";
import useWallet from "lib/wallets/useWallet";
import { fetchNFTData, fetchPositions, fetchStakeLiquidity } from "pages/Stake/StakeV2";

type Props = {
  small?: boolean;
  clickCloseIcon?: () => void;
  openSettings?: () => void;
  showRedirectModal: (to: string) => void;
};

export function AppHeaderLinks({ small, openSettings, clickCloseIcon, showRedirectModal }: Props) {
  const { account } = useWallet();

  const queryClient = useQueryClient();

  const prefetchData = async () => {
    await queryClient.prefetchQuery({
      queryKey: ["positions", account],
      queryFn: fetchPositions,
      staleTime: 10000,
    });
    await queryClient.prefetchQuery({
      queryKey: ["NFTData", account],
      queryFn: () => fetchNFTData(account),
      staleTime: 10000,
    });
    await queryClient.prefetchQuery({
      queryKey: ["stakeliquidity"],
      queryFn: fetchStakeLiquidity,
      staleTime: 10000,
    });
  };
  return (
    <div className="App-header-links">
      {small && (
        <div className="App-header-links-header">
          <Link className="App-header-link-main" to="/">
            <img src={logoImg} alt="AGX Logo" />
          </Link>
          <div
            className="App-header-menu-icon-block mobile-cross-menu"
            onClick={() => clickCloseIcon && clickCloseIcon()}
          >
            <FiX className="App-header-menu-icon" />
          </div>
        </div>
      )}
      <div className="App-header-link-container">
        <HeaderLink to="/buy" showRedirectModal={showRedirectModal}>
          <Trans>Buy</Trans>
        </HeaderLink>
      </div>
      <div className="App-header-link-container" onMouseEnter={prefetchData}>
        <HeaderLink to="/earn" showRedirectModal={showRedirectModal}>
          <Trans>Earn</Trans>
        </HeaderLink>
      </div>
      <div className="App-header-link-container">
        <a href="https://portal.zklink.io/" target="_blank" rel="noreferrer">
          <Trans>Bridge</Trans>
        </a>
      </div>
      <div className="App-header-link-container">
        <HeaderLink to="/referrals" showRedirectModal={showRedirectModal}>
          <Trans>Referrals</Trans>
        </HeaderLink>
      </div>
      <div className="App-header-link-container">
        <HeaderLink to="/leaderboard" showRedirectModal={showRedirectModal}>
          <Trans>Leaderboard</Trans>
        </HeaderLink>
      </div>
      <div className="App-header-link-container">
        <ExternalLink href="https://docs.agx.xyz/">
          <Trans>Docs</Trans>
        </ExternalLink>
      </div>
    </div>
  );
}
