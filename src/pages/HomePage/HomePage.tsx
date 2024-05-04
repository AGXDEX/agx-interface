import { getPageTitle, isHashZero } from "lib/legacy";
import { useLocalStorageSerializeKey } from "lib/localStorage";
import { useParams } from "react-router-dom";
import { useLocalStorage } from "react-use";
import "./HomePage.css";
import useWallet from "lib/wallets/useWallet";
import PageTitle from "components/PageTitle/PageTitle";
import { usePendingTxns } from "lib/usePendingTxns";
import leftFir from "img/leftFir.png";
import leftSec from "img/leftSec.png";
import rightFir from "img/rightFir.png";
import rightSec from "img/rightSec.png";
import logoImg from "img/logo_GMX.svg";
import structure from "img/structure.png";
import structure2 from "img/structure2.png";
import { Link } from "react-router-dom";
import Footer from "components/Footer/Footer";

function HomePage() {
  return (
    <div className="container">
      <div className="topBox">
        <div className="header">
          <Link className="" to="/">
            <img src={logoImg} alt="GMX Logo" />
          </Link>
          <div className="nav">
            <a href="https://agx-1.gitbook.io/agx/" target="block">whitepaper</a>
            {/* <a href="https://zklink.io/" target="block">twitter</a>
            <a href="https://zklink.io/" target="block">Discord</a> */}
          </div>
        </div>
        <div className="topInner">
          <div className="titleFirst">
            Decentralized Restaking Liquidity Marketplace
          </div>
          <div className="topButton">
            <Link className="" to="/buy">
              Launch
            </Link>
          </div>
          <div className="topText">
            The first ever LRT Asset Supported native Multi-Chain Perpetual DEX
          </div>
          <div className="topDocu">
            Yiled aggregating supported by zkLink
          </div>
          <div className="topDocu">
            EignLayer Points + LSD Yield + Puffer/… LRT Points + Linea… L2 Points + $FLP LP Yield + zkLink Points + $FOM Staking Yield + Trading fee reward
          </div>
        </div>
      </div>
      <div className="content">
        <div className="contentLeft">
          <div className="innerBox">
            <div className="contentTitle">
            Slippage-Free Trading
            </div>
            <div className="contentInner">
            Trade popular cryptocurrencies, including $ETH, $BTC, $SOL, and LRT Asset including ezETH, pufETH…  on Formula Finance without experiencing slippage. Our platform is designed to prioritize the execution of your orders at the desired price, ensuring a seamless trading experience.
            </div>
          </div>
          <div className="imgBox">
            <img src={leftFir} alt="" />
          </div>
          <div className="innerBox">
            <div className="contentTitle">
            Yield aggregator supported with multi-chain LSD, LRT and LP mining
            </div>
            <div className="contentInner">
            Formula Finance is a yield aggregator platform that supports multi-chain liquidity staking , Restaking, and $FOM LP mining. We provide users with the opportunity to maximize their yield earnings through various strategies.
            </div>
          </div>
          <div className="imgBox">
            <img src={leftSec} alt="" />
          </div>
        </div>
        <div className="contentMiddle">
          <div className="contentBorder">
            <div className="contentBall">1</div>
          </div>
          <div className="contentBorder">
            <div className="contentBall">2</div>
          </div>
          <div className="contentBorder">
            <div className="contentBall">3</div>
          </div>
          <div className="contentBorder">
            <div className="contentBall">4</div>
          </div>
        </div>
        <div className="contentright">
          <div className="imgBox">
            <img src={rightFir} alt="" />
          </div>
          <div className="innerBox">
            <div className="contentTitle">
            Eliminate Counterparty Risk
            </div>
            <div className="contentInner">
            Rest assured that when you trade on Formula Finance, you won't have to worry about counterparty risk. Our platform provides a secure trading environment, protecting your trades and ensuring that all winnings are paid out, regardless of market movements.</div>
          </div>
          <div className="imgBox">
            <img src={rightSec} alt="" />
          </div>
          <div className="innerBox">
            <div className="contentTitle">
            Fair Launch
            </div>
            <div className="contentInner">
            FOM serves as the native token of Formula Finance, with a maximum supply of 10 million tokens. What makes FOM unique is its Fair Launch model, with 100% of the token supply generated through position mining, liquidity mining, and referral mining. These tokens are rewarded to our supportive community users.</div>
          </div>
        </div>
      </div>
      <div className="product">
        <div className="contentTitle productTitle">
          Product Structure
        </div>
        <img src={structure} className="structure" />
      </div>
      <div className="productSec">
        <div className="contentTitle productTitle">
          Product Structure
        </div>
        <img src={structure2} className="structure" />
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;
