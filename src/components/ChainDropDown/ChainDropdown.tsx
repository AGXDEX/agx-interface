import { Menu } from "@headlessui/react";
import { useState } from "react";
import { Trans } from "@lingui/macro";
import useWallet from "lib/wallets/useWallet";

import { SELECTED_CHAIN_LOCAL_STORAGE_KEY } from "config/localStorage";

import "./ChainDropdown.css";
import { getIcon } from "config/icons";
import { useChainId } from "lib/chains";
const switchChain = (key) => {
  localStorage.setItem(SELECTED_CHAIN_LOCAL_STORAGE_KEY, key);
  document.location.reload();
};

export default function ChainDropdown({ networkOptions, selectorLabel }) {
  const { active } = useWallet();
  const { chainId } = useChainId();
  // const icon = getIcon(chainId, "network");
  console.log(networkOptions)
  const icon = networkOptions && networkOptions.filter((net)=>{return net.key === (localStorage.getItem(SELECTED_CHAIN_LOCAL_STORAGE_KEY) || 'nova')})[0].logoUrl || networkOptions[0].logoUrl;
  const [selectedChain, setSelectedChain] = useState(localStorage.getItem(SELECTED_CHAIN_LOCAL_STORAGE_KEY) || networkOptions[0].key);
  const handleNetworkClick = (networkKey) => {
    setSelectedChain(networkKey);
    switchChain(networkKey);
  };
  return (
    <div className="App-header-network">
      <Menu>
        <Menu.Button as="div" className="network-img-box">
          <img className="network-dropdown-icon network-img" src={icon}/>
        </Menu.Button>
        <Menu.Items as="div" className="menu-items network-dropdown-items">
          <div className="network-dropdown-list">
            {networkOptions.map((network) => (
              <Menu.Item key={network.key}>
                {({ active }) => (
                  <div
                    className={`network-dropdown-menu-item menu-item ${selectedChain === network.key ? "active" : ""}`}
                    onClick={() => handleNetworkClick(network.key)}
                  >
                    <div className="menu-item-group">
                      <div className="menu-item-icon">
                        <img className="network-dropdown-icon" src={network.logoUrl} alt={network.name} />
                      </div>
                      <span className="network-dropdown-item-label">{network.name}</span>
                    </div>
                    <div className="network-dropdown-menu-item-img" />
                  </div>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Menu>
    </div>
  );
}
