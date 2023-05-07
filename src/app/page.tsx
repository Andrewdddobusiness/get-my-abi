"use client"; // this is a client component 👈🏽

import React, { useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import axios from "axios";

import {
  Text,
  Input,
  Spacer,
  Button,
  Textarea,
  Popover,
  Loading,
} from "@nextui-org/react";

interface ParsedResult {
  constant: boolean;
  inputs: any[];
  name: string;
  outputs: any[];
  payable: boolean;
  stateMutability: string;
  type: string;
}

export default function Home() {
  const [contractAddress, setContractAddress] = useState("");
  const [abiResult, setAbiResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true); // set loading to true when the form is submitted
    axios
      .get(
        `https://api.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API}`
      )
      .then((res) => {
        console.log(res);
        const parsedResult = JSON.parse(res.data.result);
        const abiWithoutConstants: Omit<ParsedResult, "constant">[] =
          parsedResult.map(({ constant, ...rest }: ParsedResult) => rest);
        setAbiResult(JSON.stringify(abiWithoutConstants));
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false)); // set loading to false when the API call is complete
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([abiResult], { type: "application/json" });
    element.href = URL.createObjectURL(file);
    element.download = "ABI.json";
    document.body.appendChild(element);
    element.click();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(abiResult);
  };

  return (
    <main className={styles.main}>
      {/* <div className={styles.description}>
        <div>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            GetMyABI{" "}
          </a>
        </div>
      </div> */}

      <div className={styles.center}>
        <div>
          <Text h1>GetMyABI 🤠 </Text>
        </div>
      </div>

      <div className={styles.center}>
        {/* <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        /> */}
        <div className={styles.centerButton}>
          <form onSubmit={handleSubmit}>
            <Input
              type="text"
              width="100%"
              value={contractAddress}
              placeholder="0x000..."
              onChange={(e) => setContractAddress(e.target.value)}
            />
            <Spacer y={0.5} />

            <Button type="submit">Get ABI</Button>
          </form>
        </div>
      </div>

      {loading ? (
        <div className={styles.center}>
          <Loading />
        </div>
      ) : (
        <div className={styles.centerButton}></div>
      )}

      <div className={styles.center}>
        <div className={styles.centerButton}>
          <Textarea
            value={abiResult}
            placeholder="ABI result"
            width="100%"
            rows={20}
            readOnly
          />
          <Spacer y={1} />
          <div
            style={{
              flexDirection: "row",
              display: "flex",
            }}
          >
            <div style={{ paddingRight: "1rem" }}>
              {" "}
              <Button onClick={handleDownload}>Download ABI</Button>
            </div>
            <Popover isBordered disableShadow>
              <Popover.Trigger>
                <Button onClick={handleCopy}>Copy to Clipboard</Button>
              </Popover.Trigger>
              <Popover.Content>
                <Text css={{ p: "$10" }}>ABI copied.</Text>
              </Popover.Content>
            </Popover>
          </div>
        </div>
      </div>

      <div></div>
    </main>
  );
}
