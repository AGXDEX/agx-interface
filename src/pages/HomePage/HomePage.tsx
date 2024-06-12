import "./HomePage.css";
import logoImg from "img/logo_GMX.svg";
import File from "img/File.png";
import XLogo from "img/XLogo.png";
import TelegramLogo from "img/TelegramLogo.png";
import DiscordLogo from "img/DiscordLogo.png";
import support from "img/home/support.svg";
import BurstStar from "img/home/Burst-star.png";
import Revolutionizing from "img/home/Revolutionizing.svg";
import Decentralized from "img/home/Decentralized.svg";
import Trading from "img/home/Trading.svg";
import ArrowRight from "img/home/ArrowRight.png";
import Multi from "img/home/Multi.svg";
import work from "img/home/work.svg";
import one from "img/home/01.svg";
import two from "img/home/02.svg";
import three from "img/home/03.svg";
import four from "img/home/04.svg";
import AGXAndALP from "img/home/AGXAndALP.svg";
import AGXBall from "img/home/AGXBall.svg";
import ALPToken from "img/home/ALPToken.svg";
import AGXToken from "img/home/AGXToken.svg";
import FairBall from "img/home/FairBall.svg";
import FairLaunch from "img/home/Fair Launch.svg";
import fair from "img/home/fair.svg";
import advanced from "img/home/advanced.svg";
import securityLogo from "img/home/securityLogo.svg";
import securityFoot from "img/home/securityFoot.svg";
import tradeLogo from "img/home/tradeLogo.svg";
import tradeFoot from "img/home/tradeFoot.svg";
import secure from "img/home/secure.svg";
import Protocol from "img/home/Protocol Architecture.svg";
import protoool from "img/home/protoool.svg";
import ALP from "img/home/ALP Pool Structure.svg";
import ALPPool from "img/home/ALPPool.svg";
import OurJourney from "img/home/Our Journey Ahead.svg";
import Journey from "img/home/Journey.svg";
import doc from "img/home/hugeicons_google-doc.png";
import XLog from "img/home/XLogo.png";
import Telegram from "img/home/TelegramLogo.png";
import Discord from "img/home/DiscordLogo.png";
import multiMinds from "img/home/multi-minds.svg";
import hero from "img/home/hero graphic.png";
import Ellipse from "img/home/Ellipse.png";
import EllipseLeft from "img/home/EllipseLeft.png";
import Mask from "img/home/Mask.png";
import MaskTable from "img/home/MaskTable.png";
import menu from "img/home/jam_menu.png";
import greenStart from "img/home/greenStart.png";
import HowAGXWorks from "img/home/How AGX Works.svg";
import purpleStart from "img/home/purpleStart.png";
import AGXandALPTokens from "img/home/AGXandALPTokens.svg";
import darkpurpleStart from "img/home/darkpurpleStart.png";
import AdvancedSecurityAndMaximizedYields from "img/home/Advanced Security And Maximized Yields.svg";
import mobileSecure from "img/home/mobileSecure.svg";
import mobileprotoool from "img/home/mobileprotoool.svg";
import mobileprotoool1 from "img/home/mobileprotoool1.svg";
import bigBall from "img/home/bigBall.svg";
import zklinkLogo from "img/home/zklinkLogo.svg";
import { Link } from "react-router-dom";
import { useState } from "react";
import cain from "img/home/cain.svg";
import cain1 from "img/home/cain1.svg";
import cain2 from "img/home/cain2.svg";

const scrollTo = (value) => {
  let arr:any = document.getElementsByClassName('main')[0].childNodes
  let sum = document.getElementsByClassName('home-header')[0].clientHeight
  let marginBottom = window.getComputedStyle(arr[0]).marginBottom.split('px')[0]
  if (value === 1) {
    for (let i=0; i<6; i++) {
      sum += (arr[i].clientHeight + Number(marginBottom))
    }
  } else if (value === 2) {
    for (let i=0; i<8; i++) {
      sum += (arr[i].clientHeight + Number(marginBottom))
    }
  }
  let top = value === 0 ? 0: sum;
  document.getElementsByClassName('home-container')[0].scrollTo({
    top: top,
    behavior: 'smooth' // 'auto' for instant scrolling
  });
  window.scrollTo({
    top: top,
    behavior: 'smooth' // 'auto' for instant scrolling
  });
};
function HomePage() {
  const [isshowMenu, setIsshowMenu] = useState(false);
  const showMenu = (flag) => {
    setIsshowMenu(flag)
  };
  return (
    <div>
      {isshowMenu && (
        <div
          className="MenuList"
          onClick={() =>
            setTimeout(() => {
              showMenu(false);
            }, 500)
          }
        >
          <div className="Menu">
            <img className="logo" src={logoImg} />
            <a href="https://docs.agx.xyz/" target="block">
              <img src={File} />
            </a>
            <a href="https://x.com/AGX_XYZ" target="block">
              <img src={XLogo} />
            </a>
            <a href="https://t.me/agx_xyz_channel" target="block">
              <img src={TelegramLogo} />
            </a>
            <a href="https://discord.gg/agxdefi" target="block">
              <img src={DiscordLogo} />
            </a>
          </div>
        </div>
      )}
      <div className="home-container">
        <div className="home-header">
          <div className="home-header-top">
            <div></div>
            <div></div>
            <div className="flex items-center justify-center space-x-5">
              <a href="https://docs.agx.xyz/" target="block">
                <img src={File} />
              </a>
              <a href="https://x.com/AGX_XYZ" target="block">
                <img src={XLogo} />
              </a>
              <a href="https://t.me/agx_xyz_channel" target="block">
                <img src={TelegramLogo} />
              </a>
              <a href="https://discord.gg/agxdefi" target="block">
                <img src={DiscordLogo} />
              </a>
            </div>
          </div>
          <div className="nav">
            <div className="mobileBut" onClick={() => showMenu(true)}>
              <img src={menu} />
            </div>
            <img src={logoImg} />
            <div className="navButton">
              <div className="scroll PC" onClick={() => scrollTo(0)}>
                Features
              </div>
              <div className="scroll PC" onClick={() => scrollTo(1)}>
                Structures
              </div>
              <div className="scroll PC" onClick={() => scrollTo(2)}>
                Roadmap
              </div>
              <Link to="/v1">
                <div className="joinNew">Join Now</div>
              </Link>
            </div>
          </div>
          <div className="support">
            <img src={support} />
          </div>
          <div className="introduce">
            <img className="cain up-down right-cain" src={cain} />
            <img className="cain left-right bottom-cain" src={cain1} />
            <img className="cain left-right left-cain" src={cain2} />
            <div className="large">
              <img className="marginRight" src={Revolutionizing} />
              <img className="BurstStar" src={BurstStar} />
            </div>
            <div className="large">
              <img className="marginLeft" src={Decentralized} />
            </div>
            <div className="large trade">
              <div>
                The First Ever LST & LRT Asset <br /> Supported Multi-Chain Perpetual DEX
              </div>
              <img src={Trading} />
            </div>
            <div className="intro-flex">
              <div className="start items-center justify-center flex">
                <Link to="/v1">
                  <span>Get Started Now</span>
                  <img className="inline-flex" src={ArrowRight} />
                </Link>
              </div>
              <a href="https://docs.agx.xyz/" target="block">
                <div className="learn">Learn More</div>
              </a>
            </div>
          </div>
          <img className="Ellipse" src={Ellipse} />
          <img className="hero" src={bigBall} />
          <img className="heros" src={hero} />
          <img className="EllipseLeft" src={EllipseLeft} />
          <img className="Mask" src={Mask} />
          <img className="MaskTable" src={MaskTable} />
        </div>
        <div className="main">
          <div className="box">
            <img className="cain up-down cain1" src={cain2} />
            <img className="cain left-right cain2" src={cain1} />
            <img className="title" src={Multi} />
            <img className="charts" src={multiMinds} />
            <img className="zklinkLogo" src={zklinkLogo} />
          </div>
          <div className="box">
            <img className="cain left-right cain3" src={cain} />
            <div className="choose">
              <div className="chooseBut">Why Choose AGX?</div>
              <img src={BurstStar} />
              <div className="chooseInf">
                Empower Your Trades, Maximize Your Gains, Seamless, Secure, and Smart, Experience the Future of Prep DEX
              </div>
            </div>
            <div className="cardList">
              <div className="card first">
                <div className="ball"></div>
                <div className="title">Effortless Trading</div>
                <div className="inner">Experience seamless, slippage-free trading on popular cryptocurrencies.</div>
                <img src={ArrowRight} />
              </div>
              <div className="card second">
                <div className="ball"></div>
                <div className="title">High Leverage</div>
                <div className="inner">Trade with up to 100X leverage directly through a non-custodial wallet.</div>
                <img src={ArrowRight} />
              </div>
              <div className="card thrid">
                <div className="ball"></div>
                <div className="title">Multi-Layer Yield</div>
                <div className="inner">
                  Maximize earnings with our multi-chain yield aggregator supported by zkLink.
                </div>
                <img src={ArrowRight} />
              </div>
            </div>
          </div>
          <div className="box">
            <div className="howToWork">
              <img className="PC" src={work} />
              <img className="modile greenStart" src={greenStart} />
              <img className="modile HowAGXWorks" src={HowAGXWorks} />
              <div className="workInfo">
                Explore the seamless process of decentralized trading and yield maximization with AGX. From setting up
                your wallet to maximizing earnings through dynamic pricing and yield aggregation, our platform offers a
                streamlined experience for traders of all levels.
              </div>
            </div>
          </div>
          <div className="box">
            <div className="stepList">
              <div className="step">
                <img src={one} />
                <div className="title">Create a Wallet</div>
                <div className="inner">Start by setting up your non-custodial wallet.</div>
              </div>
              <div className="step">
                <img src={two} />
                <div className="title">Deposit Assets</div>
                <div className="inner">Deposit your assets into our unique multi-asset pool (ALP).</div>
              </div>
              <div className="step">
                <img src={three} />
                <div className="title">Trade & Earn</div>
                <div className="inner">
                  Trade with dynamic pricing and earn rewards through liquidity provision and market making.
                </div>
              </div>
              <div className="step">
                <img src={four} />
                <div className="title">Physical Settlement</div>
                <div className="inner">
                  Enjoy seamless trading with reliable settlement in underlying assets or $USDT.
                </div>
              </div>
            </div>
          </div>
          <div className="box">
            <img className="cain up-down cain4" src={cain} />
            <div className="AGXAndALP">
              <img className="PC" src={AGXAndALP} />
              <img className="modile purpleStart" src={purpleStart} />
              <img className="modile AGXandALPTokens" src={AGXandALPTokens} />
              <img className="AGXBall" src={AGXBall} />
            </div>
            <div className="token">
              <img className="flex-1 w-[45%]" src={ALPToken} />
              <img className="flex-1 w-[45%]" src={AGXToken} />
            </div>
          </div>
          <div className="box">
            <div className="fair">
              <div className="fairBox">
                <img className="FairLaunch" src={FairLaunch} />
                {/* <div className="FairBall"></div> */}
                <img className="FairBall" src={FairBall} />
              </div>
              <img className="fairImg" src={fair} />
            </div>
            <div className="advanced">
              <img className="cain up-down cain5" src={cain2} />
              <img className="PC" src={advanced} />
              <div className="advancedLearn PC">
                <a href="https://docs.agx.xyz/" target="block">
                  Learn More
                </a>
              </div>
              <img className="modile darkpurpleStart" src={darkpurpleStart} />
              <img className="modile AdvancedSecurityAndMaximizedYields" src={AdvancedSecurityAndMaximizedYields} />
            </div>
            <div className="secure">
              <img className="PC" src={secure} />
              <img className="modile mobileSecure" src={mobileSecure} />
            </div>
            <div className="fairBox">
              <div className="security">
                <img className="logo" src={securityLogo} />
                <div className="title">Uncompromised Security</div>
                <div className="inner">
                  At AGX, security is paramount. Our platform is engineered with cutting-edge encryption protocols and
                  decentralized architecture, ensuring that your assets are protected at all times.
                </div>
                <div className="center">
                  <div className="button">
                    <img src={securityFoot} />
                    Cutting-Edge Encryption
                  </div>
                </div>
              </div>
              <div className="security">
                <img className="logo" src={tradeLogo} />
                <div className="title">Seamless and Secure Trading</div>
                <div className="inner">
                  With dynamic pricing powered by Pyth oracles, we mitigate single points of failure and provide you
                  with the peace of mind you deserve. Trade confidently, knowing that your transactions are executed
                  seamlessly and securely, free from counterparty risk.
                </div>
                <div className="center">
                  <div className="button">
                    <img src={tradeFoot} />
                    Seamless Execution
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="box">
            <img className="cain up-down cain6" src={cain1} />
            <img className="cain left-right cain7" src={cain} />
            <img className="cain up-down cain8" src={cain} />
            <img className="Protocol" src={Protocol} />
            <img className="protoool maxWidth" src={protoool} />
          </div>
          <div className="box">
            <img className="Protocol" src={ALP} />
            <img className="protoool" src={ALPPool} />
          </div>
          <div className="box">
            <img className="cain left-right cain9" src={cain1} />
            <img className="cain up-down cain10" src={cain} />
            <img className="Protocol" src={OurJourney} />
            <img className="protoool PC" src={Journey} />
            <img className="modile mobileprotoool1" src={mobileprotoool1} />
            <img className="modile mobileprotoool" src={mobileprotoool} />
          </div>
          {/* <div className="box">
            <img className="Protocol" src={Supported} />
            <img className="protoool" src={Journey} />
          </div> */}
          <div className="box">
            <img className="cain up-down cain11" src={cain1} />
            <img className="cain left-right cain12" src={cain2} />
            <div className="fairBox other">
              <div className="startTrade">
                <Link to="/v1">
                  <div className="joinNow">Join Now</div>
                </Link>
              </div>
              <div className="chain">
                {/* <img className="Bitcoin" src={Bitcoin} /> */}
                <div className="link">
                  <a href="https://docs.agx.xyz/" target="block">
                    <img src={doc} />
                  </a>
                  <a href="https://t.me/agx_xyz_channel" target="block">
                    <img src={Telegram} />
                  </a>
                  <a href="https://discord.gg/agxdefi" target="block">
                    <img src={Discord} />
                  </a>
                  <a href="https://x.com/AGX_XYZ" target="block">
                    <img src={XLog} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer">
          <div className="scrollBox">
            <div className="scroll" onClick={() => scrollTo(0)}>
              Features
            </div>
            <div className="scroll" onClick={() => scrollTo(1)}>
              Structures
            </div>
            <div className="scroll" onClick={() => scrollTo(2)}>
              Roadmap
            </div>
          </div>
          <div className="copyright">Copyright 2024, AGX. All Rights Reserved.</div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
