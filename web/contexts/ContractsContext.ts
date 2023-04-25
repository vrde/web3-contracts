import { MyContracts } from "@/../lib/types";

import { createContext, useContext } from "react";

export const ContractsContext = createContext<MyContracts>({});

export const useContractsContext = () => useContext(ContractsContext);
