import { MemoryContractManager } from "@/../lib/MemoryContractManager";
import { Contracts } from "@/../lib/contracts";
import { useAccount, useDisconnect, useNetwork, useProvider, useSigner } from "wagmi";

import { useEffect, useState } from "react";

import { NETWORK_CONFIG } from "@/lib/config";

export function useContracts() {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { data: signer } = useSigner();
  const { disconnect } = useDisconnect();
  const provider = useProvider();

  const [contracts, setContracts] = useState<Contracts | null>(null);

  useEffect(() => {
    if (provider) {
      const mcm = new MemoryContractManager(
        NETWORK_CONFIG,
        // FIXME: not sure why I need to do this
        signer ? signer : undefined,
        provider,
      );

      console.log("update useContracts", provider);
      const loadContracts = async () => {
        const loadedContracts = await mcm.loadAll();
        setContracts(loadedContracts);
      };

      loadContracts().catch(console.error);
    }
  }, [address, provider, signer, chain?.id, disconnect]);

  return contracts;
}
