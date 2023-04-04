import { useWeb3Modal } from "@web3modal/react";
import { useAccount, useNetwork } from "wagmi";

export default () => {
  const { address } = useAccount();
  const { chain, chains } = useNetwork();
  const { open } = useWeb3Modal();

  return (
    <>
      {address && (
        <div>
          Connected to {address}, {chain?.name}
        </div>
      )}

      <p>Available chains: {chains.map((c) => c.name).join(", ")}</p>

      <button onClick={() => open()}>Open</button>
    </>
  );
};
