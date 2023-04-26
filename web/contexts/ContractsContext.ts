import { Contracts } from "@/../lib/contracts";

import { createContext, useContext } from "react";

export const ContractsContext = createContext<Contracts | null>(null);

export const useContractsContext = () => useContext(ContractsContext);
