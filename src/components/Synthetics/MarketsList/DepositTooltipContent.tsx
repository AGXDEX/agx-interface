import { Trans } from "@lingui/macro";
import { DOCS_LINKS } from "config/links";
import ExternalLink from "components/ExternalLink/ExternalLink";

import "./DepositTooltipContent.scss";

export function DepositTooltipContent() {
  return (
    <div className="DepositTooltipContent-netfee-header-tooltip">
      <Trans>
      Reminder: Only Deposit in AGX is not start mining, you have to Stake LP NFT to start mining
      </Trans>
    </div>
  );
}
