import React from "react";
import "../styles/footer.scss";
import { Stack, Image } from "react-bootstrap";
import Paras from "../assets/paras.svg";
import Twitter from "../assets/twitter.svg";
import Discord from "../assets/discord.svg";

const Footer = () => {
  return (
    <div className="footer">
      <Stack className="footer_content" gap={3}>
        <Stack direction="horizontal" className="pull-right-footer" gap={3}>
          <a href="/# ">About</a>
          <a href="/#">How To Play</a>
          <a href="/#">FAQ</a>
        </Stack>
        <Stack direction="horizontal" className="mt-2" gap={3}>
          <a href=" https://paras.id/collection/classykangaroos1.near" target="_blank" rel="noopener noreferrer">
            <Image src={Paras} />{" "}
          </a>
          <a href=" https://twitter.com/ClassyKangaroos" target="_blank" rel="noopener noreferrer">
            {" "}
            <Image src={Twitter} />{" "}
          </a>
          <a href="https://discord.gg/M9BYrTAPZp" target="_blank" rel="noopener noreferrer">
            {" "}
            <Image src={Discord} />{" "}
          </a>
        </Stack>
      </Stack>
    </div>
  );
};

export default Footer;
