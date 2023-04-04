import { Storage } from "@../typechain";
import { createContext, useContext } from "react";

export type ContractsContextType = {
  storage?: Storage;
};

export const ContractsContext = createContext<ContractsContextType>({});

export const useContractsContext = () => useContext(ContractsContext);
