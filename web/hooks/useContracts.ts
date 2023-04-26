import { MemoryContractManager } from "@/../lib/MemoryContractManager";
import { Contracts } from "@/../lib/contracts";
import { useAccount, useDisconnect, useNetwork, useSigner } from "wagmi";

import { useEffect, useState } from "react";

import { NETWORK_CONFIG } from "@/lib/config";

export function useContracts() {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { data: signer } = useSigner();
  const { disconnect } = useDisconnect();

  const [contracts, setContracts] = useState<Contracts | null>(null);

  useEffect(() => {
    if (address && signer && chain && chain.id) {
      const mcm = new MemoryContractManager(NETWORK_CONFIG, chain.id, signer);

      const loadContracts = async () => {
        const loadedContracts = await mcm.loadAll();
        setContracts(loadedContracts);
      };

      loadContracts().catch(console.error);
    }
  }, [address, signer, chain?.id, disconnect]);

  return contracts;
}
