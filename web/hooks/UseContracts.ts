import { Signer } from "ethers";
import { useAccount, useDisconnect, useNetwork, useSigner } from "wagmi";

import { useEffect, useState } from "react";

import { ContractsContextType } from "../contexts/ContractsContext";
import {
  ResolutionManager,
  ResolutionManager__factory,
  TelediskoToken,
  TelediskoToken__factory,
  Voting,
  Voting__factory,
} from "../contracts/typechain";
import networksNeoKingdom from "../networks/neokingdom.json";
import networksTeledisko from "../networks/teledisko.json";

const networks: Record<string, any> =
  process.env.NEXT_PUBLIC_PROJECT_KEY === "neokingdom" ? networksNeoKingdom : networksTeledisko;

const getResolutionContract = (chainId: string, signer: Signer): ResolutionManager => {
  const address = networks[chainId]["ResolutionManager"];
  return ResolutionManager__factory.connect(address, signer);
};

const getTokenContract = (chainId: string, signer: Signer): TelediskoToken => {
  const address =
    networks[chainId][process.env.NEXT_PUBLIC_PROJECT_KEY === "neokingdom" ? "NeokingdomToken" : "TelediskoToken"];
  return TelediskoToken__factory.connect(address, signer);
};

const getVotingContract = (chainId: string, signer: Signer): Voting => {
  const address = networks[chainId]["Voting"];
  return Voting__factory.connect(address, signer);
};

export function useContracts() {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { data: signer } = useSigner();
  const { disconnect } = useDisconnect();

  const [contracts, setContracts] = useState<ContractsContextType>({});

  useEffect(() => {
    if (address && signer) {
      try {
        const chainId = String(chain?.id);

        setContracts({
          resolutionContract: getResolutionContract(chainId, signer),
          tokenContract: getTokenContract(chainId, signer),
          votingContract: getVotingContract(chainId, signer),
        });
      } catch (error) {
        console.error(error);
      }
    }
  }, [address, signer, chain?.id, disconnect]);

  return contracts;
}
