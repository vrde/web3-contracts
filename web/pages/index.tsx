import styles from "@/styles/Base.module.css";
import Head from "next/head";

import ConnectWallet from "@/components/ConnectWallet";

export default function Home() {
  return (
    <>
      <Head>
        <title>{process.env.NEXT_PUBLIC_TITLE}</title>
        <meta name="description" content={process.env.NEXT_PUBLIC_DESCRIPTION} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className={styles.row}>
          <h1>NextJS Web3 Template</h1>
          <p>Yet another web3 template.</p>
          <ConnectWallet />
        </div>
      </main>
    </>
  );
}
