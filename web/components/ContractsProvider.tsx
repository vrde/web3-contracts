import { ReactElement } from "react";

import { useContracts } from "@/hooks/useContracts";

import { ContractsContext } from "../contexts/ContractsContext";

export default function ContractsProvider({ children }: { children: ReactElement }) {
  const contracts = useContracts();

  return <ContractsContext.Provider value={contracts}>{children}</ContractsContext.Provider>;
}
