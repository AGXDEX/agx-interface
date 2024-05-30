import "./HomePage.css";
import logoImg from "img/logo_GMX.svg";
import File from "img/File.png";
import XLogo from "img/XLogo.png";
import TelegramLogo from "img/TelegramLogo.png";
import DiscordLogo from "img/DiscordLogo.png";
import start from "img/home/start.png";
import zklink from "img/home/zklink.svg";
import support from "img/home/support.svg";
import BurstStar from "img/home/Burst-star.png";
import Revolutionizing from "img/home/Revolutionizing.svg";
import Decentralized from "img/home/Decentralized.svg";
import Trading from "img/home/Trading.svg";
import ArrowRight from "img/home/ArrowRight.png";
import bg from "img/home/bg.png";
import Multi from "img/home/Multi.svg";
import multiChart from "img/home/multi-chart.svg";
import multiMind from "img/home/multi-mind.svg";

import { Link } from "react-router-dom";
function HomePage() {
  return (
    <div className="container">
      <div className="header">
        <div className="header-top">
          <div></div>
          <div></div>
          <div className="icon">
            <a href="https://docs.agx.xyz/" target="block">
              <img src={File}/>
            </a>
            <a href="https://x.com/AGX_XYZ" target="block">
              <img src={XLogo}/>
            </a>
            <a href="https://t.me/agx_xyz_channel" target="block">
              <img src={TelegramLogo}/>
            </a>
            <a href="https://discord.gg/agxdefi" target="block">
              <img src={DiscordLogo}/>
            </a>
          </div>
        </div>
        <div className="nav">
            <img src={logoImg}/>
            <div className="navButton">
              <div className="scroll">Features</div>
              <div className="scroll">Tokenomics</div>
              <div className="scroll">Roadmap</div>
              <div className="joinNew">Join Now</div>
            </div>
        </div>
        <div className="support">
          <img src={support}/>
        </div>
        <div className="introduce">
          <div className="large">
            <img className="marginRight" src={Revolutionizing}/>
            <img className="BurstStar" src={BurstStar}/>
          </div>
          <div className="large">
            <img className="marginLeft" src={Decentralized}/>
          </div>
          <div className="large trade">
            <div>The First Ever LST & LRT Asset <br /> Supported Multi-Chain Perpetual DEX</div>
            <img src={Trading}/>
          </div>
          <div className="flex">
            <div className="start">Get Started Now  <img src={ArrowRight} /></div>
            <div className="learn">Learn More</div>
          </div>
        </div>
      </div>
      <div className="main">
        <div className="box">
          <img className="title" src={Multi} />
          <img className="charts" src={multiChart} />
          <img className="charts" src={multiMind} />
        </div>
        <div className="box ">
          <div className="choose">
            <div className="chooseBut">Why Choose AGX?</div>
            <img src={BurstStar} />
            <div className="chooseInf">Empower Your Trades, Maximize Your Gains, Seamless, Secure, and Smart, Experience the Future of Prep DEX</div>
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
              <div className="title">Effortless Trading</div>
              <div className="inner">Experience seamless, slippage-free trading on popular cryptocurrencies.</div>
              <img src={ArrowRight} />
            </div>
            <div className="card thrid">
              <div className="ball"></div>
              <div className="title">Effortless Trading</div>
              <div className="inner">Experience seamless, slippage-free trading on popular cryptocurrencies.</div>
              <img src={ArrowRight} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
