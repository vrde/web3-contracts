import { Signer } from "ethers";
import { useAccount, useDisconnect, useNetwork, useSigner } from "wagmi";

import { useEffect, useState } from "react";

import { ContractsContextType } from "../contexts/ContractsContext";
import { Storage, Storage__factory } from "../../typechain";
import networks from "@/../deployments/networks.json";
import { CHAIN_ID } from "@pages/config";

const typedNetworks: Record<string, any> = networks;

const getStorage = (signer: Signer): Storage => {
  const address: string = typedNetworks[CHAIN_ID]["Storage"];
  return Storage__factory.connect(address, signer);
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
        setContracts({
          storage: getStorage(signer),
        });
      } catch (error) {
        console.error(error);
        return disconnect();
      }
    }
  }, [address, signer, disconnect]);

  return contracts;
}
