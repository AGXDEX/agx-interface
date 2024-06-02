import { ARBITRUM, AVALANCHE } from "config/chains";

import gmxIcon from "img/ic_gmx_40.svg";
import gmxOutlineIcon from "img/ic_gmxv1flat.svg";
import glpIcon from "img/ic_glp_40.svg";
import esGMXIcon from "img/ic_esgmx_40.svg";
import esGMXArbitrumIcon from "img/ic_esgmx_arbitrum.svg";
import gmIcon from "img/gm_icon.svg";
import gmArbitrum from "img/ic_gm_arbitrum.svg";
import gmxArbitrum from "img/ic_gmx_arbitrum.svg";
import glpNova from "img/nova-logo.svg";

const ICONS = {
  [ARBITRUM]: {
    network: glpNova,
    gmx: gmxArbitrum,
    glp: glpNova,
    esgmx: esGMXArbitrumIcon,
    gm: gmArbitrum,
  },
  [AVALANCHE]: {
    network: glpNova,
    gmx: gmxArbitrum,
    glp: glpNova,
    esgmx: esGMXArbitrumIcon,
    gm: gmArbitrum,
  },
  common: {
    network: glpNova,
    gmx: gmxIcon,
    gmxOutline: gmxOutlineIcon,
    glp: glpIcon,
    esgmx: esGMXIcon,
    gm: gmIcon,
  },
};

export function getIcon(chainId: number | "common", label: string) {
  if (chainId in ICONS) {
    if (label in ICONS[chainId]) {
      return ICONS[chainId][label];
    }
  }
}
export function getIcons(chainId: number | "common") {
  if (!chainId) return;
  if (chainId in ICONS) {
    return ICONS[chainId];
  }
}
